"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACTIVE_REPORTS,
  REPORT_DOCUMENT_SECTIONS,
  REPORT_INSIGHTS,
  REPORT_PL_ROWS,
  REPORT_SECTIONS,
  type ReportDocumentBlock,
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
import { SectionLibraryPicker } from "@/src/components/reporting/SectionLibraryPicker";
import { ReplaceObjectModal } from "@/src/components/reporting/ReplaceObjectModal";
import { librarySectionToCustom } from "@/src/lib/reportSectionLibrary";
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
import {
  blockEditKey,
  readBlockEdits,
  removeBlockEdit,
  resolveSectionBlocks,
  setBlockOverride,
  writeBlockEdits,
  type ReportBlockEdits,
} from "@/src/lib/reportBlockEdits";
import {
  clearApprovalRequest,
  readApprovalRequest,
  readDistributionStatus,
  writeApprovalRequest,
  writeDistributionStatus,
  type ApprovalRequest,
  type DistributionStatus,
} from "@/src/lib/reportDistribution";
import { RequestApprovalModal } from "@/src/components/reporting/RequestApprovalModal";
import { readReportRole, writeReportRole, type ReportUserRole } from "@/src/lib/reportRole";
import {
  DistributionPill,
  ReportDistributionControls,
  ReportRoleSelect,
} from "@/src/components/reporting/ReportDistributionControls";
import { listTemplateTitles, setTemplateOwnership } from "@/src/lib/reportTemplates";

type ReportActiveViewProps = {
  /** "studio" enables full editing; "preview" renders read-only. */
  variant?: "studio" | "preview";
  /** Preview → jump to the Template Studio tab. */
  onEditInStudio?: () => void;
  /** Studio → open this specific template on mount. */
  openTitle?: string;
  /** Studio → return to the templates collection. */
  onBackToCollection?: () => void;
  /** Studio → launch the new-template creation flow. */
  onRequestNewTemplate?: () => void;
};

type ReplaceTarget = { sectionId: string; editKey: string };

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

