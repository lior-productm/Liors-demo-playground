import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import {
  getLeaseEntityOptions,
  getLeasePropertyOptions,
} from "@/src/lib/leaseBackendData";
import type { ReportDocumentBlock } from "@/src/lib/reportingMockData";

/**
 * Internal "Create new section" capability for Reporting.
 *
 * The UI lives in the Reporting components; the section logic / data analysis /
 * generation is owned by the Deep Agent. This module is the single service seam:
 * today it is a mock agent (timed, deterministic), but every UI interaction goes
 * through `generateReportSection` + the persistence helpers so the mock can be
 * swapped for the real Deep Agent backend without touching the UI.
 */

export const CUSTOM_SECTION_STORAGE_KEY = "amiio:reporting:custom-sections";

export type ReportScopeKind = "shared-entity" | "property";

export type ReportScope = {
  kind: ReportScopeKind;
  /**
   * Backward-compatible single display target — a comma-joined label of {@link targets}.
   * Prefer reading `targets` for the full multi-select set.
   */
  target: string;
  /** The chosen entities (shared-entity scope) or properties (property scope). Multi-select. */
  targets: string[];
};

/** Join selected targets into a readable label (e.g. "Entity A, Entity B +1"). */
export function formatScopeTargets(targets: string[]): string {
  if (targets.length === 0) return "";
  if (targets.length <= 2) return targets.join(", ");
  return `${targets.slice(0, 2).join(", ")} +${targets.length - 2}`;
}

export type ReportObjectTypeId =
  | "import-existing"
  | "main-page-header"
  | "summary-main"
  | "ai-summary"
  | "list"
  | "kpis"
  | "kpi-matrix"
  | "charts"
  | "tables"
  | "photos";

export type ReportObjectType = {
  id: ReportObjectTypeId;
  label: string;
  /** Human-readable limitation copy shown on the card (from product spec). */
  limit: string;
  /** Soft cap on the number of data points for this object type, if any. */
  maxDataPoints?: number;
  /** What the cap counts ("objects", "values", "columns"). */
  maxLabel?: string;
};

export const REPORT_OBJECT_TYPES: ReportObjectType[] = [
  {
    id: "import-existing",
    label: "Import Existing Object from dashboard",
    limit: "Limitations defined per type",
  },
  { id: "main-page-header", label: "Main Page header", limit: "Object · Max 1" },
  {
    id: "summary-main",
    label: "Summary main",
    limit: "Object · Max 1 · Values · Max 10",
    maxDataPoints: 10,
    maxLabel: "values",
  },
  {
    id: "ai-summary",
    label: "AI Summary",
    limit: "AI narrative · uses selected entities & KPIs",
  },
  { id: "list", label: "List", limit: "Object · Max 2" },
  {
    id: "kpis",
    label: "KPIs",
    limit: "Object · Max 4",
    maxDataPoints: 4,
    maxLabel: "KPIs",
  },
  {
    id: "kpi-matrix",
    label: "KPI matrix (entities × KPIs)",
    limit: "Table · selected entities × KPIs",
    maxDataPoints: 6,
    maxLabel: "KPIs",
  },
  { id: "charts", label: "Charts & Graphs", limit: "Object · Max 2" },
  {
    id: "tables",
    label: "Tables",
    limit: "Object · Max 2 · Columns · Max 3 · Rows · no limit",
    maxDataPoints: 3,
    maxLabel: "columns",
  },
  { id: "photos", label: "Photos", limit: "Object · Max 2" },
];

export function getReportObjectType(id: ReportObjectTypeId): ReportObjectType {
  return REPORT_OBJECT_TYPES.find((type) => type.id === id) ?? REPORT_OBJECT_TYPES[0];
}

export type ReportDataSourceType = "snowflake" | "web" | "file";

export type ReportDataSource = {
  type: ReportDataSourceType;
  /** Human-readable location: a Snowflake table, list of URLs, or file name. */
  detail: string;
};

