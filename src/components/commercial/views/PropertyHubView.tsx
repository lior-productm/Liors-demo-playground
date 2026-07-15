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
import { TruncatedText } from "@/src/components/ui/TruncatedText";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { BuildingThumb } from "@/src/components/commercial/BuildingThumb";
import { InvestmentSummaryPhoto } from "@/src/components/commercial/overview/InvestmentSummaryPhoto";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import { OverviewAiSummaryCard } from "@/src/components/commercial/overview/OverviewAiSummaryCard";
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
import { Cell, Pie, PieChart } from "recharts";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";
import { COMMERCIAL_BAR_CHART_BAR_CLASS, lightenHexColor } from "@/src/lib/chartColors";
import { DS_DONUT_204 } from "@/src/lib/designSystem";
import {
  LEASE_EXPIRY_MAX_EUR,
  LEASE_EXPIRY_PROFILE,
  LEASE_EXPIRY_Y_TICKS_EUR,
  PERFORMANCE_VS_BUDGET_ROWS,
  formatLeaseExpiryAxis,
  formatLeaseExpiryTooltip,
  leaseExpiryBarHeightPx,
} from "@/src/lib/commercialMockData";

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
          {headerTrailing}
          <WidgetHeaderLamp
            chatTopic={`Review "${title}" on the Property Hub: summarise KPIs, outliers, and recommended next steps.`}
            chatLabel={title}
          />
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

function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-[12px] font-medium text-[#65686B]", className)}>
      {children}
    </div>
  );
}

