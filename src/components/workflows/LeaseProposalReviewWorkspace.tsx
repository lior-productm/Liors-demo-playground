"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildDefaultProposalDocument,
  LEASE_PROPOSAL_DOCUMENT_VERSIONS,
  proposalDocumentMeta,
  type LeaseProposalDocumentFields,
} from "@/src/lib/leaseProposalDocument";
import type { LeaseRenewalContext } from "@/src/types/leaseRenewal";

type ReviewTab = "analysis" | "live-status" | "lease-proposal";
type DocMode = "edit" | "preview";

function EditPreviewToggle({
  mode,
  onChange,
}: {
  mode: DocMode;
  onChange: (mode: DocMode) => void;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-[24px] border border-[#E6E8EB] bg-[#F0F2F5] p-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
      role="group"
      aria-label="Document mode"
    >
      <button
        type="button"
        onClick={() => onChange("edit")}
        className={cn(
          "flex h-8 min-w-[84px] items-center justify-center rounded-[24px] px-3 text-[14px] font-medium leading-[1.24] transition-colors",
          mode === "edit" ? "bg-[#111111] text-[#F0F2F5] shadow-[0_2px_3px_rgba(0,0,0,0.16)]" : "text-[#969A9E]",
        )}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onChange("preview")}
        className={cn(
          "flex h-8 min-w-[83px] items-center justify-center rounded-[24px] px-3 text-[14px] font-medium leading-[1.24] transition-colors",
          mode === "preview"
            ? "bg-[#111111] text-[#F0F2F5] shadow-[0_2px_3px_rgba(0,0,0,0.16)]"
            : "text-[#969A9E]",
        )}
      >
        Preview
      </button>
    </div>
  );
}

