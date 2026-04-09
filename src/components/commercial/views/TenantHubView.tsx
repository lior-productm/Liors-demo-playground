"use client";

import {
  ChevronUp,
  ChevronDown,
  Sparkles,
  Lightbulb,
  FileText,
  AlertTriangle,
  Filter,
  ExternalLink,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendDirectionGlyph,
  TrendPill,
} from "@/src/components/commercial/TrendPill";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import {
  AmiioAiDisclaimerTrigger,
  defaultLampTooltipSummary,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import {
  AmiioExpandableInsightRow,
  AmiioExpandableRecentActionRow,
} from "@/src/components/commercial/AmiioExpandableRow";
import { TENANT_SCALEHUB_LOGO } from "@/src/constants/commercialDemoMedia";

/* ------------------------------------------------------------------ */
/*  Collapsible section                                                */
/* ------------------------------------------------------------------ */

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
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
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronUp className="h-6 w-6 shrink-0 text-[#969A9E]" />
          ) : (
            <ChevronDown className="h-6 w-6 shrink-0 text-[#969A9E]" />
          )}
          <span className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">
            {title}
          </span>
        </button>
        <WidgetHeaderLamp
          chatTopic={`Analyse "${title}" on Tenant Hub (ScaleHub III B.V.) and highlight risks, opportunities, and data gaps.`}
          chatLabel={title}
        />
      </div>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini Table                                                         */
/* ------------------------------------------------------------------ */

function MiniTable({
  title,
  trendBadge,
  children,
  className,
}: {
  title: string;
  trendBadge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4",
        amiioCardHoverSurface,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[16px] font-medium leading-[1.5] text-[#2C2C2C]">
          {title}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {trendBadge}
          <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
            <WidgetHeaderLamp
              chatTopic={`Review "${title}" on Tenant Hub and compare to portfolio or market where useful.`}
              chatLabel={title}
            />
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

function MiniRow({
  label,
  value,
  borderBottom = true,
}: {
  label: string;
  value: React.ReactNode;
  borderBottom?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[40px] items-center justify-between py-3",
        borderBottom && "border-b border-[rgba(230,231,232,0.7)]",
      )}
    >
      <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
        {label}
      </span>
      <span className="text-[14px] leading-[1.4] text-[#2C2C2C]">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Label / Value helpers                                              */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] leading-[1.25] text-[#838697]">{children}</div>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[14px] leading-[1.4] text-[#2C2C2C]">{children}</div>
  );
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <FieldLabel>{label}</FieldLabel>
      <FieldValue>{value}</FieldValue>
    </div>
  );
}

/* ================================================================== */
/*  Amiio summary & insight copy (expandable rows)                    */
/* ================================================================== */

const tenantAmiioSummaryItems = [
  {
    id: "ts1",
    summary: "Announced Series C funding of €45M in Q3 2025",
    when: "2 days ago",
    fullDescription:
      "Press coverage and Companies House filings point to a €45M Series C closed in Q3, led by existing investors with participation from a European growth fund.\n\nFor the landlord, the round improves covenant strength and supports the tenant’s multi-year occupancy story; Amiio flags no immediate change to payment behaviour but recommends refreshing the parent guarantee on file.",
    recentActionLines: [
      "IR team uploaded the funding announcement PDF to the tenant dossier.",
      "Asset analyst linked the round to headcount growth assumptions in the renewal model.",
      "No request for rent-free or capex contribution has been logged yet.",
    ],
  },
  {
    id: "ts2",
    summary:
      "Strong tenant relationship - sentiment score 8.5/10 (+0.3 trend). 72% positive communications.",
    when: "5 days ago",
    fullDescription:
      "Amiio scored the last 90 days of emails, tickets, and meeting notes. Tone is consistently collaborative; friction topics are limited to parking allocation and one HVAC follow-up that was closed within SLA.\n\nThe +0.3pt move vs. prior quarter is driven by fewer escalations after the EV charging upgrade.",
    recentActionLines: [
      "Customer success shared Q4 relationship survey results with the asset team.",
      "Facilities confirmed closure of the HVAC ticket referenced in negative threads.",
      "Leasing added a note to renew talks referencing positive engagement metrics.",
    ],
  },
  {
    id: "ts3",
    summary:
      "Excellent payment history - 100% on-time payments with no outstanding balance.",
    when: "1 week ago",
    fullDescription:
      "Rent, service charge, and insurance contributions have cleared on or before due date for 24 consecutive months. Amiio reconciled bank receipts to the lease schedule through the latest quarter-end.\n\nNo payment plans, deferrals, or disputes are open; the only watch-item is a routine true-up on CAM expected next month.",
    recentActionLines: [
      "Treasury exported the payment register for auditor sampling.",
      "Property accountant validated indexation factors against the lease PDF.",
      "No collections tasks are queued in the AR workbench.",
    ],
  },
] as const;

