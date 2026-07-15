"use client";

import type { MutableRefObject } from "react";
import { cn } from "@/lib/utils";
import type {
  ReportDocumentSection,
  ReportPlRow,
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
};

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
}: ReportDocumentProps) {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`report-section-${section.id}`}
          ref={(node) => {
            if (sectionRefs.current) {
              sectionRefs.current[section.id] = node;
            }
          }}
          className="relative scroll-mt-6"
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

          {section.blocks[0]?.type !== "pl-table" &&
          section.blocks[0]?.type !== "heading" ? (
            <h2 className="mb-6 text-[24px] font-medium leading-[1.25] text-[#05091F]">
              {section.title}
            </h2>
          ) : null}

          <div className="flex flex-col gap-8">
            {section.blocks.map((block, blockIndex) => {
              if (block.type === "prose") {
                const committed =
                  proseOverrides?.[section.id]?.[blockIndex] ?? block.paragraphs;
                const paragraphs = committed.map((paragraph, paragraphIndex) => {
                  const key = proseEditKey(section.id, blockIndex, paragraphIndex);
                  return pendingEdits[key] ?? paragraph;
                });

                return (
                  <ProseBlock
                    key={`${section.id}-prose-${blockIndex}`}
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
              }

              if (block.type === "pl-table") {
                return (
                  <div key={`${section.id}-pl`} className="flex flex-col gap-8">
                    <h3 className="text-[24px] font-medium leading-[1.25] text-[#05091F]">
                      {block.title}
                    </h3>
                    <ReportPlTable
                      rows={plRows}
                      editable={editable}
                      pendingEdits={pendingEdits}
                      onCellDraft={onPlCellDraft}
                      onCellApprove={onPlCellApprove}
                      onCellReject={onPlCellReject}
                    />
                  </div>
                );
              }

              if (block.type === "metrics") {
                return (
                  <div
                    key={`${section.id}-metrics`}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
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
              }

              if (block.type === "updates") {
                return (
                  <ul
                    key={`${section.id}-updates`}
                    className="flex flex-col gap-3"
                  >
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
              }

              return (
                <ReportRichBlock key={`${section.id}-rich-${blockIndex}`} block={block} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
