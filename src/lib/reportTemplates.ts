import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import { ACTIVE_REPORTS } from "@/src/lib/reportingMockData";
import {
  readCustomSections,
  writeCustomSections,
} from "@/src/lib/reportSectionBuilder";
import {
  readTemplateLayout,
  writeTemplateLayout,
} from "@/src/lib/reportTemplateLayout";
import { readBlockEdits, writeBlockEdits } from "@/src/lib/reportBlockEdits";
import { CURRENT_USER_NAME, SYSTEM_CREATOR_NAME, type ItemOwnership } from "@/src/lib/reportUser";

/**
 * The template collection = a curated set of system report templates plus any
 * templates the user has created in the Template Studio. Everything downstream
 * (layout, custom sections, object edits, distribution) is keyed by the
 * template title, so the title is the collection's stable id.
 */
export const CUSTOM_TEMPLATE_METAS_KEY = "amiio:reporting:template-metas";

export type TemplateOrigin = "system" | "custom";

export type ReportTemplateMeta = {
  title: string;
  description: string;
  origin: TemplateOrigin;
  createdAt?: string;
  /** Display name of the person (or system) that created the template. */
  createdBy?: string;
  /**
   * Organization templates are shared; personal ones stay private until
   * submitted for approval (which promotes them to the org library).
   */
  ownership?: ItemOwnership;
  /** Title of the template this one was duplicated from. */
  basedOn?: string;
  /** Preset used to seed the structure. */
  presetId?: string;
};

export const SYSTEM_TEMPLATES: ReportTemplateMeta[] = [
  {
    title: ACTIVE_REPORTS[0],
    description: "Quarterly investor report — P&L, capital activity and KPIs.",
    origin: "system",
    createdBy: SYSTEM_CREATOR_NAME,
    ownership: "organization",
  },
  {
    title: ACTIVE_REPORTS[1],
    description: "Portfolio-level performance summary for the quarter.",
    origin: "system",
    createdBy: SYSTEM_CREATOR_NAME,
    ownership: "organization",
  },
  {
    title: ACTIVE_REPORTS[2],
    description: "Annual entity report with full financial detail.",
    origin: "system",
    createdBy: SYSTEM_CREATOR_NAME,
    ownership: "organization",
  },
];

/** Starting points offered by the new-template creation flow. */
export type TemplatePreset = {
  id: string;
  name: string;
  description: string;
  suggestedTitle: string;
  /** Base section ids hidden by default for this preset. */
  removedSections: string[];
  /** Highlighted sections shown on the preset card. */
  includes: string[];
};

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "blank",
    name: "Blank template",
    description: "Start from the standard section structure and build it up.",
    suggestedTitle: "Untitled template",
    removedSections: [],
    includes: ["Introduction", "Metrics", "Updates"],
  },
  {
    id: "quarterly-investor",
    name: "Quarterly investor report",
    description: "P&L, capital activity, KPIs and updates for the IC.",
    suggestedTitle: "Quarterly Investor Report",
    removedSections: [],
    includes: ["Introduction", "Acquisition & Finance", "Distribution", "Metrics"],
  },
  {
    id: "property-performance",
    name: "Property performance",
    description: "Leasing, occupancy and operational KPIs for one property.",
    suggestedTitle: "Property Performance Report",
    removedSections: ["acquisition", "distribution"],
    includes: ["Introduction", "Metrics", "Updates"],
  },
  {
    id: "portfolio-summary",
    name: "Portfolio summary",
    description: "High-level KPIs rolled up across a portfolio.",
    suggestedTitle: "Portfolio Summary",
    removedSections: ["distribution"],
    includes: ["Introduction", "Acquisition & Finance", "Metrics"],
  },
];

export function getTemplatePreset(id: string): TemplatePreset | undefined {
  return TEMPLATE_PRESETS.find((preset) => preset.id === id);
}

export function readCustomTemplates(): ReportTemplateMeta[] {
  return readLocalJson<ReportTemplateMeta[]>(CUSTOM_TEMPLATE_METAS_KEY, []);
}

function writeCustomTemplates(list: ReportTemplateMeta[]) {
  writeLocalJson(CUSTOM_TEMPLATE_METAS_KEY, list);
}

/** All templates in the collection (system first, then user-created). */
export function listTemplates(): ReportTemplateMeta[] {
  return [...SYSTEM_TEMPLATES, ...readCustomTemplates()];
}

export function listTemplateTitles(): string[] {
  return listTemplates().map((template) => template.title);
}

export function templateExists(title: string): boolean {
  return listTemplateTitles().some(
    (existing) => existing.toLowerCase() === title.toLowerCase(),
  );
}

export type CreateTemplateInput = {
  title: string;
  description?: string;
  presetId?: string;
  /** When duplicating, the source template title. */
  basedOn?: string;
};

/**
 * Persists a new template's metadata and seeds its structure — either by
 * cloning an existing template's layout/sections/object-edits, or by applying
 * a preset's default section visibility.
 */
export function createTemplate(input: CreateTemplateInput): ReportTemplateMeta {
  const meta: ReportTemplateMeta = {
    title: input.title,
    description:
      input.description?.trim() ||
      (input.basedOn
        ? `Duplicated from ${input.basedOn}.`
        : getTemplatePreset(input.presetId ?? "")?.description ??
          "Custom report template."),
    origin: "custom",
    createdAt: new Date().toISOString(),
    createdBy: CURRENT_USER_NAME,
    ownership: "personal",
    basedOn: input.basedOn,
    presetId: input.presetId,
  };

  writeCustomTemplates([...readCustomTemplates(), meta]);

  if (input.basedOn) {
    // Deep clone the source template's structure into the new title.
    writeTemplateLayout(input.title, {
      ...readTemplateLayout(input.basedOn),
    });
    writeCustomSections(
      input.title,
      readCustomSections(input.basedOn).map((section) => ({
        ...section,
        id: `${section.id}-copy-${Date.now()}`,
      })),
    );
    writeBlockEdits(input.title, {
      ...readBlockEdits(input.basedOn),
    });
  } else {
    const preset = getTemplatePreset(input.presetId ?? "");
    if (preset && preset.removedSections.length > 0) {
      writeTemplateLayout(input.title, {
        order: [],
        removed: [...preset.removedSections],
      });
    }
  }

  return meta;
}

export function resolveTemplateOwnership(
  template: ReportTemplateMeta,
): ItemOwnership {
  if (template.ownership) return template.ownership;
  return template.origin === "system" ? "organization" : "personal";
}

export function setTemplateOwnership(
  title: string,
  ownership: ItemOwnership,
): ReportTemplateMeta | null {
  const custom = readCustomTemplates();
  const index = custom.findIndex((template) => template.title === title);
  if (index === -1) return null;
  const next = [...custom];
  next[index] = { ...next[index], ownership };
  writeCustomTemplates(next);
  return next[index];
}