export function ReportActiveView({
  variant = "studio",
  onEditInStudio,
  openTitle,
  onBackToCollection,
  onRequestNewTemplate,
}: ReportActiveViewProps = {}) {
  const isStudio = variant === "studio";
  const dataEditOnly = variant === "preview";
  const [reportTitle, setReportTitle] = useState<string>(
    openTitle ?? ACTIVE_REPORTS[0],
  );
  const [templateTitles, setTemplateTitles] = useState<string[]>(() => [
    ...ACTIVE_REPORTS,
  ]);
  const [mode, setMode] = useState<"edit" | "preview">(
    isStudio ? "edit" : "preview",
  );
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
  const [blockEdits, setBlockEdits] = useState<ReportBlockEdits>({
    removed: [],
    overrides: {},
  });
  const [replaceTarget, setReplaceTarget] = useState<ReplaceTarget | null>(null);
  const [replaceChooser, setReplaceChooser] = useState<ReplaceTarget | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [distributionStatus, setDistributionStatus] =
    useState<DistributionStatus>("draft");
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(
    null,
  );
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [role, setRole] = useState<ReportUserRole>("asset-manager");

  const reports = templateTitles;

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

  const baseDocumentSections = useMemo<ReportDocumentSection[]>(() => {
    const byId = new Map(allSections.map((section) => [section.id, section]));
    return resolved.visibleIds
      .map((id) => byId.get(id))
      .filter((section): section is ReportDocumentSection => Boolean(section));
  }, [allSections, resolved.visibleIds]);

  // Overlay object-level edits (edit / replace / remove) on top of the layout.
  const { documentSections, blockEditKeys } = useMemo(() => {
    const editKeys: Record<string, string[]> = {};
    const sections = baseDocumentSections.map((section) => {
      const resolvedBlocks = resolveSectionBlocks(section, blockEdits);
      editKeys[section.id] = resolvedBlocks.map((entry) => entry.editKey);
      return { ...section, blocks: resolvedBlocks.map((entry) => entry.block) };
    });
    return { documentSections: sections, blockEditKeys: editKeys };
  }, [baseDocumentSections, blockEdits]);

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
    setTemplateTitles(listTemplateTitles());
    setRole(readReportRole());
  }, []);

  useEffect(() => {
    setCustomSections(readCustomSections(reportTitle));
    setLayout(readTemplateLayout(reportTitle));
    setBlockEdits(readBlockEdits(reportTitle));
    setDistributionStatus(readDistributionStatus(reportTitle));
    setApprovalRequest(readApprovalRequest(reportTitle));
    setIsCreatingSection(false);
    setReplaceTarget(null);
    setPendingEdits({});
    setProseOverrides({});
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

  const persistBlockEdits = useCallback(
    (next: ReportBlockEdits) => {
      setBlockEdits(next);
      writeBlockEdits(reportTitle, next);
    },
    [reportTitle],
  );

  // Structural block changes shift indices, so drop stale prose session edits.
  const clearSectionEditState = useCallback((sectionId: string) => {
    setPendingEdits((current) => {
      const prefix = `prose:${sectionId}:`;
      const next = Object.fromEntries(
        Object.entries(current).filter(([key]) => !key.startsWith(prefix)),
      );
      return next;
    });
    setProseOverrides((current) => {
      if (!(sectionId in current)) return current;
      const next = { ...current };
      delete next[sectionId];
      return next;
    });
  }, []);

  const handleReplaceSection = useCallback((sectionId: string) => {
    setReplaceTarget(null);
    const firstKey = blockEditKeys[sectionId]?.[0] ?? `${sectionId}#0`;
    setReplaceChooser({ sectionId, editKey: firstKey });
  }, [blockEditKeys]);


  const changeDistributionStatus = useCallback(
    (next: DistributionStatus, message: string) => {
      setDistributionStatus(next);
      writeDistributionStatus(reportTitle, next);
      window.dispatchEvent(
        new CustomEvent("amiio:toast", { detail: { message } }),
      );
    },
    [reportTitle],
  );

  const handleRoleChange = useCallback((next: ReportUserRole) => {
    setRole(next);
    writeReportRole(next);
  }, []);

  const handleRequestApproval = useCallback(
    () => setShowApprovalModal(true),
    [],
  );

  const submitApprovalRequest = useCallback(
    (request: ApprovalRequest) => {
      writeApprovalRequest(reportTitle, request);
      setApprovalRequest(request);
      setTemplateOwnership(reportTitle, "organization");
      changeDistributionStatus(
        "pending_approval",
        `Approval requested from ${request.approverName}.`,
      );
    },
    [reportTitle, changeDistributionStatus],
  );

  const handleApproveDistribution = useCallback(() => {
    clearApprovalRequest(reportTitle);
    setApprovalRequest(null);
    changeDistributionStatus("approved", "Template approved for distribution.");
  }, [reportTitle, changeDistributionStatus]);

  const handleRejectDistribution = useCallback(() => {
    clearApprovalRequest(reportTitle);
    setApprovalRequest(null);
    setTemplateOwnership(reportTitle, "personal");
    changeDistributionStatus("draft", "Approval request declined — back to draft.");
  }, [reportTitle, changeDistributionStatus]);

  const handleDistribute = useCallback(
    () =>
      changeDistributionStatus(
        "distributed",
        "Template distributed to stakeholders.",
      ),
    [changeDistributionStatus],
  );

  const handleNewRevision = useCallback(() => {
    clearApprovalRequest(reportTitle);
    setApprovalRequest(null);
    changeDistributionStatus("draft", "Started a new revision (draft).");
  }, [reportTitle, changeDistributionStatus]);

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

  const handleInsightChange = (insightId: string) => {
    scrollToInsight(insightId);
  };

  const applyBlockReplacement = (
    target: ReplaceTarget,
    blocks: ReportDocumentBlock[],
  ) => {
    const source = baseDocumentSections.find((section) => section.id === target.sectionId);
    let next = blockEdits;
    if (source && source.blocks.length > 0) {
      source.blocks.forEach((_block, index) => {
        const key = blockEditKey(target.sectionId, index);
        next =
          index === 0
            ? setBlockOverride(next, key, blocks)
            : removeBlockEdit(next, key);
      });
    } else {
      next = setBlockOverride(blockEdits, target.editKey, blocks);
    }
    persistBlockEdits(next);
    clearSectionEditState(target.sectionId);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: "Section replaced." },
      }),
    );
    window.setTimeout(() => scrollToSection(target.sectionId), 200);
  };

  const handleApproveSection = (section: CustomReportSection) => {
    // Replace mode: use the generated blocks to swap a single object in place.
    if (replaceTarget) {
      const target = replaceTarget;
      setReplaceTarget(null);
      applyBlockReplacement(target, section.blocks);
      return;
    }

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

  const handleInsertLibrarySection = (
    section: Parameters<typeof librarySectionToCustom>[0],
  ) => {
    const custom = librarySectionToCustom(section);
    setCustomSections(appendCustomSection(reportTitle, custom));
    setActiveSectionId(custom.id);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `“${custom.title}” added from the library.` },
      }),
    );
    window.setTimeout(() => scrollToSection(custom.id), 200);
  };

  const builderOpen = isCreatingSection;
  const closeBuilder = () => {
    setIsCreatingSection(false);
    setReplaceTarget(null);
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {onBackToCollection ? (
        <button
          type="button"
          onClick={onBackToCollection}
          className="flex w-fit items-center gap-1.5 text-[13px] font-medium leading-[1.24] text-[#65686B] hover:text-[#353638]"
        >
          <ArrowLeft className="size-4" strokeWidth={1.9} />
          All templates
        </button>
      ) : null}
      <ReportToolbar
        reportTitle={reportTitle}
        reports={reports}
        onReportChange={setReportTitle}
        mode={mode}
        onModeChange={handleModeChange}
        pendingEditCount={pendingEditCount}
        readOnly={false}
        dataEditOnly={dataEditOnly}
        onEditInStudio={onEditInStudio}
        onCreateTemplate={isStudio ? onRequestNewTemplate : undefined}
        canCreateSection={
          isStudio && featureFlags.showReportSectionBuilder && !builderOpen
        }
        onCreateSection={() => setIsCreatingSection(true)}
        onAddFromLibrary={
          isStudio && featureFlags.showReportSectionBuilder && !builderOpen
            ? () => setShowSectionLibrary(true)
            : undefined
        }
        roleSlot={
          isStudio ? (
            <ReportRoleSelect role={role} onRoleChange={handleRoleChange} />
          ) : undefined
        }
        distributionSlot={
          dataEditOnly ? (
            <DistributionPill status={distributionStatus} />
          ) : (
            <ReportDistributionControls
              status={distributionStatus}
              role={role}
              request={approvalRequest}
              onRequestApproval={handleRequestApproval}
              onApprove={handleApproveDistribution}
              onReject={handleRejectDistribution}
              onDistribute={handleDistribute}
              onNewRevision={handleNewRevision}
            />
          )
        }
      />

      <div className="flex min-h-0 items-start gap-4">
        <ReportSectionsNav
          sections={navSections}
          activeSectionId={activeSectionId}
          onSectionSelect={scrollToSection}
          updatedLabel="Updated 23 Nov 2025"
          collapsed={sectionsCollapsed}
          onToggleCollapse={() => setSectionsCollapsed((value) => !value)}
          editable={
            isStudio && featureFlags.showReportSectionBuilder && !builderOpen
          }
          removedSections={removedNavSections}
          onMoveSection={handleMoveSection}
          onRemoveSection={handleRemoveSection}
          onRestoreSection={handleRestoreSection}
          onReorderSection={handleReorderSection}
        />

        {builderOpen ? (
          <div className="flex h-[794px] min-w-0 flex-1">
            <CreateSectionBuilder
              reportTitle={reportTitle}
              mode="create"
              onCancel={closeBuilder}
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
                  objectEditable={isStudio && mode === "edit"}
                  onReplaceSection={handleReplaceSection}
                  onRemoveSection={handleRemoveSection}
                />
              </div>
            </div>

            {dataEditOnly ? (
              <ReportInsightsPanel
                insights={REPORT_INSIGHTS}
                activeInsightId={activeInsightId}
                onInsightChange={handleInsightChange}
                collapsed={insightsCollapsed}
                onToggleCollapse={() => setInsightsCollapsed((value) => !value)}
                positions={positions}
                viewportHeight={viewportHeight}
              />
            ) : null}
          </div>
        )}
      </div>

      {showSectionLibrary ? (
        <SectionLibraryPicker
          onClose={() => setShowSectionLibrary(false)}
          onInsert={handleInsertLibrarySection}
        />
      ) : null}

      {replaceChooser ? (
        <ReplaceObjectModal
          onClose={() => setReplaceChooser(null)}
          onCreateNew={() => {
            const target = replaceChooser;
            setReplaceChooser(null);
            setReplaceTarget(target);
          }}
          onUseSection={(section) => {
            applyBlockReplacement(replaceChooser, section.blocks);
            setReplaceChooser(null);
          }}
        />
      ) : null}

      {replaceTarget ? (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setReplaceTarget(null)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-[900px] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CreateSectionBuilder
              reportTitle={reportTitle}
              mode="replace"
              onCancel={() => setReplaceTarget(null)}
              onApprove={handleApproveSection}
            />
          </div>
        </div>
      ) : null}

      {showApprovalModal ? (
        <RequestApprovalModal
          reportTitle={reportTitle}
          customSectionCount={customSections.length}
          onClose={() => setShowApprovalModal(false)}
          onSubmit={submitApprovalRequest}
          onContinue={() => {
            setShowApprovalModal(false);
            onBackToCollection?.();
          }}
        />
      ) : null}
    </div>
  );
}
