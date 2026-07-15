"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Copy, Download, ExternalLink, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AmiioSummaryTypewriterParts } from "@/src/components/commercial/AmiioSummaryTypewriter";
import { ChatAside } from "@/src/components/commercial/ChatPanel";
import {
  SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX,
  SHELL_CHAT_PANEL_GRADIENT_STYLE,
  SHELL_SIDE_PANEL_FRAME_CLASS,
  SHELL_SIDE_PANEL_INSET_SHADOW_CLASS,
} from "@/src/lib/shellLayout";
import type { LeaseRenewalContext } from "@/src/types/leaseRenewal";
import { leaseRenewalProposalRef } from "@/src/types/leaseRenewal";

const documentVersions = [
  { label: "Current", date: "", active: true },
  { label: "v78", date: "23 Nov 2025", active: false },
  { label: "v77", date: "12 Nov 2025", active: false },
  { label: "v76", date: "12 May 2025", active: false },
];

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

function buildProposalDocumentParts(ctx: LeaseRenewalContext) {
  const property = ctx.property ?? "the selected property";
  const tenant = ctx.tenantName;
  const ref = leaseRenewalProposalRef(tenant);

  return [
    {
      text: `Lease Renewal Proposal\nDate: 29 March 2026\nReference: ${ref}\n\nTo: ${tenant}\nFrom: ${property}\n\n1. SUBJECT PROPERTY\nThis Lease Renewal Proposal concerns the premises located at ${property}, comprising 3,905 square metres of lettable floor area, together with 40 parking spaces.\n\n2. PROPOSED TERMS\n2.1 Lease Term: 5 (Five) years, commencing on Jul 2026.\n2.2 Lease term extension — 60 months (5 years).\n2.3 Base Rent: €225 per square meter per annum, totalling €878,625 annually.\n2.4 Rent-Free Period: 3 (Three) months rent-free at the commencement of the lease term.\n2.5 ${tenant} may terminate after year 3 with 6 months' written notice.\n2.6 Rent Review: Annual Indexation based on CPI, capped at 3% per annum.\n\n3. ADDITIONAL TERMS\n• Break option at 3 years with 6 months notice\n• CPI indexation capped at 3% annually\n• Expansion for unit 4B at €209/sqm`,
    },
  ];
}