/** The review payload shown to the internal user before approval (step 5). */
export type SectionGenerationSummary = {
  dataSource: ReportDataSource;
  calculationLogic: string;
  assumptions: string[];
  missingData: string[];
  confidence: "high" | "medium" | "low";
};

/** A user-created section = the existing document section shape + provenance. */
export type CustomReportSection = {
  id: string;
  title: string;
  blocks: ReportDocumentBlock[];
  origin: "custom";
  scope: ReportScope;
  selectedObjects: string[];
  objectType: ReportObjectTypeId;
  customFormula?: string;
  summary: SectionGenerationSummary;
  status: "approved";
  createdAt: string;
};

export type GenerateSectionRequest = {
  scope: ReportScope;
  objects: string[];
  /** How the section should be rendered (KPIs, Tables, Charts, …). */
  objectType: ReportObjectTypeId;
  /** Free-text formula from the "Else" data point, if used. */
  customFormula?: string;
  /** Optional uploaded-file name; forces the agent to use the file source. */
  uploadedFileName?: string;
  /** Optional free-text intent from the internal user. */
  hint?: string;
};

export type GeneratedSectionDraft = {
  title: string;
  blocks: ReportDocumentBlock[];
  summary: SectionGenerationSummary;
};

type ScopeObjectOption = {
  id: string;
  label: string;
  /** Where the Deep Agent expects to source this data point from. */
  preferredSource: ReportDataSourceType;
  /** Mock value rendered in the generated metrics block. */
  sampleValue: string;
  /**
   * "kpi" = headline metric shown under "Select the KPIs".
   * "suggested" = supporting data point shown under "Suggested options".
   */
  group: "kpi" | "suggested";
};

/** Sentinel id for the user-authored "Else" data point (custom formula). */
export const CUSTOM_FORMULA_OBJECT_ID = "custom-formula";

const SHARED_ENTITY_OBJECTS: ScopeObjectOption[] = [
  { id: "noi", label: "Net operating income (NOI)", preferredSource: "snowflake", sampleValue: "€90,908", group: "kpi" },
  { id: "dscr", label: "Debt service & DSCR", preferredSource: "snowflake", sampleValue: "1.18x", group: "kpi" },
  { id: "icr", label: "Interest cover (ICR)", preferredSource: "snowflake", sampleValue: "2.4x", group: "kpi" },
  { id: "irr", label: "IRR / equity multiple", preferredSource: "snowflake", sampleValue: "12.4% · 1.8x", group: "kpi" },
  { id: "ltv", label: "Loan-to-value (LTV)", preferredSource: "snowflake", sampleValue: "62.4%", group: "kpi" },
  { id: "valuation", label: "Valuation / GAV", preferredSource: "snowflake", sampleValue: "€18.4M", group: "kpi" },
  { id: "rental-income", label: "Rental income", preferredSource: "snowflake", sampleValue: "€110,968", group: "suggested" },
  { id: "operating-expenses", label: "Operating expenses", preferredSource: "snowflake", sampleValue: "€20,060", group: "suggested" },
  { id: "distributions", label: "Capital distributions", preferredSource: "snowflake", sampleValue: "€0", group: "suggested" },
  { id: "equity-contributions", label: "Equity contributions", preferredSource: "snowflake", sampleValue: "€4.2M", group: "suggested" },
  { id: "loan-balance", label: "Loan balances", preferredSource: "snowflake", sampleValue: "€10.8M", group: "suggested" },
  { id: "debt-maturity", label: "Debt maturity profile", preferredSource: "snowflake", sampleValue: "2028", group: "suggested" },
  { id: "cash-at-bank", label: "Cash at bank", preferredSource: "snowflake", sampleValue: "€441,060", group: "suggested" },
  { id: "capex-entity", label: "Capex spend", preferredSource: "file", sampleValue: "€212,400", group: "suggested" },
  { id: "market-rent", label: "Market rent comparables", preferredSource: "web", sampleValue: "€18.5 / sqm", group: "suggested" },
];