function ProposalDocumentPreview({
  context,
  fields,
}: {
  context: LeaseRenewalContext;
  fields: LeaseProposalDocumentFields;
}) {
  const meta = proposalDocumentMeta(context);

  return (
    <div className="mx-auto w-full max-w-[606px] rounded-sm bg-white p-8 pb-12 shadow-sm">
      <div className="space-y-1 text-center">
        <h3 className="text-[18px] font-bold text-[#111827]">Lease Renewal Proposal</h3>
        <p className="text-[12px] text-[#6B7280]">Date: {meta.date}</p>
        <p className="text-[12px] text-[#6B7280]">Reference: {meta.ref}</p>
      </div>

      <div className="mt-6 space-y-1 text-[12px] text-[#4B5563]">
        <p>
          <span className="font-medium">To:</span> {meta.tenant}
        </p>
        <p>
          <span className="font-medium">From:</span> {meta.property}
        </p>
      </div>

      <div className="mt-6 space-y-5 text-[12px] leading-relaxed text-[#4B5563]">
        <div>
          <h4 className="font-semibold text-[#111827]">1. SUBJECT PROPERTY</h4>
          <p className="mt-2 whitespace-pre-wrap">{fields.subjectProperty}</p>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827]">2. PROPOSED TERMS</h4>
          <div className="mt-3 space-y-2">
            {[
              ["2.1", fields.termLease, "60 months (5 years)"],
              ["2.2", fields.termExtension, "60 months (5 years)"],
              ["2.3", fields.baseRent, "€225/PSM (€878,625)"],
              ["2.4", fields.rentFree, "3 Months"],
              ["2.5", fields.breakOption, "3 Years"],
              ["2.6", fields.rentReview, "3%"],
            ].map(([num, text, hint]) => (
              <div key={num} className="flex items-start justify-between gap-4">
                <p>
                  <span className="font-medium">{num}</span> {text}
                </p>
                <span className="shrink-0 rounded border border-[#E6E8EB] px-2 py-0.5 text-[11px] font-medium text-[#233FDE]">
                  {hint}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-[#111827]">3. ADDITIONAL TERMS</h4>
          <p className="mt-2 whitespace-pre-wrap">{fields.additionalTerms}</p>
        </div>
      </div>
    </div>
  );
}

function ProposalDocumentEditor({
  fields,
  onChange,
}: {
  fields: LeaseProposalDocumentFields;
  onChange: (next: LeaseProposalDocumentFields) => void;
}) {
  const fieldClass =
    "w-full rounded-lg border border-[#C9DED1] bg-white px-3 py-2 text-[13px] leading-relaxed text-[#353638] outline-none transition-colors focus-visible:border-[#233FDE]/35 focus-visible:ring-2 focus-visible:ring-[#233FDE]/15";

  return (
    <div className="mx-auto w-full max-w-[606px] space-y-5 rounded-sm bg-white p-8 pb-12 shadow-sm">
      <p className="text-[14px] font-medium text-[#2C2C2C]">Edit proposal content</p>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-[#65686B]">1. Subject property</span>
        <textarea
          rows={4}
          value={fields.subjectProperty}
          onChange={(e) => onChange({ ...fields, subjectProperty: e.target.value })}
          className={fieldClass}
        />
      </label>

      <div className="space-y-3">
        <p className="text-[12px] font-medium text-[#65686B]">2. Proposed terms</p>
        {(
          [
            ["termLease", "2.1 Lease term"],
            ["termExtension", "2.2 Extension"],
            ["baseRent", "2.3 Base rent"],
            ["rentFree", "2.4 Rent-free period"],
            ["breakOption", "2.5 Break option"],
            ["rentReview", "2.6 Rent review"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block space-y-1">
            <span className="text-[11px] text-[#969A9E]">{label}</span>
            <textarea
              rows={2}
              value={fields[key]}
              onChange={(e) => onChange({ ...fields, [key]: e.target.value })}
              className={fieldClass}
            />
          </label>
        ))}
      </div>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-[#65686B]">3. Additional terms</span>
        <textarea
          rows={5}
          value={fields.additionalTerms}
          onChange={(e) => onChange({ ...fields, additionalTerms: e.target.value })}
          className={fieldClass}
        />
      </label>
    </div>
  );
}

/** Figma 1201:43247 — Review Proposal step: tabs, versions, edit/preview document. */
export function LeaseProposalReviewWorkspace({
  context,
  onDraftReady,
}: {
  context: LeaseRenewalContext;
  onDraftReady?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("lease-proposal");
  const [docMode, setDocMode] = useState<DocMode>("preview");
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("Current");
  const [viewingHistorical, setViewingHistorical] = useState(false);
  const [fields, setFields] = useState<LeaseProposalDocumentFields>(() =>
    buildDefaultProposalDocument(context),
  );

  const meta = useMemo(() => proposalDocumentMeta(context), [context]);

  useEffect(() => {
    setFields(buildDefaultProposalDocument(context));
    setSelectedVersion("Current");
    setViewingHistorical(false);
  }, [context.tenantName, context.property]);

  useEffect(() => {
    onDraftReady?.();
  }, [onDraftReady]);

  const handleDocModeChange = (next: DocMode) => {
    setDocMode(next);
    if (next === "preview") {
      setVersionsOpen(false);
    } else {
      setVersionsOpen(true);
    }
  };

  const tabs: { id: ReviewTab; label: string }[] = [
    { id: "analysis", label: "Analysis" },
    { id: "live-status", label: "Live Status" },
    { id: "lease-proposal", label: "Lease Proposal" },
  ];

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex h-12 items-end gap-0 border-b border-[#E6E8EB]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex h-12 items-center px-4 text-[16px] font-medium leading-[1.5] transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-[#121212] text-[#2E3033]"
                : "text-[#65686B] hover:text-[#353638]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== "lease-proposal" ? (
        <div
          className={cn(
            "rounded-xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-8 text-center",
            "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
          )}
        >
          <p className="text-[14px] text-[#65686B]">
            {activeTab === "analysis"
              ? "Negotiation analysis is available on the Lease Proposal step."
              : "Live status tracking is available on the Lease Proposal step."}
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("lease-proposal")}
            className="mt-3 text-[14px] font-medium text-[#233FDE] hover:underline"
          >
            Go to Lease Proposal
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-4 overflow-hidden rounded-xl bg-[rgba(255,255,255,0.8)] px-6 pb-6 pt-4",
            "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="typo-h4 text-[#353638]">Lease Proposal</p>

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:justify-center">
              {viewingHistorical ? (
                <>
                  <History className="size-4 shrink-0 text-[#65686B]" aria-hidden />
                  <span className="text-[14px] text-[#65686B]">Viewing previous version</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVersion("Current");
                      setViewingHistorical(false);
                    }}
                    className="inline-flex items-center gap-1 text-[14px] font-medium text-[#2C2C2C] hover:underline"
                  >
                    Go to latest
                    <ArrowRight className="size-4" />
                  </button>
                </>
              ) : null}
            </div>

            <EditPreviewToggle mode={docMode} onChange={handleDocModeChange} />
          </div>

          <div className="flex min-h-[520px] gap-4">
            <div
              className={cn(
                "flex shrink-0 flex-col gap-4 overflow-hidden transition-[width,opacity] duration-300 ease-out",
                versionsOpen && docMode === "edit" ? "w-[208px] opacity-100" : "w-0 opacity-0",
              )}
            >
              <div className="flex w-[208px] flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-[34px] bg-[#FBF2DC] px-2 py-1 text-[14px] font-medium text-[#E7B65A]">
                    Draft
                  </span>
                  <button
                    type="button"
                    onClick={() => setVersionsOpen(false)}
                    className="flex size-8 items-center justify-center rounded-lg text-[#353638] hover:bg-[#F2F4F7]"
                    aria-label="Collapse versions panel"
                  >
                    <PanelLeftClose className="size-5" />
                  </button>
                </div>
                <p className="text-[12px] text-[#65686B]">{meta.updatedLabel}</p>

                <div className="space-y-0.5">
                  <p className="h-8 text-[14px] text-[#65686B]">Versions</p>
                  {LEASE_PROPOSAL_DOCUMENT_VERSIONS.map((v) => (
                    <button
                      key={v.label}
                      type="button"
                      onClick={() => {
                        setSelectedVersion(v.label);
                        setViewingHistorical(v.label !== "Current");
                      }}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded-lg px-2 text-left text-[14px] transition-colors",
                        selectedVersion === v.label
                          ? "bg-[rgba(230,231,232,0.7)] font-medium text-[#111111]"
                          : "text-[#353638] hover:bg-[#F2F4F7]",
                      )}
                    >
                      <span>{v.label}</span>
                      {v.date ? (
                        <span className="flex items-center gap-1 text-[12px] text-[#65686B]">
                          <Clock className="size-3.5" />
                          {v.date}
                        </span>
                      ) : null}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="h-8 w-full rounded-lg px-2 text-left text-[12px] font-medium text-[#353638] hover:bg-[#F2F4F7]"
                  >
                    See all versions
                  </button>
                </div>
              </div>
            </div>

            {docMode === "edit" && !versionsOpen ? (
              <button
                type="button"
                onClick={() => setVersionsOpen(true)}
                className="flex h-8 shrink-0 items-center gap-1 self-start rounded-lg border border-[#E6E8EB] px-2 text-[12px] font-medium text-[#65686B] hover:bg-[#F2F4F7]"
              >
                <PanelLeftOpen className="size-4" />
                Versions
              </button>
            ) : null}

            <div
              className={cn(
                "custom-scrollbar relative min-h-[520px] min-w-0 flex-1 overflow-y-auto rounded-xl border border-[#E6E8EB] bg-[#F2F4F7] py-6",
                docMode === "preview" && "shadow-[inset_0_0_20px_rgba(0,0,0,0.08)]",
              )}
            >
              {docMode === "preview" ? (
                <ProposalDocumentPreview context={context} fields={fields} />
              ) : (
                <ProposalDocumentEditor fields={fields} onChange={setFields} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
