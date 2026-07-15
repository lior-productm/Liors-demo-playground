"use client";

import { useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ExternalLink,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  Lightbulb,
  Mail,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { dsChartCard, dsFinTypo } from "@/src/lib/designSystem";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";

const DS_CARD = `${dsChartCard} ds-card-gradient shadow-[0px_2px_12px_rgba(0,0,0,0.04)]`;

function fmtEuroAmount(n: number) {
  return `€ ${n.toLocaleString("de-DE")}`;
}

function fmtVariance(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}${fmtEuroAmount(Math.abs(n))}`;
}

function AnalyseWithAmiioButton({ topic }: { topic: string }) {
  const inject = useCommercialChatInject();
  const onClick = useCallback(() => {
    const prompt = `Budgeting — Analyse with Amiio:\n\n${topic}`;
    if (inject) inject(prompt);
    else
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Open chat to analyse with Amiio" },
        }),
      );
  }, [inject, topic]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border border-[#D1D5D9] bg-white px-3.5 shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]",
        dsFinTypo.analyseBtn,
      )}
    >
      <Lightbulb className="size-4 shrink-0 text-[#7E8185]" strokeWidth={1.8} />
      Analyse with Amiio
    </button>
  );
}

const KPI_ITEMS: {
  title: string;
  value: string;
  sub: string;
  subTone?: "success" | "muted";
}[] = [
  { title: "Annual Budget", value: fmtEuroAmount(1_804_000), sub: "FY 2026", subTone: "muted" },
  {
    title: "YTD Actual",
    value: fmtEuroAmount(451_197),
    sub: "+0.04% vs budget",
    subTone: "success",
  },
  {
    title: "Remaining Budget",
    value: fmtEuroAmount(1_352_803),
    sub: "75% remaining",
    subTone: "muted",
  },
  {
    title: "Forecast Variance",
    value: `+${fmtEuroAmount(12_400)}`,
    sub: "0.7% favorable",
    subTone: "success",
  },
];

const BUDGET_CATEGORIES: {
  id: string;
  name: string;
  actual: number;
  budget: number;
  utilizedPct: number;
  detail: string;
}[] = [
  {
    id: "rental",
    name: "Rental Income",
    actual: 413_697,
    budget: 1_655_400,
    utilizedPct: 25,
    detail:
      "Rental income is tracking in line with FY profile after indexation and one short vacancy in Q1. Amiio can stress renewal probability for the top three expiries.",
  },
  {
    id: "sc",
    name: "Service Charges",
    actual: 37_500,
    budget: 144_000,
    utilizedPct: 26,
    detail:
      "Service charge recovery is slightly ahead of seasonal curve due to utilities true-up invoices posted early.",
  },
  {
    id: "opex",
    name: "Operating Expenses",
    actual: 29_103,
    budget: 117_200,
    utilizedPct: 25,
    detail:
      "OPEX reflects property management fees and insurance renewals; no material one-offs flagged versus budget phasing.",
  },
  {
    id: "capex",
    name: "Capital Expenditure",
    actual: 0,
    budget: 280_000,
    utilizedPct: 0,
    detail:
      "No capex drawdowns booked yet; approved projects are scheduled from Q2. Monitor commitment timing vs covenant reporting.",
  },
];

type MonthRow = {
  month: string;
  budget: number;
  actual: number | null;
  variance: number | null;
  status: "complete" | "pending";
};

type MonthRowEdit = {
  month: string;
  budget: string;
  actual: string;
};

const MONTHLY_ROWS: MonthRow[] = [
  { month: "January 2026", budget: 150_333, actual: 150_399, variance: 66, status: "complete" },
  { month: "February 2026", budget: 150_333, actual: 149_820, variance: -513, status: "complete" },
  { month: "March 2026", budget: 150_334, actual: 150_978, variance: 644, status: "complete" },
  { month: "April 2026", budget: 150_333, actual: null, variance: null, status: "pending" },
];

function toMoneyInputValue(n: number | null) {
  return n == null ? "" : String(n);
}

function sanitizeMoneyInput(value: string) {
  return value.replace(/[^0-9.-]/g, "");
}

function parseMoneyInput(value: string): number | null {
  const clean = sanitizeMoneyInput(value).trim();
  if (!clean) return null;
  const parsed = Number(clean);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed);
}

const BUDGET_INPUT_SOURCES: {
  id: string;
  title: string;
  date: string;
  icon: LucideIcon;
  iconBg: string;
  detail: string;
}[] = [
  {
    id: "b1",
    title: "Budget 2026.xlsx",
    date: "Dec 15, 2025",
    icon: FileSpreadsheet,
    iconBg: "bg-[#E6F6F3] text-[#146B3A]",
    detail: "Board-approved FY 2026 budget workbook with phasing by cost centre and property.",
  },
  {
    id: "b2",
    title: "Budget Approval",
    date: "Dec 20, 2025",
    icon: Mail,
    iconBg: "bg-[#D3E8FA] text-[#1A4D8C]",
    detail: "Email chain confirming IC sign-off and variance thresholds for quarterly reforecast.",
  },
  {
    id: "b3",
    title: "AM Note: Q1 Review",
    date: "Mar 5, 2026",
    icon: FileText,
    iconBg: "bg-[#EDE9F7] text-[#5B4B8A]",
    detail: "Asset management narrative on Q1 performance vs budget and drivers for the next reforecast.",
  },
  {
    id: "b4",
    title: "PM Budget Meeting",
    date: "Feb 10, 2026",
    icon: MessageSquare,
    iconBg: "bg-[#FBF2DC] text-[#B07D12]",
    detail: "Notes from property management budget alignment — opex and capex timing for H1.",
  },
];

export function FinancialBudgetingPanel() {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);
  const [monthlyRows, setMonthlyRows] = useState<MonthRow[]>(MONTHLY_ROWS);
  const [isBudgetEditMode, setIsBudgetEditMode] = useState(false);
  const [monthlyRowEdits, setMonthlyRowEdits] = useState<MonthRowEdit[]>([]);

  const startMonthlyBudgetEdit = () => {
    setMonthlyRowEdits(
      monthlyRows.map((row) => ({
        month: row.month,
        budget: toMoneyInputValue(row.budget),
        actual: toMoneyInputValue(row.actual),
      })),
    );
    setIsBudgetEditMode(true);
  };

  const cancelMonthlyBudgetEdit = () => {
    setIsBudgetEditMode(false);
    setMonthlyRowEdits([]);
  };

  const saveMonthlyBudgetEdit = () => {
    const editsByMonth = new Map(monthlyRowEdits.map((row) => [row.month, row]));
    setMonthlyRows((prev) =>
      prev.map((row) => {
        const edit = editsByMonth.get(row.month);
        if (!edit) return row;
        const parsedBudget = parseMoneyInput(edit.budget);
        const parsedActual = parseMoneyInput(edit.actual);
        const nextBudget = parsedBudget ?? row.budget;
        const nextActual = parsedActual;
        return {
          ...row,
          budget: nextBudget,
          actual: nextActual,
          variance: nextActual == null ? null : nextActual - nextBudget,
          status: nextActual == null ? "pending" : "complete",
        };
      }),
    );
    setIsBudgetEditMode(false);
    setMonthlyRowEdits([]);
  };

  const updateMonthlyBudgetEdit = (month: string, field: "budget" | "actual", value: string) => {
    setMonthlyRowEdits((prev) =>
      prev.map((row) => (row.month === month ? { ...row, [field]: sanitizeMoneyInput(value) } : row)),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#010309] px-3.5 shadow-[0px_2px_8px_rgba(1,3,9,0.2)] transition-colors hover:bg-[#040718]",
            dsFinTypo.btnPrimary,
          )}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: "Budgeting actions" } }),
            )
          }
        >
          <MoreVertical className="size-4 opacity-90" strokeWidth={2} />
          Actions
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_ITEMS.map((k) => (
          <div
            key={k.title}
            className={cn(
              "rounded-2xl border border-[rgba(230,231,232,0.85)] bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.04)]",
              amiioCardHoverSurface,
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className={dsFinTypo.kpiLabel}>{k.title}</p>
              <WidgetHeaderLamp
                chatLabel={k.title}
                chatTopic={`Analyse ${k.title} in budget context.`}
              />
            </div>
            <p className={cn("mt-2", dsFinTypo.kpiValue)}>
              {k.value}
            </p>
            <p
              className={cn(
                "mt-1",
                dsFinTypo.kpiSubMuted,
                k.subTone === "success" ? "text-[#146B3A]" : "text-[#969A9E]",
              )}
            >
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      <div className={cn(DS_CARD, "p-6")}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h3 className={dsFinTypo.sectionTitle}>Budget vs Actual by Category</h3>
          <WidgetHeaderLamp
            chatLabel="Budget vs actual by category"
            chatTopic="Compare YTD actuals to annual budget by category and explain utilization and phasing."
          />
        </div>
        <div className="flex flex-col gap-5">
          {BUDGET_CATEGORIES.map((c) => {
            const open = expandedCategoryId === c.id;
            return (
              <div key={c.id}>
                <button
                  type="button"
                  onClick={() => setExpandedCategoryId((id) => (id === c.id ? null : c.id))}
                  className="flex w-full flex-col gap-2 text-left"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className={dsFinTypo.rowTitle}>{c.name}</span>
                    <div className="text-right">
                      <span className={cn(dsFinTypo.tableCellMedium, "tabular-nums")}>
                        {fmtEuroAmount(c.actual)} / {fmtEuroAmount(c.budget)}
                      </span>
                      <p className={dsFinTypo.kpiSubMuted}>{c.utilizedPct}% utilized</p>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--Neutral-200)]">
                    <div
                      className="h-full rounded-full bg-[var(--Tertiary-600)] transition-[width] duration-300"
                      style={{ width: `${c.utilizedPct}%` }}
                    />
                  </div>
                </button>
                {open ? (
                  <div className="mt-3 rounded-xl border border-[rgba(230,231,232,0.85)] bg-[#F3F4F6] p-3">
                    <p className={dsFinTypo.bodySm}>{c.detail}</p>
                    <div className="mt-3 flex justify-end">
                      <AnalyseWithAmiioButton topic={`Budget category: ${c.name}\n\n${c.detail}`} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn(DS_CARD, "overflow-hidden p-6")}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h3 className={dsFinTypo.sectionTitle}>Monthly Budget Tracking</h3>
          <div className="flex flex-wrap items-center gap-2">
            {isBudgetEditMode ? (
              <>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-xl bg-[#010309] px-3 transition-colors hover:bg-[#040718]",
                    dsFinTypo.btnPrimary,
                  )}
                  onClick={saveMonthlyBudgetEdit}
                >
                  <LayoutGrid className="size-4 text-white" strokeWidth={1.5} />
                  Save Budget
                </button>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-9 items-center rounded-xl border border-[#D1D5D9] bg-white px-3 transition-colors hover:bg-[#F7F8FA]",
                    dsFinTypo.btn,
                    "text-[#010309]",
                  )}
                  onClick={cancelMonthlyBudgetEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-xl border border-[#D1D5D9] bg-white px-3 transition-colors hover:bg-[#F7F8FA]",
                  dsFinTypo.btn,
                  "text-[#010309]",
                )}
                onClick={startMonthlyBudgetEdit}
              >
                <LayoutGrid className="size-4 text-[#65686B]" strokeWidth={1.5} />
                Edit Budget
              </button>
            )}
            <WidgetHeaderLamp
              chatLabel="Monthly budget tracking"
              chatTopic="Walk through monthly budget, actual, and variance trend and flag months that need reforecast."
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[rgba(230,231,232,0.85)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(230,231,232,0.9)] bg-[#F7F8FA]">
                {["Month", "Budget", "Actual", "Variance", "Status"].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-3",
                      dsFinTypo.tableHeader,
                      h !== "Month" && h !== "Status" && "text-right",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map((row) => {
                const draft = monthlyRowEdits.find((editRow) => editRow.month === row.month);
                const budgetPreview = isBudgetEditMode
                  ? parseMoneyInput(draft?.budget ?? "") ?? row.budget
                  : row.budget;
                const actualPreview = isBudgetEditMode
                  ? parseMoneyInput(draft?.actual ?? "")
                  : row.actual;
                const variancePreview =
                  actualPreview == null ? null : actualPreview - budgetPreview;
                return (
                <tr key={row.month} className="border-b border-[rgba(230,231,232,0.6)] last:border-0">
                  <td className={cn("px-4 py-3", dsFinTypo.tableCellMedium)}>{row.month}</td>
                  <td className={cn("px-4 py-3 text-right", dsFinTypo.tableCell)}>
                    {isBudgetEditMode ? (
                      <input
                        value={draft?.budget ?? ""}
                        onChange={(e) => updateMonthlyBudgetEdit(row.month, "budget", e.target.value)}
                        inputMode="numeric"
                        className={cn(
                          "h-8 w-[124px] rounded-lg border border-[#D1D5D9] bg-white px-2 text-right outline-none transition-colors focus:border-[#AAB3BD]",
                          dsFinTypo.bodySm,
                        )}
                      />
                    ) : (
                      fmtEuroAmount(row.budget)
                    )}
                  </td>
                  <td className={cn("px-4 py-3 text-right", dsFinTypo.tableCell)}>
                    {isBudgetEditMode ? (
                      <input
                        value={draft?.actual ?? ""}
                        onChange={(e) => updateMonthlyBudgetEdit(row.month, "actual", e.target.value)}
                        inputMode="numeric"
                        placeholder="—"
                        className={cn(
                          "h-8 w-[124px] rounded-lg border border-[#D1D5D9] bg-white px-2 text-right outline-none transition-colors placeholder:text-[#B8BCC2] focus:border-[#AAB3BD]",
                          dsFinTypo.bodySm,
                        )}
                      />
                    ) : row.actual != null ? (
                      fmtEuroAmount(row.actual)
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right tabular-nums",
                      dsFinTypo.tableCellMedium,
                      variancePreview == null
                        ? "text-[#969A9E]"
                        : variancePreview >= 0
                          ? "text-[#146B3A]"
                          : "text-[#C65A66]",
                    )}
                  >
                    {variancePreview != null ? fmtVariance(variancePreview) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {(actualPreview == null ? "pending" : "complete") === "complete" ? (
                      <span className={cn("inline-flex rounded-full bg-[#E6F6F3] px-2.5 py-1 text-[#1F9E8B]", dsFinTypo.badge)}>
                        Complete
                      </span>
                    ) : (
                      <span className={cn("inline-flex rounded-full bg-[#EDEEF2] px-2.5 py-1 text-[#676A6E]", dsFinTypo.badge)}>
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      <div className={cn(DS_CARD, "p-6")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className={dsFinTypo.sectionTitle}>Input Sources</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={dsFinTypo.link}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "View all sources" } }),
                )
              }
            >
              View all
            </button>
            <WidgetHeaderLamp
              chatLabel="Budget input sources"
              chatTopic="Summarise budget inputs: approvals, workbooks, and meeting notes that drive the FY plan."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {BUDGET_INPUT_SOURCES.map((s) => {
            const Icon = s.icon;
            const open = expandedSourceId === s.id;
            return (
              <div key={s.id} className="relative min-w-0">
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-lg text-[#969A9E] transition-colors hover:bg-white hover:text-[#233FDE]"
                  aria-label={`Open ${s.title}`}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("amiio:toast", { detail: { message: `Open ${s.title}` } }),
                    )
                  }
                >
                  <ExternalLink className="size-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSourceId((id) => (id === s.id ? null : s.id))}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border border-[rgba(230,231,232,0.85)] bg-[#FAFBFC] p-3 pr-10 text-left transition-colors",
                    amiioCardHoverSurface,
                    "hover:border-[#D1D5D9]",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      s.iconBg,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(dsFinTypo.rowTitle, "text-[#010309]")}>{s.title}</p>
                    <p className={cn("mt-0.5", dsFinTypo.meta)}>{s.date}</p>
                  </div>
                </button>
                {open ? (
                  <div className="mt-2 rounded-xl border border-[rgba(230,231,232,0.85)] bg-[#F3F4F6] p-3">
                    <p className={dsFinTypo.bodySm}>{s.detail}</p>
                    <div className="mt-3 flex justify-end">
                      <AnalyseWithAmiioButton topic={`Budget input: ${s.title}\n\n${s.detail}`} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