const PROPERTY_OBJECTS: ScopeObjectOption[] = [
  { id: "occupancy", label: "Occupancy", preferredSource: "snowflake", sampleValue: "94.2%", group: "kpi" },
  { id: "wault", label: "WAULT", preferredSource: "snowflake", sampleValue: "5.4 yrs", group: "kpi" },
  { id: "rent-roll", label: "Rent roll", preferredSource: "snowflake", sampleValue: "24 units", group: "kpi" },
  { id: "arrears", label: "Tenant arrears", preferredSource: "snowflake", sampleValue: "€4,210", group: "kpi" },
  { id: "service-charge", label: "Service charge recovery", preferredSource: "snowflake", sampleValue: "91%", group: "kpi" },
  { id: "epc", label: "Energy performance (EPC)", preferredSource: "file", sampleValue: "B", group: "kpi" },
  { id: "lease-expiries", label: "Lease events & expiries", preferredSource: "snowflake", sampleValue: "3 in 12m", group: "suggested" },
  { id: "break-options", label: "Break options", preferredSource: "snowflake", sampleValue: "2 in 18m", group: "suggested" },
  { id: "rent-reviews", label: "Rent reviews", preferredSource: "snowflake", sampleValue: "1 due", group: "suggested" },
  { id: "vacancy", label: "Vacancy schedule", preferredSource: "snowflake", sampleValue: "1.4k sqm", group: "suggested" },
  { id: "tenant-mix", label: "Tenant mix", preferredSource: "snowflake", sampleValue: "9 tenants", group: "suggested" },
  { id: "footfall", label: "Footfall / visits", preferredSource: "web", sampleValue: "-6.2%", group: "suggested" },
  { id: "capex", label: "Capex projects", preferredSource: "file", sampleValue: "2 active", group: "suggested" },
  { id: "market-comparables", label: "Market comparables", preferredSource: "web", sampleValue: "€18.5 / sqm", group: "suggested" },
];

export function getScopeObjectOptions(kind: ReportScopeKind): ScopeObjectOption[] {
  return kind === "shared-entity" ? SHARED_ENTITY_OBJECTS : PROPERTY_OBJECTS;
}

/** Headline KPI options for the "Select the KPIs" group. */
export function getScopeKpiOptions(kind: ReportScopeKind): ScopeObjectOption[] {
  return getScopeObjectOptions(kind).filter((option) => option.group === "kpi");
}

/** Supporting data points for the "Suggested options" group. */
export function getScopeSuggestedOptions(kind: ReportScopeKind): ScopeObjectOption[] {
  return getScopeObjectOptions(kind).filter((option) => option.group === "suggested");
}

export function getScopeTargetOptions(kind: ReportScopeKind): string[] {
  if (kind === "shared-entity") {
    return getLeaseEntityOptions("All portfolio");
  }

  const entities = getLeaseEntityOptions("All portfolio");
  const properties = entities.flatMap((entity) =>
    getLeasePropertyOptions("All portfolio", entity),
  );
  return Array.from(new Set(properties));
}

export const SCOPE_LABELS: Record<ReportScopeKind, string> = {
  "shared-entity": "Shared - Entity Scope",
  property: "Property",
};

/** Lowercase noun for inline prose (avoids awkward "scope scope" / "scope level"). */
export const SCOPE_NOUNS: Record<ReportScopeKind, string> = {
  "shared-entity": "shared entity",
  property: "property",
};

export const DATA_SOURCE_LABELS: Record<ReportDataSourceType, string> = {
  snowflake: "Snowflake",
  web: "Web",
  file: "Uploaded file",
};

/** One resolved field referenced inside a user-authored formula. */
export type FormulaInputResolution = {
  token: string;
  source: ReportDataSourceType;
};

/** The Deep Agent's read-back of a custom formula, shown for Accept/Decline. */
export type FormulaInterpretation = {
  formula: string;
  plainEnglish: string;
  steps: string[];
  inputs: FormulaInputResolution[];
  output: string;
};