function FieldValue({
  children,
  compact,
  className,
}: {
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-medium text-[#2C2C2C]",
        compact ? "text-[13px] md:text-[14px]" : "text-[14px]",
        className,
      )}
    >
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

/** Collapsed strip — first column key fields only. */
const KEY_INFO_ROWS: [string, React.ReactNode][] = [
  ["SPV", "Wenckebachweg Amsterdam B.V."],
  ["Valuation", "€26.870.544"],
  ["Asset Manager", "Daniel Meyer"],
  ["Energy Label", <Pill key="el-strip">A</Pill>],
];

const INVESTMENT_VACANCY_PCT = 9.3;

function InvestmentVacancyValue({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <MiniDonut
        pct={INVESTMENT_VACANCY_PCT}
        size={compact ? 22 : 24}
        strokeWidth={3}
        color="#010309"
      />
      <span
        className={cn(
          "font-medium text-[#121212]",
          compact ? "text-[13px] md:text-[14px]" : "text-[14px]",
        )}
      >
        9,3%
      </span>
    </span>
  );
}

function InvestmentSummary({ compact = false }: { compact?: boolean }) {
  const photoSize = compact ? 136 : 220;
  const photoColW = compact ? "w-[136px] max-w-[136px]" : "w-[220px] max-w-[220px]";
  const imgClass = "aspect-square w-full";
  const gridGap = compact ? "gap-2 md:gap-3" : "gap-3 md:gap-4";
  const colW = compact ? "w-[min(120px,22%)]" : "min-w-[100px] flex-1";
  const addressText = compact
    ? "text-[14px] font-medium leading-[1.5] text-[#2C2C2C] md:text-[15px]"
    : "text-[14px] font-medium leading-[1.5] text-[#2C2C2C]";
  const pinClass = compact ? "h-4 w-4 md:h-[18px] md:w-[18px]" : "h-4 w-4";

  const columns: Array<{ title: string; rows: [string, React.ReactNode][] }> = compact
    ? [
        {
          title: "KEY INFO",
          rows: [
            ["SPV", "Wenckebachweg Amsterdam B.V."],
            ["Valuation", "€26.870.544"],
            ["Asset Manager", "Daniel Meyer"],
            ["Energy Label", <Pill key="el-compact">A</Pill>],
          ],
        },
        {
          title: "CLASSIFICATION",
          rows: [
            ["Asset Use", "Office"],
            ["Type", "Core+"],
            ["Tenure", "Freehold"],
            ["Tenant Type", "Multi tenant"],
          ],
        },
        {
          title: "CHARACTERISTICS",
          rows: [
            ["Condition", <Pill key="cond">B (Good)</Pill>],
            ["Location", <Pill key="loc">A (Excellent)</Pill>],
            ["Year Built", "2001"],
            ["Floors", "4"],
          ],
        },
        {
          title: "AREAS",
          rows: [
            ["Plot Size", "10.757 sqm"],
            ["GFA", "€14,423.25"],
            ["LFA", "13,170.2"],
            ["Vacancy", <InvestmentVacancyValue key="vac-compact" compact />],
          ],
        },
      ]
    : [
        {
          title: "KEY INFO",
          rows: [
            ["Property code", "p1000071"],
            ["SPV", "Wenckebachweg Amsterdam B.V."],
            ["Valuation", "€26.870.544"],
            ["Asset Manager", "Daniel Meyer"],
            ["Energy Label", <Pill key="el">A</Pill>],
          ],
        },
        {
          title: "CLASSIFICATION",
          rows: [
            ["Asset Use", "Office"],
            ["Type", "Core+"],
            ["Tenure", "Freehold"],
            ["Tenant Type", "Multi tenant"],
          ],
        },
        {
          title: "CHARACTERISTICS",
          rows: [
            ["Condition", <Pill key="cond">B (Good)</Pill>],
            ["Location", <Pill key="loc">A (Excellent)</Pill>],
            ["Year Built", "2001"],
            ["Floors", "4"],
          ],
        },
        {
          title: "AREAS",
          rows: [
            ["Plot Size", "10.757 sqm"],
            ["GFA", "€14,423.25"],
            ["LFA", "13,170.2"],
            ["Vacancy", <InvestmentVacancyValue key="vac" />],
          ],
        },
      ];

  return (
    <div
      className={cn(
        "grid w-full min-w-0 items-start overflow-hidden",
        compact ? "gap-2 md:gap-3" : "gap-3 md:gap-4",
      )}
      style={{ gridTemplateColumns: `${photoSize}px minmax(0, 1fr)` }}
    >
      <div
        className={cn(
          "flex min-w-0 shrink-0 flex-col",
          photoColW,
          "gap-1.5",
        )}
      >
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden rounded-[8px] bg-[#D9D9D9]",
            imgClass,
          )}
        >
          <InvestmentSummaryPhoto
            containerClassName="h-full w-full"
            className="h-full w-full rounded-[8px] object-cover"
            alt="H.J.E. Wenckebachweg 123"
          />
        </div>
        <div className={cn("flex min-w-0 items-start", compact ? "gap-1.5" : "gap-2")}>
          <MapPin className={cn("mt-0.5 shrink-0 text-[#2C2C2C]", pinClass)} />
          <div className={cn(addressText, "min-w-0 break-words")}>
            {compact ? (
              <>
                H.J.E. Wenckebachweg 123
                <br />
                Amsterdam
              </>
            ) : (
              "H.J.E. Wenckebachweg 123 / Amsterdam"
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "flex border-b border-[rgba(230,231,232,0.7)] pb-1.5",
            gridGap,
          )}
        >
          {columns.map((column) => (
            <div
              key={column.title}
              className={cn("text-[12px] font-medium text-[#65686B]", colW)}
            >
              {column.title}
            </div>
          ))}
        </div>
        <div className={cn("mt-2 flex", gridGap)}>
          {columns.map((column) => (
            <InfoCol
              key={column.title}
              compact={compact}
              colClass={colW}
              rows={column.rows}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCol({
  rows,
  compact = false,
  colClass = "w-[144px]",
}: {
  rows: [string, React.ReactNode][];
  compact?: boolean;
  colClass?: string;
}) {
  return (
    <div className={cn("flex flex-col", colClass, compact ? "gap-1.5 md:gap-2" : "gap-2")}>
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <FieldLabel>{k}</FieldLabel>
          <FieldValue compact={compact}>{v}</FieldValue>
        </div>
      ))}
    </div>
  );
}

function InvestmentSummaryStripExpandable() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col rounded-2xl border border-[rgba(230,231,232,0.75)] bg-[rgba(255,255,255,0.95)] p-1",
        amiioCardHoverSurface,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full min-w-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-[#F3F6FA]/90"
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[#969A9E]" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[#969A9E]" />
        )}
        <span
          className={cn(
            "font-medium text-[#2C2C2C]",
            expanded ? "text-[15px] md:text-[16px]" : "text-[16px] md:text-[17px]",
          )}
        >
          Investment summary
        </span>
      </button>

      {expanded ? (
        <div className="w-full border-t border-[rgba(230,231,232,0.7)] px-4 pb-3 pt-2.5">
          <InvestmentSummary compact />
        </div>
      ) : (
        <div className="w-full border-t border-[rgba(230,231,232,0.7)] px-4 pb-3 pt-2.5">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9] sm:h-[80px] sm:w-[80px]">
              <BuildingThumb
                className="absolute inset-0 h-full w-full rounded-[6px]"
                alt="H.J.E. Wenckebachweg 123"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-x-6">
                {KEY_INFO_ROWS.map(([k, v], idx) => (
                  <div
                    key={k}
                    className={cn(
                      "flex min-w-0 flex-col justify-center gap-1.5",
                      idx > 0 && "sm:border-l sm:border-[rgba(230,231,232,0.9)] sm:pl-6",
                    )}
                  >
                    <FieldLabel className="text-[13px] sm:text-[14px]">{k}</FieldLabel>
                    <FieldValue compact={false} className="text-[15px] sm:text-[16px]">
                      {v}
                    </FieldValue>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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

/** Four-up strip for the Property Hub header (includes Total GRI). */
function MajorMetricsStrip({
  onAnalyse,
}: {
  onAnalyse?: (topic: string) => void;
}) {
  const card =
    "flex h-full min-h-[108px] flex-col overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-2.5 sm:min-h-[114px] sm:p-3";
  const valueLg =
    "text-[15px] font-medium leading-tight text-[#353638] sm:text-[16px] md:text-[17px]";
  const stripLabel =
    "text-[11px] font-medium uppercase leading-tight tracking-wide text-[#676A6E] sm:text-[12px]";

  return (
    <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5 md:items-stretch">
      <div className={cn(card, amiioCardHoverSurface)}>
        <div className="flex flex-1 flex-col justify-between gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <div className={stripLabel}>WAULT</div>
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
          <div className="flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <div className={valueLg}>4.2 years</div>
              <TrendBadge value="1.5%" label="vs last period" direction="up" />
            </div>
            <svg
              width="60"
              height="22"
              viewBox="0 0 103 42"
              fill="none"
              className="shrink-0 self-end opacity-90"
              aria-hidden
            >
              <defs>
                <linearGradient id="sparkGradHubStrip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#588CB3" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#588CB3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M2 34 L14 28 L26 30 L38 18 L50 22 L62 10 L74 14 L86 4 L100 8 L100 42 L2 42 Z"
                fill="url(#sparkGradHubStrip)"
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
      </div>

      <div className={cn(card, amiioCardHoverSurface)}>
        <div className="flex flex-1 flex-col justify-between gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <div className={stripLabel}>Occupancy Rate</div>
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
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className={valueLg}>99.5%</div>
              <div className="mt-1">
                <TrendBadge value="1.5%" label="vs last period" direction="up" />
              </div>
            </div>
            <MiniDonut pct={99.5} size={36} strokeWidth={5} color="#1F9E8B" />
          </div>
        </div>
      </div>

      <div className={cn(card, amiioCardHoverSurface)}>
        <div className="flex flex-1 flex-col justify-between gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <div className={stripLabel}>Vacancy Rate</div>
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
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className={valueLg}>0.5%</div>
              <div className="mt-1">
                <TrendBadge value="1.5%" label="vs last period" direction="down" />
              </div>
            </div>
            <MiniDonut pct={0.5} size={36} strokeWidth={5} color="#588CB3" />
          </div>
        </div>
      </div>

      <div className={cn(card, amiioCardHoverSurface)}>
        <div className="flex flex-1 flex-col justify-between gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <div className={stripLabel}>Total GRI</div>
            <AmiioAiDisclaimerTrigger
              variant="lamp"
              lampSummary={defaultLampTooltipSummary(
                "Total GRI",
                "Gross rental income for the asset versus the prior year baseline.",
              )}
            >
              <AnalyseIcon onClick={() => onAnalyse?.("total gross rental income")} />
            </AmiioAiDisclaimerTrigger>
          </div>
          <div>
            <div className={cn(valueLg, "break-words")}>€3,146,703</div>
            <div className="mt-1">
              <TrendBadge value="0%" label="vs previous year" direction="neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyHubKpiStrip({
  onAnalyse,
}: {
  onAnalyse?: (topic: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="min-w-0 w-full">
        <InvestmentSummaryStripExpandable />
      </div>
      <div className="min-w-0 w-full">
        <MajorMetricsStrip onAnalyse={onAnalyse} />
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

const LEASING_TAB_METRICS = miniMetrics.filter((_, i) => i !== 3);

function MinorMetricsBar() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-5",
        amiioCardHoverSurface,
      )}
    >
      <div className="absolute right-4 top-4 z-10">
        <WidgetHeaderLamp
          chatTopic="Explain the Minor Metrics bar (retention, absorption, rent per m², GRI, NRI) vs prior year and what actions to take."
          chatLabel="Minor metrics"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 pr-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-0 xl:pr-12">
        {miniMetrics.map((m, idx) => (
          <div
            key={m.label}
            className={cn(
              "min-w-0",
              idx > 0 && "xl:border-l xl:border-[#E6E8EB] xl:pl-4",
              idx < miniMetrics.length - 1 && "xl:pr-4",
            )}
          >
            <div className="text-[14px] font-medium text-[#65686B]">{m.label}</div>
            <div className="mt-2 text-[18px] font-medium text-[#353638]">{m.value}</div>
            <div className="mt-2">
              <TrendBadge value={m.delta} label={m.sub} direction={m.direction} />
            </div>
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
  { label: "Verizon Nederland...", pct: 10, color: "#142587" },
  { label: "Schweppes Internat...", pct: 10, color: "#70A4AC" },
  { label: "Aroundtown...", pct: 20, color: "#838697" },
  { label: "Leapforce B.V.", pct: 10, color: "#D7ECEF" },
  { label: "Management", pct: 25, color: "#010309" },
] as const;

/** Figma 4094:174171 — fixed 204×203px doughnut viewport. */
const GRI_DONUT_W = DS_DONUT_204.width;
const GRI_DONUT_H = DS_DONUT_204.height;
const GRI_PIE_OUTER = DS_DONUT_204.outerRadius;
const GRI_PIE_INNER = DS_DONUT_204.innerRadius;
const GRI_TENANT_COUNT = 16;
/** Label box inside the ring opening. */
const GRI_CENTER_INSET = DS_DONUT_204.centerInset;

function GriLegendColumn({
  items,
  onOpenTenantHub,
  onHover,
}: {
  items: (typeof donutSegments)[number][];
  onOpenTenantHub?: () => void;
  onHover: (idx: number | null) => void;
}) {
  const labelClass =
    "max-w-[132px] text-[14px] font-normal leading-[1.24] text-[#65686B]";

  return (
    <div className="flex items-center gap-6">
      <div className="flex min-w-0 flex-col gap-3">
        {items.map((s) => {
          const idx = donutSegments.findIndex((row) => row.label === s.label);
          return (
            <div
              key={s.label}
              className="flex h-[17px] min-w-0 items-center gap-4"
              onMouseEnter={() => onHover(idx)}
              onMouseLeave={() => onHover(null)}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              {onOpenTenantHub && s.label === "ScaleHub" ? (
                <button
                  type="button"
                  onClick={() => onOpenTenantHub()}
                  className="min-w-0 max-w-[132px] text-left"
                >
                  <TruncatedText
                    text={s.label}
                    side="top"
                    className={cn(labelClass, "hover:text-[#233FDE] hover:underline")}
                  />
                </button>
              ) : (
                <TruncatedText text={s.label} side="top" className={labelClass} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex w-8 flex-col gap-3">
        {items.map((s) => (
          <span
            key={`${s.label}-pct`}
            className="flex h-[17px] items-end justify-end text-[14px] font-medium leading-[1.24] tabular-nums text-[#121212]"
          >
            {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

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
        "relative flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex shrink-0 min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 truncate text-[18px] font-medium leading-[1.25] text-[#353638]">
          GRI (% Of Total)
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WidgetExportMenu
            variant="chart"
            fileName="gri-distribution"
            captureRef={exportRef}
          />
          <AmiioAiDisclaimerTrigger
            variant="lamp"
            lampSummary={defaultLampTooltipSummary(
              "GRI (% of total)",
              "Donut shows each tenant’s share of gross rental income for this asset.",
            )}
          >
            <AnalyseIcon onClick={() => onAnalyse?.("the GRI distribution across tenants")} />
          </AmiioAiDisclaimerTrigger>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div
          className="relative shrink-0"
          style={{ width: GRI_DONUT_W, height: GRI_DONUT_H }}
        >
          <PieChart width={GRI_DONUT_W} height={GRI_DONUT_H} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              isAnimationActive={false}
              data={[{ name: "_track", value: 100, fill: "#F2F4F7" }]}
              dataKey="value"
              cx={GRI_DONUT_W / 2}
              cy={GRI_DONUT_H / 2}
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
              cx={GRI_DONUT_W / 2}
              cy={GRI_DONUT_H / 2}
              innerRadius={GRI_PIE_INNER}
              outerRadius={GRI_PIE_OUTER}
              paddingAngle={1.5}
              cornerRadius={2.5}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={2}
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
                    opacity: hovered !== null && hovered !== idx ? 0.45 : 1,
                  }}
                />
              ))}
            </Pie>
          </PieChart>
          <div
            className="pointer-events-none absolute z-10 flex flex-col items-center justify-center gap-1 overflow-hidden text-center"
            style={GRI_CENTER_INSET}
          >
            {hovered !== null ? (
              <>
                <span className="w-full truncate text-[14px] font-normal leading-[1.24] text-[#65686B]">
                  {donutSegments[hovered]?.label}
                </span>
                <span className="w-full text-[32px] font-medium leading-[1.25] tabular-nums text-[#353638]">
                  {donutSegments[hovered]?.pct}%
                </span>
              </>
            ) : (
              <>
                <span className="w-full text-[14px] font-normal leading-[1.24] text-[#65686B]">
                  Total GRI
                </span>
                <span className="w-full text-[48px] font-medium leading-[1.25] tabular-nums text-[#353638]">
                  {GRI_TENANT_COUNT}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-start justify-center gap-8">
        <GriLegendColumn
          items={donutSegments.slice(0, 3)}
          onOpenTenantHub={onOpenTenantHub}
          onHover={setHovered}
        />
        <GriLegendColumn
          items={donutSegments.slice(3)}
          onOpenTenantHub={onOpenTenantHub}
          onHover={setHovered}
        />
      </div>
    </div>
  );
}

/** Core Design System — Single Bar chart (Figma 1631:76158 / 5748:47655) */
const leaseExpiryData = LEASE_EXPIRY_PROFILE;
const leaseExpiryYTicks = LEASE_EXPIRY_Y_TICKS_EUR;

const LEASE_PLOT_H = 288;
const LEASE_VIEWPORT_MIN_H = LEASE_PLOT_H + 36;
const LEASE_BAR_COLOR = "#70A4AC";
const LEASE_BAR_HOVER_COLOR = lightenHexColor(LEASE_BAR_COLOR);

function LeaseExpiryValueMarker({
  color = LEASE_BAR_COLOR,
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
            <WidgetExportMenu
              variant="chart"
              fileName="lease-expiry"
              captureRef={exportRef}
            />
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
          </div>
        </div>

        <div
          className="relative w-full shrink-0 rounded-[24px] bg-white p-3 sm:p-4"
          style={{ minHeight: LEASE_VIEWPORT_MIN_H }}
          data-lease-expiry-chart
        >
          <div className="flex gap-2 sm:gap-3">
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
                className="relative flex items-end justify-between gap-2 px-0.5 sm:gap-3 sm:px-1"
                style={{ height: LEASE_PLOT_H }}
              >
                {leaseExpiryData.map((d, idx) => {
                  const h = leaseExpiryBarHeightPx(d.euros, LEASE_PLOT_H);
                  const active = hoveredBar === idx;
                  const isHighlight = idx === highlightIdx && hoveredBar === null;
                  const showValueTooltip =
                    active || isHighlight || clickedBarIdx === idx;
                  const useHoverColor = active || clickedBarIdx === idx;
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
                        className={cn(COMMERCIAL_BAR_CHART_BAR_CLASS, dimOthers && "opacity-45")}
                        style={{
                          height: h,
                          backgroundColor: useHoverColor
                            ? LEASE_BAR_HOVER_COLOR
                            : LEASE_BAR_COLOR,
                        }}
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

function ServiceChargesKpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard label="Advance Payment" value="€892,500" indicator="green" />
      <MetricCard label="Actual Expenses" value="€847,320" sub="vs previous year" />
      <MetricCard
        label="Balance"
        value="+€45,180"
        indicator="green"
        sub="→ Surplus to return"
      />
      <MetricCard label="Budget Variance" value="-5.1%" indicator="red" sub="→ Under budget" />
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

const budgetRows = PERFORMANCE_VS_BUDGET_ROWS;

function HistoricalPerformanceCard() {
  return (
    <div
      className={cn(
        "group flex min-h-0 flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-5 py-4",
        amiioCardHoverSurface,
      )}
    >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="text-[17px] font-medium text-[#2C2C2C]">
            Historical Performance
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <WidgetHeaderLamp
              revealOnHover
              chatTopic="Interpret Historical Performance metrics (NRI, occupancy, incentive %, WALT) and trends vs prior periods."
              chatLabel="Historical Performance"
            />
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
  );
}

function FinancialPerformance() {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-stretch">
      <HistoricalPerformanceCard />

      {/* Performance vs Budget */}
      <div
        className={cn(
          "group flex min-h-0 h-full flex-col rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-5 py-4",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-[17px] font-medium text-[#2C2C2C]">
            Performance vs budget
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <WidgetHeaderLamp
              revealOnHover
              chatTopic="Explain Performance vs budget: actual vs budget bars, deltas, and where to focus remediation."
              chatLabel="Performance vs budget"
            />
          </div>
        </div>
        <div className="mt-3 space-y-3">
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
            <WidgetHeaderLamp
              revealOnHover
              chatTopic="Walk through Indicative Valuation: cap-rate sensitivity, variance vs book, and scenario implications."
              chatLabel="Indicative Valuation"
            />
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
            <WidgetHeaderLamp
              revealOnHover
              chatTopic="Analyse CAPEX 2026: invoicing progress, categories, and top line items vs plan."
              chatLabel="CAPEX 2026"
            />
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
      <WidgetHeaderLamp revealOnHover chatTopic={lampTopic} chatLabel={lampLabel} />
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

/* ================================================================== */
/*  Property Hub — KPI strip + tabbed panels                           */
/* ================================================================== */

type PropertyHubTab =
  | "overview"
  | "financial"
  | "commercial"
  | "leasing"
  | "management";

const PROPERTY_HUB_TABS: { id: PropertyHubTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "financial", label: "Financial" },
  { id: "commercial", label: "Commercial" },
  { id: "leasing", label: "Leasing" },
  { id: "management", label: "Management" },
];

function OverviewTabPanel({
  onNavigateToLeasing,
  onAnalyseWithAmiio,
}: {
  onNavigateToLeasing: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
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
            <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
              Amiio&apos;s Property Summary
            </span>
          </button>
        </div>
        <AmiioSummarySection onAnalyseWithAmiio={onAnalyseWithAmiio} />
      </div>

      <CollapsibleSection title="Recent actions">
        <div
          className="mb-1.5 hidden h-9 items-center border-b border-[rgba(230,231,232,0.7)] pl-4 pr-[52px] text-[12px] font-medium text-[#7E8185] sm:flex"
          aria-hidden
        >
          <span className="min-w-0 flex-1 pl-8">Title</span>
          <span className="w-[160px] shrink-0">Author</span>
          <span className="w-[112px] shrink-0">Time</span>
          <span className="w-[120px] shrink-0 text-right">Status</span>
        </div>
        <RecentActionsSection onNavigateToLeasing={onNavigateToLeasing} />
      </CollapsibleSection>
    </div>
  );
}

function FinanceTabPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-[#2C2C2C]">Service charge KPIs</h3>
        <ServiceChargesKpiGrid />
      </div>
      <FinancialPerformanceSection />
    </div>
  );
}

function LeasingTabPanel({
  onAnalyse,
  onOpenTenantHub,
}: {
  onAnalyse?: (topic: string) => void;
  onOpenTenantHub?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <MinorMetricsBar />
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
        <LeaseExpiryChart onAnalyse={onAnalyse} />
        <GriDonutChart onAnalyse={onAnalyse} onOpenTenantHub={onOpenTenantHub} />
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="absolute right-4 top-4 z-10">
          <WidgetHeaderLamp
            chatTopic="Explain leasing KPIs: retention, absorption, average rent, and NRI vs prior year."
            chatLabel="Leasing KPIs"
          />
        </div>
        <div className="flex flex-wrap items-stretch gap-4 pr-0 sm:pr-10">
          {LEASING_TAB_METRICS.map((m) => (
            <div
              key={m.label}
              className="min-w-[140px] flex-1 basis-[calc(50%-0.5rem)] sm:basis-[calc(33.333%-0.67rem)] lg:min-w-0 lg:flex-1"
            >
              <div className="text-[14px] font-medium text-[#65686B]">{m.label}</div>
              <div className="mt-2 text-[18px] font-medium text-[#353638]">{m.value}</div>
              <div className="mt-2">
                <TrendBadge value={m.delta} label={m.sub} direction={m.direction} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagementTabPanel() {
  return (
    <div className="flex flex-col gap-8">
      <PropertyManagementUpdatesSection />
    </div>
  );
}

const BUSINESS_PLAN_ASSUMPTIONS = [
  { label: "ERV in EUR per m2", value: "EUR 3,035,956" },
  { label: "Commercial Capex", value: "EUR 890" },
  { label: "Upcoming Vacancy", value: "EUR 278" },
  { label: "Unforeseen", value: "EUR 890" },
  { label: "Tenant Improvement", value: "EUR 2,203" },
] as const;

function PropertyInvestmentSummaryCard() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] px-6 py-5",
        amiioCardHoverSurface,
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        {open ? (
          <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
        ) : (
          <ChevronDown className="h-6 w-6 shrink-0 text-[#969A9E]" />
        )}
        <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
          Investment Summary
        </span>
      </button>
      {open ? (
        <div className="mt-4 min-w-0 overflow-hidden">
          <InvestmentSummary />
        </div>
      ) : null}
    </div>
  );
}

function PropertyOverviewSparkline() {
  return (
    <svg viewBox="0 0 68 56" className="h-14 w-[68px] shrink-0" aria-hidden>
      <defs>
        <linearGradient id="propertyOverviewSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BE1D5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6BE1D5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 15 C7 4, 12 3, 18 14 C24 25, 30 24, 36 12 C42 1, 49 9, 54 8 C59 7, 63 16, 66 54 L66 56 L2 56 Z"
        fill="url(#propertyOverviewSparkFill)"
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

function PropertyOverviewProgressRing({
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
        strokeDashoffset={circumference * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function PropertyOverviewSummaryCard() {
  return (
    <OverviewAiSummaryCard
      title="Property Summary"
      chatTopic="Summarise this property's current performance, key trends, and lease risk."
      chatLabel="Property Summary"
      summary={
        <p>
          Property performing well with 92% occupancy{" "}
          <span className="font-medium text-[#1F9E8B]">(+2.3% QoQ)</span> and strong GRI of
          EUR 185k/month <span className="font-medium text-[#1F9E8B]">(+4.2% vs budget)</span>.
          NRI at EUR 142k/month demonstrates efficient operations. Tenant retention remains
          solid at 87%, while WAULT has declined to 4.2 years.
        </p>
      }
      trends={[
        {
          tone: "positive",
          content: (
            <>
              Occupancy strong: 92% with{" "}
              <span className="font-medium text-[#1F9E8B]">+2.3%</span> QoQ improvement
            </>
          ),
        },
        {
          tone: "positive",
          content: (
            <>
              Tenant retention solid: 87% with{" "}
              <span className="font-medium text-[#1F9E8B]">+3%</span> improvement
            </>
          ),
        },
        {
          tone: "warning",
          content: "WAULT declining: 4.2 years with 2 expirations in 6 months",
        },
      ]}
    />
  );
}

function PropertyHubFinancialPerformanceCard() {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] px-6 py-5",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-center gap-2">
        <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
        <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
          Financial Performance
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-[#E6E8EB] bg-white/70 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-medium leading-[1.25] text-[#353638]">
                Business Plan Assumptions
              </h3>
              <p className="mt-1 text-[14px] leading-[1.4] text-[#65686B]">
                Based on 5 years
              </p>
            </div>
            <WidgetHeaderLamp
              chatTopic="Explain the business plan assumptions and what the current values imply for the property."
              chatLabel="Business Plan Assumptions"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#F2F4F7]">
            {BUSINESS_PLAN_ASSUMPTIONS.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-3",
                  index < BUSINESS_PLAN_ASSUMPTIONS.length - 1 &&
                    "border-b border-[#F2F4F7]",
                )}
              >
                <span className="text-[14px] font-medium leading-[1.24] text-[#353638]">
                  {row.label}
                </span>
                <span className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E6E8EB] bg-white/70 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[18px] font-medium leading-[1.25] text-[#353638]">
              Historical Performance
            </h3>
            <WidgetHeaderLamp
              chatTopic="Interpret the historical performance table and summarize the main trend changes."
              chatLabel="Historical Performance"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[#E6E8EB]">
            <div
              className="grid min-w-[720px] grid-cols-[minmax(120px,1.2fr)_repeat(4,minmax(110px,1fr))] text-[14px]"
              role="table"
              aria-label="Historical performance"
            >
              <div className="bg-[#F0F2F5] px-4 py-2.5 font-medium text-[#121212]">Metric</div>
              <div className="bg-[#F0F2F5] px-4 py-2.5 text-right font-medium text-[#2C2C2C]">DEC &apos;25</div>
              <div className="bg-[#F0F2F5] px-4 py-2.5 text-right font-medium text-[#2C2C2C]">NOV &apos;25</div>
              <div className="bg-[#F0F2F5] px-4 py-2.5 text-right font-medium text-[#2C2C2C]">DEC &apos;24</div>
              <div className="bg-[#F0F2F5] px-4 py-2.5 text-right font-medium text-[#2C2C2C]">DEC &apos;22</div>

              {historicalRows.map((row) => (
                <div key={row[0]} className="contents">
                  <div className="border-t border-[#E6E8EB] px-4 py-2.5 font-medium text-[#2C2C2C]">
                    {row[0]}
                  </div>
                  <div className="border-t border-[#E6E8EB] px-4 py-2.5 text-right text-[#2C2C2C]">
                    {row[1]}
                  </div>
                  <div className="border-t border-[#E6E8EB] px-4 py-2.5 text-right text-[#2C2C2C]">
                    {row[2]}
                  </div>
                  <div className="border-t border-[#E6E8EB] px-4 py-2.5 text-right text-[#2C2C2C]">
                    {row[3]}
                  </div>
                  <div className="border-t border-[#E6E8EB] px-4 py-2.5 text-right text-[#2C2C2C]">
                    {row[4]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyHubRecentActionsCard({
  onNavigateToLeasing,
}: {
  onNavigateToLeasing: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] px-6 py-5",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-center gap-2">
        <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
        <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
          Recent actions
        </span>
      </div>

      <div className="mt-4">
        <RecentActionsSection onNavigateToLeasing={onNavigateToLeasing} />
      </div>
    </div>
  );
}

function PropertyOverviewMetricCard({
  label,
  value,
  helper,
  delta,
  deltaPositive = true,
  visual,
  emptyState = false,
  chatTopic,
  chatLabel,
}: {
  label: string;
  value: string;
  helper: string;
  delta?: string;
  deltaPositive?: boolean;
  visual?: "sparkline" | { kind: "progress"; value: number; accent: string };
  emptyState?: boolean;
  chatTopic: string;
  chatLabel: string;
}) {
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
              <TrendPill direction={deltaPositive ? "up" : "down"} pct={delta} />
            ) : null}
            <span className="text-[12px] leading-[1.24] text-[#7E8185]">{helper}</span>
          </div>
        </div>
        <div className="flex items-end self-stretch">
          {emptyState ? (
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F4F7]">
              <Sparkles className="h-5 w-5 text-[#C5CAD0]" />
              <span className="absolute -right-1 top-0 text-[12px] text-[#D1D5D9]">+</span>
              <span className="absolute -left-1 bottom-1 h-1.5 w-1.5 rounded-full bg-[#D1D5D9]" />
              <span className="absolute right-0 top-7 h-2 w-2 rounded-full bg-[#D1D5D9]" />
            </div>
          ) : null}
          {visual === "sparkline" ? <PropertyOverviewSparkline /> : null}
          {typeof visual === "object" && visual?.kind === "progress" ? (
            <PropertyOverviewProgressRing value={visual.value} accent={visual.accent} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PropertyOverviewMinorMetricsBar() {
  const items = [
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
      value: "EUR 75",
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
    <div className="space-y-6">
      <PropertyInvestmentSummaryCard />
      <PropertyOverviewSummaryCard />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PropertyOverviewMetricCard
          label="Total Assets"
          value="12"
          helper="vs last period"
          delta="1.5%"
          visual="sparkline"
          chatTopic="Explain total assets and the recent change for this period."
          chatLabel="Total Assets"
        />
        <PropertyOverviewMetricCard
          label="Current Valuation"
          value="€25,209,000"
          helper="vs last period"
          delta="1.5%"
          visual="sparkline"
          chatTopic="Explain current valuation and the recent change for this asset."
          chatLabel="Current Valuation"
        />
        <PropertyOverviewMetricCard
          label="Total Tenants"
          value="218"
          helper="vs last period"
          delta="1.5%"
          chatTopic="Summarise total tenants and the latest movement."
          chatLabel="Total Tenants"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PropertyOverviewMetricCard
          label="WAULT"
          value="2.8 years"
          helper="vs last period"
          delta="1.5%"
          visual="sparkline"
          chatTopic="Explain WAULT and the near-term expiry implications for this property."
          chatLabel="WAULT"
        />
        <PropertyOverviewMetricCard
          label="Occupancy Rate"
          value="94%"
          helper="vs last period"
          delta="1.5%"
          visual={{ kind: "progress", value: 0.94, accent: "#2437B8" }}
          chatTopic="Explain occupancy rate and the operational drivers behind it."
          chatLabel="Occupancy Rate"
        />
        <PropertyOverviewMetricCard
          label="Vacancy Rate"
          value="5.28%"
          helper="vs last period"
          delta="1.5%"
          visual={{ kind: "progress", value: 0.0528, accent: "#2437B8" }}
          chatTopic="Explain vacancy rate and what is driving the current exposure."
          chatLabel="Vacancy Rate"
        />
      </div>
      <PropertyOverviewMinorMetricsBar />
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <GriDonutChart onAnalyse={onAnalyseWithAmiio} onOpenTenantHub={onOpenTenantHub} />
        <LeaseExpiryChart onAnalyse={onAnalyseWithAmiio} />
      </div>
      <PropertyHubFinancialPerformanceCard />
      <PropertyHubRecentActionsCard onNavigateToLeasing={onNavigateToLeasing} />
    </div>
  );
}

