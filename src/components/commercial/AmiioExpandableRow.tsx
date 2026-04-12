"use client";

import { useId, useState, type ReactNode } from "react";
import { CheckCircle2, Clock, Lightbulb, Pencil } from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { AmiioSummaryTypewriterText } from "@/src/components/commercial/AmiioSummaryTypewriter";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";

/** Two-column body from Figma: Full description + Recent actions */
export function AmiioExpandedDetailGrid({
  fullDescription,
  recentActionLines,
  emptyActionsFallback,
  className,
  onAnalyseWithAmiio,
  analyseChatTopic,
  showAnalyseWithAmiioButton = true,
}: {
  fullDescription: string;
  recentActionLines: string[];
  emptyActionsFallback?: ReactNode;
  className?: string;
  /** When set, invoked by the bottom-right “Analyse with Amiio” control. */
  onAnalyseWithAmiio?: () => void;
  /** Default chat seed when `onAnalyseWithAmiio` is omitted and chat inject is available. */
  analyseChatTopic?: string;
  /** Hide the bottom analyse button for specific contexts. */
  showAnalyseWithAmiioButton?: boolean;
}) {
  const inject = useCommercialChatInject();
  const paragraphs = fullDescription
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const handleAnalyseWithAmiio = () => {
    if (onAnalyseWithAmiio) {
      onAnalyseWithAmiio();
      return;
    }
    const topic =
      analyseChatTopic ??
      "Help me interpret this expanded detail in the context of my portfolio.";
    if (inject) inject(topic);
    else
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Open chat to analyse with Amiio" },
        }),
      );
  };

  return (
    <div
      className={cn(
        "border-t border-[#E6E8EB] bg-[#F3F4F6] px-4 py-3 sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-[#676A6E]">
            Full description
          </p>
          <div className="mt-1.5 space-y-2 text-[12px] leading-[1.45] text-[#353638]">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-[#676A6E]">
            Recent actions
          </p>
          <div className="mt-1.5 text-[12px] leading-[1.45] text-[#353638]">
            {recentActionLines.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-4">
                {recentActionLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              (emptyActionsFallback ?? (
                <p className="text-[11px] leading-[1.45] text-[#676A6E]">
                  No actions have been logged for this item yet. Use{" "}
                  <span className="font-medium text-[#353638]">Analyse further</span>{" "}
                  above to generate next steps in Amiio.
                </p>
              ))
            )}
          </div>
        </div>
      </div>
      {showAnalyseWithAmiioButton ? (
        <div className="mt-3 flex justify-end border-t border-[#E6E8EB] pt-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAnalyseWithAmiio();
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#D1D5D9] bg-white px-3.5 text-[13px] font-medium leading-tight text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]"
          >
            <Lightbulb className="size-4 shrink-0 text-[#7E8185]" strokeWidth={1.8} />
            Analyse with Amiio
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Lightbulb insight row — Property / Tenant Amiio summaries */
export function AmiioExpandableInsightRow({
  summary,
  when,
  fullDescription,
  recentActionLines,
  onAnalyseFurther,
  typewriterStartDelayMs = 0,
  useTypewriterSummary = true,
  hideExpandedAnalyseButton = false,
  className,
}: {
  summary: string;
  when: string;
  fullDescription: string;
  recentActionLines: string[];
  onAnalyseFurther?: (topic: string) => void;
  typewriterStartDelayMs?: number;
  /** When false, summary text shows immediately (e.g. Property / Tenant summary sections). */
  useTypewriterSummary?: boolean;
  /** Hide bottom-right button in expanded panel for summary cards. */
  hideExpandedAnalyseButton?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowId = useId();

  const toggle = () => setOpen((o) => !o);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB]",
        amiioCardHoverSurface,
        className,
      )}
    >
      <div className="flex min-h-[72px] w-full min-w-0 items-stretch">
        <div
          id={rowId}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-2 pl-4 pr-2 transition-colors hover:bg-[#F2F4F7]/80 sm:gap-3"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#010309] shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
            <Lightbulb className="h-4 w-4 text-white" aria-hidden />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            {useTypewriterSummary ? (
              <AmiioSummaryTypewriterText
                text={summary}
                className="pointer-events-none min-w-0 text-[14px] leading-[1.4] text-[#353638]"
                charDelayMs={8}
                startDelayMs={typewriterStartDelayMs}
              />
            ) : (
              <span className="pointer-events-none min-w-0 text-[14px] leading-[1.4] text-[#353638]">
                {summary}
              </span>
            )}
            <span className="shrink-0 text-[12px] font-medium leading-5 text-[#7E8185] sm:w-[112px]">
              {when}
            </span>
          </div>
        </div>
        <div
          className="flex w-[120px] shrink-0 items-center p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="rounded-lg border border-[#B3B8BD] px-1.5 py-1 text-[12px] font-medium leading-[1.25] text-[#111] transition-colors hover:bg-[#F0F2F5]"
            onClick={() => onAnalyseFurther?.(summary)}
          >
            Analyse further
          </button>
        </div>
      </div>
      {open ? (
        <div id={panelId} role="region" aria-labelledby={rowId}>
          <AmiioExpandedDetailGrid
            fullDescription={fullDescription}
            recentActionLines={recentActionLines}
            onAnalyseWithAmiio={
              onAnalyseFurther ? () => onAnalyseFurther(summary) : undefined
            }
            analyseChatTopic={
              onAnalyseFurther ? undefined : `Analyse insight: ${summary}`
            }
            showAnalyseWithAmiioButton={!hideExpandedAnalyseButton}
          />
        </div>
      ) : null}
    </div>
  );
}

type RecentStatus = "Completed" | "Draft" | "Pending";

/** Recent-actions table row — matches Property Hub / Insights Overview layout */
export function AmiioExpandableRecentActionRow({
  actionIcon: ActionIcon,
  actionIconBg,
  title,
  initials,
  avatarBg,
  person,
  time,
  status,
  fullDescription,
  recentActionLines,
  onNavigate,
  navigateLabel = "Open related workspace",
  className,
}: {
  actionIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  actionIconBg: string;
  title: string;
  initials: string;
  avatarBg: string;
  person: string;
  time: string;
  status: RecentStatus;
  fullDescription: string;
  recentActionLines: string[];
  onNavigate?: () => void;
  navigateLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowId = useId();

  const toggle = () => setOpen((o) => !o);

  const statusChip =
    status === "Completed" ? (
      <div className="inline-flex items-start gap-2 rounded-2xl bg-[#E6F6F3] px-2 py-1">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1F9E8B]" aria-hidden />
        <span className="text-[12px] font-medium leading-[1.25] text-[#1F9E8B]">Completed</span>
      </div>
    ) : status === "Draft" ? (
      <div className="inline-flex items-start gap-2 rounded-2xl bg-[#FBF2DC] px-2 py-1">
        <Pencil className="h-4 w-4 shrink-0 text-[#E7B65A]" aria-hidden />
        <span className="text-[12px] font-medium leading-[1.25] text-[#E7B65A]">Draft</span>
      </div>
    ) : (
      <div className="inline-flex items-start gap-2 rounded-2xl bg-amber-100 px-2 py-1">
        <Clock className="h-4 w-4 shrink-0 text-amber-800" aria-hidden />
        <span className="text-[12px] font-medium leading-[1.25] text-amber-800">Pending</span>
      </div>
    );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB]",
        amiioCardHoverSurface,
        className,
      )}
    >
      <div
        id={rowId}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="flex min-h-[72px] w-full min-w-0 cursor-pointer items-stretch transition-colors hover:bg-[#F2F4F7]/80"
      >
        <div className="flex min-h-0 min-w-0 flex-1 items-center gap-2 py-2 pl-4 pr-2">
          <div
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full shadow-[0px_2px_6px_rgba(0,0,0,0.15)]",
              actionIconBg,
            )}
          >
            <ActionIcon className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>
          <p className="min-w-0 flex-1 truncate text-left text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">
            {title}
          </p>
        </div>
        <div className="flex h-14 w-[160px] shrink-0 items-center p-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-normal leading-[1.24] text-white",
                avatarBg,
              )}
            >
              {initials}
            </div>
            <span className="min-w-0 flex-1 truncate text-[12px] font-normal leading-[1.24] text-[#676A6E]">
              {person}
            </span>
          </div>
        </div>
        <div className="flex h-14 w-[112px] shrink-0 items-center p-2">
          <span className="whitespace-nowrap text-[12px] font-medium leading-5 text-[#7E8185]">
            {time}
          </span>
        </div>
        <div className="flex h-14 w-[120px] shrink-0 items-center justify-end p-2 pr-4 sm:pr-5">
          {statusChip}
        </div>
      </div>
      {open ? (
        <div id={panelId} role="region" aria-labelledby={rowId}>
          <AmiioExpandedDetailGrid
            fullDescription={fullDescription}
            recentActionLines={recentActionLines}
            analyseChatTopic={`Review this recent action: ${title}`}
          />
          {onNavigate ? (
            <div className="border-t border-[#E6E8EB] bg-[#F3F4F6] px-4 pb-4 sm:px-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
                className="text-[13px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
              >
                {navigateLabel} →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Tenant Hub compact recent-action row (title + subtitle + status) */
export function AmiioExpandableTenantRecentRow({
  title,
  who,
  when,
  status,
  fullDescription,
  recentActionLines,
  icon: Icon,
  onNavigate,
  navigateLabel = "Open related workspace",
  className,
}: {
  title: string;
  who: string;
  when: string;
  status: "Completed" | "Pending";
  fullDescription: string;
  recentActionLines: string[];
  icon: React.ComponentType<{ className?: string }>;
  /** Shown below the detail grid (e.g. open leasing workspace). */
  onNavigate?: () => void;
  navigateLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowId = useId();
  const isCompleted = status === "Completed";
  const toggle = () => setOpen((o) => !o);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB]",
        amiioCardHoverSurface,
        className,
      )}
    >
      <div
        id={rowId}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="flex min-h-[72px] w-full cursor-pointer items-stretch transition-colors hover:bg-[#F2F4F7]/80"
      >
        <div className="flex flex-1 items-center gap-2 py-2 pl-4 pr-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-[#969A9E]">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-medium leading-[1.5] text-[#353638]">{title}</div>
            <div className="flex items-center gap-2 text-[12px] leading-[1.25] text-[#7E8185]">
              <span>{who}</span>
              <span>·</span>
              <span>{when}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center pr-3 sm:pr-4">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium leading-[1.25]",
              isCompleted ? "bg-[#E6F6F3] text-[#1F9E8B]" : "bg-amber-100 text-amber-700",
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            {status}
          </span>
        </div>
      </div>
      {open ? (
        <div id={panelId} role="region" aria-labelledby={rowId}>
          <AmiioExpandedDetailGrid
            fullDescription={fullDescription}
            recentActionLines={recentActionLines}
            analyseChatTopic={`Review this tenant activity: ${title}`}
          />
          {onNavigate ? (
            <div className="border-t border-[#E6E8EB] bg-[#F3F4F6] px-4 pb-4 sm:px-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
                className="text-[13px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
              >
                {navigateLabel} →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
