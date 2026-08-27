"use client";

import { useState, type MutableRefObject } from "react";
import { Check, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  REPORT_PL_FORECAST_ROWS,
  type ReportDocumentSection,
  type ReportPlRow,
} from "@/src/lib/reportingMockData";
import {
  ReportEditApprovalMark,
  proseEditKey,
} from "@/src/components/reporting/ReportEditApprovalMark";
import {
  ReportPlTable,
  type ReportPlEditableField,
} from "@/src/components/reporting/ReportPlTable";
import { ReportRichBlock } from "@/src/components/reporting/ReportRichBlock";
import { PlForecastReviewEditor } from "@/src/components/reporting/PlForecastReviewEditor";

type ReportDocumentProps = {
  sections: ReportDocumentSection[];
  plRows: ReportPlRow[];
  editable: boolean;
  sectionRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  insightAnchorRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  insightAnchors: readonly {
    id: string;
    scrollTarget: string;
    anchorOffsetPx?: number;
  }[];
  pendingEdits?: Record<string, string>;
  onPlCellDraft: (rowIndex: number, field: ReportPlEditableField, value: string) => void;
  onPlCellApprove: (rowIndex: number, field: ReportPlEditableField) => void;
  onPlCellReject: (rowIndex: number, field: ReportPlEditableField) => void;
  onProseDraft?: (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
    value: string,
  ) => void;
  onProseApprove?: (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
  ) => void;
  onProseReject?: (
    sectionId: string,
    blockIndex: number,
    paragraphIndex: number,
  ) => void;
  proseOverrides?: Record<string, string[][]>;
  /** Enables per-section Replace / Remove / Approve controls (Template Studio). */
  objectEditable?: boolean;
  onReplaceSection?: (sectionId: string) => void;
  onRemoveSection?: (sectionId: string) => void;
  onForecastRowsChange?: (
    sectionId: string,
    blockIndex: number,
    rows: ReportPlRow[],
  ) => void;
};

function SectionToolbarButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: typeof RefreshCw;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium leading-none transition-colors",
        variant === "danger" && "text-[#B23A2F] hover:bg-[#FBE9E7]",
        variant === "success" && "bg-[#E7F4EC] text-[#1F7A45] hover:bg-[#D8EDDF]",
        variant === "default" && "text-[#353638] hover:bg-[#F0F2F5]",
      )}
    >
      <Icon className="size-4" strokeWidth={1.9} />
      {label}
    </button>
  );
}

