"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Check,
  FolderOpen,
  Gauge,
  Grid3x3,
  Heading,
  Image as ImageIcon,
  LayoutDashboard,
  List as ListIcon,
  Loader2,
  Paperclip,
  Plus,
  Sparkles,
  Table2,
  TextQuote,
  TrendingUp,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionReviewSummary } from "@/src/components/reporting/SectionReviewSummary";
import { ReportRichBlock } from "@/src/components/reporting/ReportRichBlock";
import { PlForecastReviewEditor } from "@/src/components/reporting/PlForecastReviewEditor";
import {
  CUSTOM_FORMULA_OBJECT_ID,
  DATA_SOURCE_LABELS,
  REPORT_OBJECT_TYPES,
  SCOPE_LABELS,
  createApprovedSection,
  formatScopeTargets,
  generateReportSection,
  getReportObjectType,
  getScopeKpiOptions,
  getScopeSuggestedOptions,
  getScopeTargetOptions,
  interpretFormula,
  type CustomReportSection,
  type FormulaInterpretation,
  type GeneratedSectionDraft,
  type ReportObjectTypeId,
  type ReportScopeKind,
} from "@/src/lib/reportSectionBuilder";
import { saveSectionToLibrary } from "@/src/lib/reportSectionLibrary";
import {
  REPORT_PL_FORECAST_ROWS,
  type ReportPlRow,
} from "@/src/lib/reportingMockData";
import { recomputePlForecast } from "@/src/lib/plForecastModel";

type BuilderStep = "scope" | "objects" | "data-type" | "generating" | "review";

type InterpretedDataPoint = {
  label: string;
  source: "snowflake" | "web" | "file";
};

type DataPointsInterpretation = {
  plainEnglish: string;
  dataPoints: InterpretedDataPoint[];
  categories: string[];
};

const OBJECT_TYPE_ICON: Record<
  ReportObjectTypeId,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "import-existing": LayoutDashboard,
  "main-page-header": Heading,
  "summary-main": TextQuote,
  "ai-summary": Wand2,
  list: ListIcon,
  kpis: Gauge,
  "kpi-matrix": Grid3x3,
  charts: BarChart3,
  tables: Table2,
  "pl-forecasting": TrendingUp,
  photos: ImageIcon,
};

const SCOPE_CARDS: {
  kind: ReportScopeKind;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
}[] = [
  {
    kind: "shared-entity",
    icon: FolderOpen,
    description: "Roll up financials and capital activity across a shared entity.",
  },
  {
    kind: "property",
    icon: Building2,
    description: "Drill into a single property's leasing and operational data.",
  },
];

const DATA_POINT_CATEGORIES: {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  {
    id: "commercial",
    label: "Commercial data",
    description: "Leasing, occupancy, WALT and rent activity.",
    icon: Building2,
  },
  {
    id: "financial",
    label: "Financial data",
    description: "P&L, NOI, budget variance and valuations.",
    icon: BarChart3,
  },
  {
    id: "pl-forecasting",
    label: "P&L forecasting",
    description: "Full-year P&L with budget, FY forecast and variance.",
    icon: TrendingUp,
  },
  {
    id: "tenant-payments",
    label: "Tenant's payments",
    description: "Arrears, collections and payment behaviour.",
    icon: Table2,
  },
  {
    id: "lease-data",
    label: "Lease data",
    description: "Lease events, renewals, breaks and indexation.",
    icon: FolderOpen,
  },
  {
    id: "operational",
    label: "Operational data",
    description: "Facilities, service charge and maintenance.",
    icon: LayoutDashboard,
  },
];

const STEP_LABELS: { id: BuilderStep; label: string }[] = [
  { id: "scope", label: "Scope" },
  { id: "objects", label: "KPI & data points" },
  { id: "data-type", label: "Data type" },
  { id: "review", label: "Review & approve" },
];