const tenantGeneralAiInsights = [
  {
    id: "tg1",
    summary: "Strong growth trajectory - likely to need more space in 2026",
    when: "2 days ago",
    fullDescription:
      "Headcount and sales hiring plans referenced in Q3 meetings imply 15–20% more desk demand by mid-2026. The tenant asked informally about contiguous options on the floor above.\n\nAmiio suggests a structured options paper (stay-put vs. expand vs. blend-and-extend) before formal LOI timing compresses.",
    recentActionLines: [
      "Workplace lead shared a rough seat plan for H2 2026.",
      "Broker was copied on an internal email about a tour of the 5th floor.",
      "No formal RFP or LOI has been issued to the landlord yet.",
    ],
    typewriterStartDelayMs: 0,
  },
  {
    id: "tg2",
    summary: "Key decision maker: Sarah van der Berg (Head of Operations)",
    when: "2 days ago",
    fullDescription:
      "Sarah van der Berg approves facilities spend, lease amendments, and service-charge queries on behalf of ScaleHub NL. Legal and finance counter-sign above certain thresholds.\n\nOutreach on renewal economics should route through Sarah first; she prefers written summaries with two scenario tables.",
    recentActionLines: [
      "EA confirmed Sarah’s availability for a 45-minute renewal workshop next week.",
      "Last signed amendment (2023) lists Sarah as authorised signatory for NL ops.",
      "Asset manager saved her direct dial in the CRM tenant record.",
    ],
    typewriterStartDelayMs: 220,
  },
  {
    id: "tg3",
    summary:
      "Expansion optionality — tenant asked for ROFR on adjacent ~400 sqm if it becomes available",
    when: "2 days ago",
    fullDescription:
      "In the August steering call, the tenant floated a right of first refusal on the south wing swing space (~400 sqm) ahead of a potential sublet by another occupier.\n\nAmiio captured the ask as non-binding; landlord counsel should confirm whether ROFR is permitted under the head lease and how notice periods would run.",
    recentActionLines: [
      "Meeting transcript tagged with “ROFR” and linked to the lease clause library.",
      "Leasing requested a stacking-plan hold on the adjacent suite for 30 days.",
      "No term sheet or side letter has been drafted yet.",
    ],
    typewriterStartDelayMs: 440,
  },
] as const;

