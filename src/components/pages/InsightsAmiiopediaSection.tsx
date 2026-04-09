"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { FileText, Lightbulb, Link2, Plus, Sparkles, Upload } from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AmiioSummaryTypewriterParts } from "@/src/components/commercial/AmiioSummaryTypewriter";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";

const CARD_CLASS = cn(
  "flex flex-col gap-4 rounded-[30px] border border-[rgba(230,231,232,0.7)] p-5 text-left",
  amiioCardHoverSurface,
);

const CARD_SURFACE: CSSProperties = {
  backgroundImage:
    "linear-gradient(-88.59deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
};

const SECTION_LABEL =
  "text-[13px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]";

type KnowledgeStatus = "indexed" | "processing";
type KnowledgeKind = "pdf" | "link";

const KNOWLEDGE_SEED: {
  id: string;
  kind: KnowledgeKind;
  title: string;
  meta: string;
  status: KnowledgeStatus;
  detail: string;
}[] = [
  {
    id: "k1",
    kind: "pdf",
    title: "UK Commercial Property Outlook Q3 2025",
    meta: "JLL · 48 pages · 3 days ago",
    status: "indexed",
    detail:
      "Macro view on UK investment volumes, yield shifts, and sector rotation. Amiio uses this to benchmark rent and cap-rate narratives against your portfolio regions.",
  },
  {
    id: "k2",
    kind: "link",
    title: "ECB interest rate commentary — office pricing",
    meta: "Reuters · Article · 1 week ago",
    status: "indexed",
    detail:
      "Short-form rates commentary with implications for refinancing and exit yields. Cross-linked to debt covenants and lease indexation clauses in your knowledge graph.",
  },
  {
    id: "k3",
    kind: "pdf",
    title: "Retail footfall benchmarks — North West",
    meta: "Internal upload · 12 pages · Processing",
    status: "processing",
    detail:
      "Footfall indices and trading density benchmarks for regional retail. Indexing will complete shortly; partial embeddings are already available for Manchester and Liverpool catchments.",
  },
];

const FEED_SEED: {
  id: string;
  name: string;
  state: "live" | "partial" | "offline";
  pct: number;
  detail: string;
}[] = [
  {
    id: "f1",
    name: "CoStar Analytics",
    state: "live",
    pct: 100,
    detail:
      "Live lease comps and availability feeds for UK office and industrial. Amiio reconciles weekly with your rent-roll for variance alerts.",
  },
  {
    id: "f2",
    name: "MSCI / IPD",
    state: "partial",
    pct: 72,
    detail:
      "Partial coverage: quarterly index returns ingested; asset-level attribution still pending for two funds. Expected full sync next data drop.",
  },
  {
    id: "f3",
    name: "Eurostat regional GDP",
    state: "offline",
    pct: 0,
    detail:
      "Scheduled maintenance on the provider API. Historical series remain queryable; no refresh until the connection is restored.",
  },
];

const DATA_ROOM_SEED: {
  id: string;
  title: string;
  kind: "report" | "memo" | "model";
  updated: string;
  detail: string;
}[] = [
  {
    id: "dr1",
    title: "Debt covenant pack — Q1 2026",
    kind: "report",
    updated: "Updated 2 hours ago",
    detail:
      "Latest covenant dashboard, lender commentary, and sensitivity outputs compiled for IC review.",
  },
  {
    id: "dr2",
    title: "Asset strategy memo — Manchester",
    kind: "memo",
    updated: "Updated yesterday",
    detail:
      "Hold/sell rationale, leasing assumptions, and capex sequencing notes linked to current market signals.",
  },
  {
    id: "dr3",
    title: "Portfolio forecast model — 2026",
    kind: "model",
    updated: "Updated 3 days ago",
    detail:
      "Scenario model with base/upside/downside outputs used by Amiio narratives across financial and commercial views.",
  },
];

