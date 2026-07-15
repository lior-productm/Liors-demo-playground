"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OverviewAiSummaryCard } from "@/src/components/commercial/overview/OverviewAiSummaryCard";
import { AMIIO_AI_DISCLAIMER } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { COMMERCIAL_BAR_CHART_BAR_CLASS, lightenHexColor } from "@/src/lib/chartColors";
import { OverviewTrendBarChartCard } from "@/src/components/commercial/charts/OverviewTrendBarChartCard";
import { PORTFOLIO_OVERVIEW_BAR_CHARTS } from "@/src/lib/commercialMockData";

function KpiCard({
  title,
  icon: Icon,
  value,
  subtext,
  delta,
  deltaPositive,
  chatTopic,
  chatLabel,
}: {
  title: string;
  icon: LucideIcon;
  value: string;
  subtext: string;
  delta?: string;
  deltaPositive?: boolean;
  chatTopic: string;
  chatLabel: string;
}) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.9)] p-4",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-[#676A6E]">
          <Icon className="size-4 shrink-0 text-[#353638]" strokeWidth={1.75} />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {delta ? (
            <TrendPill
              direction={deltaPositive !== false ? "up" : "down"}
              pct={delta}
            />
          ) : null}
          <WidgetHeaderLamp
            chatTopic={chatTopic}
            chatLabel={chatLabel}
            revealOnHover
          />
        </div>
      </div>
      <p className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-[#010309]">
        {value}
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-[#7E8185]">{subtext}</p>
    </div>
  );
}

type TrendBarMeta = { period: string; tooltip: string };

const TREND_BAR_COLOR = "#70A4AC";
const TREND_BAR_HOVER_COLOR = lightenHexColor(TREND_BAR_COLOR);

/** Minimum plot height inside trend cards; flex-1 lets the chart grow with the card row. */
const TREND_PLOT_MIN_H_PX = 200;

/** Matches Lease Expiry chart value dot (Property Hub). */
function PortfolioTrendBarValueMarker({
  color = TREND_BAR_COLOR,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-4 w-4 shrink-0 rounded-full border border-white bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)] ring-1 ring-[#D1D5D9]",
        className,
      )}
      aria-hidden
    >
      <span
        className="absolute inset-[3px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="absolute inset-[5px] rounded-full bg-white" />
    </div>
  );
}

