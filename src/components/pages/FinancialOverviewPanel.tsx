"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CloudDownload,
  Minus,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/src/components/commercial/Sparkline";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { FinancialChartInsightLamp } from "@/src/components/commercial/FinancialChartInsightLamp";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";

/** Same as Property Hub GRI (% Of Total): 280px plot, inner/outer from 41/63 on 85 ref scaled to 140. */
const FINANCIAL_OPEX_PIE_INNER = Math.round((41 / 85) * 140);
const FINANCIAL_OPEX_PIE_OUTER = Math.round((63 / 85) * 140);

const cardBorder = "rounded-[24px] border border-[rgba(230,231,232,0.85)] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]";

/** Financial overview chart pair — matches design spec (~32px radius). */
const financialChartCard =
  "rounded-[32px] border border-[rgba(230,231,232,0.85)] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]";

const REVENUE_EXPENSE_MONTHS = ["M1 2026", "M2 2026", "M3 2026", "M4 2026"] as const;
/** Normalised 0–1 vs €0–€500K axis (matches reference curve shapes). */
const REV_LINE = [0.88, 0.88, 0.84, 0.76];
const EXP_LINE = [0.22, 0.18, 0.1, 0.03];
const PROF_LINE = [0.32, 0.34, 0.38, 0.3];

const REV_COLOR = "#2E3A8C";
const EXP_COLOR = "#8F9BFF";
const PROF_COLOR = "#56A38E";