const tenantRecentActions = [
  {
    id: "tra1",
    icon: FileText,
    title: "Lease Renewal Proposal",
    who: "From Amiio",
    when: "2 hours ago",
    status: "Completed" as const,
    openLeasingOnActivate: true,
    fullDescription:
      "Amiio generated a first-pass renewal proposal pack: headline rent, indexation, and a comparison to the in-place schedule. The document is marked ready for internal legal review before tenant send.\n\nAssumptions include a 5-year term and landlord-funded lobby refresh capped at the prior budget envelope.",
    recentActionLines: [
      "Draft stored in the leasing workspace under “ScaleHub — renewal v0.9”.",
      "Two footnotes still need FM validation on opex growth.",
      "Asset manager left comments requesting a parking allocation slide.",
    ],
  },
  {
    id: "tra2",
    icon: FileText,
    title: "Q2 Tenant Review Meeting",
    who: "Manual",
    when: "1 day ago",
    status: "Pending" as const,
    openLeasingOnActivate: false,
    fullDescription:
      "Quarterly business review is on the calendar but notes and attendance are not finalised. Topics expected: expansion interest, service charge transparency, and EV charging utilisation.\n\nAmiio will ingest the recording and slide deck once uploaded to produce action items.",
    recentActionLines: [
      "Calendar hold sent to both sides — waiting on tenant confirmation.",
      "Property manager to bring YTD service-charge actuals vs. budget.",
    ],
  },
  {
    id: "tra3",
    icon: FileText,
    title: "Lease Renewal Proposal (Draft)",
    who: "Amiio Gen",
    when: "3 days ago",
    status: "Completed" as const,
    openLeasingOnActivate: true,
    fullDescription:
      "Earlier exploratory draft before the latest rent comps refresh. Superseded by the newer pack but retained for audit trail.\n\nUse this version only to trace how assumptions moved after the September market mark.",
    recentActionLines: [
      "Version labelled “superseded” in the document history.",
      "Legal left inline comments that were merged into v0.9.",
    ],
  },
  {
    id: "tra4",
    icon: FileText,
    title: "Credit Risk Assessment",
    who: "Amiio Gen",
    when: "5 days ago",
    status: "Completed" as const,
    openLeasingOnActivate: false,
    fullDescription:
      "Automated covenant memo summarising liquidity, leverage proxies from public filings, and payment behaviour in-building. Outcome: low watch-list risk with standard renewal documentation.\n\nRecommended annual refresh aligned with year-end reporting.",
    recentActionLines: [
      "Risk score written to the tenant master record.",
      "No manual override requested by the investment committee.",
    ],
  },
] as const;