function PortfolioTrendBarChart({
  heightsPct,
  barMeta,
  onAnalyse,
  chartLabel,
  className,
}: {
  heightsPct: readonly [number, number, number, number];
  barMeta: readonly [TrendBarMeta, TrendBarMeta, TrendBarMeta, TrendBarMeta];
  onAnalyse?: (topic: string) => void;
  chartLabel: string;
  className?: string;
}) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [clickedBarIdx, setClickedBarIdx] = useState<number | null>(null);
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    if (clickedBarIdx === null) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("[data-portfolio-trend-bar]") ||
        el.closest("[data-portfolio-trend-analyse]")
      ) {
        return;
      }
      setClickedBarIdx(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clickedBarIdx]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBarsReady(true);
      return;
    }
    const id = requestAnimationFrame(() => setBarsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const max = Math.max(...heightsPct, 1);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-2", className)}>
      <div
        className="relative flex min-h-0 w-full flex-1 rounded-[24px]"
        style={{ minHeight: TREND_PLOT_MIN_H_PX }}
      >
        <div className="pointer-events-none absolute inset-0">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="amiio-portfolio-chart-gridline absolute left-0 right-0"
              style={{ bottom: `${tick}%` }}
            />
          ))}
        </div>

        <div className="relative flex h-full min-h-0 w-full items-end justify-between gap-2 px-0.5 sm:gap-3 sm:px-1">
          {heightsPct.map((h, i) => {
            const pct = (h / max) * 100;
            const barPct = Math.max(pct, 8);
            const active = hoveredBar === i;
            const showValueTooltip = active || clickedBarIdx === i;
            const useHoverColor = active || clickedBarIdx === i;
            const dimOthers =
              (hoveredBar !== null && hoveredBar !== i) ||
              (clickedBarIdx !== null && clickedBarIdx !== i);
            const meta = barMeta[i]!;

            return (
              <div
                key={meta.period}
                className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {showValueTooltip ? (
                  <>
                    <div
                      className="absolute left-1/2 z-10 max-w-[min(220px,40vw)] -translate-x-1/2 rounded-lg bg-[#060B27] p-2 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)]"
                      style={{ bottom: `calc(${barPct}% + 20px)` }}
                      role="tooltip"
                    >
                      <p className="text-center text-[12px] font-medium leading-[1.24] text-[#F0F2F5] sm:text-[13px]">
                        {meta.tooltip}
                      </p>
                    </div>
                    <div
                      className="absolute left-1/2 z-[5] -translate-x-1/2"
                      style={{ bottom: `calc(${barPct}% - 8px)` }}
                    >
                      <PortfolioTrendBarValueMarker />
                    </div>
                  </>
                ) : null}
                <div
                  data-portfolio-trend-bar
                  role="button"
                  tabIndex={0}
                  aria-label={`${meta.period}, ${meta.tooltip}. Click for Analyse with Amiio.`}
                  className={cn(COMMERCIAL_BAR_CHART_BAR_CLASS, dimOthers && "opacity-45")}
                  style={{
                    height: barsReady ? `${barPct}%` : "0%",
                    backgroundColor: useHoverColor ? TREND_BAR_HOVER_COLOR : TREND_BAR_COLOR,
                    transition: "height 1s cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setClickedBarIdx((prev) => (prev === i ? null : i));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setClickedBarIdx((prev) => (prev === i ? null : i));
                    }
                  }}
                />
                {clickedBarIdx === i && onAnalyse ? (
                  <div className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          data-portfolio-trend-analyse
                          className="flex items-center gap-2 whitespace-nowrap rounded-[32px] border border-[#D1D5D9] bg-[#F0F2F5] px-2.5 py-1.5 text-left shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)] transition-colors hover:bg-[#E6E8EB]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnalyse(
                              `${chartLabel} — ${meta.period}: ${meta.tooltip}`,
                            );
                            setClickedBarIdx(null);
                          }}
                        >
                          <Lightbulb className="h-4 w-4 shrink-0 text-[#353638]" />
                          <span className="text-[14px] font-medium leading-[1.25] text-[#353638]">
                            Analyse with Amiio
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={6}
                        className="max-w-[260px] border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium leading-snug text-[#F0F2F5]"
                      >
                        <p>
                          Send an analysis request to chat for {meta.period}.
                        </p>
                        <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal text-[#F0F2F5]/90">
                          {AMIIO_AI_DISCLAIMER}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-2 px-1 text-[12px] font-medium leading-[1.25] text-[#65686B]">
        {barMeta.map((meta) => (
          <div
            key={meta.period}
            className="flex min-w-0 flex-1 justify-center"
          >
            <span className="truncate text-center text-[10px] font-medium leading-tight text-[#65686B] sm:text-[12px]">
              {meta.period.replace(" ", "\u00A0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendCard({
  title,
  heightsPct,
  metrics,
  barMeta,
  onAnalyseWithAmiio,
}: {
  title: string;
  heightsPct: readonly [number, number, number, number];
  metrics: { label: string; valueClass?: string }[];
  barMeta: readonly [TrendBarMeta, TrendBarMeta, TrendBarMeta, TrendBarMeta];
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.9)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <h3 className="shrink-0 text-[14px] font-semibold text-[#2C2C2C]">{title}</h3>
      <div className="mt-4 flex min-h-[200px] flex-1 flex-col pb-1">
        <PortfolioTrendBarChart
          heightsPct={heightsPct}
          barMeta={barMeta}
          onAnalyse={onAnalyseWithAmiio}
          chartLabel={title}
        />
      </div>
      <div className="mt-4 shrink-0 flex flex-col gap-1.5 border-t border-[#E6E8EB] pt-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={cn("text-[12px] font-medium", m.valueClass ?? "text-[#1F9E8B]")}
          >
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const PORTFOLIO_SUMMARY_PLAIN =
  "Portfolio performance remains strong with +2.9% valuation growth YoY driven primarily by Wenckebachweg 90-98 and Zuidas Tower. Occupancy improved to 94.2%, up 0.4% from last month, with new leases signed at Herengracht contributing 3 additional tenants this quarter.";

function useTypewriter(text: string, msPerChar: number) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    setLen(0);
    if (text.length === 0) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(Math.min(i, text.length));
      if (i >= text.length) window.clearInterval(id);
    }, msPerChar);

    return () => window.clearInterval(id);
  }, [text, msPerChar]);

  return len;
}

const KEY_TRENDS_PLAIN =
  "Average rent/sqm increased 3.1% across the portfolio. WALT decreased slightly (-0.3 yrs) due to natural lease roll. Service charges remain stable at portfolio average. Tenant sentiment score improved to 7.6/10 (+0.2 vs last quarter).";

function useDeferredTypewriter(text: string, msPerChar: number, active: boolean) {
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!active) {
      setLen(0);
      return;
    }
    setLen(0);
    if (text.length === 0) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setLen(Math.min(i, text.length));
      if (i >= text.length) window.clearInterval(id);
    }, msPerChar);

    return () => window.clearInterval(id);
  }, [text, msPerChar, active]);

  return len;
}