const SIGNAL_SEED: {
  id: string;
  title: string;
  tone: "stable" | "caution" | "opportunity" | "regulatory";
  summary: string;
  sources: string;
  detail: string;
  border: string;
  pill: string;
}[] = [
  {
    id: "s1",
    title: "UK Office Demand",
    tone: "stable",
    summary:
      "Take-up in core CBDs held steady vs Q2; flight-to-quality continues to favour Grade A with strong ESG credentials.",
    sources: "JLL Q3 2025, CoStar",
    detail:
      "Amiio synthesised JLL and CoStar to flag stable national demand with localized softness in secondary stock. Useful for renewal pricing and capex prioritisation.",
    border: "border-l-[var(--Tertiary-600)]",
    pill: "bg-[#EBEDF9] text-[#233FDE]",
  },
  {
    id: "s2",
    title: "Industrial logistics yields",
    tone: "caution",
    summary:
      "Yield compression paused in several hubs; monitor refinancing windows where LTV covenants are tight.",
    sources: "MSCI, internal debt model",
    detail:
      "Signals lean cautious on short-term yield moves; align with your debt schedule and upcoming refinancings.",
    border: "border-l-[#E7B65A]",
    pill: "bg-[#FBF2DC] text-[#B07D12]",
  },
  {
    id: "s3",
    title: "Green retrofit incentives",
    tone: "opportunity",
    summary:
      "New subsidy pathways for retrofit bundles may improve payback on selected assets — worth a portfolio screen.",
    sources: "Policy brief, EU taxonomy notes",
    detail:
      "Opportunity narrative extracted from policy PDFs and taxonomy guidance. Amiio can rank assets by retrofit ROI vs incentive eligibility.",
    border: "border-l-[var(--Secondary-600)]",
    pill: "bg-[#E6F6F3] text-[#146B3A]",
  },
  {
    id: "s4",
    title: "Corporate transparency filings",
    tone: "regulatory",
    summary:
      "Upcoming disclosure rules may affect how tenant covenants are monitored — legal review recommended for cross-border leases.",
    sources: "Regulatory digest",
    detail:
      "Regulatory scan highlights filing changes that intersect with lease monitoring. Pair with legal workflow for affected entities.",
    border: "border-l-[#7B8CEB]",
    pill: "bg-[#EEF0FF] text-[#1B32B3]",
  },
];

const REGIONS = [
  "United Kingdom",
  "Manchester",
  "London",
  "Germany",
  "Netherlands",
  "Ireland",
] as const;

