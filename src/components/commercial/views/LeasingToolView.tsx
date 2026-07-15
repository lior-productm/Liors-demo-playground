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
  Download,
  X,
  Pencil,
  Radio,
  Mail,
  MessageSquare,
  FileText,
  Upload,
  Link2,
  Search,
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
import { TruncatedText } from "@/src/components/ui/TruncatedText";
import {
  resolveLeaseRenewalContext,
  type LeaseRenewalContext,
} from "@/src/types/leaseRenewal";
import { LeaseRenewalProcessFlow } from "@/src/components/workflows/LeaseRenewalProcessFlow";
import { StartLeaseRenewalDialog } from "@/src/components/workflows/StartLeaseRenewalDialog";
import { LeaseProposalReviewWorkspace } from "@/src/components/workflows/LeaseProposalReviewWorkspace";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SubView = "pipeline" | "proposal-prep" | "lease-proposal" | "review-proposal";

export type { LeaseRenewalContext };
export { resolveLeaseRenewalContext };

interface PipelineCard {
  id: string;
  company: string;
  entityName: string;
  propertyName: string;
  unit: string;
  status: "Negotiation" | "Proposal" | "Viewing" | "Lead";
  avatar: string;
  avatarName: string;
  /** Figma avatar circle fill */
  avatarBg: string;
  price: string;
  time: string;
  lastModified: string;
  probability: number;
  insight: string;
  archived?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const pipelineCards: PipelineCard[] = [
  {
    id: "p1",
    company: "ScaleHub III B.V.",
    entityName: "Property Partners",
    propertyName: "H.J.E. Wenckebachweg",
    unit: "Unit 3A - 450 sqm",
    status: "Negotiation",
    avatar: "JS",
    avatarName: "John Snow",
    avatarBg: "#E6E8EB",
    price: "€185/sqm",
    time: "2 days ago",
    lastModified: "Yesterday at 13:31",
    probability: 75,
    insight:
      "High probability deal. Prospect impressed with location and amenities. Main negotiation points: fit-out contribution and lease term flexibility. Recommend offering 2 months rent-free incentive to close.",
  },
  {
    id: "p2",
    company: "ScaleHub III B.V.",
    entityName: "Property Partners",
    propertyName: "H.J.E. Wenckebachweg",
    unit: "Unit 2B - 350 sqm",
    status: "Proposal",
    avatar: "JS",
    avatarName: "John Snow",
    avatarBg: "#E6E8EB",
    price: "€175/sqm",
    time: "5 days ago",
    lastModified: "Yesterday at 13:31",
    probability: 55,
    insight:
      "Medium probability - competitive situation. Prospect comparing with Hogehilweg and Karspeldreef properties. Price sensitivity noted. Consider highlighting energy efficiency and public transport access as differentiators.",
  },
  {
    id: "p3",
    company: "ABC Holdings B.V.",
    entityName: "Property Partners",
    propertyName: "Herengracht Offices",
    unit: "Unit 3A - 450 sqm",
    status: "Viewing",
    avatar: "JS",
    avatarName: "John Snow",
    avatarBg: "#E6E8EB",
    price: "€170/sqm",
    time: "1 week ago",
    lastModified: "12 Nov 2025 at 09:15",
    probability: 35,
    insight:
      "Early stage lead. Prospect expanding co-working concept. Timeline is longer (Q1 2027). Could be a good fit for vacant Unit 1C. Recommend showcasing flexible layout options.",
  },
  {
    id: "p4",
    company: "Eiffel Investments LLC",
    entityName: "Z Holdings",
    propertyName: "Zuidas Tower",
    unit: "Unit 4D - 280 sqm",
    status: "Lead",
    avatar: "JS",
    avatarName: "John Snow",
    avatarBg: "#E6E8EB",
    price: "€180/sqm",
    time: "3 days ago",
    lastModified: "10 Nov 2025 at 16:42",
    probability: 20,
    insight:
      "New lead requiring qualification. Company profile suggests sustainability focus - highlight building's A+ energy rating. Recommend scheduling intro call within 48 hours.",
    archived: true,
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

const LEASE_RENEWALS_TABLE_GRID =
  "grid w-full min-w-[920px] grid-cols-[minmax(140px,1.15fr)_minmax(120px,1fr)_minmax(150px,1.1fr)_minmax(110px,0.85fr)_minmax(150px,1fr)_minmax(150px,1fr)] items-center";

/** Figma Lease Renewal header: 60×60 Building Picture, 26px gap to title row */
function LeaseRenewalPageHeader({
  tenantName,
  onOpenTenantHub,
}: {
  tenantName: string;
  onOpenTenantHub?: () => void;
}) {
  return (
    <div className="flex min-w-0 items-start gap-[26px]">
      <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px] bg-white">
        <BuildingThumb
          src={TENANT_SCALEHUB_LOGO}
          fit="contain"
          className="absolute inset-0 h-full w-full rounded-[8px] p-0.5"
          alt={tenantName}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {onOpenTenantHub ? (
            <button
              type="button"
              onClick={onOpenTenantHub}
              className="min-w-0 max-w-full text-left"
            >
              <TruncatedText
                text={tenantName}
                className="max-w-full typo-h4 text-[#010309] hover:text-[#233FDE] hover:underline"
                as="h1"
              />
            </button>
          ) : (
            <TruncatedText
              text={tenantName}
              className="max-w-full typo-h4 text-[#010309]"
              as="h1"
            />
          )}
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

function ProposalDraftPanelAccess({
  available,
  panelOpen,
  onOpen,
}: {
  available?: boolean;
  panelOpen?: boolean;
  onOpen?: () => void;
}) {
  if (!available || !onOpen) return null;

  return (
    <div className="flex items-center justify-end">
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
          panelOpen
            ? "border-[#D3D9F8] bg-[#EEF0FF] text-[#233FDE]"
            : "border-[#B3B8BD] bg-white text-[#010309] hover:bg-[#F2F4F7]",
        )}
      >
        <FileText className="h-3.5 w-3.5" />
        {panelOpen ? "Proposal draft open" : "View proposal draft"}
      </button>
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
        <h3 className="typo-h5 text-[#2C2C2C]">
          Proposed Terms &amp; Conditions
        </h3>
      </div>

      <div
        className="flex flex-col gap-5 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4 lg:flex-row lg:gap-8"
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

function LeaseRenewalMetricStrip({
  metrics,
}: {
  metrics: {
    label: string;
    value: string;
    sub?: string;
    subC?: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-[rgba(230,231,232,0.7)] p-3 sm:grid-cols-4 sm:gap-4 sm:p-4">
      {metrics.map((m) => (
        <div key={m.label} className="min-w-0 text-left">
          <p className="text-[11px] font-medium leading-tight text-[#65686B] sm:text-[12px]">{m.label}</p>
          <p className="mt-1 text-[15px] font-medium leading-tight text-[#010309] sm:text-[18px]">{m.value}</p>
          {m.sub ? (
            <p className={cn("text-[11px] font-medium leading-tight sm:text-[12px]", m.subC ?? "text-[#65686B]")}>
              {m.sub}
            </p>
          ) : null}
        </div>
      ))}
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
        <span className="typo-h5 text-[#121212]">Recent Comparable Leases</span>
      </div>
      <p className="text-[14px] font-medium leading-[1.5] text-[#121212]">For Rental Assessment</p>
      <div className="overflow-x-auto rounded-2xl border border-[rgba(230,231,232,0.7)] [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D1D5D9] [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="min-w-[min(100%,520px)] sm:min-w-[700px]">
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
              <span className="truncate text-[14px] font-medium text-[#2C2C2C]">{r.name}</span>
              <span className="text-right text-[14px] font-normal leading-[1.4] text-[#65686B]">{r.area}</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">{r.rent}</span>
                {r.trend === "up" ? (
                  <TrendPill direction="up" pct={r.trendValue} />
                ) : (
                  <TrendPill direction="neutral" pct={r.trendValue} />
                )}
                <span className="shrink-0 text-[12px] text-[#65686B]">vs current</span>
              </div>
              <span className="text-right text-[12px] font-normal leading-[1.5] text-[#65686B]">{r.lease}</span>
              <span className="text-right text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">{r.term}</span>
            </div>
          ))}
        </div>
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(230,231,232,0.7)] pt-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] transition-colors hover:bg-[#F2F4F7]"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] hover:bg-[#F2F4F7]"
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

function ProspectModalDialog({
  open,
  onOpenChange,
  card,
  onStartLeaseWorkflow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: PipelineCard | null;
  onStartLeaseWorkflow?: (context: LeaseRenewalContext) => void;
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
                  <p className="typo-h4 text-[#353638]">{card.company}</p>
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
                  <p className="mt-1 typo-h5 text-[#2C2C2C]">€47,225,000</p>
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
              <p className="typo-h5 text-[#2C2C2C]">Activities</p>
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
                    onStartLeaseWorkflow?.({
                      tenantName: card.company,
                      property: card.propertyName,
                      entity: card.entityName,
                      portfolio: "All portfolio",
                    });
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
}: {
  onStartLeaseWorkflow?: (context: LeaseRenewalContext) => void;
  onAnalyseWithAmiio?: (topic: string) => void;
}) {
  const [listTab, setListTab] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [startRenewalOpen, setStartRenewalOpen] = useState(false);
  const [prospectModalOpen, setProspectModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PipelineCard | null>(null);

  const filteredCards = pipelineCards.filter((card) => {
    const isArchived = Boolean(card.archived);
    if (listTab === "active" ? isArchived : !isArchived) return false;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      card.company.toLowerCase().includes(q) ||
      card.entityName.toLowerCase().includes(q) ||
      card.propertyName.toLowerCase().includes(q) ||
      card.avatarName.toLowerCase().includes(q) ||
      card.status.toLowerCase().includes(q)
    );
  });

  const openCard = (card: PipelineCard) => {
    setSelectedCard(card);
    setProspectModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex items-start justify-between gap-4">
        <h1 className="typo-page-title text-[#010309]">Lease Renewals</h1>
        <button
          type="button"
          onClick={() => setStartRenewalOpen(true)}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[32px] bg-[#010309] px-3.5 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#252628]"
        >
          <Plus className="size-4" strokeWidth={2} />
          New
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setListTab("active")}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-[24px] px-4 text-[14px] font-medium leading-[1.24] transition-colors",
              listTab === "active"
                ? "bg-[#010309] text-[#F0F2F5]"
                : "text-[#2C2C2C] hover:bg-[#F3F6FA]",
            )}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setListTab("archived")}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-[24px] px-4 text-[14px] font-medium leading-[1.24] transition-colors",
              listTab === "archived"
                ? "bg-[#010309] text-[#F0F2F5]"
                : "text-[#2C2C2C] hover:bg-[#F3F6FA]",
            )}
          >
            Archived
          </button>
        </div>

        <label className="relative block w-full max-w-[209px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#969A9E]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="h-8 w-full rounded-[32px] border border-[#D1D5D9] bg-[#F0F2F5] py-1.5 pl-8 pr-3 text-[14px] text-[#353638] placeholder:text-[#969A9E] outline-none focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
          />
        </label>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div
              className={cn(
                LEASE_RENEWALS_TABLE_GRID,
                "rounded-xl border border-[#E6E8EB] bg-[#F2F4F7] px-3 py-2.5",
              )}
            >
              {["Name", "Entity name", "Property Name", "Status", "Owner", "Last modified"].map(
                (label) => (
                  <div
                    key={label}
                    className={cn(
                      "px-2 text-[14px] font-medium leading-[1.24] text-[#676A6E]",
                      label === "Name" && "pl-3",
                    )}
                  >
                    {label}
                  </div>
                ),
              )}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              {filteredCards.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#E6E8EB] bg-white px-4 py-10 text-center text-[14px] text-[#65686B]">
                  {listTab === "archived"
                    ? "No archived lease renewals."
                    : "No active lease renewals match your search."}
                </p>
              ) : (
                filteredCards.map((card) => (
                  <div
                    key={card.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCard(card)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openCard(card);
                      }
                    }}
                    className={cn(
                      LEASE_RENEWALS_TABLE_GRID,
                      "cursor-pointer rounded-xl bg-white px-3 py-2 outline-none transition-colors",
                      "hover:bg-[#FAFBFC] focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2",
                    )}
                  >
                    <p className="truncate px-2 pl-3 text-[14px] font-medium leading-[1.5] text-[#353638]">
                      {card.company}
                    </p>
                    <p className="truncate px-2 text-[14px] font-normal leading-[1.4] text-[#353638]">
                      {card.entityName}
                    </p>
                    <p className="truncate px-2 text-[14px] font-normal leading-[1.4] text-[#353638]">
                      {card.propertyName}
                    </p>
                    <div className="px-2">
                      <Badge
                        className={cn(
                          "rounded-2xl px-2 py-1 text-[12px] font-medium",
                          statusBadgeClasses(card.status),
                        )}
                      >
                        {card.status}
                      </Badge>
                    </div>
                    <div className="flex min-w-0 items-center gap-2 px-2">
                      <div
                        className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-[#2C2C2C]"
                        style={{ backgroundColor: card.avatarBg }}
                      >
                        {card.avatar}
                      </div>
                      <span className="truncate text-[14px] font-normal leading-[1.4] text-[#353638]">
                        {card.avatarName}
                      </span>
                    </div>
                    <p className="truncate px-2 text-[14px] font-normal leading-[1.4] text-[#65686B]">
                      {card.lastModified}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <StartLeaseRenewalDialog
        open={startRenewalOpen}
        onOpenChange={setStartRenewalOpen}
        onStart={(context) => onStartLeaseWorkflow?.(context)}
      />
      <ProspectModalDialog
        open={prospectModalOpen && !!selectedCard}
        onOpenChange={(open) => {
          setProspectModalOpen(open);
          if (!open) setSelectedCard(null);
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

function buildProposalPrepExecSummaryParts(tenantName: string): { text: string; className?: string }[] {
  return [
    {
      text: `${tenantName} has been a tenant since 01-Jul-2019 with 1 successful renewals, demonstrating strong commitment to this location. The current lease expires on 30-Jun-2032. Based on their excellent payment history (100% on-time), positive communication sentiment (8.2/10), and recent business activity indicating stability, I assess the renewal probability as `,
    },
    { text: "Very High (85%+)", className: "font-semibold text-[#1F9E8B]" },
    { text: "." },
  ];
}

function ProposalPrepView({
  renewalContext,
  onBack,
  onProceed,
  onOpenTenantHub,
  onAnalyseWithAmiio,
  onNavigateLeaseRenewalStep,
  proposalDraftAvailable,
  proposalPanelOpen,
  onOpenProposalPanel,
}: {
  renewalContext: LeaseRenewalContext;
  onBack: () => void;
  onProceed: () => void;
  onOpenTenantHub?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
  proposalDraftAvailable?: boolean;
  proposalPanelOpen?: boolean;
  onOpenProposalPanel?: () => void;
}) {
  const { tenantName, property } = renewalContext;
  const execSummaryParts = buildProposalPrepExecSummaryParts(tenantName);

  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader tenantName={tenantName} onOpenTenantHub={onOpenTenantHub} />
        <RecentLeaseRenewalChip />
      </div>

      <LeaseRenewalProcessFlow
        currentStep={0}
        onStepClick={onNavigateLeaseRenewalStep}
        draftAvailable={proposalDraftAvailable}
      />

      <ProposalDraftPanelAccess
        available={proposalDraftAvailable}
        panelOpen={proposalPanelOpen}
        onOpen={onOpenProposalPanel}
      />

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
          <h3 className="typo-h5 text-[#2C2C2C]">
            Amiio&apos;s Executive Summary
          </h3>
        </div>
        <div className="rounded-xl bg-[#FBFBFB] px-4 py-4">
          <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
            <AmiioSummaryTypewriterParts parts={execSummaryParts} charDelayMs={8} />
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
                alt={tenantName}
              />
            </div>
            <div className="min-w-0">
              <TruncatedText
                text={tenantName}
                className="text-[14px] font-semibold leading-[1.25] text-[#010309]"
              />
              <p className="mt-1 text-[12px] font-normal leading-[1.25] text-[#65686B]">Tenant Profile</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
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
            <div className="min-w-0">
              <TruncatedText
                text={property ?? "Selected property"}
                className="text-[14px] font-semibold leading-[1.25] text-[#010309]"
              />
              <p className="mt-1 text-[12px] font-normal leading-[1.25] text-[#65686B]">Asset Profile</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
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
              Tenant Concentration — {tenantName}
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
          <span className="typo-h5 text-[#2C2C2C]">Market Analysis</span>
        </div>
        <p className="text-[16px] font-medium leading-[1.25] text-[#2C2C2C]">
          Amsterdam Southeast Office Market
        </p>

        <LeaseRenewalMetricStrip
          metrics={[
            { label: "Market Avg. Rent", value: "€235/sqm", sub: "from €175" },
            { label: "Market Vacancy", value: "12.5%", sub: "↗ 0.5%", subC: "text-[#1F9E8B]" },
            { label: "New Supply (2025)", value: "45,000 sqm", sub: "↗ 5% vs previous year", subC: "text-[#1F9E8B]" },
            { label: "Market Incentive", value: "8%", sub: "↗ 6 months avg", subC: "text-[#1F9E8B]" },
          ]}
        />

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

        <LeaseRenewalMetricStrip
          metrics={[
            { label: "Average Asking", value: "€176/sqm", sub: "↗ 3.5%", subC: "text-[#1F9E8B]" },
            { label: "Current Rent", value: "€232/sqm", sub: "↗ 0.6%", subC: "text-[#1F9E8B]" },
            { label: "Difference", value: "-28.6%", sub: "", subC: "text-[#B23A48]" },
            { label: "Suggested", value: "€175-185", sub: "↗ 2.8%", subC: "text-[#1F9E8B]" },
          ]}
        />

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
                  `Amsterdam Southeast market comparables and suggested renewal rent range for ${tenantName}.`,
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
  renewalContext,
  onBack,
  onProceed,
  onNavigateLeaseRenewalStep,
  proposalDraftAvailable,
  proposalPanelOpen,
  onOpenProposalPanel,
}: {
  renewalContext: LeaseRenewalContext;
  onBack: () => void;
  onProceed: () => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
  proposalDraftAvailable?: boolean;
  proposalPanelOpen?: boolean;
  onOpenProposalPanel?: () => void;
}) {
  const { tenantName } = renewalContext;
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
    <div className="w-full min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader tenantName={tenantName} />
        <RecentLeaseRenewalChip />
      </div>

      <LeaseRenewalProcessFlow
        currentStep={1}
        onStepClick={onNavigateLeaseRenewalStep}
        draftAvailable={proposalDraftAvailable}
      />

      <ProposalDraftPanelAccess
        available={proposalDraftAvailable}
        panelOpen={proposalPanelOpen}
        onOpen={onOpenProposalPanel}
      />

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="h-4 w-4 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <h3 className="text-[16px] font-medium text-[#2C2C2C] sm:text-[18px]">Amiio&apos;s Live Status</h3>
            <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-xs font-medium text-[#16A34A]">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-[#6B7280]">Agreed Rent</p>
            {isEditing ? (
              <input
                type="number"
                value={editDraft.agreedRent}
                onChange={(e) => setEditDraft((d) => ({ ...d, agreedRent: Number(e.target.value) }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-[15px] font-bold leading-tight text-[#111827] sm:text-lg">
                {liveStatus.agreedRent}{" "}
                <span className="text-xs font-normal text-[#6B7280]">/sqm/yr</span>
              </p>
            )}
            <p className="text-xs text-[#16A34A]">
              ↗ {(((liveStatus.agreedRent - 232) / 232) * 100).toFixed(1)}% vs current
            </p>
            <p className="text-xs text-[#6B7280]">Aligned with recommendations</p>
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-[#6B7280]">Agreed Term</p>
            {isEditing ? (
              <input
                type="number"
                value={editDraft.agreedTerm}
                onChange={(e) => setEditDraft((d) => ({ ...d, agreedTerm: Number(e.target.value) }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-[15px] font-bold leading-tight text-[#111827] sm:text-lg">
                {liveStatus.agreedTerm} years
              </p>
            )}
            <p className="text-xs text-[#6B7280]">Aligned with recommendations</p>
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-[#6B7280]">Incentive</p>
            {isEditing ? (
              <input
                type="text"
                value={editDraft.incentive}
                onChange={(e) => setEditDraft((d) => ({ ...d, incentive: e.target.value }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-[15px] font-bold leading-tight text-[#111827] sm:text-lg">{liveStatus.incentive}</p>
            )}
            <p className="text-xs text-[#6B7280]">Within budget</p>
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-[#6B7280]">Start Date</p>
            {isEditing ? (
              <input
                type="text"
                value={editDraft.startDate}
                onChange={(e) => setEditDraft((d) => ({ ...d, startDate: e.target.value }))}
                className="w-full rounded-md border border-[#C9DED1] bg-[rgba(255,255,255,0.85)] px-2 py-1 text-lg font-bold text-[#111827] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15"
              />
            ) : (
              <p className="text-[15px] font-bold leading-tight text-[#111827] sm:text-lg">{liveStatus.startDate}</p>
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Input Negotiation Data */}
        <div
          className={cn(
            "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-5 space-y-4",
            amiioCardHoverSurface,
          )}
        >
          <h3 className="typo-h5 text-[#2C2C2C]">Input Negotiation Data</h3>
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
                <p className="typo-h5 text-[#2C2C2C]">Transcript</p>
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
                <p className="typo-h5 text-[#2C2C2C]">Email</p>
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
            <h3 className="typo-h5 text-[#2C2C2C]">
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
              description={`${tenantName} requested 10% reduction. Market data supports only 3% decrease. Counter with €225/sqm (-3%) citing building improvements and energy efficiency upgrades.`}
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
  renewalContext,
  onBack,
  onNavigateLeaseRenewalStep,
  proposalDraftAvailable,
  onProposalDraftReady,
}: {
  renewalContext: LeaseRenewalContext;
  onBack: () => void;
  onNavigateLeaseRenewalStep?: (stepIndex: 0 | 1 | 2) => void;
  proposalDraftAvailable?: boolean;
  onProposalDraftReady?: () => void;
}) {
  const { tenantName } = renewalContext;

  return (
    <div className="w-full min-w-0 space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#65686B] transition-colors hover:text-[#353638]"
      >
        <ArrowLeft className="size-5" />
        All Lease Renewals
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <LeaseRenewalPageHeader tenantName={tenantName} />
        <RecentLeaseRenewalChip />
      </div>

      <div className="space-y-4">
        <LeaseRenewalProcessFlow
          currentStep={2}
          onStepClick={onNavigateLeaseRenewalStep}
          draftAvailable={proposalDraftAvailable ?? true}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("amiio:toast", { detail: { message: "Download started" } }),
              )
            }
            className="inline-flex h-8 items-center gap-2 rounded-[32px] bg-[#010309] px-3 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#252628]"
          >
            <Download className="size-4" />
            Finalize &amp; Download
          </button>
        </div>
      </div>

      <LeaseProposalReviewWorkspace
        context={renewalContext}
        onDraftReady={onProposalDraftReady}
      />

      <div className="border-t border-[rgba(230,231,232,0.7)] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium text-[#010309] transition-colors hover:bg-[#F2F4F7]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared tiny components                                             */
/* ------------------------------------------------------------------ */

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs leading-tight text-[#6B7280]">{label}</p>
      <p className="mt-0.5 break-words text-[15px] font-medium leading-tight text-[#111827] sm:text-[18px]">
        {value}
      </p>
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

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */

export function LeasingToolView({
  onOpenTenantHub,
  onAnalyseWithAmiio,
  entryIntent = "default",
  onEntryIntentApplied,
  renewalContext: renewalContextProp,
  renewalSubStep: renewalSubStepProp,
  onRenewalStepChange,
  onOpenProposalPanel,
  proposalDraftAvailable,
  proposalPanelOpen,
  onProposalDraftReady,
}: {
  onOpenTenantHub?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
  entryIntent?: "default" | "proposal-prep";
  onEntryIntentApplied?: () => void;
  renewalContext?: Partial<LeaseRenewalContext>;
  renewalSubStep?: SubView;
  onRenewalStepChange?: (step: SubView) => void;
  onOpenProposalPanel?: () => void;
  proposalDraftAvailable?: boolean;
  proposalPanelOpen?: boolean;
  onProposalDraftReady?: () => void;
} = {}) {
  const [step, setStep] = useState<SubView>(() => renewalSubStepProp ?? "pipeline");
  const [pipelineRenewalContext, setPipelineRenewalContext] =
    useState<Partial<LeaseRenewalContext> | null>(null);
  const renewalContext = resolveLeaseRenewalContext({
    ...renewalContextProp,
    ...(pipelineRenewalContext ?? {}),
  });

  useEffect(() => {
    if (renewalSubStepProp === undefined) return;
    setStep(renewalSubStepProp);
  }, [renewalSubStepProp]);

  useLayoutEffect(() => {
    if (entryIntent !== "proposal-prep") return;
    setStep(
      renewalSubStepProp && renewalSubStepProp !== "pipeline"
        ? renewalSubStepProp
        : "proposal-prep",
    );
    onEntryIntentApplied?.();
  }, [entryIntent, onEntryIntentApplied, renewalSubStepProp]);

  useEffect(() => {
    onRenewalStepChange?.(step);
  }, [step, onRenewalStepChange]);

  const navigateLeaseRenewalToStep = useCallback((index: 0 | 1 | 2) => {
    setStep(
      index === 0 ? "proposal-prep" : index === 1 ? "lease-proposal" : "review-proposal",
    );
  }, []);

  return (
    <div className="w-full min-w-0 space-y-0">
      {step === "pipeline" && (
        <PipelineView
          onStartLeaseWorkflow={(context) => {
            setPipelineRenewalContext(context);
            setStep("proposal-prep");
          }}
          onAnalyseWithAmiio={onAnalyseWithAmiio}
        />
      )}
      {step === "proposal-prep" && (
        <ProposalPrepView
          renewalContext={renewalContext}
          onBack={() => setStep("pipeline")}
          onProceed={() => setStep("lease-proposal")}
          onOpenTenantHub={onOpenTenantHub}
          onAnalyseWithAmiio={onAnalyseWithAmiio}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
          proposalDraftAvailable={proposalDraftAvailable}
          proposalPanelOpen={proposalPanelOpen}
          onOpenProposalPanel={onOpenProposalPanel}
        />
      )}
      {step === "lease-proposal" && (
        <LeaseProposalView
          renewalContext={renewalContext}
          onBack={() => setStep("proposal-prep")}
          onProceed={() => setStep("review-proposal")}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
          proposalDraftAvailable={proposalDraftAvailable}
          proposalPanelOpen={proposalPanelOpen}
          onOpenProposalPanel={onOpenProposalPanel}
        />
      )}
      {step === "review-proposal" && (
        <ReviewProposalView
          renewalContext={renewalContext}
          onBack={() => setStep("lease-proposal")}
          onNavigateLeaseRenewalStep={navigateLeaseRenewalToStep}
          proposalDraftAvailable={proposalDraftAvailable}
          onProposalDraftReady={onProposalDraftReady}
        />
      )}
    </div>
  );
}
