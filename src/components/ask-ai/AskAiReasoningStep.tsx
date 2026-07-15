"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AiPromptBubble } from "@/src/components/commercial/ChatPanel";
import { cn } from "@/lib/utils";

/** Per-step dwell before advancing (ms). */
const STEP_DURATIONS_MS: Record<string, number> = {
  analysed: 650,
  fetched: 700,
  intent: 1100,
  generating: 1800,
};

const COMPLETE_HOLD_MS = 900;

export type AskAiReasoningStepItem = {
  id: string;
  label: string;
};

export function buildLeaseRenewalReasoningSteps(tenantName: string): AskAiReasoningStepItem[] {
  return [
    { id: "analysed", label: "Analysed question" },
    { id: "fetched", label: "Fetched data" },
    {
      id: "intent",
      label: `You want to start a lease renewal process for ${tenantName}.`,
    },
    { id: "generating", label: "Generating your process" },
  ];
}

function stepDuration(stepId: string) {
  return STEP_DURATIONS_MS[stepId] ?? 750;
}

function ReasoningConnector({ filled }: { filled: boolean }) {
  return (
    <div
      className={cn(
        "h-3 w-px shrink-0 origin-top rounded-[2px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]",
        filled ? "bg-[#70A4AC] animate-reasoning-line-grow" : "bg-[#D1D5D9]",
      )}
      aria-hidden
    />
  );
}

function ReasoningStatusIcon({
  status,
  justCompleted,
}: {
  status: "done" | "active" | "pending";
  justCompleted?: boolean;
}) {
  if (status === "done") {
    return (
      <div className="flex size-5 shrink-0 items-center justify-center">
        <CheckCircle2
          className={cn(
            "size-[18px] text-[#70A4AC]",
            justCompleted && "animate-reasoning-check-in",
          )}
          strokeWidth={2}
          aria-hidden
        />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="relative flex size-5 shrink-0 items-center justify-center">
        <span
          className="absolute size-5 animate-reasoning-pulse-ring rounded-full bg-[#70A4AC]/35"
          aria-hidden
        />
        <span
          className="absolute size-3.5 animate-ping rounded-full bg-[#70A4AC]/25"
          style={{ animationDuration: "1.25s" }}
          aria-hidden
        />
        <span
          className="relative size-2.5 rounded-full bg-[#70A4AC] shadow-[0_0_8px_rgba(112,164,172,0.65)]"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className="size-5 shrink-0 rounded-full border border-[#E6E8EB] bg-[#F7F8FA]" aria-hidden />
  );
}

function GeneratingLabel({ active }: { active: boolean }) {
  if (!active) {
    return <span>Generating your process</span>;
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="animate-reasoning-label-shimmer">Generating your process</span>
      <span className="inline-flex w-[1.25rem] text-[#70A4AC]" aria-hidden>
        <span className="typing-dot-1">.</span>
        <span className="typing-dot-2">.</span>
        <span className="typing-dot-3">.</span>
      </span>
    </span>
  );
}

/** Figma 1040:60071 — animated deep-research reasoning after tenant selection. */
export function AskAiReasoningStep({
  steps,
  onComplete,
  completed = false,
}: {
  steps: AskAiReasoningStepItem[];
  onComplete?: () => void;
  /** When true, show all steps checked (handoff state). */
  completed?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [justCompletedIndex, setJustCompletedIndex] = useState<number | null>(null);

  const visibleSteps = useMemo(
    () =>
      completed
        ? steps
        : steps.slice(0, Math.min(activeIndex + 1, steps.length)),
    [activeIndex, completed, steps],
  );

  useEffect(() => {
    setActiveIndex(0);
    setJustCompletedIndex(null);
  }, [steps]);

  useEffect(() => {
    if (justCompletedIndex === null) return;
    const timer = window.setTimeout(() => setJustCompletedIndex(null), 480);
    return () => window.clearTimeout(timer);
  }, [justCompletedIndex]);

  useEffect(() => {
    if (completed) return;

    const current = steps[activeIndex];
    if (!current) return;

    const duration = stepDuration(current.id);
    const isLast = activeIndex >= steps.length - 1;
    let completeTimer: ReturnType<typeof window.setTimeout> | undefined;

    const timer = window.setTimeout(() => {
      if (isLast) {
        completeTimer = window.setTimeout(() => onComplete?.(), COMPLETE_HOLD_MS);
        return;
      }

      setJustCompletedIndex(activeIndex);
      setActiveIndex((index) => Math.min(index + 1, steps.length - 1));
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, [activeIndex, completed, onComplete, steps]);

  return (
    <div className="flex w-full min-w-0 items-start gap-2 pb-4">
      <div className="relative shrink-0">
        <AiPromptBubble size="md" />
        <span
          className="pointer-events-none absolute -inset-1 rounded-[20px] bg-[#70A4AC]/10 animate-pulse"
          style={{ animationDuration: "2s" }}
          aria-hidden
        />
      </div>

      <div className="flex min-w-0 flex-1 gap-2.5 pr-4">
        <div className="flex shrink-0 flex-col items-center gap-0.5 pt-0.5">
          {visibleSteps.map((step, index) => {
            const status = completed
              ? "done"
              : index < activeIndex
                ? "done"
                : index === activeIndex
                  ? "active"
                  : "pending";

            return (
              <div key={step.id} className="flex flex-col items-center animate-reasoning-row-in">
                <ReasoningStatusIcon
                  status={status}
                  justCompleted={index === justCompletedIndex}
                />
                {index < visibleSteps.length - 1 ? (
                  <ReasoningConnector filled={completed || index < activeIndex} />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {visibleSteps.map((step, index) => {
            const isActive = !completed && index === activeIndex;
            const isDone = completed || index < activeIndex;

            return (
              <div
                key={step.id}
                className="min-h-5 animate-reasoning-row-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {step.id === "generating" ? (
                  <p
                    className={cn(
                      "text-[14px] font-normal leading-[1.4]",
                      isActive ? "text-[#70A4AC]" : "text-[#7E8185]",
                    )}
                  >
                    <GeneratingLabel active={isActive} />
                  </p>
                ) : (
                  <p
                    className={cn(
                      "text-[14px] font-normal leading-[1.4] transition-colors duration-300",
                      step.id === "intent" ? "truncate" : "whitespace-nowrap",
                      isActive && "animate-reasoning-label-shimmer font-medium",
                      isDone && "text-[#7E8185]",
                      !isActive && !isDone && "text-[#D1D5D9]",
                    )}
                  >
                    {step.label}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
