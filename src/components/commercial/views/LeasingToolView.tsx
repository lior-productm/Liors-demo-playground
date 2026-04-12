"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Lightbulb,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  Download,
  X,
  ExternalLink,
  Pencil,
  Radio,
  Mail,
  MessageSquare,
  FileText,
  Upload,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AmiioSummaryTypewriterParts } from "@/src/components/commercial/AmiioSummaryTypewriter";
import {
  COMPARABLE_BUILDING_THUMB_1,
  COMPARABLE_BUILDING_THUMB_2,
  COMPARABLE_BUILDING_THUMB_3,
  COMPARABLE_BUILDING_THUMB_4,
} from "@/src/constants/commercialDemoMedia";
import { BuildingThumb } from "@/src/components/commercial/BuildingThumb";
import { TENANT_SCALEHUB_LOGO } from "@/src/constants/commercialDemoMedia";
import { ActivityUploadDialog } from "@/components/activity-upload-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SubView = "pipeline" | "proposal-prep" | "lease-proposal" | "review-proposal";

interface PipelineCard {
  id: string;
  company: string;
  unit: string;
  status: "Negotiation" | "Proposal" | "Viewing" | "Lead";
  avatar: string;
  avatarName: string;
  /** Figma avatar circle fill */
  avatarBg: string;
  price: string;
  time: string;
  probability: number;
  insight: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const pipelineCards: PipelineCard[] = [
  {
    id: "p1",
    company: "TechVentures B.V.",
    unit: "Unit 3A - 450 sqm",
    status: "Negotiation",
    avatar: "TZ",
    avatarName: "Tomer Zakai",
    avatarBg: "#0E195B",
    price: "€185/sqm",
    time: "2 days ago",
    probability: 75,
    insight:
      "High probability deal. Prospect impressed with location and amenities. Main negotiation points: fit-out contribution and lease term flexibility. Recommend offering 2 months rent-free incentive to close.",
  },
  {
    id: "p2",
    company: "Digital Agency Group",
    unit: "Unit 2B - 350 sqm",
    status: "Proposal",
    avatar: "MB",
    avatarName: "Maria Baker",
    avatarBg: "#86C5CE",
    price: "€175/sqm",
    time: "5 days ago",
    probability: 55,
    insight:
      "Medium probability - competitive situation. Prospect comparing with Hogehilweg and Karspeldreef properties. Price sensitivity noted. Consider highlighting energy efficiency and public transport access as differentiators.",
  },
  {
    id: "p3",
    company: "StartupHub Amsterdam",
    unit: "Unit 3A - 450 sqm",
    status: "Viewing",
    avatar: "TZ",
    avatarName: "Tomer Zakai",
    avatarBg: "#0E195B",
    price: "€170/sqm",
    time: "1 week ago",
    probability: 35,
    insight:
      "Early stage lead. Prospect expanding co-working concept. Timeline is longer (Q1 2027). Could be a good fit for vacant Unit 1C. Recommend showcasing flexible layout options.",
  },
  {
    id: "p4",
    company: "GreenTech Solutions",
    unit: "Unit 4D - 280 sqm",
    status: "Lead",
    avatar: "JG",
    avatarName: "Jules Gooren",
    avatarBg: "#838697",
    price: "€180/sqm",
    time: "3 days ago",
    probability: 20,
    insight:
      "New lead requiring qualification. Company profile suggests sustainability focus - highlight building's A+ energy rating. Recommend scheduling intro call within 48 hours.",
  },
];

const comparableProperties = [
  {
    name: "Hogehilweg 10-16",
    thumbSrc: COMPARABLE_BUILDING_THUMB_1,
    location: "Amsterdam Southeast",
    area: "2,400 sqm",
    type: "For Lease",
    energy: "A",
    condition: "Renovated 2023",
    available: "Immediately",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    diff: "+2.3%",
    diffColor: "text-[#1CAB9F]",
  },
  {
    name: "Karspeldreef 8",
    thumbSrc: COMPARABLE_BUILDING_THUMB_2,
    location: "Amsterdam Southeast",
    area: "1,800 sqm",
    type: "For Lease",
    energy: "B",
    condition: "Good",
    available: "Q2 2026",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    diff: "-0.8%",
    diffColor: "text-[#C84E69]",
  },
  {
    name: "Bijlmerdreef 24-68",
    thumbSrc: COMPARABLE_BUILDING_THUMB_3,
    location: "Amsterdam Southeast",
    area: "3,200 sqm",
    type: "For Lease",
    energy: "A+",
    condition: "New build",
    available: "Immediately",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    diff: "-1.8%",
    diffColor: "text-[#C84E69]",
  },
  {
    name: "Paasheuvelweg 50",
    thumbSrc: COMPARABLE_BUILDING_THUMB_4,
    location: "Amsterdam Southeast",
    area: "950 sqm",
    type: "For Lease",
    energy: "C",
    condition: "Average",
    available: "Q3 2026",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    diff: "-8.6%",
    diffColor: "text-[#C84E69]",
  },
];

const documentVersions = [
  { label: "Current", date: "", active: true },
  { label: "v78", date: "23 Nov 2025", active: false },
  { label: "v77", date: "12 Nov 2025", active: false },
  { label: "v76", date: "12 May 2025", active: false },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function ProbabilityDonut({ value, size = 32 }: { value: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6E8EB" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={value >= 60 ? "#1F9E8B" : value >= 40 ? "#E7B65A" : "#B23A48"}
        strokeWidth={3}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Figma Leasing Tool Overview — StatusTag */
function statusBadgeClasses(status: PipelineCard["status"]) {
  switch (status) {
    case "Negotiation":
      return "bg-[#FBF2DC] text-[#B07E22] border-0";
    case "Proposal":
      return "bg-[#D3D9F8] text-[#233FDE] border-0";
    case "Viewing":
      return "bg-[#D7ECEF] text-[#303552] border-0";
    case "Lead":
      return "bg-[#CDCFD5] text-[#060B27] border-0";
  }
}

const metricCardGradient =
  "linear-gradient(-88deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)";

function MetricInsightButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] text-[#65686B] transition-colors hover:bg-[#F3F6FA]"
      aria-label="Analyse with Amiio"
    >
      <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

const pipelineTabs = ["All", "Lead", "Viewing", "Proposal", "Negotiation", "Signed"] as const;

function tabCount(tab: string) {
  if (tab === "All") return pipelineCards.length;
  if (tab === "Signed") return 0;
  return pipelineCards.filter(
    (c) => c.status.toLowerCase() === tab.toLowerCase()
  ).length;
}

/* ------------------------------------------------------------------ */
/*  Lease Renewal Process flow (Figma: Process flow / step 1–3)        */
/* ------------------------------------------------------------------ */

const leaseRenewalSteps = [
  {
    title: "Proposal Prep",
    description: "Prepare initial renewal proposal",
  },
  {
    title: "Lease Proposal",
    description: "Draft commercial terms",
  },
  {
    title: "Review Proposal",
    description: "Review your proposal",
  },
] as const;

function LeaseRenewalProcessFlow({
  currentStep,
  onStepClick,
}: {
  currentStep: 0 | 1 | 2;
  onStepClick?: (stepIndex: 0 | 1 | 2) => void;
}) {
  return (
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
            amiioCardHoverSurface,
          )}
        >
      <div className="relative flex w-full justify-between gap-2">
        <div
          className="pointer-events-none absolute left-[71px] right-[71px] top-5 z-0 h-0.5 bg-[#D1D5D9]"
          aria-hidden
        />
        {leaseRenewalSteps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          const pending = i > currentStep;
          const stepIndex = i as 0 | 1 | 2;
          const colClass = cn(
            "relative z-10 flex w-[142px] shrink-0 flex-col items-center gap-2 text-center",
            onStepClick &&
              "cursor-pointer rounded-xl border border-transparent p-1 -m-1 transition-colors hover:bg-black/[0.03] hover:border-[#E6E8EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE] focus-visible:ring-offset-2",
          );
          const inner = (
            <>
              <div className="flex h-10 items-center justify-center bg-[rgba(255,255,255,0.8)]">
                {done ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#040617] bg-[#040617] text-white">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                ) : active ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#040617] bg-white">
                    <div className="h-4 w-4 rounded-[10px] bg-[#040617]" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-[#B3B8BD] bg-white" />
                )}
              </div>
              <div className="flex min-h-[3.5rem] flex-col gap-1">
                <p
                  className={cn(
                    "text-[14px] font-medium leading-[1.5]",
                    active || done ? "text-[#010309]" : "text-[#65686B]",
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-[12px] font-normal leading-[1.5]",
                    pending ? "text-[#7E8185]" : "text-[#65686B]",
                  )}
                >
                  {step.description}
                </p>
              </div>
            </>
          );
          if (onStepClick) {
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => onStepClick(stepIndex)}
                className={colClass}
                aria-current={active ? "step" : undefined}
                aria-label={`${step.title}. ${active ? "Current step" : done ? "Completed — go to this step" : "Go to this step"}`}
              >
                {inner}
              </button>
            );
          }
          return (
            <div key={step.title} className={colClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Figma Lease Renewal header: 60×60 Building Picture, 26px gap to title row */
function LeaseRenewalPageHeader({
  onOpenTenantHub,
}: {
  onOpenTenantHub?: () => void;
}) {
  return (
    <div className="flex items-start gap-[26px]">
      <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-white">
        <BuildingThumb
          src={TENANT_SCALEHUB_LOGO}
          fit="contain"
          className="absolute inset-0 h-full w-full rounded-[8px] p-0.5"
          alt="ScaleHub III B.V."
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className={cn(
              "text-[20px] font-medium leading-[1.25] text-[#010309]",
              onOpenTenantHub && "cursor-pointer hover:text-[#233FDE] hover:underline",
            )}
            onClick={onOpenTenantHub}
          >
            ScaleHub III B.V.
          </h2>
        </div>
        <div className="mt-2">
          <Badge className="border-0 bg-[#FEF3CD] text-[12px] font-medium text-[#856404]">
            Negotiation
          </Badge>
        </div>
      </div>
    </div>
  );
}

function RecentLeaseRenewalChip() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">Recent:</span>
      <div className="flex h-8 items-center gap-2 rounded-full border border-[#E6E8EB] bg-white px-3 text-[14px] font-medium leading-[1.25] text-[#010309] shadow-sm">
        Lease Renewal
        <button type="button" className="rounded-full p-0.5 text-[#969A9E] hover:bg-[#F2F4F7]">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TermSliderBlock({
  label,
  valueLabel,
  fillPct,
  refs,
}: {
  label: string;
  valueLabel: string;
  fillPct: number;
  refs: { left: string; mid: string }[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-start justify-between gap-2 leading-[1.5]">
        <span className="text-[14px] font-medium text-[#65686B]">{label}</span>
        <span className="text-right text-[16px] font-medium text-[#2C2C2C]">{valueLabel}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#F7F9FB]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#010309]"
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <div className="flex flex-col gap-1 text-[12px] leading-[1.5] text-[#65686B]">
        {refs.map((r) => (
          <div key={`${r.left}-${r.mid}`} className="flex h-5 items-center justify-between">
            <span className="font-normal">{r.left}</span>
            <span className="font-medium">{r.mid}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProposedTermsConditionsFigma({
  onAnalyseWithAmiio,
}: {
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-[rgba(230,231,232,0.7)] p-6",
        amiioCardHoverSurface,
      )}
      style={{
        backgroundImage:
          "linear-gradient(-88deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
      }}
    >
      <div className="flex items-center gap-2">
        <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
        <h3 className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
          Proposed Terms &amp; Conditions
        </h3>
      </div>

      <div
        className="flex flex-col gap-5 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4 md:flex-row md:gap-12"
        style={{
          backgroundImage:
            "linear-gradient(-83deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
        }}
      >
        <TermSliderBlock
          label="Proposed Rent (per sqm/yr)"
          valueLabel="€244"
          fillPct={52}
          refs={[
            { left: "Current", mid: "€232" },
            { left: "Market", mid: "€235" },
            { left: "Prime", mid: "€275" },
          ]}
        />
        <TermSliderBlock
          label="Lease Terms (years)"
          valueLabel="5 years"
          fillPct={40}
          refs={[
            { left: "Minimum", mid: "3 years" },
            { left: "Recommended", mid: "5 Years" },
            { left: "Maximum", mid: "10 years" },
          ]}
        />
        <TermSliderBlock
          label="Incentive (rent-free months)"
          valueLabel="2 months"
          fillPct={45}
          refs={[
            { left: "Minimum", mid: "None" },
            { left: "Market", mid: "4 months" },
            { left: "Maximum", mid: "6" },
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] p-4">
          <p className="text-[16px] font-medium leading-[1.5] text-[#2C2C2C]">Proposed Terms Summary</p>
          <div className="mt-4 divide-y divide-[rgba(230,231,232,0.7)]">
            {[
              ["Proposed Rent", "€245/sqm/yr"],
              ["Rent Increase", "trend"],
              ["Lease Term", "5 Years"],
              ["Incentive", "2 months rent-free"],
              ["Break Option", "After year 3 (6 months notice)"],
              ["Indexation", "CPI annually"],
            ].map(([k, v]) => (
              <div key={k} className="flex h-10 items-center justify-between py-3 first:pt-0">
                <span className="text-[14px] font-medium text-[#65686B]">{k}</span>
                {k === "Rent Increase" ? (
                  <TrendPill direction="up" pct="33%" />
                ) : (
                  <span className="text-[14px] font-normal text-[#2C2C2C]">{v}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="rounded-2xl border border-[rgba(230,231,232,0.7)] p-4"
          style={{
            backgroundImage:
              "linear-gradient(153deg, rgba(236, 241, 247, 0.8) 0.6%, rgba(236, 244, 247, 0.7) 98%)",
          }}
        >
          <p className="text-[16px] font-medium leading-[1.5] text-[#2C2C2C]">Financial Impact</p>
          <div className="mt-4 space-y-0">
            <div className="flex h-10 items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
              <span className="text-[14px] font-medium text-[#65686B]">Annual Rent (new)</span>
              <span className="text-[14px] font-normal text-[#2C2C2C]">€952,820</span>
            </div>
            <div className="flex h-10 items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
              <span className="text-[14px] font-medium text-[#65686B]">Total Contract Value</span>
              <span className="text-[14px] font-normal text-[#2C2C2C]">€4,764,100</span>
            </div>
            <div className="flex h-10 items-center justify-between border-b border-[#121212] py-3">
              <span className="text-[14px] font-medium text-[#65686B]">Less Incentive Value</span>
              <span className="text-[14px] font-normal text-[#B23A48]">-€157,803</span>
            </div>
            <div className="flex items-center justify-between pb-1 pt-3">
              <span className="text-[14px] font-medium text-[#2C2C2C]">Effective Annual Rent</span>
              <span className="text-[16px] font-medium text-[#2C2C2C]">€921,059</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[12px] font-medium text-[#65686B]">Break Option</span>
              <span className="text-[12px] font-normal text-[#65686B]">€236/sqm/yr</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] p-2">
        <div className="flex gap-2">
          <AmiioAiDisclaimerTrigger>
            <button
              type="button"
              className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#010309] transition-colors hover:bg-[#F3F6FA]"
              aria-label="Amiio AI"
            >
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </button>
          </AmiioAiDisclaimerTrigger>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-[16px] font-medium leading-[1.5] text-[#353638]">
              Amiio&apos;s recommendation
            </p>
            <p className="text-[14px] font-normal leading-[1.4] text-[#353638]">
              Based on tenant history, market conditions, and asset positioning, I recommend a €244/sqm
              rent with 2 months rent-free incentive over a 5-year term. This represents a 5.2%
              increase from current rent, which is above average — consider negotiation buffer. The
              effective rent of €236/sqm is at the higher end of the current market range.
            </p>
            <button
              type="button"
              className="rounded-full border border-[#B3B8BD] px-2 py-1 text-[12px] font-medium text-[#010309] hover:bg-[#F2F4F7]"
              onClick={() =>
                onAnalyseWithAmiio?.(
                  "Amiio’s renewal recommendation — proposed rent, incentive, and effective rent vs market",
                )
              }
            >
              Analyse further
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparableLeasesMiniTable() {
  const rows = [
    {
      name: "Wonderkind Technologies B.V.",
      area: "580 sqm",
      rent: "€267",
      trend: "up" as const,
      trendValue: "16%",
      lease: "1-Nov-19",
      term: "30 yrs",
    },
    {
      name: "Occupancy",
      area: "580 sqm",
      rent: "€238",
      trend: "up" as const,
      trendValue: "3%",
      lease: "01-May-24",
      term: "29 yrs",
    },
    {
      name: "Incentive %",
      area: "628 sqm",
      rent: "€233",
      trend: "flat" as const,
      trendValue: "0%",
      lease: "01-May-24",
      term: "29 yrs",
    },
  ];
  return (
    <div
      className="space-y-4 rounded-2xl border border-[rgba(230,231,232,0.7)] p-[25px]"
      style={{
        backgroundImage:
          "linear-gradient(-86deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
      }}
    >
      <div className="flex items-center gap-2">
        <ChevronUp className="h-6 w-6 text-[#969A9E]" />
        <span className="text-[18px] font-medium leading-[1.25] text-[#121212]">Recent Comparable Leases</span>
      </div>
      <p className="text-[14px] font-medium leading-[1.5] text-[#121212]">For Rental Assessment</p>
      <div className="overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)]">
        <div className="grid grid-cols-[240px_100px_160px_100px_100px] items-center justify-between border-b border-[rgba(230,231,232,0.7)] bg-[#F2F4F7] px-3 py-[13px] text-[14px] font-medium text-[#65686B]">
          <span>Tenant</span>
          <span className="text-right">AREA</span>
          <span className="text-right">RENT/SQM</span>
          <span className="text-right">LEASE START</span>
          <span className="text-right">Term</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.name}
            className="grid h-12 grid-cols-[240px_100px_160px_100px_100px] items-center justify-between border-b border-[rgba(230,231,232,0.7)] px-3 last:border-b-0"
          >
            <span className="text-[14px] font-medium text-[#2C2C2C]">{r.name}</span>
            <span className="text-right text-[14px] font-normal leading-[1.4] text-[#65686B]">{r.area}</span>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">{r.rent}</span>
              {r.trend === "up" ? (
                <TrendPill direction="up" pct={r.trendValue} />
              ) : (
                <TrendPill direction="neutral" pct={r.trendValue} />
              )}
              <span className="text-[12px] text-[#65686B]">vs current</span>
            </div>
            <span className="text-right text-[12px] font-normal leading-[1.5] text-[#65686B]">{r.lease}</span>
            <span className="text-right text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">{r.term}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaseRenewalWorkflowFooter({
  onBack,
  primaryLabel,
  onPrimary,
  primaryIcon,
}: {
  onBack: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryIcon?: "arrow" | "download";
}) {
  return (
    <div className="flex items-center justify-between border-t border-[rgba(230,231,232,0.7)] pt-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] transition-colors hover:bg-[#F2F4F7]"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] hover:bg-[#F2F4F7]"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message: "Draft saved" } }))
          }
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#010309] px-4 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#252628]"
        >
          {primaryLabel}
          {primaryIcon === "download" ? (
            <Download className="h-5 w-5" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-view: Pipeline                                                 */
/* ------------------------------------------------------------------ */

function PipelineInsightBubble() {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#010309] shadow-[0px_2px_6px_rgba(0,0,0,0.15)]">
      <Lightbulb className="h-3 w-3 text-[#F0F2F5]" strokeWidth={2} />
    </div>
  );
}

const prospectActivityLog = [
  {
    type: "Email" as const,
    date: "15-Jan-2026",
    text: "Initial inquiry about available space",
  },
  {
    type: "Transcript" as const,
    date: "22-Jan-2026",
    text: "Site viewing - positive feedback on location",
  },
  {
    type: "Notes" as const,
    date: "5-Feb-2026",
    text: "Follow-up call - discussing lease notes",
  },
  {
    type: "Email" as const,
    date: "12-Feb-2026",
    text: "Sent proposal with €185/sqm offer",
  },
];

function ActivityLogIcon({ type }: { type: "Email" | "Transcript" | "Notes" }) {
  const icon =
    type === "Email" ? (
      <Mail className="h-4 w-4 text-[#F0F2F5]" />
    ) : type === "Transcript" ? (
      <MessageSquare className="h-4 w-4 text-[#F0F2F5]" />
    ) : (
      <FileText className="h-4 w-4 text-[#F0F2F5]" />
    );
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#020410] p-1.5">
      {icon}
    </div>
  );
}

function AddNewProspectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(90vh,640px)] max-w-[638px] gap-0 overflow-y-auto rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] p-0 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        <DialogTitle className="sr-only">Add a New Prospect</DialogTitle>
        <div className="relative flex flex-col gap-5 px-8 pb-8 pt-8">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-2 flex size-6 items-center justify-center rounded-full p-1.5 text-[#65686B] hover:bg-[#F3F6FA]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex max-w-[576px] flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-[20px] font-medium leading-[1.25] text-[#121212]">Add a New Prospect</h2>
              <p className="text-[16px] font-normal leading-[1.5] text-[#2C2C2C]">
                Enter the details of the new prospect to add them to your leasing pipeline.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">Company Name</span>
                <Input
                  placeholder="Enter company name"
                  className="h-12 rounded-lg border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">Contact Person</span>
                  <Input
                    placeholder="Full name"
                    className="h-12 rounded-lg border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">Email</span>
                  <Input
                    type="email"
                    placeholder="email@company.com"
                    className="h-12 rounded-lg border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">Phone (optional)</span>
                  <div className="flex h-12 items-center gap-2 rounded-lg border border-[#D1D5D9] bg-white px-3">
                    <select
                      className="h-full shrink-0 border-0 bg-transparent pr-6 text-[16px] text-[#2C2C2C] outline-none"
                      aria-label="Country code"
                    >
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+31">🇳🇱 +31</option>
                    </select>
                    <span className="h-6 w-px shrink-0 bg-[#D1D5D9]" />
                    <Input
                      placeholder="+972"
                      className="h-full flex-1 border-0 px-0 text-[16px] shadow-none placeholder:text-[#969A9E] focus-visible:ring-0"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">Target Unit (optional)</span>
                  <Input
                    placeholder="e.g. Floor 2 unit 2A"
                    className="h-12 rounded-lg border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[16px] font-normal leading-[1.25] text-[#2C2C2C]">
                  Expected Annual Return (EUR)
                </span>
                <Input
                  placeholder="0"
                  className="h-12 rounded-lg border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-12 min-w-[92px] items-center justify-center rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] hover:bg-[#F3F6FA]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "Prospect added to pipeline" } }),
                );
              }}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#121212] px-4 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#353638]"
            >
              Add Prospect
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProspectModalDialog({
  open,
  onOpenChange,
  card,
  onStartLeaseWorkflow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: PipelineCard | null;
  onStartLeaseWorkflow?: () => void;
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadActivity, setUploadActivity] = useState("");

  useEffect(() => {
    if (!open) {
      setUploadOpen(false);
      setUploadActivity("");
    }
  }, [open]);

  if (!card) return null;

  const stages: PipelineCard["status"][] = ["Lead", "Viewing", "Proposal", "Negotiation"];

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(90vh,920px)] max-w-[min(906px,calc(100vw-24px))] flex-col gap-0 overflow-hidden rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] p-0 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        <DialogTitle className="sr-only">{card.company}</DialogTitle>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-3 z-20 flex size-6 items-center justify-center rounded-full p-1.5 text-[#65686B] hover:bg-[#F3F6FA]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="shrink-0 space-y-5 px-6 pb-4 pt-8 sm:px-8 sm:pr-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex min-w-0 items-center gap-2">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9]">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E6E8EB] to-[#CDCFD5] text-sm font-bold text-[#65686B]">
                    {card.company.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[20px] font-medium leading-[1.25] text-[#353638]">{card.company}</p>
                  <p className="text-[14px] font-normal leading-[1.4] text-[#65686B]">{card.unit}</p>
                </div>
              </div>
              <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:max-w-none sm:shrink-0 sm:items-end">
                <div className="relative w-full sm:w-[min(200px,100%)]">
                  <select
                    defaultValue={card.status}
                    className="h-10 w-full appearance-none rounded-lg border border-[#E6E8EB] bg-white py-2 pl-3 pr-10 text-[14px] font-medium text-[#2C2C2C] accent-auto outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
                    aria-label="Pipeline stage"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2C2C2C]" />
                </div>
                <div className="flex flex-nowrap items-center gap-1.5 sm:justify-end">
                  <AmiioAiDisclaimerTrigger>
                    <button
                      type="button"
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#2C2C2C] transition-colors hover:bg-[#F3F6FA]"
                      aria-label="Amiio AI"
                    >
                      <Sparkles className="h-4 w-4 text-[#2C2C2C]" aria-hidden />
                    </button>
                  </AmiioAiDisclaimerTrigger>
                  <ProbabilityDonut value={card.probability} size={24} />
                  <span className="whitespace-nowrap text-[14px] font-medium leading-none text-[#2C2C2C]">
                    {card.probability}% success probability
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-3"
                >
                  <p className="text-[12px] font-medium leading-[1.5] text-[#65686B]">Indicative Value</p>
                  <p className="mt-1 text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">€47,225,000</p>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 pb-4 sm:px-8">
            <div
              className={cn(
                "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6 opacity-[0.98]",
                amiioCardHoverSurface,
              )}
            >
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">Activities</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-nowrap lg:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUploadActivity("Transcript");
                    setUploadOpen(true);
                  }}
                  className="inline-flex h-8 min-w-[108px] items-center justify-center gap-2 rounded-full bg-[#05091F] px-3 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#0E195B]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Transcript
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 min-w-[108px] items-center justify-center gap-2 rounded-full bg-[#05091F] px-3 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#0E195B]"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[10rem] border-[#E6E8EB] bg-white text-[#353638]">
                    <DropdownMenuItem
                      className="cursor-pointer text-[14px] focus:bg-[#F2F4F7]"
                      onSelect={() => {
                        window.dispatchEvent(
                          new CustomEvent("amiio:toast", {
                            detail: { message: "Send Email — opening composer…" },
                          }),
                        );
                      }}
                    >
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-[14px] focus:bg-[#F2F4F7]"
                      onSelect={() => {
                        setUploadActivity("Email");
                        setUploadOpen(true);
                      }}
                    >
                      Upload Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    setUploadActivity("Notes");
                    setUploadOpen(true);
                  }}
                  className="inline-flex h-8 min-w-[108px] items-center justify-center gap-2 rounded-full bg-[#05091F] px-3 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#0E195B]"
                >
                  <FileText className="h-4 w-4" />
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadActivity("Document");
                    setUploadOpen(true);
                  }}
                  className="inline-flex h-8 min-w-[108px] items-center justify-center gap-2 rounded-full bg-[#05091F] px-3 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#0E195B]"
                >
                  <Upload className="h-4 w-4" />
                  Document
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {prospectActivityLog.map((row, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <ActivityLogIcon type={row.type} />
                      <span className="text-[16px] font-medium text-[#2C2C2C]">{row.type}</span>
                      <Link2 className="h-4 w-4 shrink-0 text-[#233FDE]" />
                    </div>
                    <span className="shrink-0 text-[12px] font-normal text-[#65686B]">{row.date}</span>
                  </div>
                  <p className="text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">{row.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <span className="text-[16px] font-normal text-[#2C2C2C]">Notes</span>
                <span className="text-[14px] font-normal text-[#65686B]">0/1000</span>
              </div>
              <Textarea
                placeholder="Enter your information"
                className="min-h-[157px] rounded-2xl border-[#D1D5D9] bg-white text-[16px] placeholder:text-[#969A9E]"
              />
            </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[rgba(230,231,232,0.85)] bg-[#FBFBFB] px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#B23A48] px-4 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#9A3240]"
              >
                Mark as Lost
              </button>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] hover:bg-[#F3F6FA]"
                >
                  Generate Proposal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onStartLeaseWorkflow?.();
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#121212] px-4 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#353638]"
                >
                  Start Lease Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <ActivityUploadDialog
      open={uploadOpen}
      onOpenChange={(o) => {
        setUploadOpen(o);
        if (!o) setUploadActivity("");
      }}
      activityLabel={uploadActivity}
    />
    </>
  );
}

function PipelineView({
  onStartLeaseWorkflow,
  onAnalyseWithAmiio,
}: {
  onStartLeaseWorkflow?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [stagesOpen, setStagesOpen] = useState(true);
  const [addProspectOpen, setAddProspectOpen] = useState(false);
  const [prospectModalOpen, setProspectModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PipelineCard | null>(null);

  const filteredCards = pipelineCards.filter((c) => {
    if (activeTab === "All") return true;
    if (activeTab === "Signed") return false;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* KPI row — Figma: Leasing Tool Overview metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div
          className={cn(
            "flex min-h-[136px] flex-col gap-2 rounded-2xl border border-[rgba(230,231,232,0.7)] p-6",
            amiioCardHoverSurface,
          )}
          style={{ backgroundImage: metricCardGradient }}
        >
          <div className="flex h-8 items-center justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-[15px] font-medium leading-[1.25] text-[#65686B]">
              Active Prospects
            </p>
            <MetricInsightButton
              onClick={() => onAnalyseWithAmiio?.("Active Prospects in the leasing pipeline")}
            />
          </div>
          <p className="text-[32px] font-medium leading-[1.25] text-[#353638]">4</p>
        </div>

        <div
          className={cn(
            "flex min-h-[136px] flex-col gap-2 rounded-2xl border border-[rgba(230,231,232,0.7)] p-6",
            amiioCardHoverSurface,
          )}
          style={{ backgroundImage: metricCardGradient }}
        >
          <div className="flex h-8 items-center justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-[15px] font-medium leading-[1.25] text-[#65686B]">
              Weighted Pipeline Value
            </p>
            <MetricInsightButton
              onClick={() => onAnalyseWithAmiio?.("Weighted pipeline value and deal momentum")}
            />
          </div>
          <div className="flex h-12 items-center justify-between gap-3">
            <div className="flex min-w-[112px] flex-col justify-between gap-1">
              <p className="text-[21px] font-medium leading-[1.25] text-[#353638]">€144K</p>
              <TrendPill direction="up" pct="1.5%" />
            </div>
            <svg width="72" height="32" className="shrink-0 text-[#1F9E8B]" viewBox="0 0 72 32" aria-hidden>
              <defs>
                <linearGradient id="pipeSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M2 22 L12 16 L22 18 L32 10 L42 13 L52 6 L62 9 L70 4 L70 30 L2 30 Z"
                fill="url(#pipeSpark)"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="2,22 12,16 22,18 32,10 42,13 52,6 62,9 70,4"
              />
            </svg>
          </div>
        </div>

        <div
          className={cn(
            "flex min-h-[136px] flex-col gap-2 rounded-2xl border border-[rgba(230,231,232,0.7)] p-6",
            amiioCardHoverSurface,
          )}
          style={{ backgroundImage: metricCardGradient }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="max-w-[133px] text-[15px] font-medium leading-[1.25] text-[#65686B]">
              Avg. Success Probability
            </p>
            <MetricInsightButton
              onClick={() =>
                onAnalyseWithAmiio?.("Average success probability across pipeline deals")
              }
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-h-[48px] flex-col justify-between gap-1">
              <p className="text-[21px] font-medium leading-[1.25] text-[#353638]">46%</p>
              <TrendPill direction="up" pct="1.5%" />
            </div>
            <ProbabilityDonut value={46} size={48} />
          </div>
        </div>

        <div
          className={cn(
            "flex min-h-[136px] flex-col gap-2 rounded-2xl border border-[rgba(230,231,232,0.7)] p-6",
            amiioCardHoverSurface,
          )}
          style={{ backgroundImage: metricCardGradient }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="whitespace-nowrap text-[15px] font-medium leading-[1.25] text-[#65686B]">
              In Negotiation
            </p>
            <MetricInsightButton
              onClick={() => onAnalyseWithAmiio?.("Deals currently in negotiation and priority actions")}
            />
          </div>
          <div className="flex min-h-[48px] flex-col justify-between gap-1">
            <p className="text-[21px] font-medium leading-[1.25] text-[#353638]">1</p>
            <div className="inline-flex w-fit rounded-lg bg-[#E6F6F3] px-1 py-0.5">
              <span className="text-[12px] font-medium leading-[1.25] text-[#1F9E8B]">High priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages — Figma: white card + pill nav (horizontal scroll when row wider than viewport) */}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-left text-[18px] font-medium leading-[1.25] text-[#2C2C2C]"
            onClick={() => setStagesOpen(!stagesOpen)}
          >
            {stagesOpen ? (
              <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
            ) : (
              <ChevronRight className="h-6 w-6 shrink-0 text-[#969A9E]" />
            )}
            Pipeline Stages
          </button>
          <button
            type="button"
            onClick={() => setAddProspectOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#010309] px-3.5 py-1 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#252628]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Prospect
          </button>
        </div>

        {stagesOpen && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {pipelineTabs.map((tab) => {
                const count = tabCount(tab);
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-full px-4 text-[14px] font-medium leading-[1.24] transition-colors",
                      active
                        ? "bg-[#010309] text-[#F0F2F5]"
                        : "text-[#2C2C2C] hover:bg-[#F3F6FA]",
                    )}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              {filteredCards.length === 0 && (
                <p className="rounded-xl border border-dashed border-[rgba(230,231,232,0.9)] bg-[#FBFBFB] px-4 py-8 text-center text-[14px] text-[#65686B]">
                  No prospects in this stage.
                </p>
              )}
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedCard(card);
                    setProspectModalOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCard(card);
                      setProspectModalOpen(true);
                    }
                  }}
                  className="cursor-pointer rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] py-4 pl-4 pr-2 outline-none transition-colors hover:border-[#CDCFD5] hover:bg-[#F5F5F6] focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2"
                >
                  <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                  <div className="flex w-max min-w-full items-center gap-2">
                    <div className="flex min-w-0 flex-[1.1] items-center gap-2">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#D9D9D9]">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E6E8EB] to-[#CDCFD5] text-[11px] font-bold text-[#65686B]">
                          {card.company.slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium leading-[1.5] text-[#353638]">
                          {card.company}
                        </p>
                        <p className="truncate text-[12px] font-normal leading-[1.5] text-[#65686B]">
                          {card.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-[100px] shrink-0 justify-end px-2">
                      <Badge className={cn("rounded-2xl px-2 py-1 text-[12px] font-medium", statusBadgeClasses(card.status))}>
                        {card.status}
                      </Badge>
                    </div>

                    <div className="flex w-[140px] shrink-0 items-center gap-2.5 px-2">
                      <div
                        className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-normal text-white"
                        style={{ backgroundColor: card.avatarBg }}
                      >
                        {card.avatar}
                      </div>
                      <span className="truncate text-[12px] font-normal leading-[1.24] text-[#676A6E]">
                        {card.avatarName}
                      </span>
                    </div>

                    <div className="w-[112px] shrink-0 px-2">
                      <p className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">{card.price}</p>
                    </div>

                    <div className="w-[112px] shrink-0 px-2">
                      <p className="whitespace-nowrap text-[12px] font-medium leading-5 text-[#7E8185]">{card.time}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 pr-1">
                      <ProbabilityDonut value={card.probability} size={24} />
                      <span className="text-[14px] font-medium leading-[1.24] text-[#2C2C2C]">
                        {card.probability}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                        setProspectModalOpen(true);
                      }}
                      className="flex h-14 shrink-0 items-center pl-2 pr-3 text-[#65686B] hover:text-[#2C2C2C]"
                      aria-label="Open prospect"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                  </div>

                  <div className="mt-2 flex items-start gap-2.5 pr-4">
                    <PipelineInsightBubble />
                    <p className="text-[12px] font-normal leading-[1.5] text-[#353638]">{card.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AddNewProspectDialog open={addProspectOpen} onOpenChange={setAddProspectOpen} />
      <ProspectModalDialog
        open={prospectModalOpen && !!selectedCard}
        onOpenChange={(o) => {
          setProspectModalOpen(o);
          if (!o) setSelectedCard(null);
        }}
        card={selectedCard}
        onStartLeaseWorkflow={onStartLeaseWorkflow}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-view: Proposal Prep                                            */
/* ------------------------------------------------------------------ */

const PROPOSAL_PREP_EXEC_SUMMARY_PARTS: { text: string; className?: string }[] = [
  {
    text:
      "ScaleHub III B.V. has been a tenant since 01-Jul-2019 with 1 successful renewals, demonstrating strong commitment to this location. The current lease expires on 30-Jun-2032. Based on their excellent payment history (100% on-time), positive communication sentiment (8.2/10), and recent business activity indicating stability, I assess the renewal probability as ",
  },
  { text: "Very High (85%+)", className: "font-semibold text-[#1F9E8B]" },
  { text: "." },
];

function ProposalPrepView({
  onBack,
  onProceed,
  onOpenTenantHub,
  onAnalyseWithAmiio,
  onNavigateLeaseRenewalStep,
}: {
  onBack: () => void;
  onProceed: () => void;
  onOpenTenantHub?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader onOpenTenantHub={onOpenTenantHub} />
        <RecentLeaseRenewalChip />
      </div>

      <LeaseRenewalProcessFlow currentStep={0} onStepClick={onNavigateLeaseRenewalStep} />

      {/* Insight Summary — Figma */}
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
            amiioCardHoverSurface,
          )}
        >
        <div className="mb-4 flex items-center gap-2">
          <AmiioAiDisclaimerTrigger>
            <button
              type="button"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#010309] transition-colors hover:bg-[#F3F6FA]"
              aria-label="Amiio AI"
            >
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </button>
          </AmiioAiDisclaimerTrigger>
          <h3 className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
            Amiio&apos;s Executive Summary
          </h3>
        </div>
        <div className="rounded-xl bg-[#FBFBFB] px-4 py-4">
          <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
            <AmiioSummaryTypewriterParts parts={PROPOSAL_PREP_EXEC_SUMMARY_PARTS} charDelayMs={8} />
          </p>
        </div>
      </div>

      {/* Tenant + Asset profiles */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
            amiioCardHoverSurface,
          )}
        >
          <div className="flex items-start gap-[26px]">
            <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-white">
              <BuildingThumb
                src={TENANT_SCALEHUB_LOGO}
                fit="contain"
                className="absolute inset-0 h-full w-full rounded-[8px] p-0.5"
                alt="ScaleHub III B.V."
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold leading-[1.25] text-[#010309]">ScaleHub III B.V.</p>
              <p className="mt-1 text-[12px] font-normal leading-[1.25] text-[#65686B]">Tenant Profile</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-4">
            <MetricCell label="First lease" value="01-Jul-2019" />
            <MetricCell label="Employees" value="150-200" />
            <MetricCell label="Parking Spaces" value="40 spaces" />
            <MetricCell label="Renewals" value="1x" />
            <MetricCell label="Leased Area" value="3,905 sqm" />
            <MetricCell label="Annual Value" value="€904,302" />
            <MetricCell label="Expires" value="30-Jun-2032" />
            <MetricCell label="Current Rent" value="€232/sqm/yr" />
          </div>
          <div className="mt-6 border-t border-[rgba(230,231,232,0.7)] pt-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[#65686B]">
              Recent Business Changes
            </p>
            <p className="mt-2 text-[12px] leading-[1.5] text-[#353638]">
              Announced Series C funding of €45M in Q3 2025 Expanding AI capabilities with new machine
              learning team Opened new office in Rotterdam for customer success team
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
            amiioCardHoverSurface,
          )}
        >
          <div className="flex items-start gap-[26px]">
            <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-[#D9D9D9]">
              <BuildingThumb className="absolute inset-0 h-full w-full rounded-[8px]" alt="Asset" />
            </div>
            <div>
              <p className="text-[14px] font-semibold leading-[1.25] text-[#010309]">
                H.J.E. Wenckebachweg 123
              </p>
              <p className="mt-1 text-[12px] font-normal leading-[1.25] text-[#65686B]">Asset Profile</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-4">
            <div>
              <p className="text-[12px] text-[#65686B]">Condition</p>
              <Badge variant="outline" className="mt-1 border-[#E6E8EB] text-[12px] font-medium">
                Good
              </Badge>
            </div>
            <div>
              <p className="text-[12px] text-[#65686B]">Location</p>
              <Badge variant="outline" className="mt-1 border-[#E6E8EB] text-[12px] font-medium">
                Amsterdam SE
              </Badge>
            </div>
            <MetricCell label="Built" value="2000" />
            <MetricCell label="Total LFA" value="45,000 sqm" />
            <MetricCell label="Occupancy" value="100%" />
            <div>
              <p className="text-[12px] text-[#65686B]">Energy</p>
              <Badge className="mt-1 border-0 bg-[#E6F6F3] text-[12px] font-medium text-[#1F9E8B]">
                A
              </Badge>
            </div>
            <MetricCell label="Avg. Asset Rent" value="€221/sqm/yr" />
            <MetricCell label="Asset Valuation" value="€47,225,000" />
          </div>
          <div className="mt-6">
            <p className="text-[12px] font-medium text-[#65686B]">
              Tenant Concentration - ScaleHub III B.V.
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E6E8EB]">
              <div className="h-full w-[65%] rounded-full bg-[#010309]" />
            </div>
          </div>
        </div>
      </div>

      {/* Market Analysis — Figma */}
      <div
        className={cn(
          "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6 space-y-6",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex items-center gap-2">
          <ChevronDown className="h-6 w-6 shrink-0 text-[#969A9E]" />
          <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">Market Analysis</span>
        </div>
        <p className="text-[16px] font-medium leading-[1.25] text-[#2C2C2C]">
          Amsterdam Southeast Office Market
        </p>

        <div className="flex flex-wrap items-stretch justify-between gap-4 rounded-xl border border-[rgba(230,231,232,0.7)] px-2 py-4 sm:flex-nowrap">
          {[
            { label: "Market Avg. Rent", value: "€235/sqm", sub: "from €175" },
            { label: "Market Vacancy", value: "12.5%", sub: "↗ 0.5%", subC: "text-[#1F9E8B]" },
            { label: "New Supply (2025)", value: "45,000 sqm", sub: "↗ 5% vs previous year", subC: "text-[#1F9E8B]" },
            { label: "Market Incentive", value: "8%", sub: "↗ 6 months avg", subC: "text-[#1F9E8B]" },
          ].map((m, i) => (
            <div key={m.label} className="flex min-w-[140px] flex-1 items-center gap-4">
              {i > 0 && <div className="hidden h-16 w-px shrink-0 bg-[rgba(230,231,232,0.7)] sm:block" />}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[12px] font-medium text-[#65686B]">{m.label}</p>
                <p className="mt-1 text-[18px] font-medium text-[#010309]">{m.value}</p>
                {m.sub && (
                  <p className={cn("text-[12px] font-medium", m.subC ?? "text-[#65686B]")}>{m.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {comparableProperties.map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-4 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-start gap-[26px]">
                <div className="relative mt-[5px] h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-[#D9D9D9]">
                  <img
                    src={p.thumbSrc}
                    alt={`${p.name} — building`}
                    className="absolute inset-0 h-full w-full rounded-[8px] object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#010309]">{p.name}</p>
                  <p className="mt-1 text-[14px] text-[#65686B]">
                    {p.location} | {p.area} | {p.type}
                  </p>
                  <p className="mt-1 text-[12px] text-[#65686B]">
                    Energy: {p.energy} Condition: {p.condition} Available: {p.available}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 sm:w-[200px]">
                <span className="text-[12px] font-medium text-[#65686B]">GRI: {p.gri}</span>
                <div className="flex flex-wrap items-end justify-end gap-2">
                  <span className="text-[14px] font-medium text-[#010309]">{p.rent}</span>
                  <span className="flex items-center gap-1">
                    <span className={cn("text-[12px] font-medium", p.diffColor)}>{p.diff}</span>
                    <span className="text-[12px] text-[#65686B]">vs subject</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-stretch justify-between gap-4 rounded-xl border border-[rgba(230,231,232,0.7)] px-2 py-4 sm:flex-nowrap">
          {[
            { label: "Average Asking", value: "€176/sqm", sub: "↗ 3.5%", subC: "text-[#1F9E8B]" },
            { label: "Current Rent", value: "€232/sqm", sub: "↗ 0.6%", subC: "text-[#1F9E8B]" },
            { label: "Difference", value: "-28.6%", sub: "", subC: "text-[#B23A48]" },
            { label: "Suggested", value: "€175-185", sub: "↗ 2.8%", subC: "text-[#1F9E8B]" },
          ].map((m, i) => (
            <div key={m.label} className="flex min-w-[140px] flex-1 items-center gap-4">
              {i > 0 && <div className="hidden h-16 w-px shrink-0 bg-[rgba(230,231,232,0.7)] sm:block" />}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[12px] font-medium text-[#65686B]">{m.label}</p>
                <p className="mt-1 text-[18px] font-medium text-[#010309]">{m.value}</p>
                {m.sub && <p className={cn("text-[12px] font-medium", m.subC)}>{m.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] p-3">
          <AmiioAiDisclaimerTrigger>
            <button
              type="button"
              className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[#010309] transition-colors hover:bg-[#F3F6FA]"
              aria-label="Amiio AI"
            >
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </button>
          </AmiioAiDisclaimerTrigger>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium leading-[1.5] text-[#353638]">
              Market Insight: Based on 4 comparable units currently for lease in Amsterdam Southeast,
              the average asking rent is €179/sqm. Current tenant rent of €232/sqm is above market
              asking prices. Given the asset&apos;s good condition, excellent location, and Energy Label
              A, a rent in the range of €175-185/sqm is justified for renewal negotiations.
            </p>
            <button
              type="button"
              className="mt-3 rounded-full border border-[#B3B8BD] px-3 py-1 text-[12px] font-medium text-[#010309] hover:bg-[#F2F4F7]"
              onClick={() =>
                onAnalyseWithAmiio?.(
                  "Amsterdam Southeast market comparables and suggested renewal rent range for ScaleHub III B.V.",
                )
              }
            >
              Analyse further
            </button>
          </div>
        </div>
      </div>

      <ComparableLeasesMiniTable />

      <ProposedTermsConditionsFigma onAnalyseWithAmiio={onAnalyseWithAmiio} />

      <LeaseRenewalWorkflowFooter onBack={onBack} primaryLabel="Proceed" onPrimary={onProceed} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-view: Lease Proposal                                           */
/* ------------------------------------------------------------------ */

function LeaseProposalView({
  onBack,
  onProceed,
  onNavigateLeaseRenewalStep,
}: {
  onBack: () => void;
  onProceed: () => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
}) {
  const [inputTab, setInputTab] = useState<"Transcript" | "Email" | "Notes" | "Document">(
    "Transcript"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [liveStatus, setLiveStatus] = useState({
    agreedRent: 225,
    agreedTerm: 5,
    incentive: "3 months free",
    startDate: "Jul 2026",
  });
  const [editDraft, setEditDraft] = useState(liveStatus);
  const [agreedTerms, setAgreedTerms] = useState([
    "Break option at year 3 with 6 months notice",
    "Expansion option for Unit 4B at €209/sqm",
    "CPI indexation capped at 3% annually",
  ]);
  const [newTerm, setNewTerm] = useState("");
  const [negotiationDataUploadOpen, setNegotiationDataUploadOpen] = useState(false);
  const [negotiationDataUploadLabel, setNegotiationDataUploadLabel] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader />
        <RecentLeaseRenewalChip />
      </div>

      <LeaseRenewalProcessFlow currentStep={1} onStepClick={onNavigateLeaseRenewalStep} />

      {/* Live Status — white card when viewing; soft green tint while editing */}
      <div
        className={cn(
          "relative p-5 space-y-4 transition-all duration-300",
          isEditing
            ? "rounded-2xl border border-[#D1E5D9] bg-[rgba(236,253,245,0.38)] shadow-[0_1px_3px_rgba(15,23,42,0.05),0_0_0_1px_rgba(22,163,74,0.07)]"
            : cn(
                "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)]",
                amiioCardHoverSurface,
              ),
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <h3 className="text-[18px] font-medium text-[#2C2C2C]">Amiio&apos;s Live Status</h3>
            <span className="ml-1 flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-xs font-medium text-[#16A34A]">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                setLiveStatus(editDraft);
                setIsEditing(false);
              } else {
                setEditDraft(liveStatus);
                setIsEditing(true);
              }
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              isEditing
                ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                : "border border-[#E6E8EB] text-[#6B7280] hover:bg-[rgba(255,255,255,0.35)]",
            )}
          >
            {isEditing ? (
              <>
                <Check className="h-3 w-3" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-3 w-3" />
                Edit
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-[#6B7280]">Agreed Rent</p>
            {isEditing ? (
              <input
                type="number"
                value={editDraft.agreedRent}
                onChange={(e) => setEditDraft((d) => ({ ...d, agreedRent: Number(e.target.value) }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-lg font-bold text-[#111827]">
                {liveStatus.agreedRent}{" "}
                <span className="text-xs font-normal text-[#6B7280]">/sqm/yr</span>
              </p>
            )}
            <p className="text-xs text-[#16A34A]">
              ↗ {(((liveStatus.agreedRent - 232) / 232) * 100).toFixed(1)}% vs current
            </p>
            <p className="text-xs text-[#6B7280]">Aligned with recommendations</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#6B7280]">Agreed Term</p>
            {isEditing ? (
              <input
                type="number"
                value={editDraft.agreedTerm}
                onChange={(e) => setEditDraft((d) => ({ ...d, agreedTerm: Number(e.target.value) }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-lg font-bold text-[#111827]">
                {liveStatus.agreedTerm} years
              </p>
            )}
            <p className="text-xs text-[#6B7280]">Aligned with recommendations</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#6B7280]">Incentive</p>
            {isEditing ? (
              <input
                type="text"
                value={editDraft.incentive}
                onChange={(e) => setEditDraft((d) => ({ ...d, incentive: e.target.value }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-lg font-bold text-[#111827]">{liveStatus.incentive}</p>
            )}
            <p className="text-xs text-[#6B7280]">Within budget</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#6B7280]">Start Date</p>
            {isEditing ? (
              <input
                type="text"
                value={editDraft.startDate}
                onChange={(e) => setEditDraft((d) => ({ ...d, startDate: e.target.value }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-lg font-bold text-[#111827]">{liveStatus.startDate}</p>
            )}
            <p className="text-xs text-[#6B7280]">Within budget</p>
          </div>
        </div>

        {/* Agreed terms chips */}
        <div>
          <p className="text-xs font-medium text-[#6B7280] mb-2">Additional Agreed Terms</p>
          <div className="flex flex-wrap items-center gap-2">
            {agreedTerms.map((term, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="gap-1 border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] text-xs text-[rgba(4,10,26,1)]"
              >
                <X
                  className="h-4 w-4 cursor-pointer text-[#65686B] hover:text-red-500"
                  onClick={() => setAgreedTerms((prev) => prev.filter((_, i) => i !== idx))}
                />
                {term}
              </Badge>
            ))}
            {isEditing ? (
              <form
                className="flex items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newTerm.trim()) {
                    setAgreedTerms((prev) => [...prev, newTerm.trim()]);
                    setNewTerm("");
                  }
                }}
              >
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="New term..."
                  className="rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-0.5 text-xs outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 text-xs font-medium text-[#16A34A] hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </form>
            ) : (
              <button
                onClick={() => { setEditDraft(liveStatus); setIsEditing(true); }}
                className="flex items-center gap-1 text-xs font-medium text-[#353638] hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add Term
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Two-column: Input Data + Analysis */}
      <div className="grid grid-cols-2 gap-4">
        {/* Input Negotiation Data */}
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-5 space-y-4",
            amiioCardHoverSurface,
          )}
        >
          <h3 className="text-[18px] font-medium text-[#2C2C2C]">Input Negotiation Data</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setInputTab("Transcript");
                setNegotiationDataUploadLabel("Transcript");
                setNegotiationDataUploadOpen(true);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                inputTab === "Transcript"
                  ? "bg-[#353638] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E6E8EB]",
              )}
            >
              Transcript
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors data-[state=open]:bg-[#353638] data-[state=open]:text-white",
                    inputTab === "Email"
                      ? "bg-[#353638] text-white"
                      : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E6E8EB]",
                  )}
                >
                  Email
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[10rem] border-[#E6E8EB] bg-white text-[#353638]"
              >
                <DropdownMenuItem
                  className="cursor-pointer text-xs focus:bg-[#F2F4F7]"
                  onSelect={() => {
                    setInputTab("Email");
                    window.dispatchEvent(
                      new CustomEvent("amiio:toast", {
                        detail: { message: "Send Email — opening composer…" },
                      }),
                    );
                  }}
                >
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs focus:bg-[#F2F4F7]"
                  onSelect={() => {
                    setInputTab("Email");
                    setNegotiationDataUploadLabel("Email");
                    setNegotiationDataUploadOpen(true);
                  }}
                >
                  Upload Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => {
                setInputTab("Notes");
                setNegotiationDataUploadLabel("Notes");
                setNegotiationDataUploadOpen(true);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                inputTab === "Notes"
                  ? "bg-[#353638] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E6E8EB]",
              )}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => {
                setInputTab("Document");
                setNegotiationDataUploadLabel("Document");
                setNegotiationDataUploadOpen(true);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                inputTab === "Document"
                  ? "bg-[#353638] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E6E8EB]",
              )}
            >
              Document
            </button>
          </div>

          {/* Transcript entry */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-medium text-[#2C2C2C]">Transcript</p>
                <span className="text-xs text-[#6B7280]">15-Feb-2026</span>
              </div>
              <p className="text-xs text-[#4B5563]">
                Initial renewal discussion with tenant representative
              </p>
              <ul className="space-y-1 text-xs text-[#4B5563]">
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Tenant expressed interest in extending for 5 years
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Requested 10% rent reduction due to market conditions
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Mentioned possible need for additional 200 sqm
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Preferred lease start date: July 2026
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-medium text-[#2C2C2C]">Email</p>
                <span className="text-xs text-[#6B7280]">15-Feb-2026</span>
              </div>
              <p className="text-xs text-[#4B5563]">
                Follow-up email confirming meeting points
              </p>
              <ul className="space-y-1 text-xs text-[#4B5563]">
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Confirmed 5-year term preference
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Agreed to 3% rent reduction as compromise
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                  Break option at year 3 accepted
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Negotiation Analysis */}
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-5 space-y-4",
            amiioCardHoverSurface,
          )}
        >
          <div className="flex items-center gap-2">
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <h3 className="text-[18px] font-medium text-[#2C2C2C]">
              Amiio&apos;s Negotiation Analysis
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-[#4B5563]">
            Based on 2 input(s), the tenant shows strong commitment to renewal but is seeking
            concessions. Key negotiation points identified:
          </p>

          <div className="space-y-3">
            <NegotiationPoint
              title="Rent Reduction Request"
              priority="High Priority"
              priorityColor="bg-red-100 text-red-700"
              description="Tenant requested 10% reduction. Market data supports only 3% decrease. Counter with €225/sqm (-3%) citing building improvements and energy efficiency upgrades."
            />
            <NegotiationPoint
              title="Expansion Interest"
              priority="Medium"
              priorityColor="bg-orange-100 text-orange-700"
              description="Additional 200 sqm request aligns with their growth trajectory. Unit 4B (209 sqm) available at €209/sqm. Bundle expansion with main renewal for leverage."
            />
            <NegotiationPoint
              title="Term Length"
              priority="Aligned"
              priorityColor="bg-green-100 text-green-700"
              description="5-year term preference matches our target. Use this alignment to negotiate on rent level - longer commitment justifies modest concession."
            />
          </div>

          {/* Recommended Counter-Offer */}
          <div className="rounded-lg bg-[#FFFBEB] p-3">
            <p className="text-xs font-semibold text-[#92400E]">Recommended Counter-Offer</p>
            <p className="mt-1 text-xs leading-relaxed text-[#92400E]">
              Offer €225/sqm (-3%) for main space + €209/sqm for expansion with 3 months rent-free
              on combined space.
            </p>
          </div>
        </div>
      </div>

      <LeaseRenewalWorkflowFooter onBack={onBack} primaryLabel="Draft Proposal" onPrimary={onProceed} />

      <ActivityUploadDialog
        open={negotiationDataUploadOpen}
        onOpenChange={(open) => {
          setNegotiationDataUploadOpen(open);
          if (!open) setNegotiationDataUploadLabel("");
        }}
        activityLabel={negotiationDataUploadLabel}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-view: Review Proposal                                          */
/* ------------------------------------------------------------------ */

function ReviewProposalView({
  onBack,
  onNavigateLeaseRenewalStep,
}: {
  onBack: () => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
}) {
  const [previewMode, setPreviewMode] = useState<"Edit" | "Preview">("Preview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader />
        <RecentLeaseRenewalChip />
      </div>

      <LeaseRenewalProcessFlow currentStep={2} onStepClick={onNavigateLeaseRenewalStep} />

      {/* Document card */}
      <div
        className={cn(
          "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)]",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex">
          {/* Left sidebar */}
          <div className="w-56 shrink-0 border-r border-[#E6E8EB] p-5 space-y-4">
            <h3 className="text-[18px] font-medium text-[#2C2C2C]">Lease Proposal</h3>
            <Badge className="bg-[#FEF3CD] text-[#856404] border-0 text-xs">Draft</Badge>
            <button className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827]">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <p className="text-xs text-[#6B7280]">Updated on 23 Nov 2025</p>

            <div className="space-y-2">
              <p className="text-[14px] font-medium text-[#65686B]">
                Versions
              </p>
              {documentVersions.map((v) => (
                <button
                  key={v.label}
                  className={cn(
                    "block w-full rounded-md px-2 py-1.5 text-left text-xs",
                    v.active
                      ? "bg-[#F3F4F6] font-semibold text-[#111827]"
                      : "text-[#6B7280] hover:bg-[#F9FAFB]"
                  )}
                >
                  {v.label}
                  {v.date && <span className="ml-1 text-xs text-[#A0A4AB]">{v.date}</span>}
                </button>
              ))}
              <button className="text-xs font-medium text-[#353638] hover:underline">
                See all versions
              </button>
            </div>

            <Button className="w-full bg-[#353638] text-white hover:bg-[#252628]" size="sm">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Finalize &amp; Download
            </Button>
          </div>

          {/* Right document preview */}
          <div className="flex-1 p-5 space-y-4">
            {/* Header bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                Viewing previous version
                <button className="flex items-center gap-1 font-medium text-[#353638] hover:underline">
                  Go to latest
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div className="flex rounded-2xl border border-[rgba(230,231,232,0.7)] overflow-hidden">
                {(["Edit", "Preview"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPreviewMode(m)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium transition-colors",
                      previewMode === m
                        ? "bg-[#353638] text-white"
                        : "bg-white text-[#6B7280] hover:bg-[#F9FAFB]"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Document */}
            <div className="rounded-lg bg-[#F9FAFB] p-6">
              <div className="mx-auto max-w-2xl rounded-lg bg-[rgba(255,255,255,0.8)] p-8 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-[#111827]">Lease Renewal Proposal</h2>
                  <p className="text-xs text-[#6B7280]">Date: 29 March 2026</p>
                  <p className="text-xs text-[#6B7280]">Reference: LRP-2026-SCA-001</p>
                </div>

                <div className="space-y-1 text-xs text-[#4B5563]">
                  <p>
                    <span className="font-medium">To:</span> ScaleHub III B.V.
                  </p>
                  <p>
                    <span className="font-medium">From:</span> H.J.E. Wenckebachweg 123
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-[#4B5563]">
                  <div>
                    <h4 className="font-semibold text-[#111827]">1. SUBJECT PROPERTY</h4>
                    <p className="mt-1">
                      This Lease Renewal Proposal concerns the premises located at H.J.E.
                      Wenckebachweg 123, comprising 3,905 square metres of lettable floor area,
                      together with 40 parking spaces.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#111827]">2. PROPOSED TERMS</h4>
                    <div className="mt-2 space-y-2">
                      <ProposalTerm
                        num="2.1"
                        text="Lease Term: 5 (Five) years, commencing on Jul 2026."
                        annotation="60 months (5 years)"
                      />
                      <ProposalTerm
                        num="2.2"
                        text="Lease term extension"
                        annotation="60 months (5 years)"
                      />
                      <ProposalTerm
                        num="2.3"
                        text="Base Rent: €225 per square meter per annum, totalling €878,625 annually."
                        annotation="€225/PSM (€878,625)"
                      />
                      <ProposalTerm
                        num="2.4"
                        text="Rent-Free Period: 3 (Three) months rent-free at the commencement of the lease term."
                        annotation="3 Months"
                      />
                      <ProposalTerm
                        num="2.5"
                        text="Tenant may terminate after year 3 with 6 months' written notice."
                        annotation="3 Years"
                      />
                      <ProposalTerm
                        num="2.6"
                        text="Rent Review: Annual Indexation based on CPI, capped at 3% per annum."
                        annotation="3%"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#111827]">3. ADDITIONAL TERMS</h4>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                        Break option at 3 years with 6 months notice
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                        CPI indexation capped at 3% annually
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#6B7280]" />
                        Expansion for unit 4B at €209/sqm
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeaseRenewalWorkflowFooter
        onBack={onBack}
        primaryLabel="Finalize & Download"
        onPrimary={() =>
          window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message: "Download started" } }))
        }
        primaryIcon="download"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared tiny components                                             */
/* ------------------------------------------------------------------ */

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="mt-0.5 text-[18px] font-medium text-[#111827]">{value}</p>
    </div>
  );
}

function NegotiationPoint({
  title,
  priority,
  priorityColor,
  description,
}: {
  title: string;
  priority: string;
  priorityColor: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-[#111827]">{title}</p>
        <Badge className={cn("border-0 text-xs", priorityColor)}>{priority}</Badge>
      </div>
      <p className="text-xs leading-relaxed text-[#4B5563]">{description}</p>
    </div>
  );
}

function ProposalTerm({
  num,
  text,
  annotation,
}: {
  num: string;
  text: string;
  annotation: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p>
        <span className="font-medium">{num}</span> {text}
      </p>
      <Badge variant="outline" className="shrink-0 text-xs">
        {annotation}
      </Badge>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */

export function LeasingToolView({
  onOpenTenantHub,
  onAnalyseWithAmiio,
  entryIntent = "default",
  onEntryIntentApplied,
}: {
  onOpenTenantHub?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
  entryIntent?: "default" | "proposal-prep";
  onEntryIntentApplied?: () => void;
} = {}) {
  const [step, setStep] = useState<SubView>("pipeline");

  useLayoutEffect(() => {
    if (entryIntent !== "proposal-prep") return;
    setStep("proposal-prep");
    onEntryIntentApplied?.();
  }, [entryIntent, onEntryIntentApplied]);

  const navigateLeaseRenewalToStep = useCallback((index: 0 | 1 | 2) => {
    setStep(
      index === 0 ? "proposal-prep" : index === 1 ? "lease-proposal" : "review-proposal",
    );
  }, []);

  return (
    <div className="space-y-0">
      {step === "pipeline" && (
        <PipelineView
          onStartLeaseWorkflow={() => setStep("proposal-prep")}
          onAnalyseWithAmiio={onAnalyseWithAmiio}
        />
      )}
      {step === "proposal-prep" && (
        <ProposalPrepView
          onBack={() => setStep("pipeline")}
          onProceed={() => setStep("lease-proposal")}
          onOpenTenantHub={onOpenTenantHub}
          onAnalyseWithAmiio={onAnalyseWithAmiio}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
        />
      )}
      {step === "lease-proposal" && (
        <LeaseProposalView
          onBack={() => setStep("proposal-prep")}
          onProceed={() => setStep("review-proposal")}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
        />
      )}
      {step === "review-proposal" && (
        <ReviewProposalView
          onBack={() => setStep("lease-proposal")}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
        />
      )}
    </div>
  );
}