export function LeaseProposalDocumentPanel({
  context,
  onClose,
  onDraftReady,
  layout: _layout = "shell",
}: {
  context: LeaseRenewalContext;
  onClose?: () => void;
  /** Fires once when the draft typewriter finishes loading. */
  onDraftReady?: () => void;
  /** `floating` — fills a fixed-position wrapper; `shell` — docked in AppShell side column. */
  layout?: "shell" | "floating";
}) {
  const [writingDone, setWritingDone] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(documentVersions[0]?.label ?? "Current");

  const activeVersion =
    documentVersions.find((v) => v.label === selectedVersion) ?? documentVersions[0];

  useEffect(() => {
    setWritingDone(false);
    setSelectedVersion(documentVersions[0]?.label ?? "Current");
  }, [context.tenantName, context.property]);

  const documentParts = useMemo(() => buildProposalDocumentParts(context), [context]);
  const ref = leaseRenewalProposalRef(context.tenantName);
  const property = context.property ?? "the selected property";

  return (
    <ChatAside
      id="lease-proposal-document-panel"
      className="h-full min-h-0 w-full"
      style={{ maxWidth: SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX }}
    >
      <div className={cn("relative h-full min-h-0 w-full rounded-[12px]", SHELL_SIDE_PANEL_FRAME_CLASS)}>
        <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[12px] backdrop-blur-[20px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[12px]"
            style={SHELL_CHAT_PANEL_GRADIENT_STYLE}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit]",
              SHELL_SIDE_PANEL_INSET_SHADOW_CLASS,
            )}
          />
          <div className="relative flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E6E8EB] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
                <Sparkles className="size-4 text-[#010309]" aria-hidden />
              </AmiioAiDisclaimerTrigger>
              <h2 className="truncate text-[16px] font-semibold leading-[1.35] text-[#010309]">
                Lease Renewal Proposal
              </h2>
            </div>
            <p className="mt-0.5 truncate text-[12px] font-medium text-[#676A6E]">
              {context.tenantName}
              {context.property ? ` · ${context.property}` : null}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge className="border-0 bg-[#FEF3CD] text-[11px] font-medium text-[#856404]">
              Draft
            </Badge>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]"
                aria-label="Close proposal panel"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#E6E8EB] px-4 py-2.5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {!writingDone ? (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#233FDE]">
                  <Sparkles className="size-3 animate-pulse" />
                  Writing draft…
                </span>
              ) : (
                <span className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] text-[#6B7280]">
                  <span className="truncate">Viewing {activeVersion?.label ?? "Current"}</span>
                  {activeVersion && !activeVersion.active ? (
                    <button
                      type="button"
                      className="flex shrink-0 items-center gap-1 font-medium text-[#353638] hover:underline"
                    >
                      Go to latest
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  ) : null}
                </span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-white px-2.5 text-[11px] font-medium text-[#353638] transition-colors hover:bg-[#F9FAFB]"
                    aria-label="Select document version"
                  >
                    Version: {selectedVersion}
                    <ChevronDown className="size-3.5 text-[#969A9E]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[11rem] border-[#E6E8EB] bg-white text-[#353638]"
                >
                  {documentVersions.map((v) => (
                    <DropdownMenuItem
                      key={v.label}
                      className={cn(
                        "cursor-pointer text-xs focus:bg-[#F2F4F7] focus:text-[#010309]",
                        v.label === selectedVersion && "bg-[#F3F4F6] font-semibold",
                      )}
                      onSelect={() => setSelectedVersion(v.label)}
                    >
                      {v.label}
                      {v.date ? (
                        <span className="ml-1.5 text-[#A0A4AB]">{v.date}</span>
                      ) : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-white px-2.5 text-[11px] font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#111827]"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                className="h-7 bg-[#353638] px-2.5 text-[11px] text-white hover:bg-[#252628]"
                size="sm"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Finalize
              </Button>
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-[#F9FAFB] p-4 pb-8">
            <p className="mb-3 text-center text-[10px] text-[#969A9E]">Updated on 23 Nov 2025</p>
            <div className="mx-auto w-full max-w-none rounded-lg bg-white p-5 pb-8 shadow-sm">
                <div className="space-y-4 text-center">
                  <h3 className="text-[15px] font-bold text-[#111827]">Lease Renewal Proposal</h3>
                  <p className="text-[11px] text-[#6B7280]">Date: 29 March 2026</p>
                  <p className="text-[11px] text-[#6B7280]">Reference: {ref}</p>
                </div>

                <div className="mt-5 space-y-1 text-[11px] text-[#4B5563]">
                  <p>
                    <span className="font-medium">To:</span> {context.tenantName}
                  </p>
                  <p>
                    <span className="font-medium">From:</span> {property}
                  </p>
                </div>

                {!writingDone ? (
                  <div className="mt-5 whitespace-pre-wrap text-[11px] leading-relaxed text-[#4B5563]">
                    <AmiioSummaryTypewriterParts
                      parts={documentParts}
                      charDelayMs={6}
                      onComplete={() => {
                        setWritingDone(true);
                        onDraftReady?.();
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-5 space-y-4 text-[11px] leading-relaxed text-[#4B5563]">
                    <div>
                      <h4 className="font-semibold text-[#111827]">1. SUBJECT PROPERTY</h4>
                      <p className="mt-1">
                        This Lease Renewal Proposal concerns the premises located at {property},
                        comprising 3,905 square metres of lettable floor area, together with 40 parking
                        spaces.
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
                          text={`${context.tenantName} may terminate after year 3 with 6 months' written notice.`}
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
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ChatAside>
  );
}