type PortfolioInsightId = "performers" | "attention";

const RENTAL_BAR_META = [
  { period: "Dec 2023", tooltip: "€14.2M annualised rental income" },
  { period: "Dec 2024", tooltip: "€16.1M annualised rental income" },
  { period: "Nov 2025", tooltip: "€17.9M run-rate (partial month)" },
  { period: "Dec 2025", tooltip: "€18.5M current period" },
] as const satisfies readonly [TrendBarMeta, TrendBarMeta, TrendBarMeta, TrendBarMeta];

const OCC_BAR_META = [
  { period: "Dec 2023", tooltip: "92.0% portfolio occupancy" },
  { period: "Dec 2024", tooltip: "92.8% portfolio occupancy" },
  { period: "Nov 2025", tooltip: "93.8% portfolio occupancy" },
  { period: "Dec 2025", tooltip: "94.2% current occupancy" },
] as const satisfies readonly [TrendBarMeta, TrendBarMeta, TrendBarMeta, TrendBarMeta];

const WALT_BAR_META = [
  { period: "Dec 2023", tooltip: "5.4 yrs weighted avg. lease term" },
  { period: "Dec 2024", tooltip: "5.1 yrs weighted avg. lease term" },
  { period: "Nov 2025", tooltip: "4.9 yrs weighted avg. lease term" },
  { period: "Dec 2025", tooltip: "4.8 yrs current WALT" },
] as const satisfies readonly [TrendBarMeta, TrendBarMeta, TrendBarMeta, TrendBarMeta];

type OverviewScope = "portfolio" | "entity";

type OverviewMetricVisual =
  | { kind: "none" }
  | { kind: "sparkline" }
  | { kind: "progress"; value: number; accent: string };

type OverviewMetricItem = {
  label: string;
  value: string;
  helper: string;
  delta?: string;
  deltaPositive?: boolean;
  visual?: OverviewMetricVisual;
  chatTopic: string;
  chatLabel: string;
};

type OverviewMinorMetricItem = {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  helper: string;
};

const OVERVIEW_CHARTS = PORTFOLIO_OVERVIEW_BAR_CHARTS;

