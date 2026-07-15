"use client";

import { ChevronDown, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportToolbarProps = {
  reportTitle: string;
  reports: readonly string[];
  onReportChange?: (title: string) => void;
  mode: "edit" | "preview";
  onModeChange: (mode: "edit" | "preview") => void;
  pendingEditCount?: number;
  onSave?: () => void;
  canCreateSection?: boolean;
  onCreateSection?: () => void;
};

export function ReportToolbar({
  reportTitle,
  reports,
  onReportChange,
  mode,
  onModeChange,
  pendingEditCount = 0,
  onSave,
  canCreateSection = false,
  onCreateSection,
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

        {hasPendingEdits && mode === "edit" ? (
          <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2.5 py-1 text-[12px] font-medium leading-4 text-[#65686B]">
            {pendingEditCount} change{pendingEditCount === 1 ? "" : "s"} awaiting approval
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
        <button
          type="button"
          className="flex h-10 items-center justify-center rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
        >
          Finalize
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={hasPendingEdits}
          className={cn(
            "flex h-10 items-center justify-center rounded-lg border px-4 text-[14px] font-medium leading-[1.24]",
            hasPendingEdits
              ? "cursor-not-allowed border-[#E8EAED] text-[#B3B8BD]"
              : "border-[#B3B8BD] text-[#111] hover:bg-[#F7F8FA]",
          )}
          title={
            hasPendingEdits
              ? "Approve all pending edits before saving"
              : "Save approved changes"
          }
        >
          Save
        </button>
        <button
          type="button"
          disabled
          className="flex h-10 items-center gap-2 rounded-lg border border-[#E8EAED] px-4 text-[14px] font-medium leading-[1.24] text-[#B3B8BD] disabled:cursor-not-allowed"
        >
          <Download className="size-4" />
          Download PDF file
        </button>
      </div>
    </div>
  );
}
