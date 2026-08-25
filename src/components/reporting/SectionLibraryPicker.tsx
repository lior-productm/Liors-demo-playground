"use client";

import { Library, X } from "lucide-react";
import { SectionCollection } from "@/src/components/reporting/SectionCollection";
import type { LibrarySection } from "@/src/lib/reportSectionLibrary";

/** Modal for inserting a saved/standard section into the open template. */
export function SectionLibraryPicker({
  onClose,
  onInsert,
}: {
  onClose: () => void;
  onInsert: (section: LibrarySection) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Library className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
              <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
                Add section from library
              </h3>
            </div>
            <p className="text-[12px] leading-[1.4] text-[#65686B]">
              Insert a standard or saved section into this template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <SectionCollection
            onInsert={(section) => {
              onInsert(section);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