function ProseBlock({
  sectionId,
  blockIndex,
  paragraphs,
  committedParagraphs,
  editable,
  pendingEdits = {},
  onParagraphDraft,
  onParagraphApprove,
  onParagraphReject,
}: {
  sectionId: string;
  blockIndex: number;
  paragraphs: string[];
  committedParagraphs: string[];
  editable: boolean;
  pendingEdits?: Record<string, string>;
  onParagraphDraft?: (paragraphIndex: number, value: string) => void;
  onParagraphApprove?: (paragraphIndex: number) => void;
  onParagraphReject?: (paragraphIndex: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, index) => {
        const editKey = proseEditKey(sectionId, blockIndex, index);
        const isPending = editKey in pendingEdits;

        if (!editable) {
          return (
            <p key={index} className="text-[12px] leading-[1.5] text-[#353638]">
              {paragraph}
            </p>
          );
        }

        return (
          <div key={index} className="relative">
            <textarea
              value={paragraph}
              onChange={(event) => onParagraphDraft?.(index, event.target.value)}
              rows={3}
              className={cn(
                "w-full resize-y rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 pr-16 text-[12px] leading-[1.5] text-[#353638] outline-none focus:border-[#B3B8BD]",
              )}
            />
            {isPending ? (
              <div className="absolute right-2 top-2">
                <ReportEditApprovalMark
                  onApprove={() => onParagraphApprove?.(index)}
                  onReject={() => onParagraphReject?.(index)}
                />
              </div>
            ) : null}
            {isPending ? (
              <p className="mt-1 text-[11px] leading-[1.4] text-[#65686B]">
                Approve to keep this change, or discard to revert to: "
                {committedParagraphs[index]?.slice(0, 48)}
                {committedParagraphs[index]?.length > 48 ? "…" : ""}"
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ReportDocument({
  sections,
  plRows,
  editable,
  sectionRefs,
  insightAnchorRefs,
  insightAnchors = [],
  pendingEdits = {},
  onPlCellDraft,
  onPlCellApprove,
  onPlCellReject,
  onProseDraft,
  onProseApprove,
  onProseReject,
  proseOverrides,
  objectEditable = false,
  onReplaceSection,
  onRemoveSection,
  onForecastRowsChange,
}: ReportDocumentProps) {
  const [approvedSections, setApprovedSections] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleApproved = (sectionId: string) => {
    setApprovedSections((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {sections.map((section) => {
        const isApproved = approvedSections.has(section.id);
        const hideStandaloneTitle =
          !objectEditable &&
          (section.blocks[0]?.type === "pl-table" ||
            section.blocks[0]?.type === "heading");

        return (
        <section
          key={section.id}
          id={`report-section-${section.id}`}
          ref={(node) => {
            if (sectionRefs.current) {
              sectionRefs.current[section.id] = node;
            }
          }}
          className={cn(
            "relative scroll-mt-6 rounded-xl transition-colors",
            objectEditable && "border p-5",
            objectEditable && isApproved
              ? "border-[#BFE3CC] bg-[#E7F4EC]"
              : objectEditable
                ? "border-[#E6E8EB] bg-white"
                : null,
          )}
        >
          {insightAnchors
            .filter((anchor) => anchor.scrollTarget === section.id)
            .map((anchor) => (
              <div
                key={anchor.id}
                ref={(node) => {
                  insightAnchorRefs.current[anchor.id] = node;
                }}
                className="pointer-events-none absolute left-0 h-px w-px"
                style={{ top: anchor.anchorOffsetPx ?? 0 }}
                aria-hidden
              />
            ))}

          {!hideStandaloneTitle || objectEditable ? (
            <div
              className={cn(
                "mb-6 flex items-start justify-between gap-3",
                objectEditable && "mb-5",
              )}
            >
              <h2 className="min-w-0 text-[24px] font-medium leading-[1.25] text-[#05091F]">
                {section.title}
              </h2>
              {objectEditable ? (
                <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-[#E6E8EB] bg-white p-1">
                  <SectionToolbarButton
                    icon={RefreshCw}
                    label="Replace"
                    onClick={() => onReplaceSection?.(section.id)}
                  />
                  <span className="h-4 w-px bg-[#E6E8EB]" />
                  <SectionToolbarButton
                    icon={Trash2}
                    label="Remove"
                    onClick={() => onRemoveSection?.(section.id)}
                    variant="danger"
                  />
                  <span className="h-4 w-px bg-[#E6E8EB]" />
                  <SectionToolbarButton
                    icon={Check}
                    label={isApproved ? "Approved" : "Approve"}
                    onClick={() => toggleApproved(section.id)}
                    variant={isApproved ? "success" : "default"}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-8">
            {section.blocks.map((block, blockIndex) => {
              if (objectEditable && block.type === "heading") return null;

              let content: React.ReactNode;

              if (block.type === "prose") {
                const committed =
                  proseOverrides?.[section.id]?.[blockIndex] ?? block.paragraphs;
                const paragraphs = committed.map((paragraph, paragraphIndex) => {
                  const key = proseEditKey(section.id, blockIndex, paragraphIndex);
                  return pendingEdits[key] ?? paragraph;
                });

                content = (
                  <ProseBlock
                    sectionId={section.id}
                    blockIndex={blockIndex}
                    paragraphs={paragraphs}
                    committedParagraphs={committed}
                    editable={editable}
                    pendingEdits={pendingEdits}
                    onParagraphDraft={(paragraphIndex, value) =>
                      onProseDraft?.(section.id, blockIndex, paragraphIndex, value)
                    }
                    onParagraphApprove={(paragraphIndex) =>
                      onProseApprove?.(section.id, blockIndex, paragraphIndex)
                    }
                    onParagraphReject={(paragraphIndex) =>
                      onProseReject?.(section.id, blockIndex, paragraphIndex)
                    }
                  />
                );
              } else if (block.type === "pl-table") {
                const isForecast = block.variant === "forecast";
                if (isForecast) {
                  content = (
                    <PlForecastReviewEditor
                      title={block.title}
                      rows={block.rows ?? REPORT_PL_FORECAST_ROWS}
                      editable={editable}
                      onRowsChange={
                        onForecastRowsChange
                          ? (rows) => onForecastRowsChange(section.id, blockIndex, rows)
                          : undefined
                      }
                    />
                  );
                } else {
                  content = (
                    <div className="flex flex-col gap-8">
                      <h3 className="text-[24px] font-medium leading-[1.25] text-[#05091F]">
                        {block.title}
                      </h3>
                      <ReportPlTable
                        rows={block.rows ?? plRows}
                        editable={editable}
                        pendingEdits={pendingEdits}
                        onCellDraft={onPlCellDraft}
                        onCellApprove={onPlCellApprove}
                        onCellReject={onPlCellReject}
                      />
                    </div>
                  );
                }
              } else if (block.type === "metrics") {
                content = (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {block.items.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] px-4 py-3"
                      >
                        <p className="text-[11px] leading-[1.5] text-[#65686B]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[16px] font-medium leading-[1.25] text-[#05091F]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              } else if (block.type === "updates") {
                content = (
                  <ul className="flex flex-col gap-3">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[12px] leading-[1.5] text-[#353638]"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#65686B]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              } else {
                content = <ReportRichBlock block={block} />;
              }

              return (
                <div key={`${section.id}-block-${blockIndex}`}>{content}</div>
              );
            })}
          </div>
        </section>
        );
      })}
    </div>
  );
}