function OverviewSparkline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 68 56"
      className={cn("h-14 w-[68px] shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="overviewSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BE1D5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6BE1D5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 15 C7 4, 12 3, 18 14 C24 25, 30 24, 36 12 C42 1, 49 9, 54 8 C59 7, 63 16, 66 54 L66 56 L2 56 Z"
        fill="url(#overviewSparkFill)"
      />
      <path
        d="M2 15 C7 4, 12 3, 18 14 C24 25, 30 24, 36 12 C42 1, 49 9, 54 8 C59 7, 63 16, 66 54"
        stroke="#22C7B8"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OverviewProgressRing({
  value,
  accent,
}: {
  value: number;
  accent: string;
}) {
  const size = 56;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, value));
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function OverviewMetricCard({
  label,
  value,
  helper,
  delta,
  deltaPositive = true,
  visual = { kind: "none" },
  chatTopic,
  chatLabel,
}: OverviewMetricItem) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.92)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[16px] font-medium leading-[1.25] text-[#65686B]">{label}</p>
        <WidgetHeaderLamp chatTopic={chatTopic} chatLabel={chatLabel} />
      </div>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="min-w-0">
          <p className="text-[24px] font-medium leading-[1.25] tracking-tight text-[#353638]">
            {value}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {delta ? (
              <TrendPill
                direction={deltaPositive ? "up" : "down"}
                pct={delta}
              />
            ) : null}
            <span className="text-[12px] leading-[1.24] text-[#7E8185]">{helper}</span>
          </div>
        </div>
        <div className="flex items-end self-stretch">
          {visual.kind === "sparkline" ? <OverviewSparkline /> : null}
          {visual.kind === "progress" ? (
            <OverviewProgressRing value={visual.value} accent={visual.accent} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OverviewMinorMetricsBar({
  items,
}: {
  items: OverviewMinorMetricItem[];
}) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.92)] px-6 py-5",
        amiioCardHoverSurface,
      )}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-0">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "min-w-0",
              index > 0 && "xl:border-l xl:border-[#D1D5D9] xl:pl-4",
              index < items.length - 1 && "xl:pr-4",
            )}
          >
            <p className="text-[14px] font-medium leading-[1.24] text-[#65686B]">{item.label}</p>
            <p className="mt-2 text-[18px] font-medium leading-[1.25] text-[#353638]">{item.value}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <TrendPill
                direction={item.deltaPositive ? "up" : "down"}
                pct={item.delta}
              />
              <span className="text-[12px] leading-[1.24] text-[#7E8185]">{item.helper}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewSummaryCard({
  scope,
}: {
  scope: OverviewScope;
}) {
  const isEntity = scope === "entity";

  return (
    <OverviewAiSummaryCard
      title={isEntity ? "Entity Summary" : "Portfolio Summary"}
      chatTopic={
        isEntity
          ? "Summarise the current entity overview, with performance against the portfolio benchmark."
          : "Summarise the current portfolio overview, highlight outperformance and risks."
      }
      chatLabel={isEntity ? "Entity Summary" : "Portfolio Summary"}
      summary={
        isEntity ? (
          <p>
            Entity is portfolio outperformer with occupancy at 89%{" "}
            <span className="font-medium text-[#1F9E8B]">(+3.5% QoQ)</span> exceeding portfolio
            average of 87%. GRI growth of{" "}
            <span className="font-medium text-[#1F9E8B]">6.2%</span> demonstrates strong
            operational execution. Entity represents 32% of portfolio value and remains a
            strategic focus area.
          </p>
        ) : (
          <p>
            Portfolio performing strongly with occupancy reaching 87%{" "}
            <span className="font-medium text-[#1F9E8B]">(+3.2% QoQ)</span> and GRI exceeding
            budget by EUR 1.2M. Strong pricing momentum is visible with rent/sqm up 2.1%,
            driven by 8 new leases signed. WAULT continues to decline and needs close
            monitoring.
          </p>
        )
      }
      trends={
        isEntity
          ? [
              {
                tone: "positive",
                content: (
                  <>
                    Occupancy outperforming: 89% vs portfolio 87%{" "}
                    <span className="font-medium text-[#1F9E8B]">(+2%)</span>
                  </>
                ),
              },
              {
                tone: "positive",
                content: "GRI growth strong: +6.2% vs portfolio +5.8%",
              },
              {
                tone: "warning",
                content: (
                  <>
                    WAULT declining: <span className="font-medium text-[#9F2D3A]">-0.3 yrs</span>{" "}
                    but still above portfolio average
                  </>
                ),
              },
            ]
          : [
              {
                tone: "positive",
                content: (
                  <>
                    Occupancy improving: <span className="font-medium text-[#1F9E8B]">+3.2%</span>{" "}
                    to 87% with strong leasing momentum
                  </>
                ),
              },
              {
                tone: "positive",
                content: (
                  <>
                    Pricing strength: rent/sqm up{" "}
                    <span className="font-medium text-[#1F9E8B]">2.1%</span>
                  </>
                ),
              },
              {
                tone: "warning",
                content: (
                  <>
                    WAULT declining: <span className="font-medium text-[#9F2D3A]">-0.4 yrs</span> to
                    3.2 years, monitor expirations
                  </>
                ),
              },
            ]
      }
    />
  );
}

