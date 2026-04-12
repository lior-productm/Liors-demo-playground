"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Download,
  Layers,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadExcelWorkbook } from "@/src/lib/commercial-export";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

/* ------------------------------------------------------------------ */
/*  Commercial Dashboard — widgets / Rent Roll / Property Hub tables    */
/*  (CommercialDashboard, RentRollView, PropertyHubView)               */
/* ------------------------------------------------------------------ */

const CM = {
  /** Core DS: P3 bold + Neutral-700 */
  pageLead: "typo-p3-b text-[#65686B]",
  /** Core DS: H5 + Neutral-800 */
  widgetTitle: "typo-h5 text-[#2C2C2C]",
  widgetShell: cn(
    "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
    amiioCardHoverSurface,
  ),
  innerWidget: cn(
    "rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-6 pb-6 pt-[17px]",
    amiioCardHoverSurface,
  ),
  innerWidgetCompact: cn(
    "rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-4 py-4 sm:px-6 sm:py-5",
    amiioCardHoverSurface,
  ),
  kpiCard: cn(
    "flex min-h-[124px] flex-col justify-between gap-2 rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-4 py-4",
    amiioCardHoverSurface,
  ),
  /** Core DS: P2 bold + Neutral-700 */
  kpiLabel: "typo-p2-b text-[#65686B]",
  /** Core DS: H5 + tabular + Neutral-900 */
  kpiValue: "typo-h5 tabular-nums text-[#353638]",
  /** Core DS: P3 bold + Neutral-500 */
  kpiHint: "typo-p3-b text-[#969A9E]",
  /** Core DS: L2 bold (14 / medium / 1.25) */
  tabActive: "h-[36px] rounded-full bg-[#010309] px-5 typo-l2-b text-white transition-colors",
  tabInactive:
    "h-[36px] rounded-full px-4 typo-l2-b text-[#969A9E] transition-colors hover:text-[#353638]",
  btnSecondary:
    "inline-flex items-center gap-2 rounded-lg border border-[#E6E8EB] bg-white px-3 py-1.5 typo-p3-b text-[#353638] shadow-sm transition-colors hover:bg-[#F8F9FA]",
  iconBtn:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] text-[#969A9E] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF]",
  link: "typo-l2-b text-[#233FDE] underline-offset-2 transition-colors hover:text-[#1a2fb0] hover:underline",
  pillDark: "inline-flex h-6 items-center rounded-full bg-[#010309] px-2.5 typo-p3-b text-white",
  /** RentRollView TableHeaderRow + body */
  rrHead: "bg-[#F2F4F7]",
  rrTh: "whitespace-nowrap px-3 py-2 text-left typo-p3-b text-[#65686B]",
  rrThRight: "whitespace-nowrap px-3 py-2 text-right typo-p3-b text-[#65686B]",
  rrRow: "border-b border-[#F2F4F7] transition-colors last:border-b-0 hover:bg-[#FAFBFC]",
  rrTd: "px-3 py-2.5 typo-p3-r text-[#353638]",
  rrFoot: "border-t-2 border-[#E6E8EB] bg-[#F2F4F7]",
} as const;

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTH_LABELS_UPPER = MONTH_LABELS.map((m) => m.toUpperCase());

/** VO reference snapshot ratios (GRI €384k) — scales proportionally with scenario GRI */
const PL_FIN = 320_000 / 384_000;
const PL_DEP = 250_000 / 384_000;
const PL_DIST = 120_000 / 384_000;
const PL_LOAN = 180_000 / 384_000;
const PL_CAPEX_VO = 23_004 / 384_000;
const PL_ASSUMED_EQUITY_PCT = 0.42;

function monthlyAmount(annualSigned: number) {
  return annualSigned / 12;
}

/* ------------------------------------------------------------------ */
/*  Collapsible (Property Hub / core system pattern)                   */
/* ------------------------------------------------------------------ */

function ScenarioCollapsibleSection({
  title,
  defaultOpen = true,
  lampChatTopic,
  lampLabel,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  lampChatTopic?: string;
  lampLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)]">
      <div className="flex w-full items-center gap-3 px-6 py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
          ) : (
            <ChevronDown className="h-6 w-6 shrink-0 text-[#969A9E]" />
          )}
          <span className="typo-h5 text-[#2C2C2C]">{title}</span>
        </button>
        <WidgetHeaderLamp chatTopic={lampChatTopic} chatLabel={lampLabel ?? title} />
      </div>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Types & seed data                                                  */
/* ------------------------------------------------------------------ */

type RentStatus = "occupied" | "vacant";

type RentRow = {
  id: string;
  unit: string;
  tenant: string;
  status: RentStatus;
  sqm: number;
  annualRent: number;
  yearsLeft: number;
  leaseEnd: string;
  rentFreeMonths: number;
  capex: number;
};

type ScenarioSlice = {
  capRatePct: number;
  rows: RentRow[];
};

type ScenarioEntry = {
  id: string;
  name: string;
  slice: ScenarioSlice;
  createdAt: number;
  updatedAt: number;
  /** Single baseline rent roll — not closable, always in comparison/export. */
  isBase: boolean;
  /** When false, the scenario is a draft tab only; Save adds it to All scenarios. */
  persisted: boolean;
};

type ScenarioAgentState = {
  input: string;
  processing: boolean;
  response: string;
};

const ALL_SCENARIOS_TAB = "all-scenarios" as const;
type TabKey = string | "comparison" | typeof ALL_SCENARIOS_TAB;

function formatScenarioDateTime(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

function createEmptyScenarioRow(): RentRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    unit: "New unit",
    tenant: "New tenant",
    status: "occupied",
    sqm: 100,
    annualRent: 0,
    yearsLeft: 3,
    leaseEnd: "—",
    rentFreeMonths: 0,
    capex: 0,
  };
}

function voBaseRows(): RentRow[] {
  return [
    {
      id: "1",
      unit: "Unit 1 — Ground floor retail",
      tenant: "Coffee Co.",
      status: "occupied",
      sqm: 320,
      annualRent: 84_480,
      yearsLeft: 3.4,
      leaseEnd: "2028-06-30",
      rentFreeMonths: 0,
      capex: 15_000,
    },
    {
      id: "2",
      unit: "Unit 2 — Office",
      tenant: "TechMart B.V.",
      status: "occupied",
      sqm: 540,
      annualRent: 144_000,
      yearsLeft: 4.1,
      leaseEnd: "2029-03-15",
      rentFreeMonths: 0,
      capex: 0,
    },
    {
      id: "3",
      unit: "Unit 3 — Warehouse",
      tenant: "—",
      status: "vacant",
      sqm: 400,
      annualRent: 0,
      yearsLeft: 0,
      leaseEnd: "—",
      rentFreeMonths: 0,
      capex: 0,
    },
    {
      id: "4",
      unit: "Unit 4 — Flex",
      tenant: "Studio NL",
      status: "occupied",
      sqm: 690,
      annualRent: 155_520,
      yearsLeft: 2.2,
      leaseEnd: "2027-11-01",
      rentFreeMonths: 1,
      capex: 8_000,
    },
  ];
}

function cloneRows(rows: RentRow[]): RentRow[] {
  return rows.map((r) => ({ ...r }));
}

function deepCloneScenario(s: ScenarioSlice): ScenarioSlice {
  return { capRatePct: s.capRatePct, rows: cloneRows(s.rows) };
}

/** Matches VO reference (€384k GRI → €115.2k opex → €268.8k NOI); adjust if you standardise on a different load. */
const OPEX_RATIO = 0.3;

