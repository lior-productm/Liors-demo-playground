"use client";

import { Fragment, useMemo, useRef, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import {
  DS_CHART,
  DS_CARD_GRADIENT,
  DS_DONUT_204,
  dsChartCard,
  dsFinTypo,
  dsPanelCard,
} from "@/src/lib/designSystem";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { FinancialChartInsightLamp } from "@/src/components/commercial/FinancialChartInsightLamp";
import { MajorMetricCard } from "@/src/components/commercial/MajorMetricCard";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";
import { FinancialPlTable } from "@/src/components/pages/FinancialPlTable";

/** Operational expenses doughnut — same ring sizing as Property GRI chart. */
const OPEX_DONUT_W = DS_DONUT_204.width;
const OPEX_DONUT_H = DS_DONUT_204.height;
const FINANCIAL_OPEX_PIE_OUTER = DS_DONUT_204.outerRadius;
const FINANCIAL_OPEX_PIE_INNER = DS_DONUT_204.innerRadius;
const OPEX_CENTER_INSET = DS_DONUT_204.centerInset;

const dsMinorMetricsBar =
  "rounded-2xl border border-[#E6E8EB] bg-white p-6 ds-card-gradient";

const cardBorder = dsPanelCard;

/** Figma line chart series — Income / Expense / Profit */
const INCOME_COLOR = DS_CHART.income;
const EXPENSE_COLOR = DS_CHART.expense;
const PROFIT_COLOR = DS_CHART.profit;

const REVENUE_EXPENSE_QUARTERS = ["Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"] as const;
/** Normalised 0–1 vs €0–€400K axis (Figma viewport curves). */
const INCOME_LINE = [0.27, 0.1, 0.31, 0.17];
const EXPENSE_LINE = [0.36, 0.35, 0.47, 0.38];
const PROFIT_LINE = [0.64, 0.72, 0.76, 0.68];

const PLOT_W = 242;
const PLOT_H = 216;

type LineInsightPoint = {
  series: "income" | "expense" | "profit";
  /** Quarter index 0–3 */
  index: number;
};

function lineInsightPlacement(
  x: number,
  y: number,
  plotW: number,
  plotH: number,
): { style: CSSProperties; popoverSide: "top" | "left" | "right" } {
  const leftPct = (x / plotW) * 100;
  const topPct = (y / plotH) * 100;

  if (leftPct > 72) {
    return {
      style: {
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(calc(-100% + 7px), calc(-100% - 3px))",
      },
      popoverSide: "left",
    };
  }
  if (leftPct < 28) {
    return {
      style: {
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-7px, calc(-100% - 3px))",
      },
      popoverSide: "right",
    };
  }
  return {
    style: {
      left: `${leftPct}%`,
      top: `${topPct}%`,
      transform: "translate(-50%, calc(-100% - 3px))",
    },
    popoverSide: "top",
  };
}

type FinancialLineChartCardProps = {
  title: string;
  fileName: string;
  chatTopic: string;
  chatLabel: string;
  insightPoint?: LineInsightPoint;
  incomeLine?: readonly number[];
  expenseLine?: readonly number[];
  profitLine?: readonly number[];
};