export function PortfolioOverviewView({
  scope = "portfolio",
  selectedPortfolio: _selectedPortfolio,
  selectedEntity: _selectedEntity,
  selectedProperty: _selectedProperty,
  onAnalyseWithAmiio,
}: {
  scope?: OverviewScope;
  selectedPortfolio?: string;
  selectedEntity?: string;
  selectedProperty?: string;
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  const isEntity = scope === "entity";
  const topMetrics: OverviewMetricItem[] = [
    {
      label: "Total Assets",
      value: "12",
      helper: "Properties in portfolio",
      visual: { kind: "none" },
      chatTopic: "Explain total assets in the current overview scope.",
      chatLabel: "Total Assets",
    },
    {
      label: "Current Valuation",
      value: isEntity ? "€25,209,000" : "€245,209,000",
      helper: "vs last period",
      delta: "1.5%",
      visual: { kind: "sparkline" },
      chatTopic: "Explain current valuation and the latest change versus the prior period.",
      chatLabel: "Current Valuation",
    },
    {
      label: "Total Tenants",
      value: "218",
      helper: "vs last period",
      delta: "1.5%",
      visual: { kind: "none" },
      chatTopic: "Summarise tenant count and the latest movement.",
      chatLabel: "Total Tenants",
    },
    {
      label: "WAULT",
      value: "2.8 years",
      helper: "vs last period",
      delta: "1.5%",
      visual: { kind: "sparkline" },
      chatTopic: "Explain WAULT and whether the current movement is a risk.",
      chatLabel: "WAULT",
    },
    {
      label: "Occupancy Rate",
      value: "94%",
      helper: "vs last period",
      delta: "1.5%",
      visual: { kind: "progress", value: 0.94, accent: "#2437B8" },
      chatTopic: "Explain occupancy rate and what is driving it.",
      chatLabel: "Occupancy Rate",
    },
    {
      label: "Vacancy Rate",
      value: "5.28%",
      helper: "vs last period",
      delta: "1.5%",
      visual: { kind: "progress", value: 0.0528, accent: "#2437B8" },
      chatTopic: "Explain vacancy rate and how it compares with recent periods.",
      chatLabel: "Vacancy Rate",
    },
  ];
  const minorMetrics: OverviewMinorMetricItem[] = [
    {
      label: "Tenant Retention Rate",
      value: "71.8%",
      delta: "0.9%",
      deltaPositive: false,
      helper: "vs previous year",
    },
    {
      label: "Net Absorption",
      value: "3%",
      delta: "0.8%",
      deltaPositive: false,
      helper: "vs previous year",
    },
    {
      label: "Average Rent per m2",
      value: "€75",
      delta: "4.2%",
      deltaPositive: false,
      helper: "vs previous year",
    },
    {
      label: "Total GRI",
      value: "3%",
      delta: "0.8%",
      deltaPositive: false,
      helper: "vs previous year",
    },
    {
      label: "Net Rental Income",
      value: "2,180,339",
      delta: "11%",
      deltaPositive: true,
      helper: "vs previous year",
    },
  ];

  return (
    <div className="space-y-6">
      <OverviewSummaryCard scope={scope} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {topMetrics.slice(0, 3).map((metric) => (
          <OverviewMetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {topMetrics.slice(3).map((metric) => (
          <OverviewMetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <OverviewMinorMetricsBar items={minorMetrics} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {OVERVIEW_CHARTS.map((chart) => (
          <OverviewTrendBarChartCard
            key={chart.title}
            chart={chart}
            onAnalyse={onAnalyseWithAmiio}
            fileName={chart.title.toLowerCase().replace(/\s+/g, "-")}
          />
        ))}
      </div>
    </div>
  );
}
