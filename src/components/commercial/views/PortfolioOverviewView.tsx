"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowUpRight,
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
import {
  AmiioAiDisclaimerTrigger,
  AMIIO_AI_DISCLAIMER,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { amiioCardHoverSurface, cn } from "@/lib/utils";

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
          <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <WidgetHeaderLamp
              chatTopic={chatTopic}
              chatLabel={chatLabel}
              revealOnHover
            />
          </span>
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

/** Minimum plot height inside trend cards; flex-1 lets the chart grow with the card row. */
const TREND_PLOT_MIN_H_PX = 200;

/** Matches Lease Expiry chart value dot (Property Hub). */
function PortfolioTrendBarValueMarker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-4 w-4 shrink-0 rounded-full border border-white bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)] ring-1 ring-[#D1D5D9]",
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-[3px] rounded-full bg-[#436367]" />
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
            const useSecondary900 = active || clickedBarIdx === i;
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
                  className={cn(
                    "mx-auto w-[88%] min-w-[18px] cursor-pointer rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2",
                    useSecondary900 ? "bg-[#436367]" : "bg-[#70A4AC]",
                    dimOthers && "opacity-45",
                  )}
                  style={{
                    height: barsReady ? `${barPct}%` : "0%",
                    transition: "height 1s cubic-bezier(0.22, 1, 0.36, 1)",
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

export function PortfolioOverviewView({
  onAnalyseWithAmiio,
}: {
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  const summaryLen = useTypewriter(PORTFOLIO_SUMMARY_PLAIN, 14);
  const summaryComplete = summaryLen >= PORTFOLIO_SUMMARY_PLAIN.length;
  const keyTrendsLen = useDeferredTypewriter(KEY_TRENDS_PLAIN, 9, summaryComplete);
  const keyTrendsTypingDone =
    summaryComplete && keyTrendsLen >= KEY_TRENDS_PLAIN.length;

  const [openInsight, setOpenInsight] = useState<PortfolioInsightId | null>(null);

  useEffect(() => {
    if (openInsight === null) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("[data-portfolio-insight-widget]") ||
        el.closest("[data-portfolio-insight-analyse]")
      ) {
        return;
      }
      setOpenInsight(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openInsight]);

  function renderInsightAnalysePill(topic: string) {
    if (!onAnalyseWithAmiio) return null;
    return (
      <div className="relative z-20 mt-2 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-portfolio-insight-analyse
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D1D5D9] bg-white px-3.5 text-left text-[13px] font-medium text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyseWithAmiio(topic);
                setOpenInsight(null);
              }}
            >
              <Lightbulb className="h-4 w-4 shrink-0 text-[#7E8185]" />
              <span className="leading-[1.25] text-[#353638]">
                Analyse with Amiio
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={6}
            className="max-w-[260px] border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium leading-snug text-[#F0F2F5]"
          >
            <p>Send this insight to chat for a deeper analysis.</p>
            <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal text-[#F0F2F5]/90">
              {AMIIO_AI_DISCLAIMER}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        {/* Amiio's Portfolio Summary */}
        <div
          className={cn(
            "relative rounded-2xl border border-[rgba(230,231,232,0.85)] bg-[rgba(255,255,255,0.92)] p-6",
            amiioCardHoverSurface,
          )}
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
                <Sparkles className="size-5 shrink-0 text-[#010309]" aria-hidden />
              </AmiioAiDisclaimerTrigger>
              <span className="text-[16px] font-semibold text-[#010309]">
                Amiio&apos;s Portfolio Summary
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#969A9E]">Updated Dec 2025</span>
              <WidgetHeaderLamp
                chatTopic="Summarise portfolio valuation growth, occupancy, top performers, and assets needing attention."
                chatLabel="Portfolio Summary"
              />
            </div>
          </div>

          <p className="min-h-[5.5rem] text-[14px] leading-[1.65] text-[#353638]">
            {!summaryComplete ? (
              <>
                {PORTFOLIO_SUMMARY_PLAIN.slice(0, summaryLen)}
                <span
                  className="ml-0.5 inline-block h-[1.1em] w-px translate-y-0.5 animate-pulse bg-[#010309]"
                  aria-hidden
                />
              </>
            ) : (
              <>
                Portfolio performance remains strong with{" "}
                <strong className="font-semibold text-[#010309]">+2.9% valuation growth</strong> YoY
                driven primarily by{" "}
                <strong className="font-semibold text-[#010309]">Wenckebachweg 90-98</strong> and{" "}
                <strong className="font-semibold text-[#010309]">Zuidas Tower</strong>. Occupancy
                improved to{" "}
                <strong className="font-semibold text-[#010309]">94.2%</strong>, up 0.4% from last
                month, with new leases signed at Herengracht contributing 3 additional tenants this
                quarter.
              </>
            )}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div
              data-portfolio-insight-widget={onAnalyseWithAmiio ? "" : undefined}
              role={onAnalyseWithAmiio ? "button" : undefined}
              tabIndex={onAnalyseWithAmiio ? 0 : undefined}
              aria-expanded={onAnalyseWithAmiio ? openInsight === "performers" : undefined}
              aria-label={
                onAnalyseWithAmiio
                  ? "Top performers. Click to open Analyse with Amiio."
                  : undefined
              }
              className={cn(
                "rounded-lg border border-[#D1D5D9] bg-[#F8F9FA] p-3 outline-none transition-shadow",
                onAnalyseWithAmiio &&
                  "cursor-pointer hover:border-[#B3B8BD] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2",
                openInsight === "performers" && "border-[#1F9E8B]/40 ring-1 ring-[#1F9E8B]/25",
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (!onAnalyseWithAmiio) return;
                setOpenInsight((p) => (p === "performers" ? null : "performers"));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!onAnalyseWithAmiio) return;
                  setOpenInsight((p) => (p === "performers" ? null : "performers"));
                }
              }}
            >
              <div className="flex items-start gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[#1F9E8B]"
                  strokeWidth={2}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#1F9E8B]">Top performers</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#676A6E]">
                    Wenckebachweg (+4.2% GRI), Zuidas Tower (98% occupancy)
                  </p>
                </div>
              </div>
              {openInsight === "performers"
                ? renderInsightAnalysePill(
                    "top portfolio performers: Wenckebachweg (+4.2% GRI) and Zuidas Tower (98% occupancy)",
                  )
                : null}
            </div>

            <div
              data-portfolio-insight-widget={onAnalyseWithAmiio ? "" : undefined}
              role={onAnalyseWithAmiio ? "button" : undefined}
              tabIndex={onAnalyseWithAmiio ? 0 : undefined}
              aria-expanded={onAnalyseWithAmiio ? openInsight === "attention" : undefined}
              aria-label={
                onAnalyseWithAmiio
                  ? "Attention needed. Click to open Analyse with Amiio."
                  : undefined
              }
              className={cn(
                "rounded-lg border border-[#D1D5D9] bg-[#F8F9FA] p-3 outline-none transition-shadow",
                onAnalyseWithAmiio &&
                  "cursor-pointer hover:border-[#B3B8BD] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2",
                openInsight === "attention" && "border-[#D97706]/40 ring-1 ring-[#D97706]/20",
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (!onAnalyseWithAmiio) return;
                setOpenInsight((p) => (p === "attention" ? null : "attention"));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!onAnalyseWithAmiio) return;
                  setOpenInsight((p) => (p === "attention" ? null : "attention"));
                }
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-[#D97706]"
                  strokeWidth={2}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#D97706]">Attention needed</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#676A6E]">
                    Herengracht 123 (WALT declining to 2.8 yrs, 2 lease expiries Q1)
                  </p>
                </div>
              </div>
              {openInsight === "attention"
                ? renderInsightAnalysePill(
                    "Herengracht 123 — WALT declining to 2.8 years and 2 lease expiries in Q1",
                  )
                : null}
            </div>
          </div>

          <div className="mt-4 min-h-[4.5rem] border-t border-[#E6E8EB] pt-4">
            <p className="text-[12px] leading-relaxed text-[#7E8185]">
              <span className="font-semibold text-[#676A6E]">Key trends:</span>{" "}
              {!summaryComplete ? (
                <span className="text-[#969A9E]">…</span>
              ) : !keyTrendsTypingDone ? (
                <>
                  {KEY_TRENDS_PLAIN.slice(0, keyTrendsLen)}
                  <span
                    className="ml-0.5 inline-block h-[1em] w-px translate-y-0.5 animate-pulse bg-[#010309]"
                    aria-hidden
                  />
                </>
              ) : (
                <>
                  Average rent/sqm increased 3.1% across the portfolio. WALT decreased slightly
                  (-0.3 yrs) due to natural lease roll. Service charges remain stable at portfolio
                  average. Tenant sentiment score improved to 7.6/10 (+0.2 vs last quarter).
                </>
              )}
            </p>
          </div>
        </div>

        {/* KPI grid */}
        <div>
          <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
            Key metrics
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              title="Total Assets"
              icon={Building2}
              value="12"
              subtext="Properties in portfolio"
              chatTopic="Explain total assets count and how it compares to peer portfolios."
              chatLabel="Total Assets"
            />
            <KpiCard
              title="Portfolio Value"
              icon={Wallet}
              value="€245,000,000"
              subtext="vs Last Year: €238,000,000"
              delta="+2.9%"
              chatTopic="Interpret portfolio valuation change vs last year and key drivers."
              chatLabel="Portfolio Value"
            />
            <KpiCard
              title="Avg. Occupancy"
              icon={ArrowUpRight}
              value="94.2%"
              subtext="vs Last Month: 93.8%"
              delta="+0.4%"
              chatTopic="Analyse average occupancy trend and implications for revenue."
              chatLabel="Avg. Occupancy"
            />
            <KpiCard
              title="Total Tenants"
              icon={Users}
              value="87"
              subtext="vs Last Quarter: 84"
              delta="+3.6%"
              chatTopic="Discuss tenant count growth and concentration risk."
              chatLabel="Total Tenants"
            />
            <KpiCard
              title="Total GRI"
              icon={Wallet}
              value="€18,500,000"
              subtext="vs Last Year: €17,800,000"
              delta="+3.9%"
              chatTopic="Break down gross rental income growth vs last year."
              chatLabel="Total GRI"
            />
            <KpiCard
              title="Avg. WALT"
              icon={Calendar}
              value="4.8 yrs"
              subtext="vs Last Quarter: 5.1 yrs"
              delta="+5.9%"
              chatTopic="Explain weighted average lease term movement and renewal exposure."
              chatLabel="Avg. WALT"
            />
          </div>
        </div>

        {/* Trend charts */}
        <div>
          <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
            Trends
          </h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:[grid-template-rows:minmax(420px,auto)]">
            <TrendCard
              title="Rental Income Trend"
              heightsPct={[62, 72, 85, 100]}
              barMeta={RENTAL_BAR_META}
              onAnalyseWithAmiio={onAnalyseWithAmiio}
              metrics={[
                { label: "vs Last Period +€300,000" },
                { label: "vs Last Year +€700,000" },
                { label: "vs 2 Yrs Ago +2.3M" },
              ]}
            />
            <TrendCard
              title="Occupancy Trend"
              heightsPct={[88, 90, 93, 100]}
              barMeta={OCC_BAR_META}
              onAnalyseWithAmiio={onAnalyseWithAmiio}
              metrics={[
                { label: "vs Last Period +0.4%" },
                { label: "vs Last Year +1.1%" },
                { label: "vs 2 Yrs Ago +2.7%" },
              ]}
            />
            <TrendCard
              title="WALT Trend"
              heightsPct={[100, 96, 92, 88]}
              barMeta={WALT_BAR_META}
              onAnalyseWithAmiio={onAnalyseWithAmiio}
              metrics={[
                { label: "vs Last Period -0.1 yrs", valueClass: "text-[#1F9E8B]" },
                { label: "vs Last Year -0.3 yrs", valueClass: "text-[#1F9E8B]" },
                { label: "vs 2 Yrs Ago -0.6 yrs", valueClass: "text-[#1F9E8B]" },
              ]}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