function personInitials(person: string) {
  return person
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export function TenantHubView({
  onNavigateToLeasing,
  onAnalyseWithAmiio,
}: {
  onNavigateToLeasing?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
} = {}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!actionsOpen) return;
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [actionsOpen]);

  const analyseTenantInsight = onAnalyseWithAmiio
    ? (insightText: string) =>
        onAnalyseWithAmiio(`Tenant summary — ${insightText}`)
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* ============ Company Overview Card ============ */}
      <div
        className={cn(
          "group rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-[25px]",
          amiioCardHoverSurface,
        )}
      >
        <div className="flex gap-[27px]">
          {/* Left: Logo Area */}
          <div className="flex w-[192px] shrink-0 flex-col items-center justify-between">
            <div className="flex w-full flex-col items-center gap-2">
              <div className="relative flex h-[201px] w-[192px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={TENANT_SCALEHUB_LOGO}
                  alt="ScaleHub III B.V."
                  width={192}
                  height={201}
                  decoding="async"
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <div className="text-center text-[12px] leading-[1.25] text-[#65686B]">
                Technology / Data Services
              </div>
            </div>
            <div className="flex h-8 w-full items-center justify-center rounded-full bg-[#E6F6F3]">
              <span className="text-[12px] font-medium leading-[1.25] text-[#1F9E8B]">
                High Renewal
              </span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-[15px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-start justify-between">
                <h2 className="text-[20px] font-medium leading-[1.25] text-[#353638]">
                  ScaleHub III B.V.
                </h2>
                <div className="flex items-center gap-2">
                  <span className="opacity-0 transition-opacity duration-150 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                    <WidgetHeaderLamp
                      chatTopic="Summarise ScaleHub III B.V. profile: financial health, lease posture, and top questions for the asset manager."
                      chatLabel="Company overview"
                    />
                  </span>
                <div ref={actionsRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setActionsOpen((v) => !v)}
                    className="flex h-10 items-center gap-2 rounded-full bg-[#020410] px-[14px] py-1 text-[14px] font-medium leading-[1.5] text-[#F0F2F5]"
                  >
                    <Filter className="h-4 w-4" />
                    Actions
                  </button>
                  {actionsOpen && (
                    <div className="absolute right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-[#E6E8EB] bg-[#F0F2F5] px-2.5 py-2 shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)]">
                      {[
                        { label: "Lease Renewals", divider: false },
                        { label: "Send Communications", divider: false },
                        { label: "Schedule Meeting", divider: false },
                        { label: "Report Issue", divider: true },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setActionsOpen(false);
                            if (item.label === "Lease Renewals") {
                              onNavigateToLeasing?.();
                              window.dispatchEvent(
                                new CustomEvent("amiio:toast", {
                                  detail: { message: "Opening Proposal Prep" },
                                }),
                              );
                              return;
                            }
                            window.dispatchEvent(
                              new CustomEvent("amiio:toast", {
                                detail: { message: `${item.label} initiated` },
                              }),
                            );
                          }}
                          className={cn(
                            "flex h-[41px] w-[192px] items-center rounded px-1.5 text-[14px] leading-[1.4] text-[#353638] hover:bg-[#E6E8EB] transition-colors",
                            item.divider && "border-t border-[rgba(205,207,213,0.5)]",
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </div>
              <p className="text-[12px] leading-[1.25] text-[#838697]">
                ScaleHub is a leading data collection and processing company
                specializing in AI-powered document processing and data
                extraction services for enterprise clients globally.
              </p>
            </div>

            {/* 4-column info grid */}
            <div className="flex h-[190px] items-center justify-between">
              <div className="flex w-[155px] flex-col gap-6">
                <InfoCell label="Employees" value="150-200" />
                <InfoCell label="NL Locations" value="3" />
                <InfoCell label="Website" value="scalehub.com" />
              </div>
              <div className="flex w-[155px] flex-col gap-6">
                <InfoCell label="Annual Rent" value="€904,302" />
                <InfoCell label="First Lease" value="3,905 sqm" />
                <InfoCell label="Rent/sqm" value="€232/sqm" />
              </div>
              <div className="flex w-[155px] flex-col gap-6">
                <InfoCell label="Lease End" value="30-Jun-2032" />
                <InfoCell label="Renewals" value="1x" />
                <InfoCell label="Area" value="01-Jul-2019" />
              </div>
              <div className="flex w-[155px] flex-col gap-6">
                <div className="flex flex-col gap-[5px]">
                  <FieldLabel>Payment</FieldLabel>
                  <span className="inline-flex w-fit items-center rounded-full bg-[#010309] px-2.5 py-0.5 text-[12px] leading-[1.25] text-white">
                    Excellent
                  </span>
                </div>
                <InfoCell label="Sentiment" value="8.2/10" />
                <InfoCell label="Service Req." value="8/yr" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Amiio's Tenant Summary ============ */}
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
              Amiio&apos;s Tenant Summary
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {tenantAmiioSummaryItems.map((it) => (
            <AmiioExpandableInsightRow
              key={it.id}
              summary={it.summary}
              when={it.when}
              fullDescription={it.fullDescription}
              recentActionLines={[...it.recentActionLines]}
              useTypewriterSummary={false}
              hideExpandedAnalyseButton
              onAnalyseFurther={analyseTenantInsight}
            />
          ))}
        </div>
      </div>

      {/* ============ General Information ============ */}
      <Section title="General Information">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_322px]">
          <div className="flex flex-col gap-[25px]">
            <div>
              <div className="text-[12px] font-medium leading-[1.25] text-[#838697]">
                Company Overview
              </div>
              <p className="mt-[5px] text-[12px] leading-[1.25] text-[#65686B]">
                ScaleHub is a leading data collection and processing company
                specializing in AI-powered document processing and data
                extraction services for enterprise clients globally.
              </p>
            </div>
            <div>
              <div className="text-[12px] font-medium leading-[1.25] text-[#838697]">
                Recent Business Changes
              </div>
              <TooltipProvider delayDuration={200}>
                <div className="mt-[5px] flex flex-col gap-[5px]">
                  {[
                    "Announced Series C funding of €45M in Q3 2025",
                    "Expanding AI capabilities with new machine learning team",
                  ].map((changeText) => (
                    <Tooltip key={changeText}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="-mx-1 flex w-full items-start gap-1 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-[#F2F4F7]"
                          onClick={() =>
                            onAnalyseWithAmiio?.(
                              `Recent business change on Tenant Hub: ${changeText}`,
                            )
                          }
                        >
                          <TrendDirectionGlyph
                            direction="up"
                            className="mt-0.5 h-6 w-6"
                          />
                          <span className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                            {changeText}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={6}
                        className="border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium text-[#F0F2F5]"
                      >
                        Analyse with Amiio
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col gap-[20px]">
              <InfoCell label="Industry" value="Technology / Data Services" />
              <InfoCell label="Employees (est.)" value="150-200" />
              <InfoCell label="Headquarters" value="Amsterdam, Netherlands" />
            </div>
            <div className="flex flex-col gap-[20px]">
              <InfoCell label="Corporate Structure" value="ScaleHub Group GmbH" />
              <InfoCell label="Website" value="scalehub.com" />
              <InfoCell label="Other NL Locations" value="2" />
            </div>
          </div>
        </div>
      </Section>

      {/* ============ Lease Information ============ */}
      <Section title="Lease Information">
        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable title="Lease Timeline">
              <div className="flex flex-col">
                <MiniRow label="First Lease Start" value="01-Jul-2019" />
                <MiniRow label="Current Lease Start" value="01-Jul-2022" />
                <MiniRow label="Current Lease End" value="30-Jun-2032" />
                <MiniRow label="Renewals" value="1x Renewed" borderBottom={false} />
              </div>
            </MiniTable>
            <MiniTable title="Current Contract Incentive">
              <div className="flex flex-col">
                <div className="flex h-[40px] items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
                  <span className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[#2C2C2C]">
                    <AlertTriangle className="h-6 w-6 text-[#E7B65A]" />
                    30-Jun-2027
                  </span>
                  <span className="text-[12px] leading-[1.25] text-[#7E8185]">
                    12 months notice
                  </span>
                </div>
                <div className="flex h-[40px] items-center justify-between py-3">
                  <span className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[#2C2C2C]">
                    <AlertTriangle className="h-6 w-6 text-[#E7B65A]" />
                    30-Jun-2029
                  </span>
                  <span className="text-[12px] leading-[1.25] text-[#7E8185]">
                    12 months notice
                  </span>
                </div>
              </div>
            </MiniTable>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable title="Current Contract Incentive">
              <div className="flex flex-col">
                <MiniRow label="Rent Free Period" value="3 months" />
                <MiniRow label="Fit-out Contribution" value="€95,000" />
                <MiniRow
                  label="Rent Discount"
                  value={
                    <span className="flex items-center gap-1.5">
                      <MiniCircle pct={25} />
                      2.5%
                    </span>
                  }
                />
                <MiniRow
                  label="Incentive Load"
                  value={
                    <span className="flex items-center gap-1.5">
                      <MiniCircle pct={42} />
                      4.2%
                    </span>
                  }
                  borderBottom={false}
                />
              </div>
            </MiniTable>
            <MiniTable title="Previous Contract Incentive">
              <div className="flex flex-col">
                <MiniRow label="Rent Free Period" value="6 months" />
                <MiniRow label="Fit-out Contribution" value="€185,000" />
                <MiniRow
                  label="Other"
                  value="Early access to rooftop terrace"
                  borderBottom={false}
                />
              </div>
            </MiniTable>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable
              title="Service charges"
              trendBadge={<TrendPill direction="up" pct="16.9%" />}
            >
              <div className="rounded-xl bg-[#F2F4F7] p-3">
                <div className="flex h-8 items-center justify-between">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Annual SC Advance
                  </span>
                  <span className="text-[20px] font-medium leading-[1.25] text-[#2C2C2C]">
                    €45
                  </span>
                </div>
                <div className="flex h-8 items-center justify-between">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Total Annual
                  </span>
                  <span className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                    €175,725
                  </span>
                </div>
              </div>
            </MiniTable>
            <MiniTable title="Additional Clauses">
              <div className="flex flex-col">
                <MiniRow
                  label=""
                  value="Right of first refusal on adjacent floor (4th floor)"
                />
                <MiniRow
                  label=""
                  value="Signage rights on building exterior"
                />
                <MiniRow
                  label=""
                  value="24/7 access to premises"
                  borderBottom={false}
                />
              </div>
            </MiniTable>
          </div>
        </div>
      </Section>

      {/* ============ Financial Information ============ */}
      <Section title="Financial Information">
        <div className="flex flex-col gap-4">
          {/* Row 1: Rental Income + Parking */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable title="Rental Income">
              <div className="flex flex-col">
                <div className="flex items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Rent per sqm
                  </span>
                  <div className="text-right">
                    <div className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">
                      €232/sqm/yr
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
                      <span>Asset €221</span>
                      <TrendPill direction="up" pct="5%" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
                      <span>Portfolio €195</span>
                      <TrendPill direction="up" pct="19%" />
                    </div>
                  </div>
                </div>
                <MiniRow label="Leased Area" value="3,905 sqm" />
                <MiniRow label="Annual Rent (excl. parking)" value="€904,305" />
                <div className="flex items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    SC Advance per sqm
                  </span>
                  <div className="text-right">
                    <div className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                      €45/sqm/yr
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
                      <span>Portfolio €41</span>
                      <TrendPill direction="up" pct="10%" />
                    </div>
                  </div>
                </div>
              </div>
            </MiniTable>
            <MiniTable title="Parking">
              <div className="flex flex-col">
                <MiniRow label="Number of Spaces" value="40 spaces" />
                <div className="flex items-center justify-between border-b border-[rgba(230,231,232,0.7)] py-3">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Price per Space
                  </span>
                  <div className="text-right">
                    <div className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                      €1,577
                    </div>
                    <div className="flex items-center justify-end gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
                      <span>Asset €1686</span>
                      <TrendPill direction="down" pct="5%" />
                    </div>
                  </div>
                </div>
                <MiniRow label="Total Parking Income" value="€63,080" borderBottom={false} />
              </div>
            </MiniTable>
          </div>

          {/* Incentive Load */}
          <div
            className={cn(
              "rounded-2xl border border-[rgba(230,231,232,0.7)] p-4",
              amiioCardHoverSurface,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-[16px] font-medium leading-[1.5] text-[#2C2C2C]">
                Incentive load
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 text-[12px] leading-[1.25]">
                  <span className="text-[#7E8185]">Below asset average by</span>
                  <TrendPill direction="up" pct="16.9%" />
                </div>
                <WidgetHeaderLamp
                  chatTopic="Explain incentive load vs asset and portfolio averages and negotiation implications."
                  chatLabel="Incentive load"
                />
              </div>
            </div>
            <div className="mt-1 text-right text-[20px] font-medium leading-[1.25] text-[#2C2C2C]">
              4.2%
            </div>
            <div className="mt-1 text-[12px] leading-[1.25] text-[#65686B]">
              (Rent free + Fit-out + Discounts)/Total Contract Value
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[12px] leading-[1.25] text-[#7E8185]">
                3.00%
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-[#E6E8EB]">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full bg-[#233FDE]"
                  style={{ width: "24%" }}
                />
              </div>
              <span className="text-[12px] leading-[1.25] text-[#7E8185]">
                8.00%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-6 text-center text-[12px] font-medium leading-[1.25]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#233FDE]" />
                Asset avg. <span className="text-[#2C2C2C]">5.8%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#969A9E]" />
                Portfolio avg. <span className="text-[#2C2C2C]">6.5%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E7B65A]" />
                Portfolio avg. <span className="text-[#2C2C2C]">8%</span>
              </span>
            </div>
          </div>

          {/* Row 2: Payment Behavior + Last Payment */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable title="Payment Behavior">
              <div className="flex flex-col">
                <MiniRow
                  label="Payment Score"
                  value={
                    <span className="rounded-full bg-[#E6F6F3] px-2 py-0.5 text-[12px] font-medium leading-[1.25] text-[#1F9E8B]">
                      Excellent
                    </span>
                  }
                />
                <MiniRow label="On-time Payments" value="100%" />
                <MiniRow
                  label="Average Days Late"
                  value={
                    <span className="text-[#233FDE]">0 Days</span>
                  }
                  borderBottom={false}
                />
              </div>
            </MiniTable>
            <MiniTable title="Last Payment">
              <div className="flex flex-col">
                <MiniRow label="Last Payment" value="01-Dec-2025" />
                <MiniRow
                  label="Outstanding Amount"
                  value={
                    <span className="text-[#1F9E8B]">€0</span>
                  }
                  borderBottom={false}
                />
              </div>
            </MiniTable>
          </div>

          {/* Total Annual Value */}
          <div className="rounded-xl bg-[#F7F9FB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">
                  Total Annual Value
                </div>
                <div className="mt-1 flex items-center gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
                  <span>
                    Rent <span className="font-medium text-[#2C2C2C]">€4,191</span>
                  </span>
                  <span>+</span>
                  <span>
                    Parking{" "}
                    <span className="font-medium text-[#2C2C2C]">€63,080</span>
                  </span>
                  <span>+</span>
                  <span>
                    SC{" "}
                    <span className="font-medium text-[#2C2C2C]">€175,725</span>
                  </span>
                </div>
              </div>
              <div className="text-[24px] font-medium leading-[1.25] text-[#233FDE]">
                €1,143,107
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ Commercial Information ============ */}
      <Section title="Commercial Information">
        <div className="flex flex-col gap-4">
          {/* Row 1: Service Requests + Sentiment Score */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable
              title="Service Requests"
              trendBadge={<TrendPill direction="down" pct="-52%" />}
            >
              <div className="rounded-xl bg-[#F2F4F7] p-3">
                <div className="flex h-8 items-center justify-between">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Requests this month
                  </span>
                  <span className="text-[20px] font-medium leading-[1.25] text-[#2C2C2C]">
                    8
                  </span>
                </div>
                <div className="flex h-8 items-center justify-between">
                  <span className="text-[14px] font-medium leading-[1.25] text-[#65686B]">
                    Portfolio average
                  </span>
                  <span className="text-[14px] leading-[1.4] text-[#2C2C2C]">
                    18
                  </span>
                </div>
              </div>
            </MiniTable>
            <MiniTable
              title="Sentiment Score"
              trendBadge={<TrendPill direction="up" pct="0.3" />}
            >
              <div>
                <div className="text-[24px] font-medium leading-[1.25] text-[#2C2C2C]">
                  8.2
                </div>
                <div className="mt-1 h-2 w-2/3 rounded-full bg-[#010309]" />
                <div className="mt-2 text-[12px] leading-[1.25] text-[#7E8185]">
                  Based on <span className="font-medium text-[#2C2C2C]">156</span>{" "}
                  emails analyzed
                </div>
              </div>
            </MiniTable>
          </div>

          {/* Row 2: Status Breakdown + Sentiment Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <MiniTable title="Status Breakdown">
              <div className="flex flex-col gap-3">
                {[
                  { label: "HVAC", count: 4, status: "Resolved", cls: "bg-[#E6F6F3] text-[#1F9E8B]", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                  { label: "Electrical", count: 3, status: "In Progress", cls: "bg-[#353638] text-white", icon: <Wrench className="h-3.5 w-3.5" /> },
                  { label: "Plumbing", count: 2, status: "Resolved", cls: "bg-[#E6F6F3] text-[#1F9E8B]", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                  { label: "General Maintenance", count: 3, status: "Pending", cls: "bg-[#FBEAEC] text-[#9F2D3A]", icon: <Clock className="h-3.5 w-3.5" /> },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[14px] leading-[1.4] text-[#65686B]">
                      {s.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">
                        {s.count}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium leading-[1.25]",
                          s.cls,
                        )}
                      >
                        {s.icon}
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </MiniTable>
            <MiniTable title="Sentiment Breakdown">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Positive", pct: "72%", color: "#1F9E8B" },
                  { label: "Neutral", pct: "24%", color: "#353638" },
                  { label: "Negative", pct: "4%", color: "#E6E8EB" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[14px] leading-[1.4] text-[#65686B]">
                      {s.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <MiniCircle pct={parseInt(s.pct)} color={s.color} />
                      <span className="text-[14px] font-medium leading-[1.5] text-[#2C2C2C]">
                        {s.pct}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-1 text-[12px] leading-[1.25] text-[#7E8185]">
                  <AmiioAiDisclaimerTrigger
                    variant="lamp"
                    wrapChild
                    lampSummary={defaultLampTooltipSummary(
                      "Tenant communications sentiment",
                      "Positive, neutral, and negative shares from AI-reviewed messages and notes.",
                    )}
                  >
                    <Lightbulb className="h-4 w-4" />
                  </AmiioAiDisclaimerTrigger>
                  AI-analyzed tenant communications
                </div>
              </div>
            </MiniTable>
          </div>

          {/* Meeting Transcripts */}
          <MiniTable title="Meeting Transcripts and notes">
            <div className="flex flex-col">
              {[
                "Q3 2025: Discussed potential expansion to 4th floor if available",
                "Q2 2025: Very satisfied with recent HVAC upgrades",
                "Q1 2025: Requested improved EV charging infrastructure",
              ].map((note, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between py-3",
                    i < 2 && "border-b border-[rgba(230,231,232,0.7)]",
                  )}
                >
                  <span className="flex items-center gap-2 text-[14px] leading-[1.4] text-[#2C2C2C]">
                    <FileText className="h-5 w-5 shrink-0 text-[#969A9E]" />
                    {note}
                  </span>
                  <button className="flex items-center gap-1 rounded-lg bg-[#353638] px-2.5 py-1 text-[12px] font-medium leading-[1.25] text-white">
                    <ExternalLink className="h-3 w-3" />
                    view
                  </button>
                </div>
              ))}
            </div>
          </MiniTable>

          {/* AI Insights */}
          <div className="flex flex-col gap-2">
            {tenantGeneralAiInsights.map((it) => (
              <AmiioExpandableInsightRow
                key={it.id}
                summary={it.summary}
                when={it.when}
                fullDescription={it.fullDescription}
                recentActionLines={[...it.recentActionLines]}
                typewriterStartDelayMs={it.typewriterStartDelayMs}
                onAnalyseFurther={analyseTenantInsight}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ============ Recent Actions ============ */}
      <Section title="Recent actions">
        <div
          className="mb-1.5 hidden h-9 items-center border-b border-[rgba(230,231,232,0.7)] pl-4 pr-[52px] text-[12px] font-medium text-[#7E8185] sm:flex"
          aria-hidden
        >
          <span className="min-w-0 flex-1 pl-8">Title</span>
          <span className="w-[160px] shrink-0">Author</span>
          <span className="w-[112px] shrink-0">Time</span>
          <span className="w-[120px] shrink-0 text-right">Status</span>
        </div>
        <div className="flex flex-col gap-2">
          {tenantRecentActions.map((a) => (
            <AmiioExpandableRecentActionRow
              key={a.id}
              actionIcon={a.icon}
              actionIconBg="bg-[#1B32B3]"
              title={a.title}
              initials={personInitials(a.who)}
              avatarBg={a.who === "Manual" ? "bg-[#5A5E74]" : "bg-[#0E195B]"}
              person={a.who}
              time={a.when}
              status={a.status}
              fullDescription={a.fullDescription}
              recentActionLines={[...a.recentActionLines]}
              onNavigate={
                a.openLeasingOnActivate && onNavigateToLeasing
                  ? () => onNavigateToLeasing()
                  : undefined
              }
              navigateLabel="Open leasing workspace"
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini circle progress                                               */
/* ------------------------------------------------------------------ */

function MiniCircle({ pct, color = "#010309" }: { pct: number; color?: string }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
      <circle cx="12" cy="12" r={r} fill="transparent" stroke="#E6E8EB" strokeWidth="3" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="transparent"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
