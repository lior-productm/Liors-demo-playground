"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Bot,
  ChevronUp,
  ChevronDown,
  Clock,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Lightbulb,
  Building2,
  Clipboard,
  Share2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { BuildingThumb } from "@/src/components/commercial/BuildingThumb";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import {
  AmiioAiDisclaimerTrigger,
  AMIIO_AI_DISCLAIMER,
  defaultLampTooltipSummary,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AmiioAnalyseIcon } from "@/src/components/commercial/AmiioAnalyseIcon";
import {
  AmiioExpandableInsightRow,
  AmiioExpandableRecentActionRow,
} from "@/src/components/commercial/AmiioExpandableRow";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";

/* ------------------------------------------------------------------ */
/*  Collapsible wrapper                                                */
/* ------------------------------------------------------------------ */

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  headerTrailing,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  /** Rendered to the right of the insight lamp (e.g. export menu). */
  headerTrailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)]",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex w-full items-center gap-2 px-6 py-4">
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
          {icon}
          <span className="text-[18px] font-medium text-[#2C2C2C]">{title}</span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <WidgetHeaderLamp
            chatTopic={`Review "${title}" on the Property Hub: summarise KPIs, outliers, and recommended next steps.`}
            chatLabel={title}
          />
          {headerTrailing}
        </div>
      </div>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared tiny components                                             */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-medium uppercase text-[#676A6E]">
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-medium text-[#65686B]">{children}</div>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[14px] font-medium text-[#2C2C2C]">
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#010309] px-2.5 py-0.5 text-[12px] font-normal text-white">
      {children}
    </span>
  );
}

function MiniDonut({
  pct,
  size = 40,
  strokeWidth = 6,
  color = "#1F9E8B",
  track = "#E6E8EB",
}: {
  pct: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  track?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, pct));
  const dash = (filled / 100) * c;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      <g transform={`translate(${size / 2} ${size / 2})`}>
        <circle
          r={r}
          fill="transparent"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        <circle
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}

function TrendBadge({
  value,
  label,
  direction,
}: {
  value: string;
  label: string;
  direction: "up" | "down" | "neutral";
}) {
  return (
    <div className="flex items-center gap-2">
      <TrendPill direction={direction} pct={value} />
      <span className="text-[12px] font-normal text-[#7E8185]">{label}</span>
    </div>
  );
}

const AnalyseIcon = AmiioAnalyseIcon;

/* ------------------------------------------------------------------ */
/*  1. Investment Summary                                              */
/* ------------------------------------------------------------------ */

