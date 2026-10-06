import type { I18n } from "@/src/lib/i18n";
import type {
  ReportDocumentBlock,
  ReportDocumentSection,
  ReportPlRow,
} from "@/src/lib/reportingMockData";

/** Minimal shared insight shape — matches the report rail + document anchors. */
export type ReportInsightLike = {
  id: string;
  title: string;
  body?: readonly string[];
  reviewed?: boolean;
  scrollTarget?: string;
  anchorOffsetPx?: number;
};

/** Translate a domain term, preferring the UI dictionary then the P&L glossary. */
function localizeTerm(i18n: I18n, value: string): string {
  const fromDictionary = i18n.t(value);
  return fromDictionary !== value ? fromDictionary : i18n.account(value);
}

export function localizePlRows(i18n: I18n, rows: readonly ReportPlRow[]): ReportPlRow[] {
  return rows.map((row) => ({
    ...row,
    category: row.category ? localizeTerm(i18n, row.category) : row.category,
    account: localizeTerm(i18n, row.account),
  }));
}

function localizeBlock(i18n: I18n, block: ReportDocumentBlock): ReportDocumentBlock {
  switch (block.type) {
    case "prose":
      return { ...block, paragraphs: block.paragraphs.map((p) => i18n.t(p)) };
    case "pl-table":
      return {
        ...block,
        title: i18n.t(block.title),
        rows: block.rows ? localizePlRows(i18n, block.rows) : block.rows,
      };
    case "metrics":
      return {
        ...block,
        items: block.items.map((item) => ({ ...item, label: localizeTerm(i18n, item.label) })),
      };
    case "updates":
      return { ...block, items: block.items.map((item) => i18n.t(item)) };
    case "heading":
      return {
        ...block,
        title: i18n.t(block.title),
        subtitle: block.subtitle ? i18n.t(block.subtitle) : block.subtitle,
      };
    case "table":
      return {
        ...block,
        columns: block.columns.map((column) => localizeTerm(i18n, column)),
        rows: block.rows.map((row) => row.map((cell) => localizeTerm(i18n, cell))),
      };
    case "chart":
      return {
        ...block,
        items: block.items.map((item) => ({ ...item, label: localizeTerm(i18n, item.label) })),
      };
    case "photos":
      return {
        ...block,
        items: block.items.map((item) => ({ ...item, label: i18n.t(item.label) })),
      };
    case "ai-summary":
      return {
        ...block,
        headline: i18n.t(block.headline),
        paragraphs: block.paragraphs.map((p) => i18n.t(p)),
        kpis: block.kpis.map((kpi) => localizeTerm(i18n, kpi)),
      };
    default:
      return block;
  }
}

export function localizeSections(
  i18n: I18n,
  sections: readonly ReportDocumentSection[],
): ReportDocumentSection[] {
  return sections.map((section) => ({
    ...section,
    title: i18n.t(section.title),
    blocks: section.blocks.map((block) => localizeBlock(i18n, block)),
  }));
}

export function localizeInsights<T extends ReportInsightLike>(
  i18n: I18n,
  insights: readonly T[],
): T[] {
  return insights.map((insight) => ({
    ...insight,
    title: i18n.t(insight.title),
    body: insight.body ? insight.body.map((line) => i18n.t(line)) : insight.body,
  }));
}
