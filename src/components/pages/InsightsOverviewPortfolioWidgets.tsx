"use client";

import type { CSSProperties, ReactNode } from "react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";

/**
 * Core Design System — Desktop-Comfort card chrome (matches Insights chart cards).
 * @see https://www.figma.com/design/X14IcrYNLuva2EZe8lGiD1/Core-Design-System?node-id=147-7300
 * Chart bar fills: Tertiary “Charts variations” + Secondary base + Alert gradient warm end (node 35-1936).
 * Elevation/L1: 0 2 12 #0000000F
 */
const WIDGET_CARD_CLASS = cn(
  "flex flex-col gap-5 rounded-[35px] border border-[rgba(230,231,232,0.7)] p-6 text-left",
  amiioCardHoverSurface,
);

const WIDGET_CARD_SURFACE: CSSProperties = {
  backgroundImage:
    "linear-gradient(-88.59deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
};

function SummaryCardShell({
  title,
  onDetails,
  lampChatLabel,
  lampChatTopic,
  children,
}: {
  title: string;
  onDetails: () => void;
  lampChatLabel: string;
  lampChatTopic: string;
  children: ReactNode;
}) {
  return (
    <div className={WIDGET_CARD_CLASS} style={WIDGET_CARD_SURFACE}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-[20px] font-medium leading-[1.25] text-[#353638]">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-2">
          <WidgetHeaderLamp chatLabel={lampChatLabel} chatTopic={lampChatTopic} />
          <button
            type="button"
            onClick={onDetails}
            className="typo-l2-b shrink-0 text-[var(--Tertiary-600)] underline-offset-2 transition-colors hover:text-[var(--Tertiary-800)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Details →
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function MetricBox({
  label,
  value,
  valueTone,
}: {
  label: string;
  value: string;
  valueTone: "success" | "neutral" | "warning" | "primary";
}) {
  const valueClass =
    valueTone === "success"
      ? "text-[var(--Secondary-900)]"
      : valueTone === "warning"
        ? "text-[#b07d12]"
        : valueTone === "primary"
          ? "text-[var(--Primary-1100)]"
          : "text-[var(--Neutral-900)]";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-2xl border border-[rgba(230,231,232,0.7)] bg-white/95 px-3 py-2.5",
        amiioCardHoverSurface,
      )}
    >
      <span className="typo-l3-r text-[var(--Neutral-600)]">{label}</span>
      <span
        className={cn(
          "typo-l2-b truncate tabular-nums leading-tight",
          valueClass,
        )}
      >
        {value}
      </span>
    </div>
  );
}

type BarTone = "tertiary" | "success" | "warning" | "primary";

/** Figma Core DS — Tertiary #233FDE; Secondary #86C5CE; Primary #303552 (distinct segment); warning ~#EBBD65 */
function portfolioBarFillClass(tone: BarTone): string {
  if (tone === "tertiary") return "bg-[var(--Tertiary-600)]";
  if (tone === "success") return "bg-[var(--Secondary-600)]";
  if (tone === "primary") return "bg-[var(--Primary-500)]";
  return "bg-[#ebbd65]";
}

function ProgressRow({
  label,
  right,
  pct,
  tone,
}: {
  label: string;
  right: string;
  pct: number;
  tone: BarTone;
}) {
  const w = Math.min(100, Math.max(0, pct));
  const fillClass = portfolioBarFillClass(tone);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <span className="typo-l2-b min-w-0 text-[var(--Neutral-900)]">
          {label}
        </span>
        <span className="typo-l2-b shrink-0 tabular-nums text-[var(--Neutral-900)]">
          {right}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--Neutral-200)]"
        role="progressbar"
        aria-valuenow={Math.round(w)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", fillClass)}
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

export function InsightsFinancialSummaryCard({
  onDetails,
}: {
  onDetails: () => void;
}) {
  return (
    <SummaryCardShell
      title="Financial summary"
      onDetails={onDetails}
      lampChatLabel="Financial summary"
      lampChatTopic="Summarise portfolio financial KPIs: gross revenue, costs, NOI margin, budget variance, service charge recovery, capex, and debt service coverage."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
        <MetricBox label="Gross revenue" value="€8.4M" valueTone="success" />
        <MetricBox label="Total costs" value="€4.2M" valueTone="neutral" />
        <MetricBox label="NOI margin" value="50.1%" valueTone="success" />
        <MetricBox label="vs budget" value="+2.3%" valueTone="warning" />
      </div>
      <div className="flex flex-col gap-5 border-t border-[rgba(230,231,232,0.7)] pt-5">
        <ProgressRow
          label="Service charge recovery"
          right="87%"
          pct={87}
          tone="tertiary"
        />
        <ProgressRow
          label="Capital expenditure"
          right="€680k / €900k"
          pct={(680 / 900) * 100}
          tone="warning"
        />
        <ProgressRow
          label="Debt service coverage"
          right="1.8x"
          pct={Math.min(100, (1.8 / 2.2) * 100)}
          tone="success"
        />
      </div>
    </SummaryCardShell>
  );
}

export function InsightsCommercialSummaryCard({
  onDetails,
}: {
  onDetails: () => void;
}) {
  return (
    <SummaryCardShell
      title="Commercial summary"
      onDetails={onDetails}
      lampChatLabel="Commercial summary"
      lampChatTopic="Summarise commercial KPIs: occupancy, WAULT, average rent per m², near-term expiries, and segment occupancy (office, retail, industrial)."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
        <MetricBox label="Occupancy" value="94.7%" valueTone="success" />
        <MetricBox label="WAULT" value="6.4 yrs" valueTone="neutral" />
        <MetricBox label="Avg rent / m²" value="€232" valueTone="primary" />
        <MetricBox label="Expiring ≤90d" value="3" valueTone="warning" />
      </div>
      <div className="flex flex-col gap-5 border-t border-[rgba(230,231,232,0.7)] pt-5">
        <ProgressRow label="Office" right="97%" pct={97} tone="tertiary" />
        <ProgressRow label="Retail" right="91%" pct={91} tone="primary" />
        <ProgressRow label="Industrial" right="100%" pct={100} tone="success" />
      </div>
    </SummaryCardShell>
  );
}
