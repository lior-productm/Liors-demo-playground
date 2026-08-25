"use client";

import { ChevronDown, Download, FilePlus2, Library, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportToolbarProps = {
  reportTitle: string;
  reports: readonly string[];
  onReportChange?: (title: string) => void;
  mode: "edit" | "preview";
  onModeChange: (mode: "edit" | "preview") => void;
  pendingEditCount?: number;
  canCreateSection?: boolean;
  onCreateSection?: () => void;
  /** Open the section library picker (Template Studio only). */
  onAddFromLibrary?: () => void;
  /** Read-only preview toolbar (Active reports tab) — hides all edit affordances. */
  readOnly?: boolean;
  /** Jump to the Template Studio tab to edit this report. */
  onEditInStudio?: () => void;
  /**
   * Active reports: data can be edited, but the template structure cannot.
   * Shows Edit/Preview plus a Template Studio link (no section builder).
   */
  dataEditOnly?: boolean;
  /** Create a brand-new report template (Template Studio only). */
  onCreateTemplate?: () => void;
  /** "Viewing as" role selector (Template Studio only). */
  roleSlot?: React.ReactNode;
  /** Distribution status + approval/distribute actions. */
  distributionSlot?: React.ReactNode;
};

export function ReportToolbar({
  reportTitle,
  reports,
  onReportChange,
  mode,
  onModeChange,
  pendingEditCount = 0,
  canCreateSection = false,
  onCreateSection,
  onAddFromLibrary,
  readOnly = false,
  onEditInStudio,
  dataEditOnly = false,
  onCreateTemplate,
  roleSlot,
  distributionSlot,
}: ReportToolbarProps) {
  const hasPendingEdits = pendingEditCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={reportTitle}
            onChange={(event) => onReportChange?.(event.target.value)}
            className="h-10 appearance-none rounded-lg border border-[#E8EAED] bg-white py-2 pl-3 pr-9 text-[14px] font-medium leading-[1.24] text-[#111]"
          >
            {reports.map((report) => (
              <option key={report} value={report}>
                {report}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
        </div>

        {readOnly && !dataEditOnly ? (
          <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-3 py-1.5 text-[12px] font-medium leading-4 text-[#65686B]">
            Read-only preview
          </span>
        ) : (
          <div className="flex h-10 items-center rounded-full border border-[#E8EAED] bg-white p-1">
            <button
              type="button"
              onClick={() => onModeChange("edit")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[14px] font-medium leading-[1.24] transition-colors",
                mode === "edit"
                  ? "bg-[#111] text-white"
                  : "text-[#111] hover:bg-[#F7F8FA]",
              )}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onModeChange("preview")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[14px] font-medium leading-[1.24] transition-colors",
                mode === "preview"
                  ? "bg-[#111] text-white"
                  : "text-[#111] hover:bg-[#F7F8FA]",
              )}
            >
              Preview
            </button>
          </div>
        )}

        {(!readOnly || dataEditOnly) && hasPendingEdits && mode === "edit" ? (
          <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2.5 py-1 text-[12px] font-medium leading-4 text-[#65686B]">
            {pendingEditCount} change{pendingEditCount === 1 ? "" : "s"} awaiting approval
          </span>
        ) : null}

        {!readOnly && roleSlot ? roleSlot : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {dataEditOnly ? (
          <>
            {distributionSlot}
            {onEditInStudio ? (
              <button
                type="button"
                onClick={onEditInStudio}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#A7B2F2] bg-[#F7F8FF] px-4 text-[14px] font-medium leading-[1.24] text-[#4C61DB] hover:bg-[#EEF0FF]"
              >
                <Pencil className="size-4" strokeWidth={1.9} />
                Edit in Template Studio
              </button>
            ) : null}
            <button
              type="button"
              disabled
              className="flex h-10 items-center gap-2 rounded-lg border border-[#E8EAED] px-4 text-[14px] font-medium leading-[1.24] text-[#B3B8BD] disabled:cursor-not-allowed"
            >
              <Download className="size-4" />
              Download PDF file
            </button>
          </>
        ) : readOnly ? (
          <>
            {distributionSlot}
            {onEditInStudio ? (
              <button
                type="button"
                onClick={onEditInStudio}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#A7B2F2] bg-[#F7F8FF] px-4 text-[14px] font-medium leading-[1.24] text-[#4C61DB] hover:bg-[#EEF0FF]"
              >
                <Pencil className="size-4" strokeWidth={1.9} />
                Edit in Template Studio
              </button>
            ) : null}
            <button
              type="button"
              disabled
              className="flex h-10 items-center gap-2 rounded-lg border border-[#E8EAED] px-4 text-[14px] font-medium leading-[1.24] text-[#B3B8BD] disabled:cursor-not-allowed"
            >
              <Download className="size-4" />
              Download PDF file
            </button>
          </>
        ) : (
          <>
            {onCreateTemplate ? (
              <button
                type="button"
                onClick={onCreateTemplate}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <FilePlus2 className="size-4" strokeWidth={1.9} />
                New template
              </button>
            ) : null}
            {canCreateSection && onAddFromLibrary ? (
              <button
                type="button"
                onClick={onAddFromLibrary}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <Library className="size-4" strokeWidth={1.9} />
                Add from library
              </button>
            ) : null}
            {canCreateSection ? (
              <button
                type="button"
                onClick={onCreateSection}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#A7B2F2] bg-[#F7F8FF] px-4 text-[14px] font-medium leading-[1.24] text-[#4C61DB] hover:bg-[#EEF0FF]"
              >
                <Plus className="size-4" strokeWidth={2} />
                Create new section
              </button>
            ) : null}
            {distributionSlot}
          </>
        )}
      </div>
    </div>
  );
}
