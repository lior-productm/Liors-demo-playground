"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiPromptBubble } from "@/src/components/commercial/ChatPanel";

/** Figma 1901:22431 — topic / frequency suggestion chip. */
function AskAiInsightChip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 shrink-0 items-center rounded-[32px] px-4 py-2 transition-colors",
        selected
          ? "border-[1.5px] border-[#65686B] bg-[#F2F4F7]"
          : "border border-[#D1D5D9] bg-white hover:bg-[#FAFBFC]",
        disabled && !selected && "opacity-60",
        disabled && "cursor-default",
      )}
    >
      <span className="truncate text-[14px] font-medium leading-[1.5] text-[#353638]">
        {label}
      </span>
    </button>
  );
}

/** Inline Amiio prompt line (avatar + text, no card) for follow-up questions. */
export function AskAiInsightPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <p className="min-w-0 flex-1 pt-0.5 text-[14px] font-normal leading-[1.5] text-[#353638]">
        {children}
      </p>
    </div>
  );
}

/**
 * Figma 1901:22426 / 1901:22678 — Amiio asks the user to pick a topic or
 * frequency. Suggestions are chips; "Other" lets the user free-type.
 */
export function AskAiInsightChoice({
  prompt,
  options,
  selected,
  answered,
  awaitingCustom,
  disabled,
  onSelect,
  onOther,
}: {
  prompt: string;
  options: readonly string[];
  selected?: string;
  /** When the step is already answered — disable chips, hide the Other chip. */
  answered?: boolean;
  /** When the user has tapped Other and is free-typing the answer. */
  awaitingCustom?: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
  onOther: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2 pb-1">
      <AiPromptBubble size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-4 pb-2">
        <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">{prompt}</p>
        <div className="flex flex-wrap items-start gap-4">
          {options.map((option) => (
            <AskAiInsightChip
              key={option}
              label={option}
              selected={selected === option}
              disabled={disabled || answered}
              onClick={() => onSelect(option)}
            />
          ))}
          {!answered ? (
            <AskAiInsightChip
              label="Other"
              selected={awaitingCustom}
              disabled={disabled}
              onClick={onOther}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ValidationField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[14px] font-medium leading-[1.24] text-[#676A6E]">{label}</p>
      <p className="text-[16px] font-normal leading-[1.5] text-[#353638]">{value}</p>
    </div>
  );
}

/** Figma 1936:31102 — live "Creating Insight..." spinner shown while the insight is built. */
function CreatingInsightLoader() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <span className="relative flex size-8 shrink-0 items-center justify-center" aria-hidden>
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-[#EBEDF9] border-t-[#4F65E5]"
          style={{ animationDuration: "0.85s" }}
        />
        <span
          className="absolute inset-[7px] rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(178.07deg, rgb(27, 50, 179) 1.63%, rgb(0, 0, 0) 128.52%)",
          }}
        />
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#4F65E5]/15"
          style={{ animationDuration: "1.4s" }}
        />
      </span>
      <span className="animate-reasoning-label-shimmer text-[16px] font-normal leading-6 text-[#65686B]">
        Creating Insight...
      </span>
    </div>
  );
}

/** Figma 1901:28019 / 1934:15990 — insight summary card with Create action + loading state. */
export function AskAiInsightValidationCard({
  topic,
  formula,
  frequency,
  creating,
  created,
  disabled,
  onCreate,
}: {
  topic: string;
  formula: string;
  frequency: string;
  /** While the insight is being created — show the live loader instead of the button. */
  creating?: boolean;
  /** Once created, the button is locked and a confirmation line is shown. */
  created?: boolean;
  disabled?: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
          {created
            ? `Your “${topic}” insight has been created and added to Insights.`
            : "I summarized your insight creation request. Do you want to proceed?"}
        </p>
        <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
          <ValidationField label="Insight’s topic" value={topic} />
          <ValidationField label="Formula" value={formula} />
          <ValidationField label="Monitoring frequency" value={frequency} />
          {creating ? (
            <CreatingInsightLoader />
          ) : (
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                disabled={disabled || created}
                onClick={onCreate}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-[32px] bg-[#010309] px-3.5 py-1 transition-opacity",
                  (disabled || created) && "opacity-50",
                )}
              >
                <span className="text-[14px] font-medium leading-[1.24] text-[#F0F2F5]">
                  {created ? "Insight created" : "Create Insight"}
                </span>
                {created ? null : (
                  <ArrowRight className="size-4 text-[#F0F2F5]" strokeWidth={2} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