function FinancialLineChartCard({
  title,
  fileName,
  chatTopic,
  chatLabel,
  insightPoint,
  incomeLine = INCOME_LINE,
  expenseLine = EXPENSE_LINE,
  profitLine = PROFIT_LINE,
}: FinancialLineChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const toX = (i: number) => (i / 3) * PLOT_W;
  const toY = (t: number) => (1 - t) * PLOT_H;

  const path = (arr: readonly number[]) =>
    arr
      .map((t, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(t).toFixed(1)}`)
      .join(" ");

  const insightSeries =
    insightPoint?.series === "expense"
      ? expenseLine
      : insightPoint?.series === "profit"
        ? profitLine
        : incomeLine;
  const insightIdx = insightPoint?.index ?? 0;
  const insightX = insightPoint ? toX(insightIdx) : 0;
  const insightY = insightPoint ? toY(insightSeries[insightIdx]!) : 0;
  const insightPlacement = insightPoint
    ? lineInsightPlacement(insightX, insightY, PLOT_W, PLOT_H)
    : null;

  const yTicks = [400_000, 300_000, 200_000, 100_000, 50_000, 0] as const;
  const fmt = (n: number) => (n === 0 ? "0K" : `${n / 1000}K`);

  return (
    <div
      ref={ref}
      className={cn(
        "financial-chart-card flex h-full min-h-0 min-w-0 flex-col ds-card-gradient",
        dsChartCard,
      )}
    >
      <div className="flex min-h-8 items-center justify-between gap-2">
        <h3 className={cn(dsFinTypo.widgetTitle, "min-w-0 flex-1 truncate")}>{title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <Select defaultValue="quarterly">
            <SelectTrigger
              className={cn(
                dsFinTypo.chartFilter,
                "h-6 w-[88px] max-w-[88px] shrink-0 gap-0.5 px-2 py-0 text-[11px] leading-4 shadow-none",
                "focus:ring-0 focus:ring-offset-0 [&>span]:truncate [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:opacity-60",
              )}
            >
              <SelectValue placeholder="Quarterly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <WidgetExportMenu variant="chart" fileName={fileName} captureRef={ref} />
          <WidgetHeaderLamp chatTopic={chatTopic} chatLabel={chatLabel} />
        </div>
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <div className="flex w-full min-w-0">
          <div
            className={cn(
              dsFinTypo.chartAxis,
              "financial-chart-scaled-plot-h financial-chart-scaled-y-axis flex shrink-0 flex-col justify-between pr-1 text-right",
            )}
            aria-hidden
          >
            {yTicks.map((tick) => (
              <span key={tick}>{fmt(tick)}</span>
            ))}
          </div>

          <div className="financial-chart-scaled-plot-area relative min-w-0 flex-1 overflow-visible">
            <svg
              className="block size-full"
              viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
              preserveAspectRatio="none"
              aria-label={title}
            >
              {yTicks.map((tick) => {
                const y = toY(tick / 400_000);
                return (
                  <line
                    key={tick}
                    x1={0}
                    x2={PLOT_W}
                    y1={y}
                    y2={y}
                    stroke={DS_CHART.grid}
                    strokeWidth={1}
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              <path
                d={path(expenseLine)}
                fill="none"
                stroke={EXPENSE_COLOR}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {expenseLine.map((t, i) => (
                <circle
                  key={`e-${i}`}
                  cx={toX(i)}
                  cy={toY(t)}
                  r={3.5}
                  fill={EXPENSE_COLOR}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
              <path
                d={path(profitLine)}
                fill="none"
                stroke={PROFIT_COLOR}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {profitLine.map((t, i) => (
                <circle
                  key={`p-${i}`}
                  cx={toX(i)}
                  cy={toY(t)}
                  r={3.5}
                  fill={PROFIT_COLOR}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
              <path
                d={path(incomeLine)}
                fill="none"
                stroke={INCOME_COLOR}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {incomeLine.map((t, i) => (
                <circle
                  key={`r-${i}`}
                  cx={toX(i)}
                  cy={toY(t)}
                  r={3.5}
                  fill={INCOME_COLOR}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </svg>

            {insightPoint && insightPlacement ? (
              <div
                className="financial-chart-scaled-lamp pointer-events-auto absolute z-20"
                style={insightPlacement.style}
              >
                <FinancialChartInsightLamp
                  className="size-full min-h-0 min-w-0"
                  ariaLabel="Insight on latest income point"
                  summary="Income dips in Q2 2025 while expenses stay elevated — Amiio reads this as tightening margin in the demo series; confirm against your live rent-roll before acting."
                  analyseTopic="Analyse the Rental Income/Expenses chart on Financial overview: interpret the latest quarter vs prior quarters, income vs expenses vs profit, and suggest follow-up checks."
                  popoverSide={insightPlacement.popoverSide}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className={cn(dsFinTypo.meta, "financial-chart-scaled-x-pl typo-l3-b mt-2 grid grid-cols-4 text-center")}>
          {REVENUE_EXPENSE_QUARTERS.map((q) => (
            <span key={q} className="truncate">
              {q}
            </span>
          ))}
        </div>
      </div>

      <div className={cn(dsFinTypo.chartLegend, "mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2")}>
        <span className="inline-flex items-center gap-2">
          <span
            className="financial-chart-scaled-legend-line h-0.5 shrink-0 rounded-full"
            style={{ backgroundColor: INCOME_COLOR }}
          />
          Income
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="financial-chart-scaled-legend-line h-0.5 shrink-0 rounded-full"
            style={{ backgroundColor: EXPENSE_COLOR }}
          />
          Expense
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="financial-chart-scaled-legend-line h-0.5 shrink-0 rounded-full"
            style={{ backgroundColor: PROFIT_COLOR }}
          />
          Profit
        </span>
      </div>
    </div>
  );
}

function RevenueExpenseChartCard() {
  return (
    <FinancialLineChartCard
      title="Rental Income/Expenses"
      fileName="revenue-expense"
      chatTopic="Analyse rental income vs expenses and profit trend for the quarters shown."
      chatLabel="Rental Income/Expenses chart"
      insightPoint={{ series: "income", index: 3 }}
    />
  );
}

type MinorMetricItem = {
  label: string;
  value: string;
  sub?: string;
  trend: { direction: "up" | "down"; pct: string };
  invert?: boolean;
};

function FinancialMinorMetricsBar({ items }: { items: MinorMetricItem[] }) {
  return (
    <div className={cn("flex min-h-[128px] flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4", dsMinorMetricsBar)}>
      {items.map((m, index) => (
        <Fragment key={m.label}>
          {index > 0 ? (
            <div className="hidden w-px shrink-0 self-center bg-[#E6E8EB] sm:block sm:h-16" aria-hidden />
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="typo-l2-b text-[#65686B]">{m.label}</span>
            <div className="flex flex-wrap items-center gap-1">
              <span className={cn(dsFinTypo.kpiValueMd)}>{m.value}</span>
              {m.sub ? (
                <>
                  <span className="mx-1 h-6 w-px shrink-0 bg-[#E6E8EB]" aria-hidden />
                  <span className="typo-l2-r text-[#65686B]">{m.sub}</span>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <TrendPill direction={m.trend.direction} pct={m.trend.pct} invert={m.invert} />
              <span className="typo-l3-r truncate text-[#7E8185]">vs previous year</span>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function OperatingExpensesDonutCard() {
  const ref = useRef<HTMLDivElement>(null);
  /** Figma 740:41858 — Operational Expenses doughnut segments & legend */
  const segments = useMemo(
    () => [
      { label: "Rent", pct: 28, color: "#142587" },
      { label: "Utilities", pct: 22, color: "#040617" },
      { label: "Insurance", pct: 12, color: "#838697" },
      { label: "Taxes", pct: 14, color: "#A7B2F2" },
      { label: "Maintenance", pct: 14, color: "#70A4AC" },
      { label: "Management", pct: 10, color: "#D7ECEF" },
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

  const legendColLeft = segments.slice(0, 3);
  const legendColRight = segments.slice(3);

  const renderLegendColumn = (items: typeof segments) => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-2">
        {items.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className={cn(dsFinTypo.chartLegend, "whitespace-nowrap")}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex w-8 flex-col items-end gap-3">
        {items.map((s) => (
          <span
            key={`${s.label}-pct`}
            className={cn(dsFinTypo.chartLegendValue)}
          >
            {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        "financial-chart-card flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden rounded-2xl ds-card-gradient",
        dsChartCard,
      )}
      style={{ backgroundImage: DS_CARD_GRADIENT }}
    >
      <div className="flex min-h-8 items-center justify-between gap-3">
        <h3 className={cn(dsFinTypo.widgetTitle, "min-w-0 flex-1 leading-snug")}>
          Operational Expenses
        </h3>
        <div className="flex shrink-0 items-center gap-2">
          <WidgetExportMenu variant="chart" fileName="operational-expenses" captureRef={ref} />
          <WidgetHeaderLamp
            chatTopic="Break down operational expense categories and flag outliers vs budget."
            chatLabel="Operational Expenses chart"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="relative shrink-0 overflow-visible [&_.recharts-tooltip-wrapper]:z-[100]"
          style={{ width: OPEX_DONUT_W, height: OPEX_DONUT_H }}
        >
          <PieChart width={OPEX_DONUT_W} height={OPEX_DONUT_H} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              {...AMIIO_CHART_MOTION}
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx={OPEX_DONUT_W / 2}
              cy={OPEX_DONUT_H / 2}
              innerRadius={FINANCIAL_OPEX_PIE_INNER}
              outerRadius={FINANCIAL_OPEX_PIE_OUTER}
              cornerRadius={2.5}
              paddingAngle={1.5}
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
                  <div className="rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 typo-l3-b text-[#353638] shadow-lg">
                    <div className="typo-l3-r text-[#65686B]">{p?.name}</div>
                    <div className="tabular-nums">{Number.isFinite(v) ? `${v}%` : "—"}</div>
                  </div>
                );
              }}
            />
          </PieChart>
          <div
            className="pointer-events-none absolute z-10 flex flex-col items-center justify-center gap-1 overflow-hidden text-center"
            style={OPEX_CENTER_INSET}
          >
            <p className={cn(dsFinTypo.donutCenterLabel, "w-full text-center leading-[1.2]")}>
              Total
              <br />
              Properties
            </p>
            <p className={cn(dsFinTypo.donutCenterValue, "w-full text-center leading-none")}>16</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-6">
        {renderLegendColumn(legendColLeft)}
        {renderLegendColumn(legendColRight)}
      </div>
    </div>
  );
}

export function FinancialOverviewPanel() {
  const kpiSpark1 = [0.45, 0.52, 0.48, 0.44, 0.41, 0.38];
  const kpiSpark2 = [0.3, 0.38, 0.45, 0.52, 0.61, 0.72];
  const kpiSpark3 = [0.55, 0.58, 0.62, 0.65, 0.68, 0.74];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Major metrics — Figma 740:41751, 734×124, 3×~229px cards, 24px gap */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            label: "Rental Income YTD",
            value: "€1,649,282",
            trend: "up" as const,
            trendPct: "2.1%",
          },
          {
            label: "ROI YTD",
            value: "7.4%",
            trend: "up" as const,
            trendPct: "0.8%",
          },
          {
            label: "ROE YTD",
            value: "10.9%",
            trend: "down" as const,
            trendPct: "0.4%",
          },
        ].map((k, i) => (
          <MajorMetricCard
            key={k.label}
            className="min-h-[124px]"
            label={k.label}
            value={k.value}
            trend={k.trend}
            trendPct={k.trendPct}
            vsLabel="vs last period"
            sparkline={[kpiSpark1, kpiSpark2, kpiSpark3][i]}
          />
        ))}
      </div>

      {/* Minor metrics — Figma 740:41791, 734×128 */}
      <FinancialMinorMetricsBar
        items={[
          {
            label: "NOI YTD",
            value: "€1,444,042",
            sub: "23.5%",
            trend: { direction: "down", pct: "0.9%" },
          },
          {
            label: "EBT",
            value: "€992,284",
            trend: { direction: "down", pct: "0.8%" },
          },
          {
            label: "CAPEX YTD",
            value: "€110,466",
            sub: "69%",
            trend: { direction: "down", pct: "1.5%" },
            invert: true,
          },
          {
            label: "Gross Rental Yield",
            value: "3.4%",
            trend: { direction: "up", pct: "11%" },
          },
        ]}
      />

      {/* Charts — Rental Income/Expenses + Operating Expenses donut */}
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <RevenueExpenseChartCard />
        <OperatingExpensesDonutCard />
      </div>

      <FinancialPlTable />
    </div>
  );
}

export function FinancialServiceChargesPlaceholder() {
  return (
    <div className={cn("p-8", cardBorder)}>
      <h2 className={cn(dsFinTypo.sectionTitle, "text-[#010309]")}>Service Charges</h2>
      <p className={cn("mt-2 max-w-xl leading-relaxed", dsFinTypo.body, "text-[#65686B]")}>
        Detailed service charge allocation, recovery rates, and tenant billing will appear here,
        matching the Overview layout and export options.
      </p>
    </div>
  );
}