function optionMatchTerms(option: ScopeObjectOption): string[] {
  const label = option.label.toLowerCase();
  const terms = new Set<string>();
  const parens = label.match(/\(([^)]+)\)/g) ?? [];
  parens.forEach((token) => terms.add(token.replace(/[()]/g, "").trim()));
  label
    .replace(/\([^)]*\)/g, "")
    .split(/\s*[·/]\s*/)
    .map((part) => part.trim())
    .forEach((part) => part && terms.add(part));
  terms.add(option.id.replace(/-/g, " "));
  return Array.from(terms).filter((term) => term.length >= 3);
}

function buildFormulaInterpretation(
  formula: string,
  options: ScopeObjectOption[],
): FormulaInterpretation {
  const haystack = formula.toLowerCase();

  const inputs: FormulaInputResolution[] = [];
  const seen = new Set<string>();
  for (const option of options) {
    if (seen.has(option.id)) continue;
    if (optionMatchTerms(option).some((term) => haystack.includes(term))) {
      inputs.push({ token: option.label, source: option.preferredSource });
      seen.add(option.id);
    }
  }

  const hasPercent = /%|×\s*100|\*\s*100/.test(formula);
  const hasDivide = /÷|\//.test(formula);
  const hasMultiply = /×|\*/.test(formula);
  const hasSubtract = /−|-/.test(formula);
  const hasAdd = /\+/.test(formula);

  const output = hasPercent
    ? "A percentage (%)"
    : hasDivide
      ? "A ratio / multiple (×)"
      : "An absolute value";

  const steps: string[] = [];
  steps.push(
    inputs.length > 0
      ? `Resolve ${inputs.length} input field${inputs.length === 1 ? "" : "s"} against the selected scope: ${inputs
          .map((input) => input.token)
          .join(", ")}.`
      : "Resolve the referenced fields against the scope's data dictionary (no fields auto-matched yet).",
  );
  if (hasSubtract) steps.push("Subtract the indicated terms.");
  if (hasAdd) steps.push("Sum the indicated terms.");
  if (hasMultiply) steps.push("Apply the multiplication factor(s).");
  if (hasDivide) steps.push("Divide by the denominator term.");
  steps.push(`Evaluate the expression: ${formula}.`);
  if (hasPercent) steps.push("Express the result as a percentage (× 100).");
  steps.push("Compare the result against the prior period and budget.");

  const inputClause =
    inputs.length > 0
      ? `combining ${inputs.map((input) => input.token.toLowerCase()).join(", ")}`
      : "combining the fields you referenced";
  const plainEnglish = `This will compute ${output.toLowerCase()} by ${inputClause}, then benchmark it against the prior period and budget.`;

  return { formula, plainEnglish, steps, inputs, output };
}

/**
 * Mock Deep Agent: reads back the calculation it will run for a user-authored
 * formula so the internal user can Accept or Decline before generation.
 */
export function interpretFormula(
  formula: string,
  scopeKind: ReportScopeKind,
): Promise<FormulaInterpretation> {
  const options = getScopeObjectOptions(scopeKind);
  const trimmed = formula.trim();
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(buildFormulaInterpretation(trimmed, options)), 900);
  });
}

/** Mock Deep Agent: identifies a source, then synthesizes a section + summary. */
function resolveDataSource(
  request: GenerateSectionRequest,
  options: ScopeObjectOption[],
): ReportDataSource {
  if (request.uploadedFileName) {
    return { type: "file", detail: request.uploadedFileName };
  }

  const selected = options.filter((option) => request.objects.includes(option.id));
  const usesWeb = selected.some((option) => option.preferredSource === "web");
  const usesFile = selected.some((option) => option.preferredSource === "file");

  if (usesWeb) {
    return {
      type: "web",
      detail: "Public market sources (CoStar, local rent indices)",
    };
  }
  if (usesFile) {
    return {
      type: "file",
      detail: "Capex tracker workbook (latest upload)",
    };
  }
  return {
    type: "snowflake",
    detail: "ANALYTICS.REPORTING.ENTITY_FINANCIALS",
  };
}

