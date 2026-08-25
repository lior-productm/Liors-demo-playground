import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import {
  REPORT_DOCUMENT_SECTIONS,
  type ReportDocumentBlock,
} from "@/src/lib/reportingMockData";
import type { CustomReportSection } from "@/src/lib/reportSectionBuilder";
import { CURRENT_USER_NAME, SYSTEM_CREATOR_NAME } from "@/src/lib/reportUser";

/**
 * The section collection = a reusable library of report sections. It combines
 * the standard sections (shipped blueprints) with sections users choose to
 * save from the Create-section flow, so any section can be dropped into any
 * template.
 */
export const SECTION_LIBRARY_STORAGE_KEY = "amiio:reporting:section-library";

export type SectionLibraryOrigin = "standard" | "saved";

export type LibrarySection = {
  id: string;
  title: string;
  description: string;
  blocks: ReportDocumentBlock[];
  origin: SectionLibraryOrigin;
  createdAt?: string;
  /** Display name of the person (or system) that created the section. */
  createdBy?: string;
};

const STANDARD_DESCRIPTIONS: Record<string, string> = {
  introduction: "Narrative introduction and reporting scope.",
  acquisition: "Acquisition and financing summary.",
  distribution: "Distributions and capital movements.",
  metrics: "Headline KPI cards (occupancy, NOI, DSCR, LTV).",
  updates: "General operational updates.",
};

export const STANDARD_LIBRARY_SECTIONS: LibrarySection[] =
  REPORT_DOCUMENT_SECTIONS.map((section) => ({
    id: `standard-${section.id}`,
    title: section.title,
    description:
      STANDARD_DESCRIPTIONS[String(section.id)] ?? "Standard report section.",
    blocks: section.blocks,
    origin: "standard" as const,
    createdBy: SYSTEM_CREATOR_NAME,
  }));

const BLOCK_TYPE_LABEL: Record<ReportDocumentBlock["type"], string> = {
  prose: "Text",
  "pl-table": "P&L table",
  metrics: "KPIs",
  updates: "List",
  heading: "Heading",
  table: "Table",
  chart: "Chart",
  photos: "Photos",
  "ai-summary": "AI Summary",
};

/** Distinct, human-readable block types inside a section (for card chips). */
export function sectionBlockSummary(blocks: ReportDocumentBlock[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  blocks.forEach((block) => {
    const label = BLOCK_TYPE_LABEL[block.type];
    if (!seen.has(label)) {
      seen.add(label);
      labels.push(label);
    }
  });
  return labels;
}

export function readSavedSections(): LibrarySection[] {
  return readLocalJson<LibrarySection[]>(SECTION_LIBRARY_STORAGE_KEY, []);
}

function writeSavedSections(sections: LibrarySection[]) {
  writeLocalJson(SECTION_LIBRARY_STORAGE_KEY, sections);
}

/** Standard blueprints first, then user-saved sections (most recent last). */
export function listLibrarySections(): LibrarySection[] {
  return [...STANDARD_LIBRARY_SECTIONS, ...readSavedSections()];
}

export function saveSectionToLibrary(input: {
  title: string;
  description?: string;
  blocks: ReportDocumentBlock[];
}): LibrarySection {
  const section: LibrarySection = {
    id: `saved-${Date.now()}`,
    title: input.title,
    description: input.description?.trim() || "Saved section.",
    blocks: input.blocks,
    origin: "saved",
    createdAt: new Date().toISOString(),
    createdBy: CURRENT_USER_NAME,
  };
  writeSavedSections([...readSavedSections(), section]);
  return section;
}

export function removeLibrarySection(id: string) {
  writeSavedSections(readSavedSections().filter((section) => section.id !== id));
}

/** Materialize a library section as a template custom section for insertion. */
export function librarySectionToCustom(
  section: LibrarySection,
): CustomReportSection {
  return {
    id: `custom-${Date.now()}`,
    title: section.title,
    blocks: structuredClone(section.blocks),
    origin: "custom",
    scope: { kind: "shared-entity", target: "Section library", targets: ["Section library"] },
    selectedObjects: [],
    objectType: "summary-main",
    summary: {
      dataSource: { type: "file", detail: "Section library" },
      calculationLogic: `Inserted “${section.title}” from the section library.`,
      assumptions: [],
      missingData: [],
      confidence: "high",
    },
    status: "approved",
    createdAt: new Date().toISOString(),
  };
}
