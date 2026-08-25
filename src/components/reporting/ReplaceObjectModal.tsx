"use client";

import { useState } from "react";
import { ArrowLeft, Library, Sparkles, X } from "lucide-react";
import { SectionCollection } from "@/src/components/reporting/SectionCollection";
import type { LibrarySection } from "@/src/lib/reportSectionLibrary";

/**
 * Replace flow entry point. Lets the user either swap the object for an
 * existing library section, or generate a new one with the section builder
 * (the workflow we already have).
 */
export function ReplaceObjectModal({
  onClose,
  onCreateNew,
  onUseSection,
}: {
  onClose: () => void;
  onCreateNew: () => void;
  onUseSection: (section: LibrarySection) => void;
}) {
  const [view, setView] = useState<"choose" | "existing">("choose");

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex items-center gap-2">
            {view === "existing" ? (
              <button
                type="button"
                onClick={() => setView("choose")}
                className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
                aria-label="Back"
              >
                <ArrowLeft className="size-5" strokeWidth={1.75} />
              </button>
            ) : null}
            <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
              {view === "existing" ? "Choose a section" : "Replace object"}
            </h3>
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
          {view === "choose" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setView("existing")}
                className="flex flex-col items-start gap-2 rounded-xl border border-[#E6E8EB] bg-white p-5 text-left transition-colors hover:border-[#A7B2F2] hover:bg-[#F7F8FF]"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF0FF] text-[#4C61DB]">
                  <Library className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-[14px] font-semibold leading-[1.3] text-[#05091F]">
                  Choose from existing sections
                </span>
                <span className="text-[12px] leading-[1.4] text-[#65686B]">
                  Swap in a standard or saved section from your library.
                </span>
              </button>

              <button
                type="button"
                onClick={onCreateNew}
                className="flex flex-col items-start gap-2 rounded-xl border border-[#E6E8EB] bg-white p-5 text-left transition-colors hover:border-[#A7B2F2] hover:bg-[#F7F8FF]"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF0FF] text-[#4C61DB]">
                  <Sparkles className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-[14px] font-semibold leading-[1.3] text-[#05091F]">
                  Create a new one
                </span>
                <span className="text-[12px] leading-[1.4] text-[#65686B]">
                  Generate a fresh object with the Deep Agent section builder.
                </span>
              </button>
            </div>
          ) : (
            <SectionCollection
              onInsert={(section) => {
                onUseSection(section);
                onClose();
              }}
              insertLabel="Replace with this"
            />
          )}
        </div>
      </div>
    </div>
  );
}
