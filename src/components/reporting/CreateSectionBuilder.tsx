"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Check,
  FolderOpen,
  Gauge,
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionReviewSummary } from "@/src/components/reporting/SectionReviewSummary";
import { ReportRichBlock } from "@/src/components/reporting/ReportRichBlock";
import {
  CUSTOM_FORMULA_OBJECT_ID,
  DATA_SOURCE_LABELS,
  REPORT_OBJECT_TYPES,
  SCOPE_LABELS,
  createApprovedSection,
  generateReportSection,
  getReportObjectType,
  getScopeObjectOptions,
  getScopeTargetOptions,
  interpretFormula,
  type CustomReportSection,
  type FormulaInterpretation,
  type GeneratedSectionDraft,
  type ReportObjectTypeId,
  type ReportScopeKind,
} from "@/src/lib/reportSectionBuilder";

type BuilderStep = "scope" | "objects" | "data-type" | "generating" | "review";

const OBJECT_TYPE_ICON: Record<
  ReportObjectTypeId,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "import-existing": LayoutDashboard,
  "main-page-header": Heading,
  "summary-main": TextQuote,
  list: ListIcon,
  kpis: Gauge,
  charts: BarChart3,
  tables: Table2,
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

const STEP_LABELS: { id: BuilderStep; label: string }[] = [
  { id: "scope", label: "Scope" },
  { id: "objects", label: "Data points" },
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
  onCancel,
  onApprove,
}: {
  reportTitle: string;
  onCancel: () => void;
  onApprove: (section: CustomReportSection) => void;
}) {
  const [step, setStep] = useState<BuilderStep>("scope");
  const [scopeKind, setScopeKind] = useState<ReportScopeKind | null>(null);
  const [target, setTarget] = useState("");
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
  const objectOptions = useMemo(
    () => (scopeKind ? getScopeObjectOptions(scopeKind) : []),
    [scopeKind],
  );

  const resetFormulaInterpretation = () => {
    setFormulaStatus("idle");
    setInterpretation(null);
  };

  const handleScopeSelect = (kind: ReportScopeKind) => {
    setScopeKind(kind);
    setTarget("");
    setSelectedObjects([]);
    setCustomFormulaOn(false);
    setCustomFormula("");
    resetFormulaInterpretation();
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

  const toggleObject = (id: string) => {
    setSelectedObjects((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const buildRequest = () => {
    if (!scopeKind || !target || !objectType) return null;
    return {
      scope: { kind: scopeKind, target },
      objects: selectedObjects,
      objectType,
      customFormula: formulaConfirmed ? trimmedFormula : undefined,
      uploadedFileName,
    };
  };

  const runAgent = async () => {
    const request = buildRequest();
    if (!request) return;
    setStep("generating");
    const result = await generateReportSection(request);
    setDraft(result);
    setStep("review");
  };

  const handleApprove = () => {
    const request = buildRequest();
    if (!draft || !request) return;
    onApprove(createApprovedSection(draft, request));
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-xl border border-[#E6E8EB] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
          <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
            Create new section
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
                <p className="text-[12px] font-medium leading-[1.5] text-[#353638]">
                  {scopeKind === "shared-entity" ? "Select entity" : "Select property"}
                </p>
                <Select value={target || undefined} onValueChange={setTarget}>
                  <SelectTrigger className="h-11 w-full max-w-[360px] rounded-lg border border-[#E6E8EB] bg-white px-3">
                    <SelectValue
                      placeholder={
                        scopeKind === "shared-entity"
                          ? "Choose an entity"
                          : "Choose a property"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    {targetOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!scopeKind || !target}
                onClick={() => setStep("objects")}
                className={cn(
                  "flex h-10 items-center rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
                  !scopeKind || !target
                    ? "cursor-not-allowed bg-[#B3B8BD]"
                    : "bg-[#111] hover:bg-[#333]",
                )}
              >
                Continue
              </button>
            </div>
          </div>
        ) : null}

        {/* Step 2 — Objects / data points */}
        {step === "objects" ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
                Select data points
              </p>
              <p className="text-[12px] leading-[1.5] text-[#65686B]">
                The Deep Agent will identify the right source (Snowflake, Web, or your uploaded
                file) for each selected object.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {objectOptions.map((option) => {
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

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep("scope")}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
              >
                <ArrowLeft className="size-4" strokeWidth={1.75} />
                Back
              </button>
              <div className="flex items-center gap-3">
                {formulaPending ? (
                  <span className="text-[11px] leading-[1.4] text-[#B23A2F]">
                    Accept the Deep Agent&apos;s formula read-back to continue.
                  </span>
                ) : null}
                <button
                  type="button"
                  disabled={!hasDataPoints || formulaPending}
                  onClick={() => setStep("data-type")}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
                    !hasDataPoints || formulaPending
                      ? "cursor-not-allowed bg-[#B3B8BD]"
                      : "bg-[#111] hover:bg-[#333]",
                  )}
                >
                  Continue
                </button>
              </div>
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
                Approve to add it to the report template, or regenerate to adjust.
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
              {draft.blocks[0]?.type !== "heading" ? (
                <h2 className="mb-4 text-[20px] font-medium leading-[1.25] text-[#05091F]">
                  {draft.title}
                </h2>
              ) : null}
              <div className="flex flex-col gap-4">
                {draft.blocks.map((block, index) => {
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
                  Approve & add to {reportTitle.split(" ")[0]} template
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