function buildSummary(
  request: GenerateSectionRequest,
  options: ScopeObjectOption[],
): SectionGenerationSummary {
  const dataSource = resolveDataSource(request, options);
  const selected = options.filter((option) => request.objects.includes(option.id));
  const labels = selected.map((option) => option.label);
  if (request.customFormula) labels.push("custom formula");
  const objectType = getReportObjectType(request.objectType);

  const sourceVerb =
    dataSource.type === "snowflake"
      ? `Queried ${dataSource.detail} for the selected quarter`
      : dataSource.type === "web"
        ? "Retrieved and normalized figures from public market sources"
        : `Parsed the uploaded file (${dataSource.detail})`;

  const formulaClause = request.customFormula
    ? ` A user-defined formula was applied: "${request.customFormula}".`
    : "";

  const scopeTargetLabel =
    request.scope.targets.length > 0
      ? request.scope.targets.join(", ")
      : request.scope.target;

  const calculationLogic = `${sourceVerb}, aggregated ${labels.length} data point${
    labels.length === 1 ? "" : "s"
  } (${labels.join(", ")}) at the ${
    SCOPE_NOUNS[request.scope.kind]
  } level for ${scopeTargetLabel}, rendered as ${objectType.label.toLowerCase()}. Variances are computed against the prior period and budget.${formulaClause}`;

  const assumptions = [
    "Figures use the reporting-quarter close; intra-quarter adjustments are excluded.",
    "Currency is normalized to EUR using period-end FX rates.",
  ];
  if (dataSource.type === "web") {
    assumptions.push("Market comparables reflect the most recent published index, which may lag by one quarter.");
  }
  if (request.customFormula) {
    assumptions.push("The custom formula was interpreted literally; verify operator precedence and units.");
  }

  const missingData: string[] = [];
  if (request.scope.kind === "property" && request.objects.includes("arrears")) {
    missingData.push("Tenant arrears ageing beyond 90 days is not yet wired to Snowflake.");
  }
  if (request.objects.includes("market-rent") || request.objects.includes("market-comparables")) {
    missingData.push("Comparable set is limited to 3 assets within the submarket.");
  }
  if (
    objectType.maxDataPoints !== undefined &&
    selected.length + (request.customFormula ? 1 : 0) > objectType.maxDataPoints
  ) {
    missingData.push(
      `${objectType.label} support up to ${objectType.maxDataPoints} ${
        objectType.maxLabel ?? "objects"
      }; extra data points were truncated.`,
    );
  }

  const confidence: SectionGenerationSummary["confidence"] =
    missingData.length === 0 ? "high" : missingData.length === 1 ? "medium" : "low";

  return { dataSource, calculationLogic, assumptions, missingData, confidence };
}

function parseMagnitude(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Deterministically varies a sample value per entity so a KPI matrix shows
 * distinct-but-plausible figures across the selected entities (mock data).
 */
function variantValue(sample: string, entityIndex: number): string {
  if (entityIndex === 0) return sample;
  const match = sample.match(/[0-9][0-9.,]*/);
  if (!match) return sample;

  const raw = match[0];
  const numeric = Number.parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(numeric) || numeric === 0) return sample;

  // Spread of roughly -6%..+6% keyed off the entity index.
  const factor = 1 + (((entityIndex * 37) % 13) - 6) / 100;
  const scaled = numeric * factor;

  const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;
  const hasThousands = raw.includes(",");
  const formatted = hasThousands
    ? Math.round(scaled).toLocaleString("en-US")
    : scaled.toFixed(decimals);

  return sample.replace(raw, formatted);
}

/** Builds an entities × KPIs table so combinations render side by side. */
function buildKpiMatrix(
  request: GenerateSectionRequest,
  selected: ScopeObjectOption[],
): ReportDocumentBlock {
  const entities =
    request.scope.targets.length > 0
      ? request.scope.targets
      : [request.scope.target].filter(Boolean);
  const kpis = selected.length > 0 ? selected : [];
  const columns = ["Entity", ...kpis.map((option) => option.label)];
  const rows = (entities.length > 0 ? entities : ["Selected scope"]).map(
    (entity, entityIndex) => [
      entity,
      ...kpis.map((option) => variantValue(option.sampleValue, entityIndex)),
    ],
  );
  return { type: "table", columns, rows };
}