function fmtEur(n: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Accounting-style negative: (€12,345) in red */
function fmtEurParen(n: number) {
  const abs = fmtEur(Math.abs(n));
  if (n < 0) return { text: `(${abs})`, negative: true as const };
  return { text: abs, negative: false as const };
}

function fmtPct(n: number, digits = 1) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

function computeTotals(rows: RentRow[]) {
  const totalSqm = rows.reduce((a, r) => a + r.sqm, 0);
  const occupiedSqm = rows.filter((r) => r.status === "occupied").reduce((a, r) => a + r.sqm, 0);
  const occupancyPct = totalSqm > 0 ? (occupiedSqm / totalSqm) * 100 : 0;
  const totalRent = rows.reduce((a, r) => a + (r.status === "occupied" ? r.annualRent : 0), 0);
  const wault =
    totalRent > 0
      ? rows.reduce((a, r) => a + (r.status === "occupied" ? r.annualRent * r.yearsLeft : 0), 0) / totalRent
      : 0;
  const impliedNoi = totalRent * (1 - OPEX_RATIO);
  const totalCapex = rows.reduce((a, r) => a + r.capex, 0);
  const monthlyRent = totalRent / 12;
  return { totalRent, wault, impliedNoi, totalSqm, occupiedSqm, occupancyPct, totalCapex, monthlyRent };
}

function computePl12m(gri: number, noi: number) {
  const opex = gri * OPEX_RATIO;
  const financingCosts = gri * PL_FIN;
  const depreciation = gri * PL_DEP;
  const resultBeforeTax = noi - financingCosts - depreciation;
  const distributions = gri * PL_DIST;
  const loanRepayment = gri * PL_LOAN;
  const capexReserve = gri * PL_CAPEX_VO;
  const netCashFlow = resultBeforeTax - distributions - loanRepayment - capexReserve;
  return {
    gri,
    opex,
    noi,
    financingCosts,
    depreciation,
    resultBeforeTax,
    distributions,
    loanRepayment,
    capexReserve,
    netCashFlow,
  };
}

/** Inline inputs when a row is open for edit (RentRollView Signed Leased pattern) */
const scenarioRentEditInput =
  "w-full rounded border border-[#233FDE] bg-white px-2 py-1 typo-p3-r text-[#353638] outline-none";

/* ------------------------------------------------------------------ */
/*  KPI card + lamp                                                    */
/* ------------------------------------------------------------------ */

function KpiCard({
  title,
  value,
  sub,
  infoText,
}: {
  title: string;
  value: string;
  sub: string;
  infoText: string;
}) {
  return (
    <div className={cn(CM.kpiCard, "group h-full")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 typo-l3-b uppercase tracking-wider text-[#969A9E]">{title}</div>
        <WidgetHeaderLamp revealOnHover chatTopic={infoText} chatLabel={title} />
      </div>
      <div className={cn(CM.kpiValue)}>{value}</div>
      <div className={cn("typo-p3-r text-[#969A9E]")}>{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  12M run-rate P&L (annualized snapshot → net cash flow)             */
/* ------------------------------------------------------------------ */

type PlLine = {
  kind: "line";
  label: string;
  amount: number;
  emphasize?: boolean;
  detail?: boolean;
};
type PlSection = { kind: "section"; label: string };
type PlRow = PlLine | PlSection;

function buildPlRows(pl: ReturnType<typeof computePl12m>): PlRow[] {
  return [
    { kind: "line", label: "Gross rental income", amount: pl.gri, emphasize: true },
    {
      kind: "line",
      label: `Operating expenses (${(OPEX_RATIO * 100).toFixed(0)}% model)`,
      amount: -pl.opex,
      detail: true,
    },
    {
      kind: "line",
      label: "Net operating income (NOI)",
      amount: pl.noi,
      emphasize: true,
    },
    { kind: "line", label: "Financing costs", amount: -pl.financingCosts, detail: true },
    { kind: "line", label: "Depreciation", amount: -pl.depreciation, detail: true },
    { kind: "line", label: "Result before tax", amount: pl.resultBeforeTax, emphasize: true },
    { kind: "section", label: "Cash flow mutations" },
    { kind: "line", label: "Distributions", amount: -pl.distributions, detail: true },
    { kind: "line", label: "Loan repayment", amount: -pl.loanRepayment, detail: true },
    { kind: "line", label: "CapEx", amount: -pl.capexReserve, detail: true },
    { kind: "line", label: "Net cash flow", amount: pl.netCashFlow, emphasize: true },
  ];
}

function RollingPl12mTable({ gri, noi }: { gri: number; noi: number }) {
  const pl = useMemo(() => computePl12m(gri, noi), [gri, noi]);
  const [breakdownOpen, setBreakdownOpen] = useState(true);

  const allRows = useMemo(() => buildPlRows(pl), [pl]);
  const rows: PlRow[] = breakdownOpen
    ? allRows
    : allRows.filter((r) => r.kind === "line" && (r.emphasize || !r.detail));

  const lamp12m =
    "12M rolling forward view: GRI and model opex to NOI, then financing and depreciation to result before tax, then cash mutations (distributions, loan principal, CapEx) to net cash flow. Months are an equal split of each annual line (run-rate). Export includes full month columns per scenario.";

  return (
    <ScenarioCollapsibleSection
      title="Financial overview — 12M rolling forward"
      lampChatTopic={lamp12m}
      lampLabel="12M rolling forward"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setBreakdownOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 typo-l2-b text-[#233FDE] transition-colors hover:text-[#1a2fb0]"
        >
          {breakdownOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {breakdownOpen ? "Hide line-item breakdown" : "Show line-item breakdown"}
        </button>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(230,231,232,0.7)] bg-white text-[#7E8185] transition-colors hover:bg-[#F2F4F7] hover:text-[#353638]"
                aria-label="About monthly columns and refreshing this table"
              >
                <CircleHelp className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-[280px] text-left typo-p3-b leading-snug text-[#353638]"
            >
              Monthly columns are one-twelfth of each annualized line. Edit the rent roll to refresh KPIs and this
              table.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-3 overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className={CM.rrHead}>
              <th
                className={cn(
                  "sticky left-0 z-20 min-w-[200px] bg-[#F2F4F7] px-3 py-2 text-left typo-l3-b uppercase tracking-wider text-[#969A9E] shadow-[2px_0_0_0_#F2F4F7]",
                )}
              >
                Line item
              </th>
              {MONTH_LABELS_UPPER.map((m) => (
                <th key={m} className="min-w-[72px] whitespace-nowrap px-3 py-2 text-right typo-l3-b uppercase tracking-wider text-[#969A9E]">
                  {m}
                </th>
              ))}
              <th className="min-w-[88px] whitespace-nowrap px-3 py-2 text-right typo-l3-b uppercase tracking-wider text-[#969A9E]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let lineIdx = 0;
              return rows.map((r) => {
              if (r.kind === "section") {
                return (
                  <tr key={r.label} className="bg-[#F8F9FA]">
                    <td
                      colSpan={14}
                      className="px-3 py-2 typo-l3-b uppercase tracking-wider text-[#353638]"
                    >
                      {r.label}
                    </td>
                  </tr>
                );
              }
              const mon = monthlyAmount(r.amount);
              const zebra = lineIdx % 2 === 1 ? "bg-[#FAFBFC]" : "bg-white";
              lineIdx += 1;
              return (
                <tr key={r.label} className={cn("border-b border-[#F2F4F7] transition-colors last:border-b-0", zebra)}>
                  <td
                    className={cn(
                      "sticky left-0 z-10 min-w-[200px] max-w-[260px] px-3 py-2.5 shadow-[2px_0_0_0_#F2F4F7]",
                      r.emphasize ? "typo-p3-b text-[#2C2C2C]" : "typo-p3-b text-[#353638]",
                      r.emphasize ? "bg-[#F8F9FA]" : zebra,
                    )}
                  >
                    {r.label}
                  </td>
                  {MONTH_LABELS.map((month) => {
                    const cell = fmtEurParen(mon);
                    return (
                      <td
                        key={month}
                        className={cn(
                          "px-3 py-2.5 text-right typo-n-default-s",
                          cell.negative ? "text-[#DC2626]" : "text-[#353638]",
                          r.emphasize && "typo-n-sectiontotal-s",
                        )}
                      >
                        {cell.text}
                      </td>
                    );
                  })}
                  {(() => {
                    const cell = fmtEurParen(r.amount);
                    return (
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right typo-n-total-s",
                          cell.negative ? "text-[#DC2626]" : "text-[#353638]",
                          r.emphasize && "typo-n-sectiontotal-s",
                        )}
                      >
                        {cell.text}
                      </td>
                    );
                  })()}
                </tr>
              );
            });
            })()}
          </tbody>
        </table>
      </div>
    </ScenarioCollapsibleSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-scenario editor                                                */
/* ------------------------------------------------------------------ */

function ScenarioSlicePanel({
  scenarioId,
  slice,
  setSlice,
  baselineTotals,
  showScenarioAgent,
  agentInput,
  agentProcessing,
  agentResponse,
  onAgentInputChange,
  onAgentSend,
  showSaveScenario,
  onSaveScenario,
}: {
  scenarioId: string;
  slice: ScenarioSlice;
  setSlice: (next: ScenarioSlice | ((prev: ScenarioSlice) => ScenarioSlice)) => void;
  baselineTotals: ReturnType<typeof computeTotals>;
  showScenarioAgent?: boolean;
  agentInput?: string;
  agentProcessing?: boolean;
  agentResponse?: string;
  onAgentInputChange?: (value: string) => void;
  onAgentSend?: () => void;
  showSaveScenario?: boolean;
  onSaveScenario?: () => void;
}) {
  const [isEditingRoll, setIsEditingRoll] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<RentRow | null>(null);

  useEffect(() => {
    setIsEditingRoll(false);
    setEditingRowIndex(null);
    setEditDraft(null);
  }, [scenarioId]);

  useEffect(() => {
    if (!isEditingRoll) {
      setEditingRowIndex(null);
      setEditDraft(null);
    }
  }, [isEditingRoll]);

  /** Include in-flight row edits so totals / KPIs / valuation update as the user types (before row Save). */
  const rowsForTotals = useMemo(() => {
    const rows = slice.rows;
    if (
      editingRowIndex !== null &&
      editDraft &&
      editingRowIndex >= 0 &&
      editingRowIndex < rows.length
    ) {
      const id = rows[editingRowIndex]?.id;
      const merged = { ...editDraft, id: id ?? editDraft.id };
      return rows.map((r, i) => (i === editingRowIndex ? merged : r));
    }
    return rows;
  }, [slice.rows, editingRowIndex, editDraft]);

  const totals = useMemo(() => computeTotals(rowsForTotals), [rowsForTotals]);
  const noi = totals.impliedNoi;
  const cap = Math.max(slice.capRatePct / 100, 0.0001);
  const indicativeValue = noi / cap;

  const plKpi = useMemo(() => computePl12m(totals.totalRent, noi), [totals.totalRent, noi]);
  const equity = indicativeValue * PL_ASSUMED_EQUITY_PCT;
  const roePct = equity > 0 ? (plKpi.netCashFlow / equity) * 100 : 0;
  const cocPct = roePct;
  const niyPct = indicativeValue > 0 ? (noi / indicativeValue) * 100 : 0;
  const opexAnnual = totals.totalRent * OPEX_RATIO;

  const avgRentPerSqm =
    totals.occupiedSqm > 0 ? totals.totalRent / totals.occupiedSqm : 0;
  const baselineAvgRentPerSqm =
    baselineTotals.occupiedSqm > 0 ? baselineTotals.totalRent / baselineTotals.occupiedSqm : 0;

  const colSpanBand = isEditingRoll ? 12 : 11;

  const openEditRow = useCallback(
    (ri: number) => {
      if (!isEditingRoll) return;
      setEditingRowIndex(ri);
      setEditDraft({ ...slice.rows[ri] });
    },
    [isEditingRoll, slice.rows],
  );

  const saveEditRow = useCallback(() => {
    if (editingRowIndex === null || !editDraft) return;
    setSlice((s) => {
      const id = s.rows[editingRowIndex]?.id;
      if (!id) return s;
      return {
        ...s,
        rows: s.rows.map((r, i) => (i === editingRowIndex ? { ...editDraft, id } : r)),
      };
    });
    setEditingRowIndex(null);
    setEditDraft(null);
  }, [editDraft, editingRowIndex, setSlice]);

  /** Persist any open line edit, then leave roll editing mode (totals / KPIs use saved slice). */
  const finishRentRollEditing = useCallback(() => {
    if (editingRowIndex !== null && editDraft !== null) {
      saveEditRow();
    } else {
      setEditingRowIndex(null);
      setEditDraft(null);
    }
    setIsEditingRoll(false);
  }, [editingRowIndex, editDraft, saveEditRow]);

  const cancelEditRow = useCallback(() => {
    setEditingRowIndex(null);
    setEditDraft(null);
  }, []);

  const deleteRowAt = useCallback(
    (ri: number) => {
      if (slice.rows.length <= 1) {
        window.dispatchEvent(
          new CustomEvent("amiio:toast", { detail: { message: "Keep at least one rent roll line." } }),
        );
        return;
      }
      setSlice((s) => ({ ...s, rows: s.rows.filter((_, i) => i !== ri) }));
      if (editingRowIndex === ri) {
        setEditingRowIndex(null);
        setEditDraft(null);
      } else if (editingRowIndex !== null && ri < editingRowIndex) {
        setEditingRowIndex(editingRowIndex - 1);
      }
    },
    [editingRowIndex, setSlice, slice.rows.length],
  );

  const addScenarioRentRow = useCallback(() => {
    const nr = createEmptyScenarioRow();
    const newIndex = slice.rows.length;
    setSlice((s) => ({ ...s, rows: [...s.rows, nr] }));
    setEditingRowIndex(newIndex);
    setEditDraft(nr);
  }, [setSlice, slice.rows.length]);

  return (
    <div className="space-y-6">
      {showScenarioAgent && (
        <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.95)] p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4 shrink-0 text-[#969A9E]" aria-hidden />
            <h2 className="typo-p1-b text-[#2C2C2C]">
              Scenario Agent — Describe changes to apply to the rent roll.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Textarea
                value={agentInput ?? ""}
                onChange={(e) => onAgentInputChange?.(e.target.value)}
                placeholder="e.g. Unit 2 is leased to NewTenant at €20/sqm, 3 months rent-free…"
                rows={2}
                disabled={agentProcessing}
                className="min-h-[72px] resize-y border-[#E6E8EB] bg-white typo-p2-r text-[#353638] placeholder:text-[#969A9E]"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className={cn(CM.tabActive, "h-10 shrink-0 gap-2 rounded-full px-5")}
              disabled={agentProcessing || !(agentInput ?? "").trim()}
              onClick={() => onAgentSend?.()}
            >
              {agentProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Processing…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 shrink-0" aria-hidden />
                  Send
                </>
              )}
            </Button>
          </div>
          {agentResponse ? (
            <div className="mt-4 rounded-lg border border-[#EEF0FF] bg-[#FAFBFF] px-4 py-3 typo-p2-r leading-relaxed text-[#353638]">
              <div className="flex items-start gap-2">
                <AmiioAiDisclaimerTrigger>
                  <button
                    type="button"
                    className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#010309] transition-colors hover:bg-[#E3ECFF]"
                    aria-label="Amiio AI"
                  >
                    <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
                  </button>
                </AmiioAiDisclaimerTrigger>
                <div className="min-w-0 flex-1 whitespace-pre-wrap">{agentResponse}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div
        id="scenario-rent-roll"
        className="rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="typo-h5 text-[#2C2C2C]">Rent Roll</h2>
            {!isEditingRoll && (
              <span className="hidden typo-p3-b text-[#969A9E] sm:inline">
                Double-click to edit cells
              </span>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {showSaveScenario && onSaveScenario ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(CM.btnSecondary, "h-9 border-[#233FDE] text-[#233FDE] hover:bg-[#EEF0FF]")}
                onClick={onSaveScenario}
              >
                <Save className="h-3.5 w-3.5" />
                Save scenario
              </Button>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E8EB] bg-white px-3 py-1.5 typo-p3-b text-[#353638] transition-colors hover:bg-[#F8F9FA]"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", {
                    detail: { message: "As-of date for this scenario roll (placeholder)." },
                  }),
                )
              }
            >
              <CalendarDays className="h-3.5 w-3.5 text-[#969A9E]" />
              Select date
              <ChevronDown className="h-3 w-3 text-[#969A9E]" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (isEditingRoll) {
                  finishRentRollEditing();
                } else {
                  setIsEditingRoll(true);
                }
              }}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1 typo-p3-b transition-colors",
                isEditingRoll
                  ? "bg-[#233FDE] text-white hover:bg-[#1a2fb0]"
                  : "border border-[#E6E8EB] text-[#353638] hover:bg-[#F8F9FA]",
              )}
            >
              {isEditingRoll ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Done editing
                </>
              ) : (
                <>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </>
              )}
            </button>
            <WidgetHeaderLamp
              chatTopic="Analyse the scenario rent roll — occupancy, contract rent, WAULT, CapEx per line, and how totals flow to GRI, NOI, and valuation."
              chatLabel="Rent roll"
            />
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 typo-l2-b text-[#233FDE] transition-colors hover:text-[#1a2fb0]"
            onClick={() => document.getElementById("scenario-rent-roll-table")?.scrollIntoView({ behavior: "smooth" })}
          >
            <ChevronDown className="h-4 w-4" />
            <Plus className="h-3.5 w-3.5" />
            Scenario roll
          </button>
          {isEditingRoll ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={addScenarioRentRow}
                className="flex items-center gap-1 rounded-lg bg-[#1F9E8B] px-3 py-1 typo-p3-b text-white transition-colors hover:bg-[#1a8a79]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add row
              </button>
            </div>
          ) : null}
        </div>

        {isEditingRoll ? (
          <p className={cn("mb-3 max-w-2xl typo-p3-b leading-relaxed text-[#65686B]")}>
            <span className="typo-p3-b text-[#2C2C2C]">Editing mode</span> — click a row to open it, then save or
            cancel. Changes apply to this scenario only and flow to KPIs, valuation, and the 12M view.
          </p>
        ) : null}

        <div
          id="scenario-rent-roll-table"
          className={cn(
            "overflow-x-auto scrollbar-hide rounded-lg transition-all",
            isEditingRoll && "ring-2 ring-[#233FDE]/20",
          )}
        >
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className={CM.rrHead}>
                <th className={CM.rrTh}>Unit</th>
                <th className={CM.rrTh}>Tenant</th>
                <th className={CM.rrTh}>Status</th>
                <th className={CM.rrThRight}>Area (sqm)</th>
                <th className={CM.rrThRight}>Rent / sqm</th>
                <th className={CM.rrThRight}>Monthly</th>
                <th className={CM.rrThRight}>Annual</th>
                <th className={CM.rrTh}>Lease end</th>
                <th className={CM.rrThRight}>
                  <span className="block">WAULT</span>
                  <span className="mt-0.5 block typo-p3-r normal-case tracking-normal text-[#969A9E]">
                    yrs
                  </span>
                </th>
                <th className={CM.rrThRight}>Rent-free (mo)</th>
                <th className={CM.rrThRight}>CapEx</th>
                {isEditingRoll && (
                  <th className={cn(CM.rrTh, "text-center")} aria-label="Row actions" />
                )}
              </tr>
              {isEditingRoll && (
                <tr className="bg-[#EEF0FF]">
                  <th
                    colSpan={colSpanBand}
                    className="px-3 py-1 text-left typo-p3-b text-[#233FDE]"
                  >
                    Editing mode — click a row to edit, or use Add row / save &amp; cancel on the active line
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              <tr className="bg-[#F8F9FA]">
                <td colSpan={colSpanBand} className="px-3 py-2 typo-p3-b text-[#353638]">
                  Portfolio — scenario roll
                </td>
              </tr>
              {slice.rows.map((row, ri) => {
                const monthly = row.status === "occupied" ? row.annualRent / 12 : 0;
                const rps =
                  row.status === "occupied" && row.sqm > 0 ? row.annualRent / row.sqm : null;
                const isOpen = isEditingRoll && editingRowIndex === ri && editDraft;
                const isRowEdit = Boolean(isOpen);

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-[#F2F4F7] transition-colors last:border-b-0",
                      !isEditingRoll && "cursor-pointer hover:bg-[#FAFBFC]",
                      isEditingRoll && !isRowEdit && "cursor-pointer hover:bg-[#EEF0FF]",
                      isRowEdit && "bg-[#EEF0FF]",
                    )}
                    onClick={() => {
                      if (isEditingRoll && !isRowEdit) openEditRow(ri);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      if (isRowEdit) return;
                      if (!isEditingRoll) setIsEditingRoll(true);
                      setEditingRowIndex(ri);
                      setEditDraft({ ...slice.rows[ri] });
                    }}
                  >
                    {isOpen && editDraft ? (
                      <>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            className={scenarioRentEditInput}
                            value={editDraft.unit}
                            onChange={(e) => setEditDraft({ ...editDraft, unit: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            className={scenarioRentEditInput}
                            value={editDraft.tenant}
                            onChange={(e) => setEditDraft({ ...editDraft, tenant: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            className={cn(scenarioRentEditInput, "cursor-pointer")}
                            value={editDraft.status}
                            onChange={(e) => {
                              const st = e.target.value as RentStatus;
                              setEditDraft({
                                ...editDraft,
                                status: st,
                                ...(st === "vacant"
                                  ? { tenant: "—", annualRent: 0, yearsLeft: 0 }
                                  : editDraft.tenant === "—"
                                    ? { tenant: "" }
                                    : {}),
                              });
                            }}
                          >
                            <option value="occupied">Occupied</option>
                            <option value="vacant">Vacant</option>
                          </select>
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            inputMode="numeric"
                            className={cn(scenarioRentEditInput, "text-right tabular-nums")}
                            value={String(editDraft.sqm)}
                            onChange={(e) => {
                              const n = parseFloat(e.target.value.replace(/,/g, ""));
                              if (e.target.value === "" || Number.isFinite(n)) {
                                setEditDraft({ ...editDraft, sqm: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0 });
                              }
                            }}
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right typo-n-default-s text-[#65686B]">
                          {editDraft.status === "occupied" && editDraft.sqm > 0
                            ? (editDraft.annualRent / editDraft.sqm).toFixed(2)
                            : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right typo-n-default-s text-[#65686B]">
                          {editDraft.status === "occupied" ? fmtEur(editDraft.annualRent / 12) : "—"}
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          {editDraft.status === "vacant" ? (
                            <span className="typo-p3-r text-[#969A9E]">—</span>
                          ) : (
                            <input
                              type="text"
                              inputMode="numeric"
                              className={cn(scenarioRentEditInput, "text-right tabular-nums")}
                              value={String(editDraft.annualRent)}
                              onChange={(e) => {
                                const n = parseFloat(e.target.value.replace(/\s/g, "").replace(/,/g, ""));
                                if (e.target.value === "" || Number.isFinite(n)) {
                                  setEditDraft({
                                    ...editDraft,
                                    annualRent: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0,
                                  });
                                }
                              }}
                            />
                          )}
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            className={scenarioRentEditInput}
                            value={editDraft.leaseEnd}
                            onChange={(e) => setEditDraft({ ...editDraft, leaseEnd: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          {editDraft.status === "vacant" ? (
                            <span className="typo-p3-r text-[#969A9E]">—</span>
                          ) : (
                            <input
                              type="text"
                              inputMode="decimal"
                              className={cn(scenarioRentEditInput, "text-right tabular-nums")}
                              value={String(editDraft.yearsLeft)}
                              onChange={(e) => {
                                const n = parseFloat(e.target.value.replace(/,/g, ""));
                                if (e.target.value === "" || Number.isFinite(n)) {
                                  setEditDraft({
                                    ...editDraft,
                                    yearsLeft: Number.isFinite(n) ? Math.round(n * 10) / 10 : 0,
                                  });
                                }
                              }}
                            />
                          )}
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            inputMode="numeric"
                            className={cn(scenarioRentEditInput, "text-right tabular-nums")}
                            value={String(editDraft.rentFreeMonths)}
                            onChange={(e) => {
                              const n = parseInt(e.target.value, 10);
                              if (e.target.value === "" || Number.isFinite(n)) {
                                setEditDraft({
                                  ...editDraft,
                                  rentFreeMonths: Number.isFinite(n) ? Math.max(0, n) : 0,
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            inputMode="numeric"
                            className={cn(scenarioRentEditInput, "text-right tabular-nums")}
                            value={String(editDraft.capex)}
                            onChange={(e) => {
                              const n = parseFloat(e.target.value.replace(/\s/g, "").replace(/,/g, ""));
                              if (e.target.value === "" || Number.isFinite(n)) {
                                setEditDraft({
                                  ...editDraft,
                                  capex: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0,
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={saveEditRow}
                              className="rounded bg-[#1F9E8B] p-1 text-white hover:bg-[#1a8a79]"
                              aria-label="Save row"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditRow}
                              className="rounded bg-[#969A9E] p-1 text-white hover:bg-[#7E8185]"
                              aria-label="Cancel edit"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={cn(CM.rrTd, "whitespace-nowrap")}>{row.unit}</td>
                        <td className={cn(CM.rrTd, "max-w-[180px] truncate")}>{row.tenant}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <span
                            className={cn(
                              "inline-flex min-w-[5.5rem] justify-center rounded-full px-2.5 py-1 typo-p3-b capitalize",
                              row.status === "occupied"
                                ? "bg-[#010309] text-white"
                                : "bg-[#FEE2E2] text-[#DC2626]",
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#353638]",
                            "typo-n-default-s",
                          )}
                        >
                          {row.sqm.toLocaleString("en-IE")}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#65686B]",
                            "typo-n-default-s",
                          )}
                        >
                          {rps != null ? rps.toFixed(2) : "—"}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#65686B]",
                            "typo-n-default-s",
                          )}
                        >
                          {row.status === "occupied" ? fmtEur(monthly) : "—"}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#353638]",
                            "typo-n-default-s",
                          )}
                        >
                          {row.status === "occupied" ? fmtEur(row.annualRent) : "—"}
                        </td>
                        <td className={cn(CM.rrTd, "whitespace-nowrap")}>{row.leaseEnd}</td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#353638]",
                            "typo-n-default-s",
                          )}
                        >
                          {row.status === "occupied" ? `${row.yearsLeft.toFixed(1)}` : "—"}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#353638]",
                            "typo-n-default-s",
                          )}
                        >
                          {row.rentFreeMonths}
                        </td>
                        <td
                          className={cn(
                            "whitespace-nowrap px-3 py-2.5 text-right text-[#353638]",
                            "typo-n-default-s",
                          )}
                        >
                          {fmtEur(row.capex)}
                        </td>
                        {isEditingRoll && (
                          <td className="whitespace-nowrap px-3 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRowAt(ri);
                              }}
                              className="rounded p-1 text-[#9F2D3A] hover:bg-[#FBEAEC]"
                              aria-label="Delete row"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
              <tr className="border-t-2 border-[#E6E8EB] bg-[#FAFBFC]">
                <td colSpan={3} className="px-3 py-2.5 align-top">
                  <span className="block typo-p3-b text-[#2C2C2C]">Total scenario rent roll</span>
                  <span className="mt-0.5 block typo-p3-r text-[#65686B]">Sums for this scenario (after your edits)</span>
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-sectiontotal")}>
                  {totals.totalSqm.toLocaleString("en-IE")}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#65686B]", "typo-n-total")}>
                  {avgRentPerSqm > 0 ? avgRentPerSqm.toFixed(2) : "—"}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-sectiontotal")}>
                  {fmtEur(totals.monthlyRent)}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-sectiontotal")}>
                  {fmtEur(totals.totalRent)}
                </td>
                <td className={cn(CM.rrTd, "typo-n-default-s text-[#969A9E]")}>—</td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-sectiontotal")}>
                  {totals.wault.toFixed(1)} yrs
                </td>
                <td className={cn(CM.rrTd, "typo-n-default-s text-[#969A9E]")}>—</td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-sectiontotal")}>
                  {fmtEur(totals.totalCapex)}
                </td>
                {isEditingRoll && <td className={cn(CM.rrTd, "bg-[#FAFBFC]")} />}
              </tr>
            </tbody>
            <tfoot>
              <tr className={CM.rrFoot}>
                <td colSpan={3} className="px-3 py-2.5 align-top leading-snug">
                  <span className="block typo-p3-b text-[#2C2C2C]">Totals</span>
                  <span className="mt-0.5 block typo-p3-r text-[#65686B]">Original baseline (current rent roll)</span>
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-grandtotal")}>
                  {baselineTotals.totalSqm.toLocaleString("en-IE")}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#65686B]", "typo-n-total")}>
                  {baselineAvgRentPerSqm > 0 ? baselineAvgRentPerSqm.toFixed(2) : "—"}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-grandtotal")}>
                  {fmtEur(baselineTotals.monthlyRent)}
                </td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-grandtotal")}>
                  {fmtEur(baselineTotals.totalRent)}
                </td>
                <td className={cn(CM.rrTd, "typo-n-default-s text-[#969A9E]")}>—</td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-grandtotal")}>
                  {baselineTotals.wault.toFixed(1)} yrs
                </td>
                <td className={cn(CM.rrTd, "typo-n-default-s text-[#969A9E]")}>—</td>
                <td className={cn("px-3 py-2.5 text-right text-[#353638]", "typo-n-grandtotal")}>
                  {fmtEur(baselineTotals.totalCapex)}
                </td>
                {isEditingRoll && <td className={cn(CM.rrTd, "bg-[#F2F4F7]")} />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch xl:grid-cols-4">
        <KpiCard
          title="Gross rental income"
          value={fmtEur(totals.totalRent)}
          sub="Occupied lines, annual"
          infoText="Contract rent summed across occupied units only. Vacant rows contribute area toward occupancy but not GRI."
        />
        <KpiCard
          title="Operating expenses"
          value={fmtEur(opexAnnual)}
          sub={`Model ${(OPEX_RATIO * 100).toFixed(0)}% of GRI`}
          infoText={`Indicative opex loaded as ${(OPEX_RATIO * 100).toFixed(0)}% of gross rental income for quick scenarios — replace with detailed budget in a full underwriting pack.`}
        />
        <KpiCard
          title="Net operating income"
          value={fmtEur(noi)}
          sub="GRI less model opex"
          infoText="NOI is implied from gross rental income less the model opex ratio; it drives cap-rate valuation and the 12M table."
        />
        <KpiCard
          title="Net initial yield"
          value={`${niyPct.toFixed(2)}%`}
          sub="NOI ÷ estimated value"
          infoText="Going-in yield on the estimated value from the cap-rate slider (same numerator/denominator relationship as cap rate in this model)."
        />
        <KpiCard
          title="Return on equity"
          value={`${roePct.toFixed(2)}%`}
          sub={`Equity ≈ ${(PL_ASSUMED_EQUITY_PCT * 100).toFixed(0)}% of value (model)`}
          infoText="Indicative ROE using net cash flow from the 12M model and assumed equity as a fixed share of estimated value — not a formal fund return."
        />
        <KpiCard
          title="Cash on cash"
          value={`${cocPct.toFixed(2)}%`}
          sub="Same basis as ROE in this demo"
          infoText="Cash-on-cash return is shown on the same simplified cash and equity basis as ROE for side-by-side VO-style monitoring."
        />
        <KpiCard
          title="WAULT"
          value={`${totals.wault.toFixed(1)} yrs`}
          sub="Rent-weighted average"
          infoText="Rent-weighted average unexpired lease term on occupied lines (same basis as the rent roll total row)."
        />
        <KpiCard
          title="Occupancy"
          value={`${totals.occupancyPct.toFixed(2)}%`}
          sub="Occupied area ÷ total area"
          infoText="Physical occupancy by lettable area. Toggle a row to vacant to exclude its rent from GRI while keeping its sqm in the denominator."
        />
      </div>

      <div className={CM.innerWidget}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="typo-h5 text-[#2C2C2C]">Cap rate &amp; valuation</h3>
          <WidgetHeaderLamp
            chatTopic="Cap rate and valuation: implied NOI from the scenario rent roll (GRI less model opex) divided by the cap-rate slider for indicative value. Use 2–12% to stress the exit yield; compare to KPIs and the 12M view."
            chatLabel="Cap rate & valuation"
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-end lg:gap-8">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="w-full max-w-[682px]">
              <div className="flex items-center justify-between gap-4">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        className="typo-l3-b cursor-help uppercase tracking-wider text-[#969A9E] underline decoration-dotted decoration-[#C5C8CC] underline-offset-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE] focus-visible:ring-offset-2"
                      >
                        Cap rate
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px] text-left typo-p3-b leading-snug text-[#353638]">
                      Exit yield used for a quick valuation: implied NOI from this rent roll (after model opex) divided
                      by this rate. Drag between 2% and 12% to stress-test; pair with KPIs and the 12M table.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span
                  className={cn(
                    CM.pillDark,
                    "typo-n-total-s shrink-0 tabular-nums",
                  )}
                >
                  {slice.capRatePct.toFixed(2)}%
                </span>
              </div>
              <div className="px-1 pt-4">
                <Slider
                  value={[slice.capRatePct]}
                  min={2}
                  max={12}
                  step={0.05}
                  onValueChange={([v]) => setSlice((s) => ({ ...s, capRatePct: v }))}
                  className="w-full py-3 [&>span:first-of-type]:h-3"
                />
                <div className="mt-3 flex justify-between typo-p3-b text-[#969A9E]">
                  <span>2%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-start lg:justify-end">
            <div className="w-full max-w-[280px] rounded-xl border border-[#E6E8EB] bg-[#FBFBFB] px-4 py-4 lg:py-5">
              <div className="typo-l3-b uppercase tracking-wider text-[#969A9E]">Estimated value</div>
              <div className="mt-2 typo-h4 tabular-nums text-[#2C2C2C]">{fmtEur(indicativeValue)}</div>
              <p className="mt-1.5 typo-p3-b text-[#65686B]">
                <span className="typo-n-default-s tabular-nums text-[#65686B]">
                  NOI {fmtEur(noi)} / {slice.capRatePct.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <RollingPl12mTable gri={totals.totalRent} noi={noi} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel                                                              */
/* ------------------------------------------------------------------ */

function buildComparisonRemarks(
  id: string,
  baselineId: string,
  sc: ScenarioSlice,
  baselineSlice: ScenarioSlice,
  baselineTotals: ReturnType<typeof computeTotals>,
  t: ReturnType<typeof computeTotals>,
  n: number,
  baselineNoi: number,
  val: number,
  baselineVal: number,
): string {
  if (id === baselineId) {
    return "Current rent roll — reference state. Other rows compare to this roll, cap rate, and implied NOI from GRI.";
  }
  const byId = new Map(sc.rows.map((r) => [r.id, r]));
  const lineDeltas: string[] = [];
  for (const br of baselineSlice.rows) {
    const r = byId.get(br.id);
    if (!r) continue;
    if (r.annualRent !== br.annualRent) {
      const d = r.annualRent - br.annualRent;
      lineDeltas.push(
        `${r.unit}: contract rent ${d > 0 ? "higher" : "lower"} by ${fmtEur(Math.abs(d))}/yr`,
      );
    }
    if (Math.abs(r.yearsLeft - br.yearsLeft) > 0.05) {
      const d = r.yearsLeft - br.yearsLeft;
      lineDeltas.push(`${r.unit}: WAULT ${d > 0 ? "+" : ""}${d.toFixed(1)} yrs`);
    }
    if (r.sqm !== br.sqm) {
      lineDeltas.push(`${r.unit}: area ${r.sqm > br.sqm ? "+" : ""}${r.sqm - br.sqm} sqm`);
    }
    if (r.status !== br.status) {
      lineDeltas.push(`${r.unit}: ${br.status} → ${r.status}`);
    }
    if (r.capex !== br.capex) {
      const d = r.capex - br.capex;
      lineDeltas.push(`${r.unit}: CapEx ${d > 0 ? "+" : "−"}${fmtEur(Math.abs(d))}`);
    }
  }
  const sentences: string[] = [];
  if (lineDeltas.length) {
    sentences.push(lineDeltas.slice(0, 4).join(". ") + (lineDeltas.length > 4 ? " …" : ""));
  }
  const dGri =
    baselineTotals.totalRent > 0
      ? ((t.totalRent - baselineTotals.totalRent) / baselineTotals.totalRent) * 100
      : 0;
  if (Math.abs(dGri) > 0.02) {
    sentences.push(`Portfolio contract rent (GRI) is ${fmtPct(dGri)} vs base / current.`);
  }
  const dWault = t.wault - baselineTotals.wault;
  const waultInLines = lineDeltas.some((l) => l.includes("WAULT"));
  if (Math.abs(dWault) > 0.02 && !waultInLines) {
    sentences.push(`Rent-weighted average WAULT is ${dWault >= 0 ? "+" : ""}${dWault.toFixed(2)} yrs vs base.`);
  }
  const dNoi = baselineNoi > 0 ? ((n - baselineNoi) / baselineNoi) * 100 : 0;
  if (Math.abs(dNoi) > 0.05) {
    sentences.push(`Implied NOI is ${fmtPct(dNoi)} vs base / current.`);
  }
  if (Math.abs(sc.capRatePct - baselineSlice.capRatePct) > 0.01) {
    sentences.push(
      `Cap rate ${sc.capRatePct.toFixed(2)}% vs ${baselineSlice.capRatePct.toFixed(2)}% on base.`,
    );
  }
  const dVal = baselineVal > 0 ? ((val - baselineVal) / baselineVal) * 100 : 0;
  if (Math.abs(dVal) > 0.05 && Math.abs(dNoi) <= 0.05 && Math.abs(dGri) <= 0.02) {
    sentences.push(`Indicative value moves ${fmtPct(dVal)} vs base (mainly cap).`);
  }
  return sentences.length
    ? sentences.join(" ")
    : "No material change vs base / current on rent roll, cap, or NOI.";
}

function initialScenarioList(): ScenarioEntry[] {
  const seed = voBaseRows();
  const t = Date.now();
  return [
    {
      id: "base",
      name: "Current rent roll",
      slice: { capRatePct: 5.5, rows: cloneRows(seed) },
      createdAt: t,
      updatedAt: t,
      isBase: true,
      persisted: true,
    },
  ];
}

function buildMockAgentResponse(prompt: string): string {
  const t = prompt.trim().slice(0, 280);
  return `Here's a quick read on your request:\n\n"${t}"\n\n• This demo does not auto-edit the rent roll from natural language.\n• Name units, tenants, and €/sqm or annual rent so a future agent can map edits cleanly.\n• Use Rent roll → Edit to apply numbers, then Save scenario to store this case in All scenarios.`;
}

export function ScenarioForecastingPanel() {
  const [scenarioList, setScenarioList] = useState<ScenarioEntry[]>(initialScenarioList);

  const [activeTab, setActiveTab] = useState<TabKey>("base");
  /** Scenario last opened in the full editor (for status on the All scenarios table). */
  const [lastEditorScenarioId, setLastEditorScenarioId] = useState<string>("base");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [agentState, setAgentState] = useState<Record<string, ScenarioAgentState>>({});

  useEffect(() => {
    if (activeTab !== "comparison" && activeTab !== ALL_SCENARIOS_TAB) {
      setLastEditorScenarioId(activeTab);
    }
  }, [activeTab]);

  const baselineEntry = useMemo(
    () => scenarioList.find((e) => e.isBase) ?? scenarioList[0],
    [scenarioList],
  );

  const persistedScenarios = useMemo(
    () => scenarioList.filter((e) => e.persisted),
    [scenarioList],
  );

  const tabStripEntries = useMemo(() => {
    const base = scenarioList.find((s) => s.isBase);
    const drafts = scenarioList.filter((s) => !s.isBase && !s.persisted);
    const out: ScenarioEntry[] = [];
    if (base) out.push(base);
    out.push(...drafts);
    const viewingSaved = scenarioList.find(
      (s) => s.id === activeTab && s.persisted && !s.isBase,
    );
    if (viewingSaved && !out.some((s) => s.id === viewingSaved.id)) {
      out.push(viewingSaved);
    }
    return out;
  }, [scenarioList, activeTab]);

  const baselineTotals = useMemo(
    () => computeTotals(baselineEntry?.slice.rows ?? []),
    [baselineEntry?.slice.rows],
  );

  const comparisonRows = useMemo(() => {
    if (!baselineEntry) return [];
    const baselineSlice = baselineEntry.slice;
    const baselineNoi = baselineTotals.impliedNoi;
    const baselineVal = baselineNoi / Math.max(baselineSlice.capRatePct / 100, 0.0001);
    return persistedScenarios.map((entry) => {
      const sc = entry.slice;
      const t = computeTotals(sc.rows);
      const n = t.impliedNoi;
      const c = Math.max(sc.capRatePct / 100, 0.0001);
      const val = n / c;
      const remarks = buildComparisonRemarks(
        entry.id,
        baselineEntry.id,
        sc,
        baselineSlice,
        baselineTotals,
        t,
        n,
        baselineNoi,
        val,
        baselineVal,
      );
      return {
        id: entry.id,
        label: entry.name,
        noi: n,
        wault: t.wault,
        value: val,
        totalRent: t.totalRent,
        remarks,
      };
    });
  }, [persistedScenarios, baselineTotals, baselineEntry]);

  const scenarioLibraryRows = useMemo(() => {
    return scenarioList
      .filter((entry) => !entry.isBase && entry.persisted)
      .map((entry) => {
      const t = computeTotals(entry.slice.rows);
      const n = t.impliedNoi;
      const c = Math.max(entry.slice.capRatePct / 100, 0.0001);
      const estValue = n / c;
      const isLiveEditor = activeTab === entry.id;
      const isRecent =
        activeTab === ALL_SCENARIOS_TAB && lastEditorScenarioId === entry.id;
      let statusLabel: string;
      let statusVariant: "open" | "recent" | "saved";
      if (isLiveEditor) {
        statusLabel = "Open";
        statusVariant = "open";
      } else if (isRecent) {
        statusLabel = "Recent";
        statusVariant = "recent";
      } else {
        statusLabel = "Saved";
        statusVariant = "saved";
      }
      return {
        entry,
        estValue,
        statusLabel,
        statusVariant,
        updatedAt: entry.updatedAt,
      };
    });
  }, [scenarioList, activeTab, lastEditorScenarioId]);

  const setScenarioSlice = useCallback(
    (id: string, next: ScenarioSlice | ((prev: ScenarioSlice) => ScenarioSlice)) => {
      const now = Date.now();
      setScenarioList((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                slice: typeof next === "function" ? next(e.slice) : next,
                updatedAt: now,
              }
            : e,
        ),
      );
    },
    [],
  );

  const addScenario = useCallback(() => {
    const fromTab =
      activeTab !== "comparison" && activeTab !== ALL_SCENARIOS_TAB
        ? scenarioList.find((e) => e.id === activeTab)
        : null;
    const source = fromTab?.slice ?? scenarioList.find((e) => e.isBase)?.slice;
    if (!source) return;
    const nid = `draft-${Date.now()}`;
    const now = Date.now();
    setScenarioList((prev) => {
      const nonBase = prev.filter((s) => !s.isBase).length;
      return [
        ...prev,
        {
          id: nid,
          name: `Scenario ${nonBase + 1}`,
          slice: deepCloneScenario(source),
          createdAt: now,
          updatedAt: now,
          isBase: false,
          persisted: false,
        },
      ];
    });
    setAgentState((prev) => ({
      ...prev,
      [nid]: { input: "", processing: false, response: "" },
    }));
    setActiveTab(nid);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: {
          message: "Draft scenario opened — describe changes to the agent, edit the roll, then Save scenario.",
        },
      }),
    );
  }, [activeTab, scenarioList]);

  const handleCloseDraft = useCallback((draftId: string, e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setScenarioList((prev) => {
      const entry = prev.find((x) => x.id === draftId);
      if (!entry || entry.isBase || entry.persisted) return prev;
      return prev.filter((x) => x.id !== draftId);
    });
    setAgentState((prev) => {
      const next = { ...prev };
      delete next[draftId];
      return next;
    });
    setActiveTab((tab) => (tab === draftId ? "base" : tab));
  }, []);

  const handleSaveDraft = useCallback(() => {
    const id = activeTab;
    if (id === "comparison" || id === ALL_SCENARIOS_TAB) return;
    setScenarioList((prev) => {
      const entry = prev.find((x) => x.id === id);
      if (!entry || entry.isBase || entry.persisted) return prev;
      const now = Date.now();
      return prev.map((x) => (x.id === id ? { ...x, persisted: true, updatedAt: now } : x));
    });
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: "Scenario saved — it now appears in All scenarios." },
      }),
    );
  }, [activeTab]);

  const handleAgentInput = useCallback((draftId: string, value: string) => {
    setAgentState((prev) => ({
      ...prev,
      [draftId]: {
        input: value,
        processing: prev[draftId]?.processing ?? false,
        response: prev[draftId]?.response ?? "",
      },
    }));
  }, []);

  const handleAgentSend = useCallback((draftId: string) => {
    setAgentState((prev) => {
      const st = prev[draftId] ?? { input: "", processing: false, response: "" };
      if (!st.input.trim() || st.processing) return prev;
      const prompt = st.input.trim();
      window.setTimeout(() => {
        setAgentState((p2) => ({
          ...p2,
          [draftId]: {
            input: p2[draftId]?.input ?? "",
            processing: false,
            response: buildMockAgentResponse(prompt),
          },
        }));
      }, 900);
      return { ...prev, [draftId]: { ...st, processing: true } };
    });
  }, []);

  const beginRename = useCallback(
    (id: string) => {
      const entry = scenarioList.find((e) => e.id === id);
      if (!entry) return;
      setRenaming(id);
      setRenameDraft(entry.name);
    },
    [scenarioList],
  );

  const commitRename = useCallback(() => {
    if (!renaming) return;
    const t = renameDraft.trim();
    if (t) {
      const now = Date.now();
      setScenarioList((prev) =>
        prev.map((e) => (e.id === renaming ? { ...e, name: t, updatedAt: now } : e)),
      );
    }
    setRenaming(null);
  }, [renaming, renameDraft]);

  const exportExcel = useCallback(() => {
    const sheets: { name: string; columns: string[]; rows: (string | number)[][] }[] = [
      {
        name: "Comparison",
        columns: [
          "Scenario",
          "GRI (€)",
          "NOI (€)",
          "WAULT (y)",
          "Est. value (€)",
          "Remarks vs base / current",
        ],
        rows: comparisonRows.map((r) => [
          r.label,
          r.totalRent,
          Math.round(r.noi),
          Number(r.wault.toFixed(2)),
          Math.round(r.value),
          r.remarks,
        ]),
      },
    ];
    for (const entry of scenarioList.filter((e) => e.persisted)) {
      const sc = entry.slice;
      const label = entry.name.slice(0, 20);
      sheets.push({
        name: `RR ${label}`.slice(0, 31),
        columns: [
          "Unit",
          "Tenant",
          "Status",
          "Area (sqm)",
          "Rent/sqm",
          "Monthly (€)",
          "Annual (€)",
          "Lease end",
          "WAULT (yrs)",
          "Rent-free (mo)",
          "CapEx (€)",
        ],
        rows: sc.rows.map((row) => {
          const rps =
            row.status === "occupied" && row.sqm > 0 ? row.annualRent / row.sqm : "";
          const mon = row.status === "occupied" ? Math.round(row.annualRent / 12) : 0;
          return [
            row.unit,
            row.tenant,
            row.status,
            row.sqm,
            rps === "" ? "" : Number(rps.toFixed(4)),
            mon,
            row.annualRent,
            row.leaseEnd,
            Number(row.yearsLeft.toFixed(2)),
            row.rentFreeMonths,
            row.capex,
          ];
        }),
      });
      const t = computeTotals(sc.rows);
      const n = t.impliedNoi;
      const pl = computePl12m(t.totalRent, n);
      const plLineItems: [string, number][] = [
        ["Gross rental income", pl.gri],
        [`Operating expenses (${(OPEX_RATIO * 100).toFixed(0)}%)`, -pl.opex],
        ["Net operating income (NOI)", pl.noi],
        ["Financing costs", -pl.financingCosts],
        ["Depreciation", -pl.depreciation],
        ["Result before tax", pl.resultBeforeTax],
        ["Distributions", -pl.distributions],
        ["Loan repayment", -pl.loanRepayment],
        ["CapEx", -pl.capexReserve],
        ["Net cash flow", pl.netCashFlow],
      ];
      const plExportRows = plLineItems.map(([lineLabel, amount]) => {
        const per = monthlyAmount(amount);
        return [lineLabel, ...MONTH_LABELS.map(() => Math.round(per)), Math.round(amount)] as (string | number)[];
      });
      sheets.push({
        name: `12M PL ${label}`.slice(0, 31),
        columns: ["Line item", ...MONTH_LABELS, "Total (€)"],
        rows: plExportRows,
      });
    }
    downloadExcelWorkbook(sheets, "scenario-forecast-comparison");
    window.dispatchEvent(
      new CustomEvent("amiio:toast", { detail: { message: "Exported scenario workbook (.xlsx)" } }),
    );
  }, [comparisonRows, scenarioList]);

  const saveJson = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      scenarios: scenarioList
        .filter((e) => e.persisted)
        .map((e) => ({
          id: e.id,
          name: e.name,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          slice: deepCloneScenario(e.slice),
        })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scenario-comparison-snapshot.json";
    a.click();
    URL.revokeObjectURL(url);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", { detail: { message: "Saved comparison snapshot (JSON)" } }),
    );
  }, [scenarioList]);

  const comparisonTable = (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className={CM.rrHead}>
            {(["Scenario", "GRI", "NOI", "WAULT", "Est. value", "Remarks vs base / current"] as const).map(
              (h) => (
                <th key={h} className={h === "Scenario" || h === "Remarks vs base / current" ? CM.rrTh : CM.rrThRight}>
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((r) => (
            <tr key={r.id} className={CM.rrRow}>
              <td className={cn(CM.rrTd, "typo-p3-b text-[#2C2C2C]")}>{r.label}</td>
              <td className={cn(CM.rrTd, "typo-n-default text-right text-[#65686B]")}>{fmtEur(r.totalRent)}</td>
              <td className={cn(CM.rrTd, "typo-n-default text-right text-[#353638]")}>{fmtEur(r.noi)}</td>
              <td className={cn(CM.rrTd, "typo-n-default text-right text-[#353638]")}>
                {r.wault.toFixed(2)}y
              </td>
              <td className={cn(CM.rrTd, "typo-n-total text-right text-[#353638]")}>{fmtEur(r.value)}</td>
              <td className={cn(CM.rrTd, "max-w-[min(100vw-2rem,480px)] align-top leading-snug typo-p3-r text-[#65686B]")}>
                {r.remarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const activeScenario =
    activeTab !== ALL_SCENARIOS_TAB && activeTab !== "comparison"
      ? scenarioList.find((e) => e.id === activeTab)
      : undefined;

  const showDraftSave =
    Boolean(activeScenario && !activeScenario.isBase && !activeScenario.persisted);

  const draftAgent =
    showDraftSave && activeScenario
      ? (agentState[activeScenario.id] ?? { input: "", processing: false, response: "" })
      : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" size="sm" className={CM.btnSecondary} onClick={exportExcel}>
          <Download className="h-3.5 w-3.5 text-[#969A9E]" />
          Export Excel
        </Button>
        <Button type="button" variant="outline" size="sm" className={CM.btnSecondary} onClick={saveJson}>
          <Save className="h-3.5 w-3.5 text-[#969A9E]" />
          Save comparison
        </Button>
      </div>

      <div className={CM.widgetShell}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Scenario views"
          >
            {tabStripEntries.map((entry) => {
              const showClose = !entry.isBase && !entry.persisted;
              return (
                <div key={entry.id} className="relative flex min-w-0 items-stretch">
                  {renaming === entry.id ? (
                    <Input
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenaming(null);
                      }}
                      className="h-9 min-w-[6rem] rounded-full border-[#E6E8EB] px-3 typo-p2-b text-[#353638]"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === entry.id}
                        onClick={() => setActiveTab(entry.id)}
                        onDoubleClick={() => beginRename(entry.id)}
                        title="Double-click to rename"
                        className={cn(
                          "inline-flex max-w-[200px] items-center gap-1.5 truncate",
                          activeTab === entry.id ? CM.tabActive : CM.tabInactive,
                          showClose && "rounded-r-none pr-2",
                        )}
                      >
                        {entry.isBase ? (
                          <Building2 className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                        ) : (
                          <Layers className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                        )}
                        <span className="truncate">{entry.name}</span>
                      </button>
                      {showClose ? (
                        <button
                          type="button"
                          aria-label={`Close draft ${entry.name}`}
                          onClick={(e) => handleCloseDraft(entry.id, e)}
                          className={cn(
                            "flex h-[36px] shrink-0 items-center rounded-r-full border border-l-0 px-2 transition-colors",
                            activeTab === entry.id
                              ? "border-[#010309] bg-[#010309] text-white hover:bg-[#1a1d24]"
                              : "border-transparent text-[#969A9E] hover:bg-[#F2F4F7] hover:text-[#353638]",
                          )}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === ALL_SCENARIOS_TAB}
              onClick={() => setActiveTab(ALL_SCENARIOS_TAB)}
              className={activeTab === ALL_SCENARIOS_TAB ? CM.tabActive : CM.tabInactive}
            >
              All scenarios
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "comparison"}
              onClick={() => setActiveTab("comparison")}
              className={activeTab === "comparison" ? CM.tabActive : CM.tabInactive}
            >
              Comparison
            </button>
          </div>
          <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
            <Button
              type="button"
              size="sm"
              className={cn(
                CM.tabActive,
                "h-8 gap-1 rounded-full px-3 typo-p3-b leading-[1.25] [&_svg]:size-3.5",
              )}
              onClick={addScenario}
            >
              <Plus className="shrink-0" />
              Create scenario
            </Button>
            {showDraftSave ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(CM.btnSecondary, "h-9 shrink-0 border-[#233FDE] text-[#233FDE] hover:bg-[#EEF0FF]")}
                onClick={handleSaveDraft}
              >
                <Save className="h-3.5 w-3.5" />
                Save scenario
              </Button>
            ) : null}
          </div>
        </div>

        <div role="tabpanel">
          {activeTab === "comparison" ? (
            <div className="space-y-4">
              <div className={CM.widgetTitle}>Cross-scenario comparison</div>
              {comparisonTable}
            </div>
          ) : activeTab === ALL_SCENARIOS_TAB ? (
            <div className="space-y-4">
              <div>
                <div className={CM.widgetTitle}>All scenarios</div>
                <p className={cn("mt-1 max-w-2xl", CM.pageLead)}>
                  Saved scenarios appear here after you use Save scenario on a draft. Click a row to open it in the
                  editor (current rent roll stays available as the baseline tab).
                </p>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr className={CM.rrHead}>
                      <th className={CM.rrTh}>Status</th>
                      <th className={CM.rrTh}>Name</th>
                      <th className={CM.rrTh}>Last updated</th>
                      <th className={CM.rrThRight}>Result (est. value)</th>
                      <th className={cn(CM.rrThRight, "w-10")} aria-hidden />
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioLibraryRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-10 text-center typo-p2-b text-[#65686B]">
                          No saved scenarios yet. Create a scenario, then use Save scenario to add it here.
                        </td>
                      </tr>
                    ) : (
                      scenarioLibraryRows.map((row) => (
                        <tr
                          key={row.entry.id}
                          role="button"
                          tabIndex={0}
                          className={cn(
                            "cursor-pointer border-b border-[#F2F4F7] transition-colors last:border-b-0",
                            "hover:bg-[#FAFBFC] focus-visible:bg-[#EEF0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/30",
                          )}
                          onClick={() => setActiveTab(row.entry.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveTab(row.entry.id);
                            }
                          }}
                          aria-label={`Open scenario ${row.entry.name}`}
                        >
                          <td className="px-3 py-2.5">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-0.5 typo-l3-b uppercase tracking-wide",
                                row.statusVariant === "open" && "bg-[#010309] text-white",
                                row.statusVariant === "recent" &&
                                  "border border-[#233FDE] bg-[#EEF0FF] text-[#233FDE]",
                                row.statusVariant === "saved" &&
                                  "border border-[#E6E8EB] bg-white text-[#65686B]",
                              )}
                            >
                              {row.statusLabel}
                            </span>
                          </td>
                          <td className={cn(CM.rrTd, "typo-p3-b text-[#2C2C2C]")}>{row.entry.name}</td>
                          <td className={cn(CM.rrTd, "typo-n-default-s text-[#65686B]")}>
                            {formatScenarioDateTime(row.updatedAt)}
                          </td>
                          <td className={cn(CM.rrTd, "typo-n-total text-right text-[#353638]")}>
                            {fmtEur(row.estValue)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-[#969A9E]">
                            <ChevronRight className="ml-auto h-4 w-4" aria-hidden />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeScenario ? (
            <ScenarioSlicePanel
              scenarioId={activeScenario.id}
              slice={activeScenario.slice}
              setSlice={(next) => setScenarioSlice(activeScenario.id, next)}
              baselineTotals={baselineTotals}
              showScenarioAgent={showDraftSave}
              agentInput={draftAgent?.input}
              agentProcessing={draftAgent?.processing}
              agentResponse={draftAgent?.response}
              onAgentInputChange={
                showDraftSave ? (v) => handleAgentInput(activeScenario.id, v) : undefined
              }
              onAgentSend={showDraftSave ? () => handleAgentSend(activeScenario.id) : undefined}
              showSaveScenario={showDraftSave}
              onSaveScenario={showDraftSave ? handleSaveDraft : undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
