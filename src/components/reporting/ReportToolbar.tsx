"use client";

import { ChevronDown, Download, FilePlus2, Library, Lock, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/src/hooks/useI18n";
import { LanguageOptionLabel } from "@/src/components/i18n/LanguageSelect";
import type { LanguageCode } from "@/src/lib/i18n";

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
  /** Language the report was generated in (locked after creation). */
  reportLanguage?: LanguageCode;
  /** Enables the "Download PDF file" action. */
  onDownloadPdf?: () => void;
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
  reportLanguage,
  onDownloadPdf,
}: ReportToolbarProps) {
  const { t } = useI18n();
  const hasPendingEdits = pendingEditCount > 0;

  const languagePill = reportLanguage ? (
    <span
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E8EAED] bg-[#FAFBFC] px-3 text-[13px] font-medium leading-[1.24] text-[#353638]"
      title={t("The report language cannot be changed after the report is created.")}
    >
      <span className="text-[#65686B]">{t("Report language")}</span>
      <LanguageOptionLabel code={reportLanguage} />
      <Lock className="size-3.5 text-[#969A9E]" strokeWidth={1.9} aria-hidden />
    </span>
  ) : null;

  const pdfButton = (
    <button
      type="button"
      disabled={!onDownloadPdf}
      onClick={onDownloadPdf}
      className={cn(
        "flex h-10 items-center gap-2 rounded-lg border border-[#E8EAED] px-4 text-[14px] font-medium leading-[1.24]",
        onDownloadPdf
          ? "text-[#111] hover:bg-[#F7F8FA]"
          : "text-[#B3B8BD] disabled:cursor-not-allowed",
      )}
    >
      <Download className="size-4" />
      {t("Download PDF file")}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={reportTitle}
            onChange={(event) => onReportChange?.(event.target.value)}
            className="h-10 appearance-none rounded-lg border border-[#E8EAED] bg-white py-2 ps-3 pe-9 text-[14px] font-medium leading-[1.24] text-[#111]"
          >
            {reports.map((report) => (
              <option key={report} value={report}>
                {report}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
        </div>
        {languagePill}

        {readOnly && !dataEditOnly ? (
          <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-3 py-1.5 text-[12px] font-medium leading-4 text-[#65686B]">
            {t("Read-only preview")}
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
              {t("Edit")}
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
              {t("Preview")}
            </button>
          </div>
        )}

        {(!readOnly || dataEditOnly) && hasPendingEdits && mode === "edit" ? (
          <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2.5 py-1 text-[12px] font-medium leading-4 text-[#65686B]">
            {pendingEditCount === 1
              ? t("1 change awaiting approval")
              : t("{count} changes awaiting approval", { values: { count: pendingEditCount } })}
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
                {t("Edit in Template Studio")}
              </button>
            ) : null}
            {pdfButton}
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
                {t("Edit in Template Studio")}
              </button>
            ) : null}
            {pdfButton}
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
                {t("New template")}
              </button>
            ) : null}
            {canCreateSection && onAddFromLibrary ? (
              <button
                type="button"
                onClick={onAddFromLibrary}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <Library className="size-4" strokeWidth={1.9} />
                {t("Add from library")}
              </button>
            ) : null}
            {canCreateSection ? (
              <button
                type="button"
                onClick={onCreateSection}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#A7B2F2] bg-[#F7F8FF] px-4 text-[14px] font-medium leading-[1.24] text-[#4C61DB] hover:bg-[#EEF0FF]"
              >
                <Plus className="size-4" strokeWidth={2} />
                {t("Create new section")}
              </button>
            ) : null}
            {distributionSlot}
          </>
        )}
      </div>
    </div>
  );
}
