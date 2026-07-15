"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ACTIVE_REPORTS,
  REPORT_DOCUMENT_SECTIONS,
  REPORT_INSIGHTS,
  REPORT_PL_ROWS,
  REPORT_SECTIONS,
  type ReportDocumentSection,
  type ReportPlRow,
} from "@/src/lib/reportingMockData";
import {
  plEditKey,
  proseEditKey,
} from "@/src/components/reporting/ReportEditApprovalMark";
import { ReportDocument } from "@/src/components/reporting/ReportDocument";
import { ReportInsightsPanel } from "@/src/components/reporting/ReportInsightsPanel";
import { ReportSectionsNav } from "@/src/components/reporting/ReportSectionsNav";
import { ReportToolbar } from "@/src/components/reporting/ReportToolbar";
import { CreateSectionBuilder } from "@/src/components/reporting/CreateSectionBuilder";
import type { ReportPlEditableField } from "@/src/components/reporting/ReportPlTable";
import { useReportInsightSync } from "@/src/hooks/useReportInsightSync";
import { featureFlags } from "@/src/lib/featureFlags";
import {
  appendCustomSection,
  readCustomSections,
  type CustomReportSection,
} from "@/src/lib/reportSectionBuilder";
import {
  moveSection,
  readTemplateLayout,
  removeSection,
  reorderSection,
  resolveLayout,
  restoreSection,
  writeTemplateLayout,
  type MoveDirection,
  type TemplateLayout,
} from "@/src/lib/reportTemplateLayout";

function getCommittedProseParagraph(
  sections: ReportDocumentSection[],
  sectionId: string,
  blockIndex: number,
  paragraphIndex: number,
  proseOverrides: Record<string, string[][]>,
): string {
  const section = sections.find((item) => item.id === sectionId);
  const block = section?.blocks[blockIndex];
  if (!block || block.type !== "prose") return "";

  return (
    proseOverrides[sectionId]?.[blockIndex]?.[paragraphIndex] ??
    block.paragraphs[paragraphIndex] ??
    ""
  );
}