function InvestmentSummary() {
  return (
    <div className="flex w-full items-start justify-between gap-6">
      {/* Picture section — Demo Collapsible Summary Table: 226×226, radius 8, 8px gap to location */}
      <div className="flex shrink-0 flex-col gap-2">
        <div className="relative h-[226px] w-[226px] shrink-0 overflow-hidden rounded-[8px] bg-[#D9D9D9]">
          <BuildingThumb
            className="absolute inset-0 h-full w-full rounded-[8px]"
            alt="H.J.E. Wenckebachweg 123"
          />
        </div>
        <div className="flex items-center gap-[11px]">
          <MapPin className="h-4 w-4 shrink-0 text-[#2C2C2C]" />
          <div className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">
            H.J.E. Wenckebachweg 123
            <br />
            Amsterdam
          </div>
        </div>
      </div>

      {/* 4-column info grid */}
      <div className="min-w-0 flex-1 xl:max-w-[693px]">
        <div className="flex gap-10 border-b border-[rgba(230,231,232,0.7)] pb-2">
          {["KEY INFO", "CLASSIFICATION", "CHARACTERISTICS", "KEY INFO"].map(
            (h, i) => (
              <div
                key={`${h}-${i}`}
                className="w-[144px] text-[12px] font-medium text-[#65686B]"
              >
                {h}
              </div>
            ),
          )}
        </div>
        <div className="mt-3 flex gap-10">
          <InfoCol
            rows={[
              ["SPV", "Wenckebachweg Amsterdam BV"],
              ["Valuation", "€47,225,000"],
              ["Asset Manager", "Sandra van Holland"],
              [
                "Energy Label",
                <Pill key="el">A</Pill>,
              ],
            ]}
          />
          <InfoCol
            rows={[
              ["Asset Use", "Office"],
              ["Type", "Core+"],
              ["Tenure", "Freehold"],
              ["Tenant Type", "Multi"],
            ]}
          />
          <InfoCol
            rows={[
              ["Condition", <Pill key="cond">B (Good)</Pill>],
              ["Location", <Pill key="loc">A (Excellent)</Pill>],
              ["Year Built", "2000"],
              ["Floors", "4"],
            ]}
          />
          <InfoCol
            rows={[
              ["Plot Size", "10,757"],
              ["GFA", "€14,423.25"],
              ["LFA", "13,170.2"],
              [
                "Vacancy",
                <span key="vac" className="flex items-center gap-2">
                  <MiniDonut pct={0} size={24} strokeWidth={3} color="#010309" />
                  <span className="text-[14px] font-medium text-[#121212]">
                    0%
                  </span>
                </span>,
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCol({
  rows,
}: {
  rows: [string, React.ReactNode][];
}) {
  return (
    <div className="flex w-[144px] flex-col gap-3">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <FieldLabel>{k}</FieldLabel>
          <FieldValue>{v}</FieldValue>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Amiio's Property Summary                                        */
/* ------------------------------------------------------------------ */

const summaryItems = [
  {
    id: "s1",
    text: "Occupancy improved by 2.3% since last visit, driven by new lease signed with Tech Solutions B.V. for 850 sqm on the 3rd floor.",
    time: "2 days ago",
    fullDescription:
      "Tech Solutions B.V. signed a 7-year lease for 850 sqm on level 3 after a competitive shortlist. The deal lifts building occupancy to 94.1% and removes the last large vacancy plate on the typical floor.\n\nAmiio matched the headline rent to three inner-ring logistics comparables and flagged service-charge recovery as the main negotiation lever in year 1.",
    recentActionLines: [
      "Asset manager logged a site visit outcome and uploaded the signed LOI to the data room.",
      "Leasing analyst refreshed the stacking plan and pushed an occupancy delta to the weekly portfolio digest.",
      "Finance reconciled TI allowances against the capex sub-ledger for this suite.",
    ],
  },
  {
    id: "s2",
    text: "WALT decreased from 4.8 to 4.2 years due to approaching lease expiry of Logistics Plus (Q2 2026). Renewal discussions should be initiated.",
    time: "5 days ago",
    fullDescription:
      "Logistics Plus represents 12% of gross rental income on the asset. Their current term ends Q2 2026 with a rolling break in Q4 2025 that has not yet been exercised.\n\nAmiio recommends opening renewal talks now with a base-case 3% uplift and a relocation contingency playbook if they push for footprint reduction.",
    recentActionLines: [
      "Portfolio lead scheduled a renewal workshop with the tenant relationship owner.",
      "Legal pulled the indexation schedule and last three rent invoices for diligence.",
      "No formal renewal proposal has been issued yet — status is “prepare”.",
    ],
  },
  {
    id: "s3",
    text: "CAPEX execution at 68% of budget. Elevator modernization project on track for Q1 2026 completion.",
    time: "1 week ago",
    fullDescription:
      "The modernization bundle covers two passenger lifts and associated lobby finishes. Spend to date tracks the phasing plan; the main contractor confirmed commissioning slots for January 2026.\n\nAmiio cross-checked accruals vs. the approved CapEx envelope and found no overrun risk on current burn rate.",
    recentActionLines: [
      "PMO uploaded the latest contractor milestone report.",
      "Engineering signed off on interim safety inspections for cab interiors.",
      "Treasury approved the next draw against the CapEx facility.",
    ],
  },
  {
    id: "s4",
    text: "Tenant sentiment score improved to 8.2/10 following completion of parking area improvements.",
    time: "2 weeks ago",
    fullDescription:
      "Post-project surveys show a +0.6pt lift in “access & convenience” scores. Open comments reference shorter wait times at peak and better EV bay availability.\n\nAmiio’s NLP cluster tagged recurring praise for wayfinding signage; no new critical complaints were detected in the same window.",
    recentActionLines: [
      "Customer success exported survey results to the tenant-experience dashboard.",
      "Facilities closed the final punch-list for lighting in P1.",
      "Marketing drafted a short “what changed” note for occupier comms.",
    ],
  },
];

function AmiioSummarySection({
  onAnalyseWithAmiio,
}: {
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {summaryItems.map((it) => (
        <AmiioExpandableInsightRow
          key={it.id}
          summary={it.text}
          when={it.time}
          fullDescription={it.fullDescription}
          recentActionLines={it.recentActionLines}
          useTypewriterSummary={false}
          hideExpandedAnalyseButton
          onAnalyseFurther={(topic) =>
            onAnalyseWithAmiio?.(`Property summary — ${topic}`)
          }
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Major Metrics Bar                                               */
/* ------------------------------------------------------------------ */

function MajorMetricsBar({
  onAnalyse,
}: {
  onAnalyse?: (topic: string) => void;
}) {
  return (
    <div className="flex gap-6">
      {/* WAULT */}
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-start justify-between">
          <SectionLabel>WAULT</SectionLabel>
          <AmiioAiDisclaimerTrigger
            variant="lamp"
            lampSummary={defaultLampTooltipSummary(
              "WAULT",
              "Weighted average unexpired lease term (4.2 yrs) with a short historical sparkline.",
            )}
          >
            <AnalyseIcon
              onClick={() => onAnalyse?.("WAULT and weighted average lease term trend")}
            />
          </AmiioAiDisclaimerTrigger>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="flex min-w-[160px] flex-col justify-between">
            <div className="text-[24px] font-medium text-[#353638]">
              4.2 years
            </div>
            <TrendBadge value="1.5%" label="vs last period" direction="up" />
          </div>
          <svg
            width="103"
            height="42"
            viewBox="0 0 103 42"
            fill="none"
            className="shrink-0"
          >
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#588CB3" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#588CB3" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M2 34 L14 28 L26 30 L38 18 L50 22 L62 10 L74 14 L86 4 L100 8 L100 42 L2 42 Z"
              fill="url(#sparkGrad)"
            />
            <path
              d="M2 34 L14 28 L26 30 L38 18 L50 22 L62 10 L74 14 L86 4 L100 8"
              stroke="#588CB3"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Occupancy Rate */}
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <SectionLabel>Occupancy Rate</SectionLabel>
            <div>
              <div className="text-[24px] font-medium text-[#353638]">
                99.5%
              </div>
              <TrendBadge value="1.5%" label="vs last period" direction="up" />
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-2">
            <AmiioAiDisclaimerTrigger
              variant="lamp"
              lampSummary={defaultLampTooltipSummary(
                "Occupancy rate",
                "Letting level (99.5%) vs last period, with a compact share donut for context.",
              )}
            >
              <AnalyseIcon
                onClick={() => onAnalyse?.("occupancy rate and letting performance")}
              />
            </AmiioAiDisclaimerTrigger>
            <MiniDonut pct={99.5} size={56} strokeWidth={7} color="#1F9E8B" />
          </div>
        </div>
      </div>

      {/* Vacancy Rate */}
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <SectionLabel>Vacancy Rate</SectionLabel>
            <div>
              <div className="text-[24px] font-medium text-[#353638]">
                0.5%
              </div>
              <TrendBadge value="1.5%" label="vs last period" direction="down" />
            </div>
          </div>
          <div className="flex flex-col items-end justify-between gap-2">
            <AmiioAiDisclaimerTrigger
              variant="lamp"
              lampSummary={defaultLampTooltipSummary(
                "Vacancy rate",
                "Void exposure (0.5%) and change vs last period, paired with a share indicator.",
              )}
            >
              <AnalyseIcon
                onClick={() => onAnalyse?.("vacancy rate and void exposure")}
              />
            </AmiioAiDisclaimerTrigger>
            <MiniDonut pct={0.5} size={56} strokeWidth={7} color="#588CB3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Minor Metrics Bar                                               */
/* ------------------------------------------------------------------ */

const miniMetrics = [
  { label: "Tenant Retention Rate", value: "80%", delta: "1.5%", sub: "vs previous year", direction: "down" as const },
  { label: "Net Absorption", value: "-0.9%", delta: "1.5%", sub: "vs previous year", direction: "down" as const },
  { label: "Average Rent per m²", value: "€239", delta: "1.5%", sub: "vs previous year", direction: "down" as const },
  { label: "Total GRI", value: "€3,146,703", delta: "0%", sub: "vs previous year", direction: "neutral" as const },
  { label: "NRI", value: "3%", delta: "0%", sub: "vs previous year", direction: "neutral" as const },
];

function MinorMetricsBar() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="absolute right-4 top-4 z-10">
        <WidgetHeaderLamp
          chatTopic="Explain the Minor Metrics bar (retention, absorption, rent per m², GRI, NRI) vs prior year and what actions to take."
          chatLabel="Minor metrics"
        />
      </div>
      <div className="flex items-center gap-4 pr-12">
        {miniMetrics.map((m, idx) => (
          <div key={m.label} className="flex flex-1 items-center gap-4">
            <div className="flex-1">
              <div className="text-[14px] font-medium text-[#65686B]">
                {m.label}
              </div>
              <div className="mt-2 text-[18px] font-medium text-[#353638]">
                {m.value}
              </div>
              <div className="mt-2">
                <TrendBadge value={m.delta} label={m.sub} direction={m.direction} />
              </div>
            </div>
            {idx < miniMetrics.length - 1 && (
              <div className="h-16 w-px bg-[#E6E8EB]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Charts Row                                                      */
/* ------------------------------------------------------------------ */

const donutSegments = [
  { label: "ScaleHub", pct: 25, color: "#040617" },
  { label: "Waaier Nederland...", pct: 10, color: "#233FDE" },
  { label: "LeaseForce B.V.", pct: 10, color: "#86C5CE" },
  { label: "Aroundtown...", pct: 20, color: "#B3B8BD" },
  { label: "Schweppes Intern...", pct: 10, color: "#D7ECEF" },
  { label: "Management", pct: 25, color: "#E6E8EB" },
] as const;

/** Match legacy 170×170 viewBox: inner 41, outer 63 → scaled to 280px plot. */
const GRI_PIE_INNER = Math.round((41 / 85) * 140);
const GRI_PIE_OUTER = Math.round((63 / 85) * 140);

function GriDonutChart({ onAnalyse, onOpenTenantHub }: { onAnalyse?: (topic: string) => void; onOpenTenantHub?: () => void }) {
  const exportRef = useRef<HTMLDivElement>(null);
  const griPieData = useMemo(
    () => donutSegments.map((s) => ({ name: s.label, value: s.pct, fill: s.color })),
    [],
  );

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      ref={exportRef}
      className={cn(
        "relative rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[18px] font-medium text-[#2C2C2C]">
          GRI (% Of Total)
        </div>
        <div className="flex items-center gap-2">
          <AmiioAiDisclaimerTrigger
            variant="lamp"
            lampSummary={defaultLampTooltipSummary(
              "GRI (% of total)",
              "Donut shows each tenant’s share of gross rental income for this asset.",
            )}
          >
            <AnalyseIcon onClick={() => onAnalyse?.("the GRI distribution across tenants")} />
          </AmiioAiDisclaimerTrigger>
          <WidgetExportMenu
            variant="chart"
            fileName="gri-distribution"
            captureRef={exportRef}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 items-start gap-8 sm:grid-cols-[minmax(220px,44%)_1fr] sm:items-center">
        <div className="relative mx-auto flex h-[280px] w-full max-w-[280px] justify-center sm:mx-0 sm:justify-start">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <Pie
                isAnimationActive={false}
                data={[{ name: "_track", value: 100, fill: "#F2F4F7" }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={GRI_PIE_INNER}
                outerRadius={GRI_PIE_OUTER}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="#F2F4F7" />
              </Pie>
              <Pie
                {...AMIIO_CHART_MOTION}
                data={griPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={GRI_PIE_INNER}
                outerRadius={GRI_PIE_OUTER}
                paddingAngle={0.6}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                onMouseEnter={(_, index) => {
                  if (typeof index === "number") setHovered(index);
                }}
                onMouseLeave={() => setHovered(null)}
              >
                {griPieData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={entry.fill}
                    className="cursor-pointer outline-none"
                    style={{
                      opacity: hovered !== null && hovered !== idx ? 0.4 : 1,
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {hovered !== null && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1 text-center">
              <span className="text-[20px] font-semibold text-[#353638]">
                {donutSegments[hovered]?.pct}%
              </span>
              <span className="mt-0.5 max-w-[min(200px,80%)] text-[13px] text-[#969A9E]">
                {donutSegments[hovered]?.label}
              </span>
            </div>
          )}
        </div>
        <div className="relative min-w-0 space-y-2.5 sm:py-1">
          {donutSegments.map((s, idx) => (
            <div
              key={s.label}
              className={cn(
                "flex min-h-[36px] items-center justify-between gap-3 rounded-md px-2 py-1 transition-colors",
                hovered === idx ? "bg-[#F2F4F7]" : "",
              )}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
                {onOpenTenantHub ? (
                  <button
                    type="button"
                    onClick={() => onOpenTenantHub()}
                    className="min-w-0 text-left text-[13px] font-medium leading-snug text-[#233FDE] underline-offset-2 hover:underline"
                  >
                    {s.label}
                  </button>
                ) : (
                  <span className="text-[13px] font-medium leading-snug text-[#969A9E]">{s.label}</span>
                )}
              </div>
              <span className="shrink-0 text-[13px] font-medium tabular-nums text-[#353638]">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Core Design System — Single Bar chart (Figma 1631:76158 / 5748:47655) */
const LEASE_EXPIRY_MAX_EUR = 350_000;
const leaseExpiryYTicks = [350_000, 280_000, 210_000, 140_000, 70_000, 0] as const;
/** Bar heights (px) in 288px plot — from Desktop-Comfort default component */
const leaseExpiryBarHeightsPx = [106, 173, 259, 217, 151, 95] as const;
const leaseExpiryData = [
  { year: "2025", euros: 143_243 },
  { year: "2026", euros: 147_843 },
  { year: "2027", euros: 350_000 },
  { year: "2028", euros: 293_243 },
  { year: "2029", euros: 204_054 },
  { year: "2035", euros: 128_378 },
] as const;

const LEASE_PLOT_H = 288;
const LEASE_VIEWPORT_MIN_H = 312;

function formatLeaseExpiryAxis(n: number) {
  return `€${n / 1000}K`;
}

function formatLeaseExpiryTooltip(n: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function LeaseExpiryValueMarker({ className }: { className?: string }) {
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

function LeaseExpiryChart({ onAnalyse }: { onAnalyse?: (topic: string) => void }) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [clickedBarIdx, setClickedBarIdx] = useState<number | null>(null);
  const highlightIdx = 1;

  useEffect(() => {
    if (clickedBarIdx === null) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("[data-lease-expiry-bar]") ||
        el.closest("[data-lease-expiry-analyse]")
      ) {
        return;
      }
      setClickedBarIdx(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clickedBarIdx]);

  return (
    <div
      ref={exportRef}
      className={cn(
        "relative rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
            Lease Expiry
          </h3>
          <div className="flex items-center gap-2">
            {onAnalyse ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AnalyseIcon
                      nativeTitle={false}
                      onClick={() =>
                        onAnalyse(
                          "the lease expiry schedule and renewal risks",
                        )
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={6}
                    className="max-w-[260px] border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium text-[#F0F2F5]"
                  >
                    <p>Analyse with Amiio</p>
                    <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal leading-snug text-[#F0F2F5]/90">
                      {AMIIO_AI_DISCLAIMER}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
            <WidgetExportMenu
              variant="chart"
              fileName="lease-expiry"
              captureRef={exportRef}
            />
          </div>
        </div>

        <div
          className="relative w-full shrink-0 rounded-[24px]"
          style={{ minHeight: LEASE_VIEWPORT_MIN_H }}
          data-lease-expiry-chart
        >
          <div className="flex gap-2">
            <div
              className="flex w-10 shrink-0 flex-col justify-between text-[12px] font-normal leading-[1.24] text-[#65686B]"
              style={{ height: LEASE_PLOT_H }}
            >
              {leaseExpiryYTicks.map((t) => (
                <span key={t}>{formatLeaseExpiryAxis(t)}</span>
              ))}
            </div>

            <div className="relative min-w-0 flex-1">
              <div
                className="pointer-events-none absolute inset-x-0 top-0"
                style={{ height: LEASE_PLOT_H }}
              >
                {leaseExpiryYTicks.map((tick) => (
                  <div
                    key={tick}
                    className="absolute left-0 right-0 border-t border-dotted border-[#E6E8EB]"
                    style={{
                      bottom: `${(tick / LEASE_EXPIRY_MAX_EUR) * 100}%`,
                    }}
                  />
                ))}
              </div>

              <TooltipProvider delayDuration={200}>
              <div
                className="relative flex items-end justify-between"
                style={{ height: LEASE_PLOT_H }}
              >
                {leaseExpiryData.map((d, idx) => {
                  const h = leaseExpiryBarHeightsPx[idx] ?? 0;
                  const active = hoveredBar === idx;
                  const isHighlight = idx === highlightIdx && hoveredBar === null;
                  const showValueTooltip =
                    active || isHighlight || clickedBarIdx === idx;
                  const useSecondary900 =
                    active || isHighlight || clickedBarIdx === idx;
                  const dimOthers =
                    (hoveredBar !== null && hoveredBar !== idx) ||
                    (clickedBarIdx !== null && clickedBarIdx !== idx);

                  return (
                    <div
                      key={d.year}
                      className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {showValueTooltip && (
                        <>
                          <div
                            className="absolute left-1/2 z-10 -translate-x-1/2 rounded-lg bg-[#060B27] p-2 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)]"
                            style={{ bottom: h + 20 }}
                          >
                            <p className="whitespace-nowrap text-[14px] font-medium leading-[1.24] text-[#F0F2F5]">
                              {formatLeaseExpiryTooltip(d.euros)}
                            </p>
                          </div>
                          <div
                            className="absolute left-1/2 z-[5] -translate-x-1/2"
                            style={{ bottom: h - 8 }}
                          >
                            <LeaseExpiryValueMarker />
                          </div>
                        </>
                      )}
                      <div
                        data-lease-expiry-bar
                        role="button"
                        tabIndex={0}
                        aria-label={`${d.year}, ${formatLeaseExpiryTooltip(d.euros)}. Click for Analyse with Amiio.`}
                        className={cn(
                          "w-10 max-w-full shrink-0 cursor-pointer rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2",
                          useSecondary900 ? "bg-[#436367]" : "bg-[#70A4AC]",
                          dimOthers && "opacity-45",
                        )}
                        style={{ height: h }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!onAnalyse) return;
                          setClickedBarIdx((prev) => (prev === idx ? null : idx));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (!onAnalyse) return;
                            setClickedBarIdx((prev) => (prev === idx ? null : idx));
                          }
                        }}
                      />
                      {clickedBarIdx === idx && onAnalyse && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                data-lease-expiry-analyse
                                className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[32px] border border-[#D1D5D9] bg-[#F0F2F5] px-2.5 py-1.5 text-left shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)] transition-colors hover:bg-[#E6E8EB]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAnalyse(
                                    `lease expiry in ${d.year} (${formatLeaseExpiryTooltip(d.euros)})`,
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
                                Send an analysis request to chat for {d.year}{" "}
                                ({formatLeaseExpiryTooltip(d.euros)})
                              </p>
                              <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal text-[#F0F2F5]/90">
                                {AMIIO_AI_DISCLAIMER}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
              </TooltipProvider>

              <div className="mt-2 flex justify-between text-[12px] font-medium leading-[1.25] text-[#65686B]">
                {leaseExpiryData.map((d) => (
                  <div
                    key={d.year}
                    className="flex min-w-0 flex-1 justify-center"
                  >
                    <span className="truncate">{d.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Service Charges                                                 */
/* ------------------------------------------------------------------ */

const SERVICE_CHARGES_EXCEL = {
  columns: ["Metric", "Value", "Detail"],
  rows: [
    ["Advance Payment", "€892,500", "green"],
    ["Actual Expenses", "€847,320", "vs previous year"],
    ["Balance", "+€45,180", "Surplus to return"],
    ["Budget Variance", "-5.1%", "Under budget"],
  ],
};

function ServiceChargesSection() {
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <CollapsibleSection
      title="Service Charges"
      headerTrailing={
        <WidgetExportMenu
          variant="table"
          fileName="service-charges"
          captureRef={exportRef}
          excel={SERVICE_CHARGES_EXCEL}
        />
      }
    >
      <div ref={exportRef} className="relative">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Advance Payment"
            value="€892,500"
            indicator="green"
          />
          <MetricCard
            label="Actual Expenses"
            value="€847,320"
            sub="vs previous year"
          />
          <MetricCard
            label="Balance"
            value="+€45,180"
            indicator="green"
            sub="→ Surplus to return"
          />
          <MetricCard
            label="Budget Variance"
            value="-5.1%"
            indicator="red"
            sub="→ Under budget"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

function MetricCard({
  label,
  value,
  indicator,
  sub,
}: {
  label: string;
  value: string;
  indicator?: "green" | "red";
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-4 py-3">
      <div className="text-[14px] font-medium text-[#65686B]">
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {indicator && (
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              indicator === "green" ? "bg-[#1CAB9F]" : "bg-[#C84E69]",
            )}
          />
        )}
        <span className="text-[18px] font-medium text-[#353638]">
          {value}
        </span>
      </div>
      {sub && (
        <div
          className={cn(
            "mt-1 text-[12px] font-medium",
            indicator === "green"
              ? "text-[#1CAB9F]"
              : indicator === "red"
                ? "text-[#C84E69]"
                : "text-[#7E8185]",
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Financial Performance                                           */
/* ------------------------------------------------------------------ */

const historicalRows = [
  ["NRI", "€3,035,956", "€3,035,972", "€2,906,252", "€2,359,736"],
  ["Occupancy", "100.0%", "100.0%", "100.0%", "100.0%"],
  ["Incentive %", "3.6%", "3.6%", "5.6%", "5.6%"],
  ["WALT", "4.4 yrs", "4.4 yrs", "5.0 yrs", "5.0 yrs"],
];

const budgetRows = [
  { label: "Income (GRI)", actual: "€3,149,596", budget: "€3,100,000", actualPct: 92, budgetPct: 88, delta: "↗ 1.5%" },
  { label: "Income (GRI)", actual: "€3,149,596", budget: "€3,100,000", actualPct: 92, budgetPct: 88, delta: "↗ 1.5%" },
  { label: "NOI", actual: "€3,149,596", budget: "€3,100,000", actualPct: 85, budgetPct: 78, delta: "↗ 1.5%" },
  { label: "CAPEX", actual: "€3,149,596", budget: "€3,100,000", actualPct: 65, budgetPct: 60, delta: "↗ 1.5%" },
  { label: "OPEX", actual: "€3,149,596", budget: "€3,100,000", actualPct: 55, budgetPct: 50, delta: "↗ 1.5%" },
];

function FinancialPerformance() {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-stretch">
      {/* Historical Performance */}
      <div
        className={cn(
          "group flex min-h-0 flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-6 py-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="text-[18px] font-medium text-[#2C2C2C]">
            Historical Performance
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <WidgetHeaderLamp
                chatTopic="Interpret Historical Performance metrics (NRI, occupancy, incentive %, WALT) and trends vs prior periods."
                chatLabel="Historical Performance"
              />
            </span>
          </div>
        </div>
        <div className="mt-3 min-w-0 overflow-x-auto rounded-md border border-[#E6E8EB]">
          <div
            className="grid w-full min-w-[28rem] grid-cols-[minmax(5.25rem,22%)_repeat(4,minmax(4.25rem,1fr))] bg-white text-[13px] tabular-nums"
            role="table"
            aria-label="Historical performance by period"
          >
            <div
              className="border-b border-[#E6E8EB] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#969A9E] sm:px-4 sm:text-[12px]"
              role="columnheader"
            >
              Metric
            </div>
            <div
              className="border-b border-[#E6E8EB] px-2 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#969A9E] sm:px-3 sm:text-[12px]"
              role="columnheader"
            >
              DEC &apos;25
            </div>
            <div
              className="border-b border-[#E6E8EB] px-2 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#969A9E] sm:px-3 sm:text-[12px]"
              role="columnheader"
            >
              NOV &apos;25
            </div>
            <div
              className="border-b border-[#E6E8EB] px-2 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#969A9E] sm:px-3 sm:text-[12px]"
              role="columnheader"
            >
              DEC &apos;24
            </div>
            <div
              className="border-b border-[#E6E8EB] px-2 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#969A9E] sm:px-3 sm:text-[12px]"
              role="columnheader"
            >
              DEC &apos;22
            </div>
            {historicalRows.map((row) => (
              <div key={row[0]} className="contents" role="row">
                <div className="border-t border-[#E6E8EB] px-3 py-2.5 font-medium text-[#353638] sm:px-4 sm:py-3">
                  {row[0]}
                </div>
                <div className="border-t border-[#E6E8EB] px-2 py-2.5 text-right font-medium text-[#969A9E] sm:px-3 sm:py-3">
                  {row[1]}
                </div>
                <div className="border-t border-[#E6E8EB] px-2 py-2.5 text-right font-medium text-[#969A9E] sm:px-3 sm:py-3">
                  {row[2]}
                </div>
                <div className="border-t border-[#E6E8EB] px-2 py-2.5 text-right font-medium text-[#969A9E] sm:px-3 sm:py-3">
                  {row[3]}
                </div>
                <div className="border-t border-[#E6E8EB] px-2 py-2.5 text-right font-medium text-[#969A9E] sm:px-3 sm:py-3">
                  {row[4]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance vs Budget */}
      <div
        className={cn(
          "group flex min-h-0 h-full flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-6 py-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-[18px] font-medium text-[#2C2C2C]">
            Performance vs budget
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <WidgetHeaderLamp
                chatTopic="Explain Performance vs budget: actual vs budget bars, deltas, and where to focus remediation."
                chatLabel="Performance vs budget"
              />
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {budgetRows.map((r, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#353638]">{r.label}</span>
                <span className="font-medium text-[#1F9E8B]">{r.delta}</span>
              </div>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#E6E8EB]">
                    <div
                      className="h-2 rounded-full bg-[#040617]"
                      style={{ width: `${r.actualPct}%` }}
                    />
                  </div>
                  <span className="w-[80px] text-right text-[12px] font-medium text-[#969A9E]">
                    {r.actual}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#E6E8EB]">
                    <div
                      className="h-2 rounded-full bg-[#E6E8EB]"
                      style={{ width: `${r.budgetPct}%` }}
                    />
                  </div>
                  <span className="w-[80px] text-right text-[12px] font-medium text-[#969A9E]">
                    {r.budget}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex gap-4 text-[12px] font-medium text-[#969A9E]">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#040617]" />
                  Actual
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E6E8EB]" />
                  Budget
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Indicative Valuation & CAPEX (nested under Financial Performance) */
/* ------------------------------------------------------------------ */

function ValuationAndCapex({
  capRate,
  onCapRateChange,
}: {
  capRate: number;
  onCapRateChange: (rate: number) => void;
}) {
  const NOI = 3_035_956;
  const CURRENT_VAL = 47_225_000;
  const LFA_SQM = 11_272;

  const MIN_RATE = 3.0;
  const MAX_RATE = 8.0;

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const indicativeValue = Math.round(NOI / (capRate / 100));
  const perSqm = Math.round(indicativeValue / LFA_SQM);
  const variancePct = ((indicativeValue - CURRENT_VAL) / CURRENT_VAL) * 100;
  const varianceAbs = indicativeValue - CURRENT_VAL;

  const pctPosition = ((capRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100;

  const fmt = (n: number) =>
    "€" + Math.abs(n).toLocaleString("en-IE", { maximumFractionDigits: 0 });

  const updateFromMouse = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rate = MIN_RATE + pct * (MAX_RATE - MIN_RATE);
      onCapRateChange(Math.round(rate * 20) / 20); // snap to 0.05
    },
    [onCapRateChange],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      updateFromMouse(e.clientX);
      const onMove = (ev: MouseEvent) => {
        if (isDragging.current) updateFromMouse(ev.clientX);
      };
      const onUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [updateFromMouse],
  );

  const scenarios = [
    { label: "Current Valuation", rate: 6.5 },
    { label: "Base Case", rate: 5.5 },
    { label: "Aggressive", rate: 4.5 },
  ].map((s) => {
    const val = Math.round(NOI / (s.rate / 100));
    return { ...s, value: fmt(val), pct: Math.min(100, Math.round((val / 70_000_000) * 100)) };
  });

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {/* Indicative Valuation */}
      <div
        className={cn(
          "group rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-[18px] font-medium text-[#2C2C2C]">
            Indicative Valuation
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <WidgetHeaderLamp
                chatTopic="Walk through Indicative Valuation: cap-rate sensitivity, variance vs book, and scenario implications."
                chatLabel="Indicative Valuation"
              />
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="text-[12px] font-medium text-[#353638]">
            CAP RATE
          </div>
          <Badge className="bg-[#1F9E8B] px-2 text-[12px] font-medium text-white hover:bg-[#1F9E8B]">
            {capRate.toFixed(2)}%
          </Badge>
        </div>

        {/* Interactive Slider */}
        <div className="mt-3">
          <div
            ref={sliderRef}
            className="relative h-2 cursor-pointer rounded-full bg-[#E6E8EB]"
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-[#1F9E8B] transition-[width] duration-75"
              style={{ width: `${pctPosition}%` }}
            />
            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1F9E8B] shadow-md transition-[left] duration-75 hover:scale-110"
              style={{ left: `${pctPosition}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[12px] font-medium text-[#969A9E]">
            <span>{MIN_RATE.toFixed(2)}%</span>
            <span>{MAX_RATE.toFixed(2)}%</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <ValRow label="Indicative Value" value={fmt(indicativeValue)} />
          <ValRow label="Per sqm" value={fmt(perSqm)} />
          <ValRow label="NOI" value={fmt(NOI)} />
        </div>

        <div className="mt-3 h-px bg-[#E6E8EB]" />

        <div className="mt-3 space-y-2">
          <ValRow label="Current Valuation" value={fmt(CURRENT_VAL)} />
          <ValRow label="Current per sqm" value={fmt(Math.round(CURRENT_VAL / LFA_SQM))} />
        </div>

        <div className="mt-3 rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-3 py-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#969A9E]">VARIANCE</span>
            <TrendPill
              direction={varianceAbs >= 0 ? "up" : "down"}
              pct={`${Math.abs(variancePct).toFixed(1)}% ${varianceAbs >= 0 ? "+" : "-"}${fmt(varianceAbs)}`}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[12px] font-medium uppercase tracking-wider text-[#969A9E]">
            SCENARIOS
          </div>
          <div className="mt-2 space-y-2">
            {scenarios.map((s) => (
              <button
                type="button"
                key={s.label}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-1.5 py-1 text-[12px] transition-colors hover:bg-[#F2F4F7]",
                  Math.abs(s.rate - capRate) < 0.05 ? "bg-[#F2F4F7]" : "",
                )}
                onClick={() => onCapRateChange(s.rate)}
              >
                <div className="flex items-center gap-2">
                  <MiniDonut
                    pct={s.pct}
                    size={20}
                    strokeWidth={3}
                    color="#040617"
                  />
                  <span className="font-medium text-[#969A9E]">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#353638]">{s.value}</span>
                  <span className="text-[12px] font-medium text-[#969A9E]">
                    {s.rate}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CAPEX 2026 */}
      <div
        className={cn(
          "group rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-[18px] font-medium text-[#2C2C2C]">
            CAPEX 2026
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <WidgetHeaderLamp
                chatTopic="Analyse CAPEX 2026: invoicing progress, categories, and top line items vs plan."
                chatLabel="CAPEX 2026"
              />
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="text-[12px] font-medium text-[#353638]">
            INVOICED
          </div>
          <Badge className="bg-[#353638] px-2 text-[12px] font-medium text-white hover:bg-[#353638]">
            5%
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-[#E6E8EB]">
          <div className="h-2 rounded-full bg-[#040617]" style={{ width: "5%" }} />
        </div>

        <div className="mt-4 space-y-2">
          <ValRow label="Ordered" value="5%" />
          <ValRow label="Remaining" value="€712,783" />
        </div>

        <div className="mt-4">
          <div className="text-[12px] font-medium uppercase tracking-wider text-[#969A9E]">
            BY CATEGORY
          </div>
          <div className="mt-2 space-y-2">
            <div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#969A9E]">
                  Maintenance Capex
                </span>
                <span className="font-medium text-[#353638]">€707,833</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[#E6E8EB]">
                <div
                  className="h-2 rounded-full bg-[#040617]"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#969A9E]">
                  Sustainability
                </span>
                <span className="font-medium text-[#353638]">€40,000</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[#E6E8EB]">
                <div
                  className="h-2 rounded-full bg-[#040617]"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[12px] font-medium uppercase tracking-wider text-[#969A9E]">
            TOP ITEMS
          </div>
          <div className="mt-2 overflow-hidden rounded-md border border-[#E6E8EB]">
            {[
              { label: "(MC) Windows", amount: "€0", pct: "6.5%" },
              { label: "(MC) Other (roof)", amount: "€0", pct: "6.5%" },
              { label: "(MC) Lift installation", amount: "€6,820", pct: "2%" },
              { label: "(MC) Other (unforseen)", amount: "€16,822", pct: "55%" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "grid grid-cols-3 px-3 py-2 text-[12px]",
                  idx > 0 && "border-t border-[#E6E8EB]",
                )}
              >
                <span className="font-medium text-[#969A9E]">
                  {item.label}
                </span>
                <span className="text-right font-medium text-[#353638]">
                  {item.amount}
                </span>
                <span className="text-right font-medium text-[#969A9E]">
                  {item.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialPerformanceSection() {
  const exportRef = useRef<HTMLDivElement>(null);
  const [capRate, setCapRate] = useState(5.5);

  const NOI = 3_035_956;
  const CURRENT_VAL = 47_225_000;
  const LFA_SQM = 11_272;

  const indicativeValue = Math.round(NOI / (capRate / 100));
  const perSqm = Math.round(indicativeValue / LFA_SQM);
  const variancePct = ((indicativeValue - CURRENT_VAL) / CURRENT_VAL) * 100;
  const varianceAbs = indicativeValue - CURRENT_VAL;

  const fmtEuro = (n: number) =>
    "€" + Math.abs(n).toLocaleString("en-IE", { maximumFractionDigits: 0 });

  const valuationExcel = useMemo(
    () => ({
      columns: ["Metric", "Value"],
      rows: [
        ["Cap rate", `${capRate.toFixed(2)}%`],
        ["Indicative value", fmtEuro(indicativeValue)],
        ["Per sqm", fmtEuro(perSqm)],
        ["NOI", fmtEuro(NOI)],
        ["Current valuation", fmtEuro(CURRENT_VAL)],
        ["Current per sqm", fmtEuro(Math.round(CURRENT_VAL / LFA_SQM))],
        ["Variance %", `${variancePct.toFixed(1)}%`],
        ["Variance €", fmtEuro(varianceAbs)],
      ],
    }),
    [capRate, indicativeValue, perSqm, variancePct, varianceAbs],
  );

  const capexExcelStatic = useMemo(
    () => ({
      columns: ["Line", "Value", "Note"],
      rows: [
        ["Invoiced", "5%", ""],
        ["Ordered", "5%", ""],
        ["Remaining", "€712,783", ""],
        ["Maintenance Capex", "€707,833", "85%"],
        ["Sustainability", "€40,000", "5%"],
        ["(MC) Windows", "€0", "6.5%"],
        ["(MC) Other (roof)", "€0", "6.5%"],
        ["(MC) Lift installation", "€6,820", "2%"],
        ["(MC) Other (unforseen)", "€16,822", "55%"],
      ],
    }),
    [],
  );

  const excelWorkbook = useMemo(
    () => [
      {
        name: "Historical Performance",
        columns: ["Metric", "DEC '25", "NOV '25", "DEC '24", "DEC '22"],
        rows: historicalRows.map((row) => [...row]),
      },
      {
        name: "Performance vs budget",
        columns: ["Line", "Actual", "Budget", "Delta"],
        rows: budgetRows.map((r) => [r.label, r.actual, r.budget, r.delta]),
      },
      {
        name: "Indicative Valuation",
        columns: valuationExcel.columns,
        rows: valuationExcel.rows,
      },
      {
        name: "CAPEX 2026",
        columns: capexExcelStatic.columns,
        rows: capexExcelStatic.rows,
      },
    ],
    [valuationExcel, capexExcelStatic],
  );

  return (
    <CollapsibleSection
      title="Financial Performance"
      headerTrailing={
        <WidgetExportMenu
          variant="table"
          fileName="financial-performance"
          captureRef={exportRef}
          excelWorkbook={excelWorkbook}
        />
      }
    >
      <div ref={exportRef} className="flex flex-col gap-3">
        <FinancialPerformance />
        <ValuationAndCapex capRate={capRate} onCapRateChange={setCapRate} />
      </div>
    </CollapsibleSection>
  );
}

function ValRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="font-medium text-[#969A9E]">{label}</span>
      <span className="font-medium text-[#353638]">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Property Manager Updates + Asset Management Activities             */
/* ------------------------------------------------------------------ */

const serviceBreakdown = [
  {
    category: "HVAC",
    count: 4,
    status: "resolved",
    color: "bg-[#E6F6F3] text-[#1F9E8B]",
  },
  {
    category: "Electrical",
    count: 3,
    status: "in progress",
    color: "bg-[#FEF6E8] text-[#C27803]",
  },
  {
    category: "Plumbing",
    count: 2,
    status: "resolved",
    color: "bg-[#E6F6F3] text-[#1F9E8B]",
  },
  {
    category: "General Maintenance",
    count: 3,
    status: "pending",
    color: "bg-[#F2F4F7] text-[#676A6E]",
  },
];

const sentimentBreakdown = [
  { label: "Positive", pct: 68, dot: "#1F9E8B" },
  { label: "Neutral", pct: 24, dot: "#969A9E" },
  { label: "Negative", pct: 8, dot: "#C84E69" },
];

function PropertySubsectionHeader({
  icon: Icon,
  title,
  lampTopic,
  lampLabel,
}: {
  icon: LucideIcon;
  title: string;
  lampTopic: string;
  lampLabel: string;
}) {
  return (
    <div className="group mb-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-5 w-5 shrink-0 text-[#969A9E]" strokeWidth={1.75} aria-hidden />
        <h3 className="text-[16px] font-semibold text-[#2C2C2C]">{title}</h3>
      </div>
      <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
        <WidgetHeaderLamp chatTopic={lampTopic} chatLabel={lampLabel} />
      </span>
    </div>
  );
}

function PropertyManagementCards() {
  return (
    <div className="flex flex-col gap-8">
      {/* Service Requests — two cards */}
      <div>
        <PropertySubsectionHeader
          icon={Wrench}
          title="Service Requests"
          lampTopic="Review Service Requests: volume vs portfolio, status breakdown, and operational risks."
          lampLabel="Service Requests"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[rgba(230,231,232,0.85)] bg-white px-5 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px] font-medium text-[#676A6E]">This Month</span>
              <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
                <TrendPill direction="down" invert pct="33%" />
                <span className="text-[11px] font-medium text-[#969A9E]">vs portfolio</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
              <span className="text-[32px] font-semibold leading-none tracking-tight text-[#010309]">
                12
              </span>
              <span className="text-[14px] font-medium text-[#676A6E]">requests</span>
            </div>
            <p className="mt-3 text-[12px] font-medium text-[#969A9E]">
              Portfolio avg: 18 requests
            </p>
          </div>

          <div className="rounded-xl border border-[rgba(230,231,232,0.85)] bg-white px-5 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[13px] font-medium text-[#676A6E]">Status Breakdown</div>
            <ul className="mt-3 space-y-2.5">
              {serviceBreakdown.map((s) => (
                <li
                  key={s.category}
                  className="flex items-center justify-between gap-2 text-[13px]"
                >
                  <span className="font-medium text-[#353638]">{s.category}</span>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="tabular-nums font-semibold text-[#010309]">{s.count}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                        s.color,
                      )}
                    >
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tenant Email Sentiment — two cards */}
      <div>
        <PropertySubsectionHeader
          icon={Mail}
          title="Tenant Email Sentiment"
          lampTopic="Interpret tenant email sentiment: score trend, breakdown, and communication risks."
          lampLabel="Tenant Email Sentiment"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[rgba(230,231,232,0.85)] bg-white px-5 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px] font-medium text-[#676A6E]">Sentiment Score</span>
              <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
                <TrendPill direction="up" pct="+0.4" />
                <span className="text-[11px] font-medium text-[#969A9E]">vs last month</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-1">
              <span className="text-[32px] font-semibold leading-none tracking-tight text-[#010309]">
                7.8
              </span>
              <span className="text-[15px] font-medium text-[#969A9E]">/ 10</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-[#ECEEF0]">
              <div
                className="h-2 rounded-full bg-[#010309]"
                style={{ width: "78%" }}
              />
            </div>
            <p className="mt-2 text-[12px] font-medium text-[#969A9E]">
              Based on 156 emails analyzed
            </p>
          </div>

          <div className="rounded-xl border border-[rgba(230,231,232,0.85)] bg-white px-5 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[13px] font-medium text-[#676A6E]">Sentiment Breakdown</div>
            <ul className="mt-3 space-y-2.5">
              {sentimentBreakdown.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="flex items-center gap-2 font-medium text-[#353638]">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: s.dot }}
                      aria-hidden
                    />
                    {s.label}
                  </span>
                  <span className="font-semibold tabular-nums text-[#010309]">{s.pct}%</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-[rgba(230,231,232,0.7)] pt-3">
              <Bot className="h-4 w-4 shrink-0 text-[#676A6E]" strokeWidth={1.75} aria-hidden />
              <span className="text-[12px] font-medium text-[#969A9E]">
                AI-analyzed tenant communications
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ASSET_MANAGEMENT_ACTIVITIES = [
  "Aroundtown Management gave notice",
  "Verizon gave notice for approx. 1,000 sqm",
  "Action: Lease out the coming vacancy",
] as const;

function AssetManagementActivitiesBlock() {
  return (
    <div>
      <PropertySubsectionHeader
        icon={Clock}
        title="Asset Management Activities"
        lampTopic="Summarise asset management activity, notices, and redevelopment status for this property."
        lampLabel="Asset Management Activities"
      />
      <div className="flex flex-col gap-3">
        {ASSET_MANAGEMENT_ACTIVITIES.map((line) => (
          <div
            key={line}
            className="flex items-start gap-3 rounded-xl bg-[#F3F4F6] px-4 py-3"
          >
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#010309]"
              aria-hidden
            />
            <p className="min-w-0 flex-1 text-[14px] font-normal leading-snug text-[#353638]">
              {line}
            </p>
          </div>
        ))}
        <div className="mt-1 rounded-xl border border-[rgba(230,231,232,0.85)] bg-white px-4 py-4">
          <div className="flex gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#969A9E]" strokeWidth={1.75} aria-hidden />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#969A9E]">
                Redevelopment
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#7E8185]">
                There are currently no development opportunities for the building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyManagementUpdatesSection() {
  const exportRef = useRef<HTMLDivElement>(null);
  const excelWorkbook = useMemo(
    () => [
      {
        name: "Service Requests",
        columns: ["Category", "Count", "Status"],
        rows: serviceBreakdown.map((s) => [s.category, s.count, s.status]),
      },
      {
        name: "Sentiment Score",
        columns: ["Sentiment", "Share %"],
        rows: sentimentBreakdown.map((s) => [s.label, s.pct]),
      },
      {
        name: "Asset Management",
        columns: ["Activity"],
        rows: ASSET_MANAGEMENT_ACTIVITIES.map((line) => [line]),
      },
    ],
    [],
  );

  return (
    <CollapsibleSection
      title="Property Manager Updates"
      headerTrailing={
        <WidgetExportMenu
          variant="table"
          fileName="property-management-updates"
          captureRef={exportRef}
          excelWorkbook={excelWorkbook}
        />
      }
    >
      <div ref={exportRef} className="relative flex flex-col gap-10">
        <PropertyManagementCards />
        <AssetManagementActivitiesBlock />
      </div>
    </CollapsibleSection>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Recent Actions                                                 */
/* ------------------------------------------------------------------ */

/** Figma: Recent actions (24:3818) — Accordion Action Card / AccordionActionCard */
const recentActions: {
  id: string;
  actionIcon: LucideIcon;
  actionIconBg: string;
  title: string;
  initials: string;
  avatarBg: string;
  person: string;
  time: string;
  status: "Completed" | "Draft";
  fullDescription: string;
  recentActionLines: string[];
}[] = [
  {
    id: "ra1",
    actionIcon: Building2,
    actionIconBg: "bg-[#1B32B3]",
    title: "Lease scenario analysis - Q1 2026",
    initials: "TZ",
    avatarBg: "bg-[#0E195B]",
    person: "Tomer Zakai",
    time: "2 hours ago",
    status: "Completed",
    fullDescription:
      "Scenario pack compares base, upside, and downside rent paths for the two largest expiries in Q1. Amiio stress-tested downtime and TI spend against the current refinance covenants.\n\nOutputs are ready for IC pre-read; the leasing team asked for one slide on break-option timing.",
    recentActionLines: [
      "Model v3 uploaded to the deal room with refreshed market assumptions.",
      "CFO office acknowledged receipt — no blocking comments yet.",
      "Leasing tagged two tenants for sensitivity on three-year vs five-year terms.",
    ],
  },
  {
    id: "ra2",
    actionIcon: Clipboard,
    actionIconBg: "bg-[#436367]",
    title: "Monthly asset report - January 2026",
    initials: "JG",
    avatarBg: "bg-[#5A5E74]",
    person: "Jules Gooren",
    time: "2 hours ago",
    status: "Completed",
    fullDescription:
      "January pack rolls up NOI variance, collections lag, and major capex movements. Amiio highlighted a timing gap between billed service charges and cash receipts on two retail units.\n\nNarrative sections were auto-drafted and edited by the asset analyst before publish.",
    recentActionLines: [
      "Property accountant signed off on the GL bridge for service charges.",
      "Asset manager added a footnote on the disputed CAM true-up.",
      "Report distributed to the LP reporting inbox on schedule.",
    ],
  },
  {
    id: "ra3",
    actionIcon: Building2,
    actionIconBg: "bg-[#1B32B3]",
    title: "Vacancy Analysis - Unit 2A",
    initials: "SB",
    avatarBg: "bg-[#86C5CE]",
    person: "Sara van der Berg",
    time: "2 hours ago",
    status: "Draft",
    fullDescription:
      "Unit 2A has been vacant 6 months; Amiio matched asking rent to three comps and suggested a modest fit-out allowance to improve tour-to-offer conversion.\n\nDraft is awaiting final photos and a broker opinion on achievable term.",
    recentActionLines: [
      "Marketing ordered updated hero renders for the listing page.",
      "Leasing coordinator scheduled two tours for next week.",
    ],
  },
  {
    id: "ra4",
    actionIcon: Share2,
    actionIconBg: "bg-[#5A5E74]",
    title: "Rent Roll Export",
    initials: "TZ",
    avatarBg: "bg-[#0E195B]",
    person: "Tomer Zakai",
    time: "2 hours ago",
    status: "Completed",
    fullDescription:
      "Full rent roll export as of month-end with indexation flags and security-balance snapshot. Amiio validated row counts against the prior close and flagged one lease with a missing renewal date in the source system.\n\nFile is suitable for lender / auditor hand-off after the data steward fixes the anomaly.",
    recentActionLines: [
      "Data steward opened a ticket to correct the renewal date on suite 4B.",
      "Export checksum passed against the warehouse staging table.",
      "Treasury copied the file to the secure exchange for the relationship bank.",
    ],
  },
];

const RECENT_ACTIONS_EXCEL = {
  columns: ["Title", "Person", "Time", "Status"],
  rows: recentActions.map((a) => [a.title, a.person, a.time, a.status]),
};

function RecentActionsSection({
  onNavigateToLeasing,
}: {
  onNavigateToLeasing: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {recentActions.map((a) => (
        <AmiioExpandableRecentActionRow
          key={a.id}
          actionIcon={a.actionIcon}
          actionIconBg={a.actionIconBg}
          title={a.title}
          initials={a.initials}
          avatarBg={a.avatarBg}
          person={a.person}
          time={a.time}
          status={a.status}
          fullDescription={a.fullDescription}
          recentActionLines={a.recentActionLines}
          onNavigate={onNavigateToLeasing}
          navigateLabel="Open leasing workspace"
        />
      ))}
    </div>
  );
}

function RecentActionsCollapsibleSection({
  onNavigateToLeasing,
}: {
  onNavigateToLeasing: () => void;
}) {
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <CollapsibleSection
      title="Recent actions"
      headerTrailing={
        <WidgetExportMenu
          variant="table"
          fileName="recent-actions"
          captureRef={exportRef}
          excel={RECENT_ACTIONS_EXCEL}
        />
      }
    >
      <div ref={exportRef} className="relative">
        <RecentActionsSection onNavigateToLeasing={onNavigateToLeasing} />
      </div>
    </CollapsibleSection>
  );
}

/* ================================================================== */
/*  MAIN EXPORT                                                        */
/* ================================================================== */

export function PropertyHubView({
  onNavigateToLeasing,
  onAnalyseWithAmiio,
  onOpenTenantHub,
}: {
  onNavigateToLeasing: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
  onOpenTenantHub?: () => void;
}) {
  return (
    <div className="space-y-3">
      {/* 1. Investment Summary */}
      <CollapsibleSection title="Investment Summary">
        <InvestmentSummary />
      </CollapsibleSection>

      {/* 2. Amiio's Property Summary */}
      <div
        className={cn(
          "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex w-full items-center gap-2">
          <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="h-5 w-5 shrink-0 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <span className="text-[18px] font-medium text-[#2C2C2C]">
              Amiio&apos;s Property Summary
            </span>
          </button>
        </div>
        <AmiioSummarySection onAnalyseWithAmiio={onAnalyseWithAmiio} />
      </div>

      {/* 3. Major Metrics Bar */}
      <MajorMetricsBar onAnalyse={onAnalyseWithAmiio} />

      {/* 4. Minor Metrics Bar */}
      <MinorMetricsBar />

      {/* 5. Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        <GriDonutChart onAnalyse={onAnalyseWithAmiio} onOpenTenantHub={onOpenTenantHub} />
        <LeaseExpiryChart onAnalyse={onAnalyseWithAmiio} />
      </div>

      {/* 6. Service Charges */}
      <ServiceChargesSection />

      {/* 7. Financial Performance (incl. Indicative Valuation & CAPEX 2026) */}
      <FinancialPerformanceSection />

      {/* 8. Property Manager Updates (incl. Asset Management Activities) */}
      <PropertyManagementUpdatesSection />

      {/* 9. Recent Actions */}
      <RecentActionsCollapsibleSection onNavigateToLeasing={onNavigateToLeasing} />
    </div>
  );
}
