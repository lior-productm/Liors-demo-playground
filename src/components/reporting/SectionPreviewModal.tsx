"use client";

import { useRef } from "react";
import { Eye, X } from "lucide-react";
import { CreatorChip, OwnershipBadge } from "@/src/components/reporting/CreatorChip";
import { ReportDocument } from "@/src/components/reporting/ReportDocument";
import type { LibrarySection } from "@/src/lib/reportSectionLibrary";
import { REPORT_PL_ROWS } from "@/src/lib/reportingMockData";
import type { ItemOwnership } from "@/src/lib/reportUser";

function sectionOwnership(origin: LibrarySection["origin"]): ItemOwnership {
  return origin === "standard" ? "organization" : "personal";
}

/** Read-only preview of a library section as it appears in a report. */
export function SectionPreviewModal({
  section,
  onClose,
}: {
  section: LibrarySection;
  onClose: () => void;
}) {
  const ownership = sectionOwnership(section.origin);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const insightAnchorRefs = useRef<Record<string, HTMLElement | null>>({});

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Eye className="size-5 shrink-0 text-[#4C61DB]" strokeWidth={1.75} />
              <h3 className="truncate text-[16px] font-semibold leading-[1.25] text-[#05091F]">
                Preview
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OwnershipBadge ownership={ownership} />
              <CreatorChip name={section.createdBy} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close preview"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[#FAFBFC] px-6 py-6">
          <div className="min-w-[661px] overflow-hidden rounded-xl border border-[#E6E8EB] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <ReportDocument
              sections={[
                {
                  id: section.id,
                  title: section.title,
                  blocks: section.blocks,
                },
              ]}
              plRows={REPORT_PL_ROWS}
              editable={false}
              sectionRefs={sectionRefs}
              insightAnchorRefs={insightAnchorRefs}
              insightAnchors={[]}
              onPlCellDraft={() => undefined}
              onPlCellApprove={() => undefined}
              onPlCellReject={() => undefined}
            />
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-[#E6E8EB] bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