function StepDots({ step }: { step: BuilderStep }) {
  const activeIndex =
    step === "generating"
      ? STEP_LABELS.findIndex((s) => s.id === "data-type")
      : STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-4",
              index === activeIndex
                ? "bg-[#111] text-white"
                : index < activeIndex
                  ? "bg-[#E7F4EC] text-[#1F7A45]"
                  : "bg-[#F0F2F5] text-[#65686B]",
            )}
          >
            {index < activeIndex ? <Check className="size-3" strokeWidth={2.5} /> : null}
            {item.label}
          </span>
          {index < STEP_LABELS.length - 1 ? (
            <span className="h-px w-4 bg-[#E6E8EB]" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CreateSectionBuilder({
  reportTitle,
  mode = "create",
  onCancel,
  onApprove,
}: {
  reportTitle: string;
  /**
   * "replace" swaps an existing object; "create" appends a new section to a
   * template; "library" creates a standalone section saved to the library.
   */
  mode?: "create" | "replace" | "library";
  onCancel: () => void;
  onApprove: (section: CustomReportSection) => void;
}) {
  const isReplace = mode === "replace";
  const isLibrary = mode === "library";
  const [step, setStep] = useState<BuilderStep>("scope");
  const [scopeKind, setScopeKind] = useState<ReportScopeKind | null>(null);
  const [targets, setTargets] = useState<string[]>([]);
  const [dataCategories, setDataCategories] = useState<string[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [customFormulaOn, setCustomFormulaOn] = useState(false);
  const [customFormula, setCustomFormula] = useState("");
  const [formulaStatus, setFormulaStatus] = useState<
    "idle" | "interpreting" | "proposed" | "accepted" | "declined"
  >("idle");
  const [interpretation, setInterpretation] = useState<FormulaInterpretation | null>(null);
  const [objectType, setObjectType] = useState<ReportObjectTypeId | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>();
  const [draft, setDraft] = useState<GeneratedSectionDraft | null>(null);
  const [forecastRows, setForecastRows] = useState<ReportPlRow[] | null>(null);
  const [saveToLibrary, setSaveToLibrary] = useState(false);
  const [dataPointsStatus, setDataPointsStatus] = useState<
    "idle" | "interpreting" | "proposed"
  >("idle");
  const [dataPointsSummary, setDataPointsSummary] =
    useState<DataPointsInterpretation | null>(null);

  const trimmedFormula = customFormula.trim();
  const formulaConfirmed = customFormulaOn && !!trimmedFormula && formulaStatus === "accepted";
  // A typed-but-unconfirmed formula blocks Continue so the agent's read-back is acknowledged.
  const formulaPending =
    customFormulaOn && !!trimmedFormula && formulaStatus !== "accepted";
  const dataPointCount = selectedObjects.length + (formulaConfirmed ? 1 : 0);
  const hasDataPoints = dataPointCount > 0;

  const targetOptions = useMemo(
    () => (scopeKind ? getScopeTargetOptions(scopeKind) : []),
    [scopeKind],
  );
  const kpiOptions = useMemo(
    () => (scopeKind ? getScopeKpiOptions(scopeKind) : []),
    [scopeKind],
  );
  const suggestedOptions = useMemo(
    () => (scopeKind ? getScopeSuggestedOptions(scopeKind) : []),
    [scopeKind],
  );

  const resetFormulaInterpretation = () => {
    setFormulaStatus("idle");
    setInterpretation(null);
  };

  const handleScopeSelect = (kind: ReportScopeKind) => {
    setScopeKind(kind);
    setTargets([]);
    setDataCategories([]);
    setSelectedObjects([]);
    setDataPointsStatus("idle");
    setDataPointsSummary(null);
    setCustomFormulaOn(false);
    setCustomFormula("");
    resetFormulaInterpretation();
  };

  const toggleTarget = (option: string) => {
    setTargets((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handleFormulaChange = (value: string) => {
    setCustomFormula(value);
    // Editing invalidates any prior agent read-back.
    if (formulaStatus !== "idle") resetFormulaInterpretation();
  };

  const runFormulaInterpretation = async () => {
    if (!scopeKind || !trimmedFormula) return;
    setFormulaStatus("interpreting");
    const result = await interpretFormula(trimmedFormula, scopeKind);
    setInterpretation(result);
    setFormulaStatus("proposed");
  };

  const declineFormula = () => {
    setInterpretation(null);
    setFormulaStatus("declined");
  };

  const resetDataPointsInterpretation = () => {
    setDataPointsStatus("idle");
    setDataPointsSummary(null);
  };

  const toggleObject = (id: string) => {
    resetDataPointsInterpretation();
    if (id === "pl-forecasting") {
      const nextOn = !selectedObjects.includes(id);
      setSelectedObjects((current) =>
        nextOn ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id),
      );
      setDataCategories((current) => {
        const has = current.includes("pl-forecasting");
        if (nextOn && !has) return [...current, "pl-forecasting"];
        if (!nextOn && has) return current.filter((item) => item !== "pl-forecasting");
        return current;
      });
      if (nextOn) setObjectType("pl-forecasting");
      else if (objectType === "pl-forecasting") setObjectType(null);
      return;
    }
    setSelectedObjects((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleDataCategory = (id: string) => {
    resetDataPointsInterpretation();
    if (id === "pl-forecasting") {
      const nextOn = !dataCategories.includes(id);
      setDataCategories((current) =>
        nextOn ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id),
      );
      setSelectedObjects((current) => {
        const has = current.includes("pl-forecasting");
        if (nextOn && !has) return [...current, "pl-forecasting"];
        if (!nextOn && has) return current.filter((item) => item !== "pl-forecasting");
        return current;
      });
      if (nextOn) setObjectType("pl-forecasting");
      else if (objectType === "pl-forecasting") setObjectType(null);
      return;
    }
    setDataCategories((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const buildDataPointsInterpretation = (): DataPointsInterpretation => {
    const chosen = [
      ...kpiOptions.filter((option) => selectedObjects.includes(option.id)),
      ...suggestedOptions.filter((option) => selectedObjects.includes(option.id)),
    ];
    const dataPoints: InterpretedDataPoint[] = chosen.map((option, index) => ({
      label: option.label,
      source: uploadedFileName
        ? "file"
        : option.group === "suggested" && index % 2 === 1
          ? "web"
          : "snowflake",
    }));
    if (formulaConfirmed) {
      dataPoints.push({ label: "Custom formula", source: "snowflake" });
    }
    const categories = dataCategories.map(
      (id) =>
        DATA_POINT_CATEGORIES.find((category) => category.id === id)?.label ?? id,
    );
    const targetLabel = formatScopeTargets(targets);
    const categoryClause =
      categories.length > 0 ? `, focused on ${categories.join(", ")}` : "";
    const isPlForecast = selectedObjects.includes("pl-forecasting");
    return {
      plainEnglish: isPlForecast
        ? `I'll build a full-year P&L forecast for ${targetLabel}${categoryClause}. I'll pull actuals year-to-date, annualize the remaining year at current run-rate, and compare the FY forecast to the approved budget.`
        : `I'll compile ${dataPoints.length} data point${
            dataPoints.length === 1 ? "" : "s"
          } for ${targetLabel}${categoryClause}. I'll resolve the right source for each, pull the figures for the reporting period, and compute the variances before building the section.`,
      dataPoints,
      categories,
    };
  };

  const runDataPointsInterpretation = async () => {
    if (!hasDataPoints || formulaPending) return;
    setDataPointsSummary(null);
    setDataPointsStatus("interpreting");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setDataPointsSummary(buildDataPointsInterpretation());
    setDataPointsStatus("proposed");
  };

  const buildRequest = () => {
    if (!scopeKind || targets.length === 0 || !objectType) return null;
    return {
      scope: {
        kind: scopeKind,
        target: formatScopeTargets(targets),
        targets,
      },
      objects: selectedObjects,
      objectType,
      customFormula: formulaConfirmed ? trimmedFormula : undefined,
      uploadedFileName,
      hint:
        dataCategories.length > 0
          ? `Data points: ${dataCategories
              .map(
                (id) =>
                  DATA_POINT_CATEGORIES.find((category) => category.id === id)
                    ?.label ?? id,
              )
              .join(", ")}`
          : undefined,
    };
  };

  const runAgent = async () => {
    const request = buildRequest();
    if (!request) return;
    setStep("generating");
    const result = await generateReportSection(request);
    if (request.objectType === "pl-forecasting") {
      const seeded = recomputePlForecast(
        structuredClone(REPORT_PL_FORECAST_ROWS),
      ).rows;
      setForecastRows(seeded);
      setDraft({
        ...result,
        blocks: result.blocks.map((block) =>
          block.type === "pl-table" ? { ...block, rows: seeded, variant: "forecast" } : block,
        ),
      });
    } else {
      setForecastRows(null);
      setDraft(result);
    }
    setStep("review");
  };

  const handleApprove = () => {
    const request = buildRequest();
    if (!draft || !request) return;
    const blocks =
      forecastRows && request.objectType === "pl-forecasting"
        ? draft.blocks.map((block) =>
            block.type === "pl-table" ? { ...block, rows: forecastRows, variant: "forecast" } : block,
          )
        : draft.blocks;
    const section = createApprovedSection({ ...draft, blocks }, request);
    if (!isReplace && saveToLibrary) {
      saveSectionToLibrary({
        title: section.title,
        description: draft.summary.calculationLogic,
        blocks: section.blocks,
      });
    }
    onApprove(section);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-xl border border-[#E6E8EB] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
          <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
            {isReplace ? "Replace object" : "Create new section"}
          </h3>
        </div>
        <StepDots step={step} />
        <button
          type="button"
          onClick={onCancel}
          className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
          aria-label="Close section builder"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* Step 1 — Scope */}
        {step === "scope" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Select scope
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Choose whether this section reports at the shared entity or property level.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SCOPE_CARDS.map((card) => {
                const Icon = card.icon;
                const isActive = scopeKind === card.kind;
                return (
                  <button
                    key={card.kind}
                    type="button"
                    onClick={() => handleScopeSelect(card.kind)}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
                      isActive
                        ? "border-2 border-[#A7B2F2] bg-[#F7F8FF]"
                        : "border-[#E6E8EB] hover:bg-[#FAFBFC]",
                    )}
                  >
                    <Icon className="size-5 text-[#353638]" strokeWidth={1.75} />
                    <span className="text-[14px] font-medium leading-[1.25] text-[#05091F]">
                      {SCOPE_LABELS[card.kind]}
                    </span>
                    <span className="text-[12px] leading-[1.5] text-[#65686B]">
                      {card.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {scopeKind ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium leading-[1.5] text-[#353638]">
                    {scopeKind === "shared-entity"
                      ? "Select entities"
                      : "Select properties"}
                    <span className="ml-1 font-normal text-[#65686B]">
                      · choose one or more
                    </span>
                  </p>
                  {targets.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#4C61DB]">
                        {targets.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setTargets([])}
                        className="text-[11px] font-medium text-[#65686B] underline hover:text-[#353638]"
                      >
                        Clear
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="flex max-h-[220px] flex-col gap-1 overflow-y-auto rounded-lg border border-[#E6E8EB] bg-white p-1.5">
                  {targetOptions.map((option) => {
                    const isChecked = targets.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleTarget(option)}
                        className={cn(
                          "flex h-10 w-full items-center gap-2.5 rounded px-3 text-left text-[13px] font-medium leading-[1.24] transition-colors",
                          isChecked
                            ? "bg-[#F7F8FF] text-[#353638]"
                            : "text-[#65686B] hover:bg-[#FAFBFC]",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                            isChecked
                              ? "border-[#4C61DB] bg-[#4C61DB] text-white"
                              : "border-[#B3B8BD] bg-white",
                          )}
                        >
                          {isChecked ? (
                            <Check className="size-3" strokeWidth={3} />
                          ) : null}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
                {targets.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {targets.map((option) => (
                      <span
                        key={option}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#A7B2F2] bg-[#F7F8FF] px-2.5 py-1 text-[11px] font-medium text-[#353638]"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() => toggleTarget(option)}
                          className="text-[#65686B] hover:text-[#B23A2F]"
                          aria-label={`Remove ${option}`}
                        >
                          <X className="size-3" strokeWidth={2} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!scopeKind || targets.length === 0}
                onClick={() => setStep("objects")}
                className={cn(
                  "flex h-10 items-center rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
                  !scopeKind || targets.length === 0
                    ? "cursor-not-allowed bg-[#B3B8BD]"
                    : "bg-[#111] hover:bg-[#333]",
                )}
              >
                Continue
              </button>
            </div>
          </div>
        ) : null}

        {/* Step 2 — KPI & data points */}
        {step === "objects" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Data points
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Choose the data domains this section should draw from.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {DATA_POINT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = dataCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleDataCategory(category.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                      isSelected
                        ? "border-2 border-[#A7B2F2] bg-[#F7F8FF]"
                        : "border-[#E6E8EB] bg-white hover:bg-[#FAFBFC]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        isSelected
                          ? "bg-[#EEF0FF] text-[#4C61DB]"
                          : "bg-[#F0F2F5] text-[#65686B]",
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.75} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-[1.25] text-[#05091F]">
                        {category.label}
                        {isSelected ? (
                          <Check className="size-3.5 text-[#4C61DB]" strokeWidth={2.5} />
                        ) : null}
                      </span>
                      <span className="text-[12px] leading-[1.4] text-[#65686B]">
                        {category.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 border-t border-[#F0F2F5] pt-4">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Select the KPIs
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Pick the headline metrics for this section. The Deep Agent identifies the
                right source (Snowflake, Web, or your uploaded file) for each one.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {kpiOptions.map((option) => {
                const isSelected = selectedObjects.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleObject(option.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium leading-[1.24] transition-colors",
                      isSelected
                        ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                        : "border-[#E6E8EB] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                    )}
                  >
                    {isSelected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 border-t border-[#F0F2F5] pt-4">
              <p className="text-[12px] font-semibold leading-[1.25] text-[#353638]">
                Suggested options
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Add supporting data points related to your scope and selected KPIs.
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {suggestedOptions.map((option) => {
                  const isSelected = selectedObjects.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleObject(option.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium leading-[1.24] transition-colors",
                        isSelected
                          ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                          : "border-[#E6E8EB] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                      )}
                    >
                      {isSelected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                      {option.label}
                    </button>
                  );
                })}
                <button
                  key={CUSTOM_FORMULA_OBJECT_ID}
                  type="button"
                  onClick={() =>
                    setCustomFormulaOn((value) => {
                      if (value) resetFormulaInterpretation();
                      return !value;
                    })
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-2 text-[13px] font-medium leading-[1.24] transition-colors",
                    customFormulaOn
                      ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                      : "border-[#B3B8BD] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                  )}
                >
                  <Plus className="size-3.5" strokeWidth={2} />
                  Else — write a formula
                </button>
              </div>
            </div>

            {customFormulaOn ? (
              <div className="flex flex-col gap-2.5 rounded-xl border border-[#E6E8EB] bg-[#FAFBFC] p-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium leading-[1.5] text-[#353638]">
                    Custom formula
                  </label>
                  <textarea
                    value={customFormula}
                    onChange={(event) => handleFormulaChange(event.target.value)}
                    disabled={formulaStatus === "accepted" || formulaStatus === "interpreting"}
                    rows={2}
                    placeholder="e.g. (Rental income − Operating expenses) ÷ GAV × 100"
                    className="w-full resize-y rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 text-[13px] leading-[1.5] text-[#353638] outline-none focus:border-[#A7B2F2] disabled:bg-[#F0F2F5] disabled:text-[#65686B]"
                  />
                </div>

                {/* Idle / declined → prompt the agent to interpret */}
                {formulaStatus === "idle" || formulaStatus === "declined" ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] leading-[1.4] text-[#65686B]">
                      {formulaStatus === "declined"
                        ? "No problem — adjust your formula and ask the agent to check it again."
                        : "The Deep Agent will read back the calculation it plans to run before you continue."}
                    </p>
                    <button
                      type="button"
                      disabled={!trimmedFormula}
                      onClick={runFormulaInterpretation}
                      className={cn(
                        "flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium leading-[1.24] text-white",
                        !trimmedFormula
                          ? "cursor-not-allowed bg-[#B3B8BD]"
                          : "bg-[#4C61DB] hover:bg-[#3B4FC4]",
                      )}
                    >
                      <Sparkles className="size-4" strokeWidth={1.75} />
                      {formulaStatus === "declined" ? "Re-check formula" : "Interpret with Deep Agent"}
                    </button>
                  </div>
                ) : null}

                {/* Interpreting → thinking */}
                {formulaStatus === "interpreting" ? (
                  <div className="flex items-center gap-2 rounded-lg border border-[#E6E8EB] bg-white px-3 py-2.5">
                    <Loader2 className="size-4 animate-spin text-[#4C61DB]" strokeWidth={1.75} />
                    <p className="text-[12px] leading-[1.4] text-[#65686B]">
                      Deep Agent is interpreting your formula…
                    </p>
                  </div>
                ) : null}

                {/* Proposed → agent read-back with Accept / Decline */}
                {formulaStatus === "proposed" && interpretation ? (
                  <div className="flex flex-col gap-3 rounded-lg border border-[#A7B2F2] bg-white p-3.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-4 text-[#4C61DB]" strokeWidth={1.75} />
                      <p className="text-[12px] font-semibold leading-[1.25] text-[#05091F]">
                        Deep Agent — here&apos;s the calculation I&apos;ll run
                      </p>
                    </div>
                    <p className="text-[12px] leading-[1.5] text-[#353638]">
                      {interpretation.plainEnglish}
                    </p>

                    {interpretation.inputs.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
                          Inputs resolved
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {interpretation.inputs.map((input) => (
                            <span
                              key={input.token}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-[#FAFBFC] px-2.5 py-1 text-[11px] font-medium text-[#353638]"
                            >
                              {input.token}
                              <span className="text-[#969A9E]">·</span>
                              <span className="text-[#65686B]">
                                {DATA_SOURCE_LABELS[input.source]}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-1.5">
                      <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
                        Calculation steps
                      </p>
                      <ol className="flex flex-col gap-1.5">
                        {interpretation.steps.map((stepText, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-[12px] leading-[1.5] text-[#353638]"
                          >
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#F0F2F5] text-[10px] font-semibold text-[#65686B]">
                              {index + 1}
                            </span>
                            {stepText}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <p className="text-[12px] leading-[1.4] text-[#353638]">
                      <span className="font-medium">Output:</span> {interpretation.output}
                    </p>

                    <div className="flex items-center justify-end gap-2 border-t border-[#F0F2F5] pt-3">
                      <button
                        type="button"
                        onClick={declineFormula}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-3 text-[13px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
                      >
                        <X className="size-4" strokeWidth={1.75} />
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormulaStatus("accepted")}
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F7A45] px-3 text-[13px] font-medium leading-[1.24] text-white hover:bg-[#1A6B3C]"
                      >
                        <Check className="size-4" strokeWidth={2} />
                        Accept calculation
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Accepted → green confirmed frame */}
                {formulaStatus === "accepted" && interpretation ? (
                  <div className="flex flex-col gap-2 rounded-lg border-2 border-[#1F7A45] bg-[#E7F4EC] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#1F7A45]">
                          <Check className="size-3.5 text-white" strokeWidth={2.5} />
                        </span>
                        <p className="text-[12px] font-semibold leading-[1.25] text-[#1F5C36]">
                          Formula confirmed
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={resetFormulaInterpretation}
                        className="text-[12px] font-medium text-[#1F7A45] underline hover:text-[#1A6B3C]"
                      >
                        Edit formula
                      </button>
                    </div>
                    <code className="block rounded-md border border-[#BFE3CC] bg-white px-3 py-2 font-mono text-[12px] leading-[1.5] text-[#1F5C36]">
                      {interpretation.formula}
                    </code>
                    <p className="text-[11px] leading-[1.4] text-[#1F5C36]">
                      Output: {interpretation.output} · this data point is now included in the
                      section.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#B3B8BD] px-3 py-2 text-[13px] font-medium text-[#65686B] hover:bg-[#FAFBFC]">
                <Paperclip className="size-4" strokeWidth={1.75} />
                {uploadedFileName ? uploadedFileName : "Attach a file (optional)"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    setUploadedFileName(event.target.files?.[0]?.name ?? undefined)
                  }
                />
              </label>
              {uploadedFileName ? (
                <button
                  type="button"
                  onClick={() => setUploadedFileName(undefined)}
                  className="w-fit text-[12px] text-[#65686B] underline hover:text-[#353638]"
                >
                  Remove file
                </button>
              ) : null}
            </div>

            {/* Deep Agent interpretation of the selected data points */}
            {dataPointsStatus === "interpreting" ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] px-3.5 py-3">
                <Loader2 className="size-4 animate-spin text-[#4C61DB]" strokeWidth={1.75} />
                <p className="text-[12px] leading-[1.4] text-[#65686B]">
                  Deep Agent is reviewing your KPIs &amp; data points…
                </p>
              </div>
            ) : null}

            {dataPointsStatus === "proposed" && dataPointsSummary ? (
              <div className="flex flex-col gap-3 rounded-xl border border-[#A7B2F2] bg-[#F7F8FF] p-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-[#4C61DB]" strokeWidth={1.75} />
                  <p className="text-[12px] font-semibold leading-[1.25] text-[#05091F]">
                    Deep Agent — here&apos;s what I&apos;ll pull
                  </p>
                </div>
                <p className="text-[12px] leading-[1.5] text-[#353638]">
                  {dataPointsSummary.plainEnglish}
                </p>

                {dataPointsSummary.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {dataPointsSummary.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#4C61DB] ring-1 ring-[#D9DEF3]"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
                    Data points resolved
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {dataPointsSummary.dataPoints.map((point) => (
                      <span
                        key={point.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-white px-2.5 py-1 text-[11px] font-medium text-[#353638]"
                      >
                        {point.label}
                        <span className="text-[#969A9E]">·</span>
                        <span className="text-[#65686B]">
                          {DATA_SOURCE_LABELS[point.source]}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#E4E7F5] pt-3">
                  <button
                    type="button"
                    onClick={resetDataPointsInterpretation}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-3 text-[13px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
                  >
                    <ArrowLeft className="size-4" strokeWidth={1.75} />
                    Adjust selection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedObjects.includes("pl-forecasting")) {
                        setObjectType("pl-forecasting");
                      }
                      setStep("data-type");
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F7A45] px-3 text-[13px] font-medium leading-[1.24] text-white hover:bg-[#1A6B3C]"
                  >
                    <Check className="size-4" strokeWidth={2} />
                    Approve &amp; continue
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("scope")}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Back
              </button>
              {dataPointsStatus !== "proposed" ? (
                <div className="flex items-center gap-3">
                  {formulaPending ? (
                    <span className="text-[11px] leading-[1.4] text-[#B23A2F]">
                      Accept the Deep Agent&apos;s formula read-back to continue.
                    </span>
                  ) : null}
                  <button
                    type="button"
                    disabled={
                      !hasDataPoints ||
                      formulaPending ||
                      dataPointsStatus === "interpreting"
                    }
                    onClick={runDataPointsInterpretation}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
                      !hasDataPoints ||
                        formulaPending ||
                        dataPointsStatus === "interpreting"
                        ? "cursor-not-allowed bg-[#B3B8BD]"
                        : "bg-[#111] hover:bg-[#333]",
                    )}
                  >
                    {dataPointsStatus === "interpreting" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" strokeWidth={1.75} />
                        Continue
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Step 3 — Data type (object type from product spec) */}
        {step === "data-type" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Select the data type
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Choose how this section is rendered. Each object type has its own page limits.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {REPORT_OBJECT_TYPES.map((type) => {
                const Icon = OBJECT_TYPE_ICON[type.id];
                const isActive = objectType === type.id;
                const exceeds =
                  type.maxDataPoints !== undefined && dataPointCount > type.maxDataPoints;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setObjectType(type.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                      isActive
                        ? "border-2 border-[#A7B2F2] bg-[#F7F8FF]"
                        : "border-[#E6E8EB] hover:bg-[#FAFBFC]",
                    )}
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F2F5] text-[#353638]">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[13px] font-medium leading-[1.3] text-[#05091F]">
                        {type.label}
                      </span>
                      <span className="text-[11px] leading-[1.4] text-[#65686B]">
                        {type.limit}
                      </span>
                      {isActive && exceeds ? (
                        <span className="mt-0.5 text-[11px] leading-[1.4] text-[#B23A2F]">
                          You selected {dataPointCount} data points — extras will be truncated to{" "}
                          {type.maxDataPoints} {type.maxLabel}.
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("objects")}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Back
              </button>
              <button
                type="button"
                disabled={!objectType}
                onClick={runAgent}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
                  !objectType ? "cursor-not-allowed bg-[#B3B8BD]" : "bg-[#111] hover:bg-[#333]",
                )}
              >
                <Sparkles className="size-4" strokeWidth={1.75} />
                Generate section
              </button>
            </div>
          </div>
        ) : null}

        {/* Generating */}
        {step === "generating" ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="relative flex size-12 items-center justify-center">
              <Loader2 className="size-10 animate-spin text-[#A7B2F2]" strokeWidth={1.5} />
              <Sparkles className="absolute size-4 text-[#4C61DB]" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[14px] font-medium leading-[1.25] text-[#05091F]">
                Deep Agent is generating your section
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                Identifying the data source, querying figures, and computing variances…
              </p>
            </div>
          </div>
        ) : null}

        {/* Step 5/6 — Review & approve */}
        {step === "review" && draft ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Review the generated section
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                {objectType === "pl-forecasting"
                  ? "Edit the forecast figures below. Totals and variances recalculate live, with a formula for each result."
                  : "Approve to add it to the report template, or regenerate to adjust."}
              </p>
            </div>

            <SectionReviewSummary summary={draft.summary} />

            <div className="rounded-xl border border-[#E6E8EB] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
                  Section preview
                </p>
                {objectType ? (
                  <span className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2.5 py-1 text-[11px] font-medium text-[#65686B]">
                    {getReportObjectType(objectType).label}
                  </span>
                ) : null}
              </div>
              {draft.blocks[0]?.type !== "heading" &&
              draft.blocks[0]?.type !== "pl-table" ? (
                <h2 className="mb-4 text-[20px] font-medium leading-[1.25] text-[#05091F]">
                  {draft.title}
                </h2>
              ) : null}
              <div className="flex flex-col gap-4">
                {draft.blocks.map((block, index) => {
                  if (block.type === "pl-table" && forecastRows) {
                    return (
                      <PlForecastReviewEditor
                        key={index}
                        title={block.title}
                        rows={forecastRows}
                        onRowsChange={setForecastRows}
                      />
                    );
                  }
                  if (block.type === "prose") {
                    return (
                      <div key={index} className="flex flex-col gap-2">
                        {block.paragraphs.map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className="text-[12px] leading-[1.5] text-[#353638]"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  if (block.type === "metrics") {
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                      >
                        {block.items.map((item) => (
                          <div
                            key={item.label}
                            className="rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] px-4 py-3"
                          >
                            <p className="text-[11px] leading-[1.5] text-[#65686B]">
                              {item.label}
                            </p>
                            <p className="mt-1 text-[16px] font-medium leading-[1.25] text-[#05091F]">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (block.type === "ai-summary") {
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-xl border border-[#A7B2F2] bg-[#F7F8FF] p-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <Wand2 className="size-4 text-[#4C61DB]" strokeWidth={1.75} />
                          <p className="text-[13px] font-semibold leading-[1.25] text-[#05091F]">
                            {block.headline}
                          </p>
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#4C61DB]">
                            <Sparkles className="size-3" strokeWidth={2} />
                            AI generated
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {block.paragraphs.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-[12px] leading-[1.5] text-[#353638]"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        {block.entities.length > 0 || block.kpis.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 border-t border-[#DDE1F7] pt-2.5">
                            {block.entities.map((entity) => (
                              <span
                                key={`e-${entity}`}
                                className="inline-flex items-center rounded-full border border-[#DDE1F7] bg-white px-2 py-0.5 text-[10px] font-medium text-[#4C61DB]"
                              >
                                {entity}
                              </span>
                            ))}
                            {block.kpis.map((kpi) => (
                              <span
                                key={`k-${kpi}`}
                                className="inline-flex items-center rounded-full border border-[#E6E8EB] bg-white px-2 py-0.5 text-[10px] font-medium text-[#65686B]"
                              >
                                {kpi}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                  if (block.type === "updates") {
                    return (
                      <ul key={index} className="flex flex-col gap-2">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-[12px] leading-[1.5] text-[#353638]"
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#65686B]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <ReportRichBlock key={index} block={block} />;
                })}
              </div>
            </div>

            {mode === "create" ? (
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] px-4 py-3">
                <input
                  type="checkbox"
                  checked={saveToLibrary}
                  onChange={(event) => setSaveToLibrary(event.target.checked)}
                  className="size-4 accent-[#4C61DB]"
                />
                <span className="flex flex-col">
                  <span className="text-[13px] font-medium leading-[1.3] text-[#05091F]">
                    Also save to the section library
                  </span>
                  <span className="text-[12px] leading-[1.4] text-[#65686B]">
                    Reuse this section across other templates.
                  </span>
                </span>
              </label>
            ) : null}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("data-type")}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Regenerate
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex h-10 items-center rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex h-10 items-center gap-2 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
                >
                  <Check className="size-4" strokeWidth={2} />
                  {isReplace
                    ? "Replace object with this"
                    : isLibrary
                      ? "Save section to library"
                      : `Approve & add to ${reportTitle.split(" ")[0]} template`}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
