"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { CreatorChip, OwnershipBadge } from "@/src/components/reporting/CreatorChip";
import { SectionPreviewModal } from "@/src/components/reporting/SectionPreviewModal";
import {
  listLibrarySections,
  removeLibrarySection,
  sectionBlockSummary,
  type LibrarySection,
} from "@/src/lib/reportSectionLibrary";
import type { ItemOwnership } from "@/src/lib/reportUser";

function sectionOwnership(origin: LibrarySection["origin"]): ItemOwnership {
  return origin === "standard" ? "organization" : "personal";
}

/**
 * Grid of reusable report sections (standard blueprints + user-saved).
 * Reused by the studio landing (browse/manage) and the in-editor picker
 * (with `onInsert`).
 */
export function SectionCollection({
  onInsert,
  insertLabel = "Add to template",
  onNewSection,
  emptyHint,
  refreshKey,
}: {
  /** When provided, each card shows an "Add" action. */
  onInsert?: (section: LibrarySection) => void;
  /** Label for the per-card insert action. */
  insertLabel?: string;
  /** When provided, renders a "Create new section" box as the first card. */
  onNewSection?: () => void;
  emptyHint?: string;
  /** Bump to force a re-read of saved sections after creating one. */
  refreshKey?: number;
}) {
  const [sections, setSections] = useState<LibrarySection[]>(() =>
    listLibrarySections(),
  );
  const [previewSection, setPreviewSection] = useState<LibrarySection | null>(
    null,
  );

  useEffect(() => {
    setSections(listLibrarySections());
  }, [refreshKey]);

  const handleRemove = (id: string) => {
    removeLibrarySection(id);
    setSections(listLibrarySections());
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {onNewSection ? (
          <button
            type="button"
            onClick={onNewSection}
            className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#B3B8BD] bg-[#FAFBFC] p-5 text-center transition-colors hover:border-[#A7B2F2] hover:bg-[#F7F8FF]"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF0FF] text-[#4C61DB]">
              <Plus className="size-5" strokeWidth={2} />
            </span>
            <span className="text-[14px] font-medium leading-[1.25] text-[#05091F]">
              Create new section
            </span>
            <span className="text-[12px] leading-[1.4] text-[#65686B]">
              Generate a reusable section and save it to the library.
            </span>
          </button>
        ) : null}

        {sections.map((section) => {
          const chips = sectionBlockSummary(section.blocks);
          const ownership = sectionOwnership(section.origin);
          return (
            <div
              key={section.id}
              className="group flex min-h-[168px] flex-col gap-3 rounded-xl border border-[#E6E8EB] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <OwnershipBadge ownership={ownership} />
                {section.origin === "saved" ? (
                  <button
                    type="button"
                    onClick={() => handleRemove(section.id)}
                    className="flex size-7 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#FBE9E7] hover:text-[#B23A2F]"
                    aria-label={`Remove ${section.title}`}
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                <h3 className="text-[15px] font-semibold leading-[1.3] text-[#05091F]">
                  {section.title}
                </h3>
                <p className="line-clamp-2 text-[12px] leading-[1.5] text-[#65686B]">
                  {section.description}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2 py-0.5 text-[10px] font-medium text-[#65686B]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <CreatorChip name={section.createdBy} className="mt-2" />
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#F0F2F5] pt-3">
                {onInsert ? (
                  <button
                    type="button"
                    onClick={() => onInsert(section)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#A7B2F2] bg-[#F7F8FF] px-3 text-[12px] font-medium leading-[1.24] text-[#4C61DB] hover:bg-[#EEF0FF]"
                  >
                    <Plus className="size-3.5" strokeWidth={2} />
                    {insertLabel}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setPreviewSection(section)}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#4C61DB] opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Preview
                  <ArrowRight className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}

        {sections.length === 0 && emptyHint ? (
          <p className="text-[13px] leading-[1.5] text-[#65686B]">{emptyHint}</p>
        ) : null}
      </div>

      {previewSection ? (
        <SectionPreviewModal
          section={previewSection}
          onClose={() => setPreviewSection(null)}
        />
      ) : null}
    </>
  );
}