function RevenueExpenseChartCard() {
  const ref = useRef<HTMLDivElement>(null);
  const w = 520;
  const h = 248;
  const padL = 52;
  const padR = 20;
  const padT = 12;
  const padB = 32;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const toX = (i: number) => padL + (i / 3) * innerW;
  const toY = (t: number) => padT + (1 - t) * innerH;

  const path = (arr: number[]) =>
    arr
      .map((t, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(t).toFixed(1)}`)
      .join(" ");

  const lastX = toX(3);
  const lastY = toY(REV_LINE[3]!);

  const yTicks = [0, 100_000, 200_000, 300_000, 400_000, 500_000];
  const fmt = (n: number) =>
    n === 0 ? "€0" : `€${n / 1000}K`;

  return (
    <div ref={ref} className={cn("flex h-full min-h-0 flex-col p-6", financialChartCard)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Revenue/Expense</h3>
          <Select defaultValue="monthly">
            <SelectTrigger className="h-8 w-[120px] rounded-full border-[#E6E8EB] bg-white text-[13px] font-medium text-[#353638]">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WidgetExportMenu variant="chart" fileName="revenue-expense" captureRef={ref} />
          <WidgetHeaderLamp
            chatTopic="Analyse revenue vs expenses and profit trend for the current FY months shown."
            chatLabel="Revenue/Expense chart"
          />
        </div>
      </div>

      <div className="relative min-h-[200px] w-full max-w-full flex-1 aspect-[520/248]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Revenue expense chart"
        >
          {yTicks.map((tick) => {
            const y = toY(tick / 500_000);
            return (
              <g key={tick}>
                <line
                  className="amiio-chart-svg-grid-line"
                  x1={padL}
                  x2={w - padR}
                  y1={y}
                  y2={y}
                  stroke="#E6E8EB"
                  strokeWidth={1}
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                />
                <text
                  x={padL - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#969A9E"
                  style={{ fontSize: 11, fontWeight: 500 }}
                >
                  {fmt(tick)}
                </text>
              </g>
            );
          })}
          <path
            d={path(EXP_LINE)}
            fill="none"
            stroke={EXP_COLOR}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {EXP_LINE.map((t, i) => (
            <circle
              key={`e-${i}`}
              cx={toX(i)}
              cy={toY(t)}
              r={5.5}
              fill={EXP_COLOR}
              stroke="white"
              strokeWidth={2.25}
            />
          ))}
          <path
            d={path(PROF_LINE)}
            fill="none"
            stroke={PROF_COLOR}
            strokeWidth={4}
            strokeDasharray="9 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {PROF_LINE.map((t, i) => (
            <circle
              key={`p-${i}`}
              cx={toX(i)}
              cy={toY(t)}
              r={5.25}
              fill={PROF_COLOR}
              stroke="white"
              strokeWidth={2.25}
            />
          ))}
          <path
            d={path(REV_LINE)}
            fill="none"
            stroke={REV_COLOR}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {REV_LINE.map((t, i) => (
            <circle
              key={`r-${i}`}
              cx={toX(i)}
              cy={toY(t)}
              r={6}
              fill={REV_COLOR}
              stroke="white"
              strokeWidth={2.25}
            />
          ))}
          {REVENUE_EXPENSE_MONTHS.map((m, i) => (
            <text
              key={m}
              x={toX(i)}
              y={h - 8}
              textAnchor="middle"
              fill="#969A9E"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {m}
            </text>
          ))}
        </svg>
        <div
          className="pointer-events-auto absolute z-20"
          style={{
            left: `${(lastX / w) * 100}%`,
            top: `${(lastY / h) * 100}%`,
            transform: "translate(-50%, calc(-100% - 6px))",
          }}
        >
          <FinancialChartInsightLamp
            ariaLabel="Insight on latest revenue point"
            summary="Revenue stays elevated through M4 while expenses ease — Amiio reads this as widening operating margin in the demo series; confirm against your live rent-roll before acting."
            analyseTopic="Analyse the Revenue/Expense chart on Financial overview: interpret the latest month vs prior months, revenue vs expenses vs profit, and suggest follow-up checks."
            popoverSide="top"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12px] font-medium text-[#676A6E]">
        <span className="inline-flex items-center gap-2.5">
          <span
            className="h-1 w-8 shrink-0 rounded-full"
            style={{ backgroundColor: REV_COLOR }}
          />
          Revenue
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span
            className="h-1 w-8 shrink-0 rounded-full"
            style={{ backgroundColor: EXP_COLOR }}
          />
          Expenses
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span
            className="h-0 w-10 shrink-0 border-t-[3px] border-dashed"
            style={{ borderColor: PROF_COLOR }}
          />
          Profit
        </span>
      </div>
    </div>
  );
}

function OperatingExpensesDonutCard() {
  const ref = useRef<HTMLDivElement>(null);
  const segments = useMemo(
    () => [
      { label: "Other Costs", pct: 0.06, color: "#2E3A8C" },
      { label: "Owners Costs", pct: 46.04, color: "#7B87D9" },
      { label: "VAT Leakage", pct: 13.1, color: "#56A38E" },
      /** Light slice — still visible on white (avoids near-invisible fill). */
      { label: "Maintenance Costs", pct: 40.8, color: "#A8BCE8" },
    ],
    [],
  );

  const pieData = useMemo(
    () =>
      segments.map((s) => ({
        name: s.label,
        value: s.pct,
        fill: s.color,
      })),
    [segments],
  );

  const legendColLeft = [segments[0]!, segments[1]!];
  const legendColRight = [segments[2]!, segments[3]!];

  const renderLegendRow = (s: (typeof segments)[number]) => (
    <div key={s.label} className="flex items-center gap-2.5">
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
      <span className="min-w-0 flex-1 text-[#676A6E]">{s.label}</span>
      <span className="shrink-0 font-semibold tabular-nums text-[#353638]">
        {s.pct.toFixed(2)}%
      </span>
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn("flex h-full min-h-0 flex-col overflow-visible p-6", financialChartCard)}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-[min(100%,240px)] text-[16px] font-semibold leading-snug text-[#2C2C2C]">
          Operating Expenses Current FY
        </h3>
        <div className="flex shrink-0 items-center gap-2">
          <WidgetExportMenu variant="chart" fileName="operating-expenses" captureRef={ref} />
          <WidgetHeaderLamp
            chatTopic="Break down operating expense categories and flag outliers vs budget."
            chatLabel="Operating expenses donut"
          />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[280px] flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center overflow-visible">
          {/* Chart insight lamp — above plot; popover avoids Recharts tooltip z-index. */}
          <div className="relative z-0 mb-1 flex shrink-0 justify-center">
            <FinancialChartInsightLamp
              ariaLabel="Insight on operating expense mix"
              summary="Owners costs drive nearly half the wheel; VAT leakage and maintenance split the rest — Amiio recommends a quick leakage reconciliation before quarter close."
              analyseTopic="Analyse Operating Expenses Current FY on Financial overview: explain category weights, risks, and what to validate against budget."
              popoverSide="bottom"
            />
          </div>

          <div className="relative h-[280px] w-full max-w-[280px] shrink-0 overflow-visible">
            {/* Hole label — width tracks GRI-scale inner hole (~2× inner radius on 280px plot). */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex aspect-square w-[49%] max-w-[136px] min-w-[108px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(230,231,232,0.95)]">
              <span className="text-center text-[11px] font-medium text-[#969A9E]">Total Expenses</span>
              <span className="text-[22px] font-semibold tracking-tight text-[#010309]">€123,396</span>
            </div>

            <div className="relative z-10 h-full w-full overflow-visible [&_.recharts-tooltip-wrapper]:z-[100]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <Pie
                    {...AMIIO_CHART_MOTION}
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={FINANCIAL_OPEX_PIE_INNER}
                    outerRadius={FINANCIAL_OPEX_PIE_OUTER}
                    cornerRadius={5}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {pieData.map((d) => (
                      <Cell
                        key={d.name}
                        fill={d.fill}
                        className="outline-none"
                        style={{ fill: d.fill }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    allowEscapeViewBox={{ x: true, y: true }}
                    wrapperStyle={{ zIndex: 100 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0];
                      const v = typeof p?.value === "number" ? p.value : Number(p?.value);
                      return (
                        <div className="rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 text-[12px] font-medium text-[#353638] shadow-lg">
                          <div className="text-[11px] text-[#969A9E]">{p?.name}</div>
                          <div className="tabular-nums">{Number.isFinite(v) ? `${v.toFixed(2)}%` : "—"}</div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-0 text-[12px]">
        <div className="flex flex-col gap-3">
          {legendColLeft.map(renderLegendRow)}
        </div>
        <div className="flex flex-col gap-3">
          {legendColRight.map(renderLegendRow)}
        </div>
      </div>
    </div>
  );
}

type PlRow = {
  id: string;
  label: string;
  indent?: boolean;
  expandable?: boolean;
  section?: boolean;
  bold?: boolean;
  values: (string | null)[];
  final: string;
};

const PL_ROWS: PlRow[] = [
  { id: "rev", label: "REVENUE", section: true, values: [null, null, null], final: "" },
  {
    id: "net",
    label: "NET SALES",
    indent: true,
    expandable: true,
    values: ["€842,000", "€856,200", "€868,400"],
    final: "€2,566,600",
  },
  {
    id: "tr",
    label: "Total Revenue",
    bold: true,
    values: ["€842,000", "€856,200", "€868,400"],
    final: "€2,566,600",
  },
  { id: "exp", label: "EXPENSES", section: true, values: [null, null, null], final: "" },
  {
    id: "costs",
    label: "Costs",
    indent: true,
    expandable: true,
    values: ["€412,000", "€398,500", "€405,200"],
    final: "€1,215,700",
  },
  {
    id: "te",
    label: "Total Expenses",
    bold: true,
    values: ["€412,000", "€398,500", "€405,200"],
    final: "€1,215,700",
  },
  {
    id: "res",
    label: "RESULT",
    bold: true,
    values: ["€430,000", "€457,700", "€463,200"],
    final: "€1,350,900",
  },
];

function PlTableSection() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const allExpandable = PL_ROWS.filter((r) => r.expandable).map((r) => r.id);
  const expandAll = () => {
    const next: Record<string, boolean> = {};
    allExpandable.forEach((id) => {
      next[id] = true;
    });
    setExpanded(next);
  };
  const collapseAll = () => setExpanded({});

  const expandedCount = allExpandable.filter((id) => expanded[id]).length;

  return (
    <div className={cn("overflow-hidden", cardBorder)}>
      <div className="flex flex-col gap-4 border-b border-[#E6E8EB] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-[#010309]">P&amp;L</h2>
          <p className="mt-1 text-[12px] text-[#969A9E]">
            Filtres: monthly | 1/2026 - 3/2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E6E8EB] bg-white px-3 text-[13px] font-medium text-[#353638] shadow-sm"
          >
            <Calendar className="size-4 text-[#676A6E]" strokeWidth={1.5} />
            Jan - Mar 2026
            <ChevronDown className="size-4 text-[#969A9E]" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#E6E8EB] bg-white px-3 text-[13px] font-medium text-[#353638] shadow-sm"
          >
            Monthly
            <ChevronDown className="size-4 text-[#969A9E]" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E6E8EB] bg-white text-[#676A6E] shadow-sm"
            aria-label="Export"
          >
            <CloudDownload className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#E6E8EB] px-6 py-3">
        <button
          type="button"
          onClick={expandAll}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-white px-3 text-[12px] font-medium text-[#353638]"
        >
          <Plus className="size-3.5" />
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#010309] px-3 text-[12px] font-medium text-white"
        >
          <Minus className="size-3.5" />
          Collapse All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#F9F9F9] text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-[#717171]">
              <th className="border-b border-[#E6E8EB] px-4 py-3 font-semibold">P&amp;L Account</th>
              <th className="border-b border-[#E6E8EB] px-3 py-3 text-right font-semibold">Jan 2026</th>
              <th className="border-b border-[#E6E8EB] px-3 py-3 text-right font-semibold">Feb 2026</th>
              <th className="border-b border-[#E6E8EB] px-3 py-3 text-right font-semibold">Mar 2026</th>
              <th className="border-b border-l border-[#E6E8EB] bg-[#F4F4F5] px-3 py-3 text-right font-semibold text-[#353638]">
                Final Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {PL_ROWS.map((row) => {
              if (row.section && !row.bold) {
                return (
                  <tr key={row.id} className="bg-white">
                    <td
                      colSpan={5}
                      className="px-4 pb-1 pt-5 text-[11px] font-semibold tracking-[0.08em] text-[#717171]"
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }
              const open = row.expandable ? expanded[row.id] : false;
              return (
                <tr key={row.id} className="border-b border-[#F0F0F0] bg-white">
                  <td
                    className={cn(
                      "px-4 py-2.5 text-[#353638]",
                      row.indent && "pl-8",
                      row.bold && "font-semibold text-[#010309]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {row.expandable ? (
                        <button
                          type="button"
                          className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#E6E8EB] text-[#676A6E]"
                          aria-expanded={open}
                          onClick={() =>
                            setExpanded((s) => ({ ...s, [row.id]: !s[row.id] }))
                          }
                        >
                          <ChevronRight
                            className={cn("size-3.5 transition-transform", open && "rotate-90")}
                          />
                        </button>
                      ) : (
                        <span className="inline-block w-6 shrink-0" />
                      )}
                      {row.label}
                    </div>
                  </td>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-3 py-2.5 text-right tabular-nums text-[#353638]",
                        row.bold && "font-semibold",
                      )}
                    >
                      {v ?? "—"}
                    </td>
                  ))}
                  <td
                    className={cn(
                      "border-l border-[#E6E8EB] bg-[#F9F9F9] px-3 py-2.5 text-right font-semibold tabular-nums text-[#010309]",
                    )}
                  >
                    {row.final || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6E8EB] px-6 py-2.5 text-[11px] text-[#969A9E]">
        <span>Showing 7 rows</span>
        <span>
          {expandedCount} section{expandedCount !== 1 ? "s" : ""} expanded
        </span>
      </div>
    </div>
  );
}

export function FinancialOverviewPanel() {
  const kpiSpark1 = [0.45, 0.52, 0.48, 0.44, 0.41, 0.38];
  const kpiSpark2 = [0.3, 0.38, 0.45, 0.52, 0.61, 0.72];
  const kpiSpark3 = [0.55, 0.58, 0.62, 0.65, 0.68, 0.74];

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI row — three cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {[
          {
            title: "Rental Income YTD",
            value: "€1,649,282",
            trend: { direction: "down" as const, pct: "1.3%" },
            positive: false,
            spark: kpiSpark1,
            lampTopic: "Rental income YTD vs previous year and drivers.",
            lampLabel: "Rental Income YTD",
          },
          {
            title: "Service Charge Income YTD",
            value: "€428,910",
            trend: { direction: "up" as const, pct: "27.1%" },
            positive: true,
            spark: kpiSpark2,
            lampTopic: "Service charge income growth vs previous year.",
            lampLabel: "Service Charge Income YTD",
          },
          {
            title: "Other Operating Income YTD",
            value: "€182,440",
            trend: { direction: "up" as const, pct: "4.8%" },
            positive: true,
            spark: kpiSpark3,
            lampTopic: "Other operating income components and variance.",
            lampLabel: "Other Operating Income YTD",
          },
        ].map((k) => (
          <div key={k.title} className={cn("flex flex-col p-5", cardBorder)}>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[12px] font-semibold text-[#676A6E]">{k.title}</span>
              <WidgetHeaderLamp chatTopic={k.lampTopic} chatLabel={k.lampLabel} />
            </div>
            <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-tight text-[#010309]">
              {k.value}
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col gap-1">
                <TrendPill direction={k.trend.direction} pct={k.trend.pct} />
                <span className="text-[11px] text-[#969A9E]">vs previous year</span>
              </div>
              <Sparkline
                values={k.spark}
                variant={k.positive ? "positive" : "negative"}
                width={128}
                height={40}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary metrics strip */}
      <div
        className={cn(
          "flex flex-col divide-y divide-[#E6E8EB] overflow-hidden lg:flex-row lg:divide-x lg:divide-y-0",
          cardBorder,
        )}
      >
        {[
          {
            label: "NOI YTD",
            value: "€1,525,895",
            sub: "92.5%",
            trend: { direction: "up" as const, pct: "11.5%" },
            lampTopic: "NOI year-to-date vs budget and prior year, margin context.",
            lampLabel: "NOI YTD",
          },
          {
            label: "EBT",
            value: "€1,373,800",
            trend: { direction: "up" as const, pct: "10.6%" },
            lampTopic: "Earnings before tax trend and drivers for this portfolio period.",
            lampLabel: "EBT",
          },
          {
            label: "Expenses YTD",
            value: "€275,482",
            trend: { direction: "down" as const, pct: "35.8%" },
            invert: true,
            lampTopic: "Operating expenses YTD vs prior year and cost categories.",
            lampLabel: "Expenses YTD",
          },
          {
            label: "CAPEX YTD",
            value: "€25,914",
            trend: { direction: "down" as const, pct: "85.3%" },
            invert: true,
            lampTopic: "Capital expenditure YTD and project mix vs plan.",
            lampLabel: "CAPEX YTD",
          },
        ].map((m) => (
          <div key={m.label} className="group flex min-w-0 flex-1 flex-col gap-1.5 p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[12px] font-semibold text-[#676A6E]">{m.label}</span>
              <WidgetHeaderLamp
                revealOnHover
                chatTopic={m.lampTopic}
                chatLabel={m.lampLabel}
              />
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[22px] font-semibold tracking-tight text-[#010309]">{m.value}</span>
              {"sub" in m && m.sub ? (
                <span className="text-[13px] font-medium text-[#969A9E]">{m.sub}</span>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <TrendPill
                direction={m.trend.direction}
                pct={m.trend.pct}
                invert={"invert" in m ? m.invert : false}
              />
              <span className="text-[11px] text-[#969A9E]">vs previous year</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <RevenueExpenseChartCard />
        <OperatingExpensesDonutCard />
      </div>

      <PlTableSection />
    </div>
  );
}

export function FinancialServiceChargesPlaceholder() {
  return (
    <div className={cn("p-8", cardBorder)}>
      <h2 className="text-[18px] font-semibold text-[#010309]">Service Charges</h2>
      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#676A6E]">
        Detailed service charge allocation, recovery rates, and tenant billing will appear here,
        matching the Overview layout and export options.
      </p>
    </div>
  );
}