/**
 * Emits the block(s) that best fit the chosen object type, so each section
 * type renders in its own form (KPIs → cards only, Tables → a table, etc.)
 * rather than always prose + metrics.
 */
function buildBlocks(
  request: GenerateSectionRequest,
  options: ScopeObjectOption[],
): ReportDocumentBlock[] {
  const selected = options.filter((option) => request.objects.includes(option.id));
  const objectType = getReportObjectType(request.objectType);

  const dataPoints = [
    ...selected.map((option) => ({ label: option.label, value: option.sampleValue })),
    ...(request.customFormula ? [{ label: "Custom formula", value: "Per formula" }] : []),
  ];

  const cappedPoints =
    objectType.maxDataPoints !== undefined
      ? dataPoints.slice(0, objectType.maxDataPoints)
      : dataPoints;

  const scopeLabel = SCOPE_NOUNS[request.scope.kind];
  const coverage = cappedPoints.map((point) => point.label.toLowerCase()).join(", ");

  switch (objectType.id) {
    case "kpis":
      // KPI cards only — no surrounding prose.
      return [{ type: "metrics", items: cappedPoints }];

    case "ai-summary":
      // GPT narrative first, then the supporting KPI cards it references.
      return cappedPoints.length > 0
        ? [buildAiSummaryBlock(request, cappedPoints), { type: "metrics", items: cappedPoints }]
        : [buildAiSummaryBlock(request, cappedPoints)];

    case "kpi-matrix":
      // Entities × KPIs combination table.
      return [buildKpiMatrix(request, selected.slice(0, objectType.maxDataPoints ?? selected.length))];

    case "main-page-header":
      return [
        {
          type: "heading",
          title: buildTitle(request, options),
          subtitle: `${request.scope.target} · ${scopeLabel} · ${cappedPoints.length} data point${
            cappedPoints.length === 1 ? "" : "s"
          }`,
        },
      ];

    case "list":
      return [
        {
          type: "updates",
          items: cappedPoints.map((point) => `${point.label}: ${point.value}`),
        },
      ];

    case "tables":
      return [
        {
          type: "table",
          columns: ["Data point", "Value"],
          rows: cappedPoints.map((point) => [point.label, point.value]),
        },
      ];

    case "charts": {
      const max = Math.max(...cappedPoints.map((point) => parseMagnitude(point.value)), 1);
      return [
        {
          type: "chart",
          items: cappedPoints.map((point) => ({
            label: point.label,
            value: point.value,
            ratio: parseMagnitude(point.value) / max,
          })),
        },
      ];
    }

    case "photos":
      return [{ type: "photos", items: cappedPoints.map((point) => ({ label: point.label })) }];

    case "summary-main":
      return [
        {
          type: "prose",
          paragraphs: [
            `Summary for ${request.scope.target} (${scopeLabel} scope) covering ${coverage}.`,
          ],
        },
        { type: "metrics", items: cappedPoints },
      ];

    case "import-existing":
      return [
        {
          type: "prose",
          paragraphs: [
            `Imported from an existing dashboard object for ${request.scope.target}, covering ${coverage}.`,
          ],
        },
        { type: "metrics", items: cappedPoints },
      ];

    default:
      return [{ type: "metrics", items: cappedPoints }];
  }
}

