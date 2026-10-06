import type { I18n } from "@/src/lib/i18n";
import {
  REPORT_DOCUMENT_SECTIONS,
  REPORT_INSIGHTS,
  type ReportDocumentSection,
} from "@/src/lib/reportingMockData";
import { localizeInsights, localizeSections } from "@/src/lib/reportLocalize";
import type { GeneratedReport } from "@/src/lib/reportGenerated";

/**
 * Builds the document body for a freshly generated report. It reuses the mock
 * section library (localized to the report's language) and tailors the intro to
 * the selected owner + period so each generated report reads as its own.
 */
export function buildGeneratedReportSections(
  report: GeneratedReport,
  i18n: I18n,
): ReportDocumentSection[] {
  const base = localizeSections(i18n, REPORT_DOCUMENT_SECTIONS);
  return base.map((section) => {
    if (section.id !== "introduction") return section;
    const intro = i18n.t(
      "This report covers {owner} for {period}. It summarizes financial results, capital activity, and key operational updates for the investment committee.",
      { values: { owner: report.ownerName, period: report.period } },
    );
    return {
      ...section,
      blocks: section.blocks.map((block, index) =>
        index === 0 && block.type === "prose"
          ? { ...block, paragraphs: [intro, ...block.paragraphs.slice(1)] }
          : block,
      ),
    };
  });
}

export function buildGeneratedReportInsights(report: GeneratedReport, i18n: I18n) {
  void report;
  return localizeInsights(i18n, REPORT_INSIGHTS);
}