export function ReportActiveView() {
  const [reportTitle, setReportTitle] = useState<string>(ACTIVE_REPORTS[0]);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [activeSectionId, setActiveSectionId] = useState<string>("introduction");
  const [sectionsCollapsed, setSectionsCollapsed] = useState(false);
  const [insightsCollapsed, setInsightsCollapsed] = useState(false);
  const [activeInsightId, setActiveInsightId] = useState(REPORT_INSIGHTS[0].id);
  const [plRows, setPlRows] = useState<ReportPlRow[]>(() => [...REPORT_PL_ROWS]);
  const [proseOverrides, setProseOverrides] = useState<Record<string, string[][]>>(
    {},
  );
  const [pendingEdits, setPendingEdits] = useState<Record<string, string>>({});
  const [customSections, setCustomSections] = useState<CustomReportSection[]>([]);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [layout, setLayout] = useState<TemplateLayout>({ order: [], removed: [] });

  const allSections = useMemo<ReportDocumentSection[]>(
    () => [...REPORT_DOCUMENT_SECTIONS, ...customSections],
    [customSections],
  );

  const sectionLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    REPORT_SECTIONS.forEach((section) => {
      map[section.id] = section.label;
    });
    customSections.forEach((section) => {
      map[section.id] = section.title;
    });
    return map;
  }, [customSections]);

  const naturalIds = useMemo(
    () => allSections.map((section) => section.id),
    [allSections],
  );

  const resolved = useMemo(
    () => resolveLayout(layout, naturalIds),
    [layout, naturalIds],
  );

  const documentSections = useMemo<ReportDocumentSection[]>(() => {
    const byId = new Map(allSections.map((section) => [section.id, section]));
    return resolved.visibleIds
      .map((id) => byId.get(id))
      .filter((section): section is ReportDocumentSection => Boolean(section));
  }, [allSections, resolved.visibleIds]);

  const navSections = useMemo(
    () =>
      resolved.visibleIds.map((id) => ({
        id,
        label: sectionLabelById[id] ?? id,
      })),
    [resolved.visibleIds, sectionLabelById],
  );

  const removedNavSections = useMemo(
    () =>
      resolved.removedIds.map((id) => ({
        id,
        label: sectionLabelById[id] ?? id,
      })),
    [resolved.removedIds, sectionLabelById],
  );

  useEffect(() => {
    setCustomSections(readCustomSections(reportTitle));
    setLayout(readTemplateLayout(reportTitle));
    setIsCreatingSection(false);
  }, [reportTitle]);

  useEffect(() => {
    if (navSections.length === 0) return;
    if (!navSections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(navSections[0].id);
    }
  }, [navSections, activeSectionId]);

  const persistLayout = useCallback(
    (next: TemplateLayout) => {
      setLayout(next);
      writeTemplateLayout(reportTitle, next);
    },
    [reportTitle],
  );

  const handleMoveSection = useCallback(
    (id: string, direction: MoveDirection) => {
      persistLayout(moveSection(layout, naturalIds, id, direction));
    },
    [layout, naturalIds, persistLayout],
  );

  const handleRemoveSection = useCallback(
    (id: string) => {
      persistLayout(removeSection(layout, naturalIds, id));
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: {
            message: `“${sectionLabelById[id] ?? "Section"}” removed. Restore it from the Removed list.`,
          },
        }),
      );
    },
    [layout, naturalIds, persistLayout, sectionLabelById],
  );

  const handleRestoreSection = useCallback(
    (id: string) => {
      persistLayout(restoreSection(layout, naturalIds, id));
    },
    [layout, naturalIds, persistLayout],
  );

  const handleReorderSection = useCallback(
    (activeId: string, overId: string) => {
      persistLayout(reorderSection(layout, naturalIds, activeId, overId));
    },
    [layout, naturalIds, persistLayout],
  );

  const viewerScrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const insightAnchorRefs = useRef<Record<string, HTMLElement | null>>({});
  const isProgrammaticScroll = useRef(false);

  const pendingEditCount = Object.keys(pendingEdits).length;

  const { positions, viewportHeight, scrollToInsight, refresh } =
    useReportInsightSync({
      scrollContainerRef: viewerScrollRef,
      insightAnchorRefs,
      insights: REPORT_INSIGHTS,
      activeInsightId,
      onActiveInsightChange: setActiveInsightId,
      isProgrammaticScrollRef: isProgrammaticScroll,
      syncKey: mode === "edit" ? 0 : 1,
    });

  const scrollToSection = useCallback((sectionId: string) => {
    const node = sectionRefs.current[sectionId];
    const container = viewerScrollRef.current;
    if (!node || !container) return;

    isProgrammaticScroll.current = true;
    setActiveSectionId(sectionId);

    const top =
      node.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    container.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
      refresh();
    }, 500);
  }, [refresh]);

  useEffect(() => {
    const container = viewerScrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visible[0];
        if (!topEntry?.target.id) return;

        const sectionId = topEntry.target.id.replace("report-section-", "");
        if (navSections.some((section) => section.id === sectionId)) {
          setActiveSectionId(sectionId);
        }
      },
      {
        root: container,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    navSections.forEach((section) => {
      const node = sectionRefs.current[section.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [mode, navSections, isCreatingSection]);

  const clearPendingKey = (key: string) => {
    setPendingEdits((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handlePlCellDraft = (
    rowIndex: number,
    field: ReportPlEditableField,
    value: string,
  ) => {
    const key = plEditKey(rowIndex, field);
    const committed = (plRows[rowIndex]?.[field] as string | undefined) ?? "";

    if (value === committed) {
      clearPendingKey(key);
      return;
    }

    setPendingEdits((current) => ({ ...current, [key]: value }));
  };

  const handlePlCellApprove = (rowIndex: number, field: ReportPlEditableField) => {
    const key = plEditKey(rowIndex, field);
    const value = pendingEdits[key];
    if (value === undefined) return;

    setPlRows((rows) =>
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row,
      ),
    );
    clearPendingKey(key);
  };

  const handlePlCellReject = (rowIndex: number, field: ReportPlEditableField) => {
    clearPendingKey(plEditKey(rowIndex, field));
  };

  const handleProseDraft = (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
    value: string,
  ) => {
    const key = proseEditKey(sectionId, blockIndex, paragraphIndex);
    const committed = getCommittedProseParagraph(
      documentSections,
      sectionId,
      blockIndex,
      paragraphIndex,
      proseOverrides,
    );

    if (value === committed) {
      clearPendingKey(key);
      return;
    }

    setPendingEdits((current) => ({ ...current, [key]: value }));
  };

  const handleProseApprove = (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
  ) => {
    const key = proseEditKey(sectionId, blockIndex, paragraphIndex);
    const value = pendingEdits[key];
    if (value === undefined) return;

    setProseOverrides((current) => {
      const section = documentSections.find((item) => item.id === sectionId);
      const block = section?.blocks[blockIndex];
      if (!block || block.type !== "prose") return current;

      const existing = current[sectionId]?.[blockIndex] ?? [...block.paragraphs];
      const nextParagraphs = [...existing];
      nextParagraphs[paragraphIndex] = value;

      const nextSectionBlocks = [...(current[sectionId] ?? [])];
      nextSectionBlocks[blockIndex] = nextParagraphs;

      return { ...current, [sectionId]: nextSectionBlocks };
    });
    clearPendingKey(key);
  };

  const handleProseReject = (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
  ) => {
    clearPendingKey(proseEditKey(sectionId, blockIndex, paragraphIndex));
  };

  const handleModeChange = (nextMode: "edit" | "preview") => {
    if (nextMode === "preview" && pendingEditCount > 0) {
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: {
            message: "Approve or discard pending edits before switching to preview.",
          },
        }),
      );
      return;
    }
    setMode(nextMode);
  };

  const handleSave = () => {
    if (pendingEditCount > 0) return;

    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: "Report changes saved." },
      }),
    );
  };

  const handleInsightChange = (insightId: string) => {
    scrollToInsight(insightId);
  };

  const handleApproveSection = (section: CustomReportSection) => {
    setCustomSections(appendCustomSection(reportTitle, section));
    setIsCreatingSection(false);
    setActiveSectionId(section.id);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `“${section.title}” added to the ${reportTitle} template.` },
      }),
    );
    window.setTimeout(() => scrollToSection(section.id), 200);
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <ReportToolbar
        reportTitle={reportTitle}
        reports={ACTIVE_REPORTS}
        onReportChange={setReportTitle}
        mode={mode}
        onModeChange={handleModeChange}
        pendingEditCount={pendingEditCount}
        onSave={handleSave}
        canCreateSection={featureFlags.showReportSectionBuilder && !isCreatingSection}
        onCreateSection={() => setIsCreatingSection(true)}
      />

      <div className="flex min-h-0 items-start gap-4">
        <ReportSectionsNav
          sections={navSections}
          activeSectionId={activeSectionId}
          onSectionSelect={scrollToSection}
          updatedLabel="Updated 23 Nov 2025"
          collapsed={sectionsCollapsed}
          onToggleCollapse={() => setSectionsCollapsed((value) => !value)}
          editable={featureFlags.showReportSectionBuilder && !isCreatingSection}
          removedSections={removedNavSections}
          onMoveSection={handleMoveSection}
          onRemoveSection={handleRemoveSection}
          onRestoreSection={handleRestoreSection}
          onReorderSection={handleReorderSection}
        />

        {isCreatingSection ? (
          <div className="flex h-[794px] min-w-0 flex-1">
            <CreateSectionBuilder
              reportTitle={reportTitle}
              onCancel={() => setIsCreatingSection(false)}
              onApprove={handleApproveSection}
            />
          </div>
        ) : (
          <div
            className={cn(
              "relative flex h-[794px] min-w-0 flex-1 overflow-hidden rounded-xl border border-[#E6E8EB] bg-white",
              mode === "preview" && "shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
            )}
          >
            <div
              ref={viewerScrollRef}
              className={cn(
                "min-w-0 flex-1 overflow-x-auto overflow-y-auto",
                mode === "preview" && "bg-white",
                mode === "edit" && "bg-[#FAFBFC]",
              )}
            >
              <div className="min-w-[661px] px-6 py-6 pr-3">
                {mode === "preview" ? (
                  <div className="mb-6 inline-flex items-center rounded-full bg-[#F0F2F5] px-3 py-1 text-[12px] font-medium text-[#65686B]">
                    Preview mode
                  </div>
                ) : null}
                {mode === "edit" && pendingEditCount > 0 ? (
                  <div className="mb-4 inline-flex items-center rounded-lg bg-[#F0F2F5] px-3 py-2 text-[12px] leading-[1.4] text-[#65686B]">
                    Approve pending edits with the checkmark before saving.
                  </div>
                ) : null}
                <ReportDocument
                  sections={documentSections}
                  plRows={plRows}
                  editable={mode === "edit"}
                  sectionRefs={sectionRefs}
                  insightAnchorRefs={insightAnchorRefs}
                  insightAnchors={REPORT_INSIGHTS}
                  pendingEdits={pendingEdits}
                  onPlCellDraft={handlePlCellDraft}
                  onPlCellApprove={handlePlCellApprove}
                  onPlCellReject={handlePlCellReject}
                  onProseDraft={handleProseDraft}
                  onProseApprove={handleProseApprove}
                  onProseReject={handleProseReject}
                  proseOverrides={proseOverrides}
                />
              </div>
            </div>

            <ReportInsightsPanel
              insights={REPORT_INSIGHTS}
              activeInsightId={activeInsightId}
              onInsightChange={handleInsightChange}
              collapsed={insightsCollapsed}
              onToggleCollapse={() => setInsightsCollapsed((value) => !value)}
              positions={positions}
              viewportHeight={viewportHeight}
            />
          </div>
        )}
      </div>
    </div>
  );
}