/** Deterministic mock of a GPT narrative built from the selected entities + KPIs. */
function buildAiSummaryBlock(
  request: GenerateSectionRequest,
  cappedPoints: { label: string; value: string }[],
): Extract<ReportDocumentBlock, { type: "ai-summary" }> {
  const entities = request.scope.targets.length
    ? request.scope.targets
    : [request.scope.target].filter(Boolean);
  const kpis = cappedPoints.map((point) => point.label);
  const scopeLabel = SCOPE_NOUNS[request.scope.kind];
  const entityClause =
    entities.length === 0
      ? "the selected scope"
      : entities.length === 1
        ? entities[0]
        : `${entities.slice(0, -1).join(", ")} and ${entities[entities.length - 1]}`;

  const highlight = cappedPoints[0];
  const secondary = cappedPoints[1];

  const paragraphs: string[] = [
    `Across ${entityClause} (${scopeLabel} level), performance this period is broadly in line with plan. ${
      highlight ? `${highlight.label} stands at ${highlight.value}` : "Key metrics are stable"
    }${secondary ? `, while ${secondary.label.toLowerCase()} is ${secondary.value}` : ""}.`,
    kpis.length > 1
      ? `The summary weighs ${kpis
          .map((kpi) => kpi.toLowerCase())
          .join(", ")} together to flag the drivers most likely to affect the investment case, and benchmarks each against the prior period and budget.`
      : "The summary benchmarks the selected metric against the prior period and budget to surface the most material movement.",
    "Recommended focus: confirm the assumptions behind any figure flagged as an outlier before circulating to the committee.",
  ];

  return {
    type: "ai-summary",
    headline: `AI Summary — ${formatScopeTargets(entities) || request.scope.target}`,
    paragraphs,
    entities,
    kpis,
  };
}

function buildTitle(request: GenerateSectionRequest, options: ScopeObjectOption[]): string {
  const selected = options.filter((option) => request.objects.includes(option.id));
  const lead = selected[0]?.label ?? (request.customFormula ? "Custom formula" : "Custom section");
  const count = selected.length + (request.customFormula ? 1 : 0);
  const extra = count > 1 ? ` +${count - 1}` : "";
  return `${lead}${extra} — ${request.scope.target}`;
}

/**
 * Mock Deep Agent entry point. Simulates source identification + section
 * synthesis with a realistic delay. Replace this body with a backend call
 * (POST /api/reporting/sections/generate + poll) without changing callers.
 */
export function generateReportSection(
  request: GenerateSectionRequest,
): Promise<GeneratedSectionDraft> {
  const options = getScopeObjectOptions(request.scope.kind);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        title: buildTitle(request, options),
        blocks: buildBlocks(request, options),
        summary: buildSummary(request, options),
      });
    }, 1600);
  });
}

type CustomSectionStore = Record<string, CustomReportSection[]>;

function readStore(): CustomSectionStore {
  return readLocalJson<CustomSectionStore>(CUSTOM_SECTION_STORAGE_KEY, {});
}

export function readCustomSections(reportTitle: string): CustomReportSection[] {
  return readStore()[reportTitle] ?? [];
}

export function appendCustomSection(
  reportTitle: string,
  section: CustomReportSection,
): CustomReportSection[] {
  const store = readStore();
  const next = [...(store[reportTitle] ?? []), section];
  writeLocalJson(CUSTOM_SECTION_STORAGE_KEY, { ...store, [reportTitle]: next });
  return next;
}

export function writeCustomSections(
  reportTitle: string,
  sections: CustomReportSection[],
) {
  const store = readStore();
  writeLocalJson(CUSTOM_SECTION_STORAGE_KEY, { ...store, [reportTitle]: sections });
}

export function removeCustomSection(
  reportTitle: string,
  sectionId: string,
): CustomReportSection[] {
  const store = readStore();
  const next = (store[reportTitle] ?? []).filter((section) => section.id !== sectionId);
  writeLocalJson(CUSTOM_SECTION_STORAGE_KEY, { ...store, [reportTitle]: next });
  return next;
}

export function createApprovedSection(
  draft: GeneratedSectionDraft,
  request: GenerateSectionRequest,
): CustomReportSection {
  return {
    id: `custom-${Date.now()}`,
    title: draft.title,
    blocks: draft.blocks,
    origin: "custom",
    scope: request.scope,
    selectedObjects: request.objects,
    objectType: request.objectType,
    customFormula: request.customFormula,
    summary: draft.summary,
    status: "approved",
    createdAt: new Date().toISOString(),
  };
}