function statusBadge(status: KnowledgeStatus) {
  if (status === "indexed") {
    return (
      <span className="shrink-0 rounded-full bg-[#E6F6F3] px-2.5 py-1 text-[11px] font-semibold text-[#1F9E8B]">
        Indexed
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-[#FBF2DC] px-2.5 py-1 text-[11px] font-semibold text-[#E7B65A]">
      Processing
    </span>
  );
}

function feedBarClass(state: "live" | "partial" | "offline") {
  if (state === "live") return "bg-[var(--Secondary-600)]";
  if (state === "partial") return "bg-[#E7B65A]";
  return "bg-[var(--Neutral-300)]";
}

function RegionFocusDetail({
  expanded,
  onToggle,
  selectedLabels,
}: {
  expanded: boolean;
  onToggle: () => void;
  selectedLabels: string;
}) {
  const detail =
    "Amiio External Knowledge Base weights external documents and feeds by your region focus. Selected geographies raise relevance scores for market commentary, comps, and regulatory sources tied to those markets.";

  return (
    <div className="border-t border-[rgba(230,231,232,0.7)] pt-3.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 text-left text-[12px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
      >
        <span>How region focus is applied</span>
        <span className="tabular-nums text-[#969A9E]">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? (
        <div className="mt-2.5 rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#F3F4F6] p-2.5">
          <p className="text-[11px] leading-[1.45] text-[#353638]">{detail}</p>
          <p className="mt-1.5 text-[10px] text-[#65686B]">
            Active: {selectedLabels || "None"}
          </p>
          <div className="mt-3 flex justify-end">
            <AnalyseWithAmiioButton
              topic={`Amiio External Knowledge Base — region focus\n\n${detail}\n\nActive regions: ${selectedLabels || "none"}.`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AnalyseWithAmiioButton({
  topic,
  className,
}: {
  topic: string;
  className?: string;
}) {
  const inject = useCommercialChatInject();

  const onClick = useCallback(() => {
    const prompt = `Analyse with Amiio — Amiio External Knowledge Base:\n\n${topic}`;
    if (inject) inject(prompt);
    else
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Open chat to analyse with Amiio" },
        }),
      );
  }, [inject, topic]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-[#D1D5D9] bg-white px-3 text-[12px] font-medium leading-tight text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]",
        className,
      )}
    >
      <Lightbulb className="size-3.5 shrink-0 text-[#7E8185]" strokeWidth={1.8} />
      Analyse with Amiio
    </button>
  );
}

export function InsightsAmiiopediaSection({
  onOpenManageInsights,
}: {
  onOpenManageInsights?: () => void;
}) {
  const inject = useCommercialChatInject();
  const [urlDraft, setUrlDraft] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [activeSignalAnalyseId, setActiveSignalAnalyseId] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(
    () => new Set(["United Kingdom", "Manchester", "London"]),
  );

  const toggleRegion = (r: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const toggleExpand = (key: string) => {
    setExpandedKey((k) => (k === key ? null : key));
  };

  const indexedKnowledgeCount = KNOWLEDGE_SEED.filter((item) => item.status === "indexed").length;
  const processingKnowledgeCount = KNOWLEDGE_SEED.filter(
    (item) => item.status === "processing",
  ).length;
  const connectedFeedCount = FEED_SEED.filter((feed) => feed.state !== "offline").length;
  const totalSignals = SIGNAL_SEED.length;
  const selectedRegionCount = selectedRegions.size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[22px] font-semibold leading-tight tracking-tight text-[#010309]">
            Amiio External Knowledge Base
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-[#020410] px-4 text-[13px] font-medium text-white shadow-[0px_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: "Add source" } }),
            )
          }
        >
          <Plus className="size-4" strokeWidth={2} />
          Add Source
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          if (onOpenManageInsights) onOpenManageInsights();
          else {
            window.dispatchEvent(
              new CustomEvent("amiio:toast", {
                detail: { message: "Open Manage Insights" },
              }),
            );
          }
        }}
        className={cn(
          "relative w-full rounded-2xl border border-[rgba(230,231,232,0.85)] bg-[rgba(255,255,255,0.92)] p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          amiioCardHoverSurface,
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WidgetHeaderLamp
              className="h-7 w-7"
              chatLabel="Amiio's Knowledge Summary"
              chatTopic="Summarise Amiio External Knowledge Base coverage, indexing progress, and region focus implications."
            />
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="size-5 shrink-0 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <span className="text-[16px] font-semibold text-[#010309]">
              Amiio&apos;s Knowledge Summary
            </span>
          </div>
          <span className="text-[12px] text-[#969A9E]">
            {indexedKnowledgeCount} indexed · {totalSignals} market signals
          </span>
        </div>
        <p className="text-[14px] leading-[1.65] text-[#353638]">
          <AmiioSummaryTypewriterParts
            charDelayMs={7}
            parts={[
              { text: "Amiio External Knowledge Base is currently tracking " },
              { text: String(indexedKnowledgeCount), className: "font-semibold text-[#010309]" },
              { text: " indexed knowledge sources with " },
              {
                text: String(processingKnowledgeCount),
                className: "font-semibold text-[#E7B65A]",
              },
              { text: " still processing. " },
              {
                text: `${connectedFeedCount} external feeds`,
                className: "font-semibold text-[#233FDE]",
              },
              { text: " are connected and " },
              {
                text: `${selectedRegionCount} regions`,
                className: "font-semibold text-[#1B32B3]",
              },
              {
                text: " are prioritized for relevance scoring. Open Manage Insights for full drill-down and actions.",
              },
            ]}
          />
        </p>
      </button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className={CARD_CLASS} style={CARD_SURFACE}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={SECTION_LABEL}>Knowledge library</h3>
            <button
              type="button"
              className="text-[12px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "Manage all sources" } }),
                )
              }
            >
              Manage all
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[rgba(230,231,232,0.9)] rounded-2xl border border-[rgba(230,231,232,0.7)] bg-white/80">
            {KNOWLEDGE_SEED.map((row) => {
              const key = `lib-${row.id}`;
              const open = expandedKey === key;
              return (
                <div key={row.id} className="text-left">
                  <button
                    type="button"
                    onClick={() => toggleExpand(key)}
                  className="flex w-full items-start gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-[#F7F8FA]/90"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                        row.kind === "pdf" ? "bg-[#FBEAEC] text-[#C65A66]" : "bg-[#EBEDF9] text-[#233FDE]",
                      )}
                    >
                      {row.kind === "pdf" ? (
                        <FileText className="size-4" strokeWidth={1.5} />
                      ) : (
                        <Link2 className="size-4" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#010309]">{row.title}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-[#65686B]">{row.meta}</p>
                    </div>
                    {statusBadge(row.status)}
                  </button>
                  {open ? (
                    <div className="border-t border-[rgba(230,231,232,0.7)] bg-[#F3F4F6] px-3.5 py-2.5 sm:pl-[46px]">
                      <p className="text-[11px] leading-[1.45] text-[#353638]">{row.detail}</p>
                      <div className="mt-3 flex justify-end">
                        <AnalyseWithAmiioButton
                          topic={`Knowledge: ${row.title}\n\n${row.detail}`}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="Paste URL or article link…"
              className="h-10 min-w-0 flex-1 rounded-xl border border-[#D1D5D9] bg-white px-3 text-[13px] text-[#353638] outline-none placeholder:text-[#969A9E] focus:border-[#233FDE] focus:ring-2 focus:ring-[#233FDE]/20"
            />
            <button
              type="button"
              className="h-10 shrink-0 rounded-xl bg-[#010309] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#040718]"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", {
                    detail: { message: urlDraft.trim() ? "Link queued" : "Paste a URL first" },
                  }),
                );
              }}
            >
              Add
            </button>
          </div>

          <button
            type="button"
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D1D5D9] bg-[#FAFBFC] px-5 py-8 text-center transition-colors hover:border-[#233FDE]/40 hover:bg-[#F4F5FC]/80"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("amiio:toast", { detail: { message: "Upload files" } }),
              )
            }
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[#EBEDF9] text-[#233FDE]">
              <Upload className="size-5" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-medium text-[#353638]">Drop files to upload</p>
            <p className="text-[11px] text-[#65686B]">PDF, XLSX, DOCX, CSV supported</p>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className={CARD_CLASS} style={CARD_SURFACE}>
            <h3 className={SECTION_LABEL}>Region focus</h3>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => {
                const on = selectedRegions.has(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRegion(r)}
                    className={cn(
                      "rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                      on
                        ? "border-[#010309] bg-[#010309] text-white"
                        : "border-[#E6E8EB] bg-white text-[#4E4F52] hover:border-[#D1D5D9]",
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
            <RegionFocusDetail
              expanded={expandedKey === "region-focus"}
              onToggle={() => toggleExpand("region-focus")}
              selectedLabels={[...selectedRegions].join(", ")}
            />
          </div>

          <div className={CARD_CLASS} style={CARD_SURFACE}>
            <h3 className={SECTION_LABEL}>External feeds</h3>
            <div className="flex flex-col gap-3.5">
              {FEED_SEED.map((f) => {
                const key = `feed-${f.id}`;
                const open = expandedKey === key;
                return (
                  <div key={f.id} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => toggleExpand(key)}
                      className="flex w-full items-center justify-between gap-2 text-left"
                    >
                      <span className="text-[13px] font-medium text-[#353638]">{f.name}</span>
                      <span className="shrink-0 text-[11px] font-medium capitalize text-[#65686B]">
                        {f.state === "live" ? "Live" : f.state === "partial" ? "Partial" : "Offline"}
                      </span>
                    </button>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-[var(--Neutral-200)]"
                      aria-hidden
                    >
                      <div
                        className={cn("h-full rounded-full transition-all", feedBarClass(f.state))}
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    {open ? (
                      <div className="rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#F3F4F6] p-2.5">
                        <p className="text-[11px] leading-[1.45] text-[#353638]">{f.detail}</p>
                        <div className="mt-3 flex justify-end">
                          <AnalyseWithAmiioButton
                            topic={`External feed: ${f.name}\n\n${f.detail}`}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={CARD_CLASS} style={CARD_SURFACE}>
            <div className="flex items-center justify-between gap-2">
              <h3 className={SECTION_LABEL}>Data room</h3>
              <button
                type="button"
                className="text-[12px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("amiio:toast", { detail: { message: "Open data room" } }),
                  )
                }
              >
                Open
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {DATA_ROOM_SEED.map((row) => {
                const key = `data-room-${row.id}`;
                const open = expandedKey === key;
                return (
                  <div key={row.id} className="rounded-xl border border-[rgba(230,231,232,0.8)] bg-white/80">
                    <button
                      type="button"
                      onClick={() => toggleExpand(key)}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#F7F8FA]/90"
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#676A6E]">
                        <FileText className="size-3.5" strokeWidth={1.7} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-[#010309]">{row.title}</p>
                        <p className="mt-0.5 text-[10px] text-[#7E8185]">
                          {row.kind} · {row.updated}
                        </p>
                      </div>
                    </button>
                    {open ? (
                      <div className="border-t border-[rgba(230,231,232,0.7)] bg-[#F3F4F6] px-3 py-2.5">
                        <p className="text-[11px] leading-[1.45] text-[#353638]">{row.detail}</p>
                        <div className="mt-2.5 flex justify-end">
                          <AnalyseWithAmiioButton topic={`Data room item: ${row.title}\n\n${row.detail}`} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className={cn(SECTION_LABEL, "mb-3 inline-flex items-center gap-2")}>
          <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
            <Sparkles className="size-4 text-[#010309]" aria-hidden />
          </AmiioAiDisclaimerTrigger>
          AI market signals
        </h3>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {SIGNAL_SEED.map((sig) => {
            const showAnalyse = activeSignalAnalyseId === sig.id;
            return (
              <div
                key={sig.id}
                className={cn(
                  "relative overflow-visible rounded-2xl border border-[rgba(230,231,232,0.7)] border-l-4 bg-white/95 text-left",
                  amiioCardHoverSurface,
                  sig.border,
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveSignalAnalyseId((id) => (id === sig.id ? null : sig.id))
                  }
                  className="flex w-full flex-col gap-1.5 p-3.5 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[#010309]">{sig.title}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                        sig.pill,
                      )}
                    >
                      {sig.tone === "stable"
                        ? "Stable"
                        : sig.tone === "caution"
                          ? "Caution"
                          : sig.tone === "opportunity"
                            ? "Opportunity"
                            : "Regulatory"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-[1.45] text-[#353638]">{sig.summary}</p>
                  <p className="text-[10px] text-[#969A9E]">{sig.sources}</p>
                </button>
                {showAnalyse ? (
                  <div className="pointer-events-none absolute -bottom-11 left-3 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const prompt = `Analyse with Amiio — Amiio External Knowledge Base market signal:\n\n${sig.title}\n${sig.summary}\n\n${sig.detail}`;
                        if (inject) inject(prompt);
                        else
                          window.dispatchEvent(
                            new CustomEvent("amiio:toast", {
                              detail: { message: "Open chat to analyse with Amiio" },
                            }),
                          );
                      }}
                      className="pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-[#D1D5D9] bg-white px-3 text-[12px] font-medium text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]"
                    >
                      <Lightbulb className="size-3.5 text-[#7E8185]" strokeWidth={1.8} />
                      <span>Analyse with Amiio</span>
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
