"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronRight,
  FileText,
  Loader2,
  Mic,
  Plus,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/src/hooks/useI18n";

/** Figma 1864:61222 — quick-start suggestions on Ask Amiio blank state. */
export const ASK_AI_CHIP_SUGGESTIONS: {
  label: string;
  icon: LucideIcon;
  action?: "lease-renewal" | "create-insight";
  /** Tinted icon-tile classes for the Ask Amiio starter list. */
  tint: string;
}[] = [
  { label: "Analyze asset performance", icon: BarChart3, tint: "bg-[#EEF1FF] text-[#2F49D1]" },
  { label: "Initiate a Lease renewal", icon: Building2, action: "lease-renewal", tint: "bg-[#EAF4F3] text-[#3C8C84]" },
  { label: "Draft an Investor report", icon: FileText, tint: "bg-[#F2EFFB] text-[#6B4FCB]" },
  { label: "Create new insight", icon: Sparkles, action: "create-insight", tint: "bg-[#FFF2E8] text-[#C2690E]" },
];

/** Ask Amiio starter prompt — editorial list row (clickable). */
function AskAiSuggestionRow({
  label,
  icon: Icon,
  tint,
  disabled,
  onClick,
  isFirst,
}: {
  label: string;
  icon: LucideIcon;
  tint: string;
  disabled?: boolean;
  onClick: () => void;
  isFirst?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 border-b border-[#ECEEF1] px-1.5 py-3.5 text-left transition-colors hover:bg-[#FAFBFC] disabled:opacity-50",
        isFirst && "border-t",
      )}
    >
      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", tint)}>
        <Icon className="size-[15px]" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="flex-1 text-[14px] font-medium leading-5 text-[#2B2E31]">{label}</span>
      <ChevronRight
        className="size-[18px] shrink-0 text-[#C2C6CA] opacity-0 transition-opacity group-hover:opacity-100"
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}

/** Figma 1217:44464 — Ask Amiio greeting (upper area). */
export function AskAiGreeting() {
  const { t } = useI18n();
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <h1 className="typo-h3 text-[#040617]">{t("Good afternoon, Tomer!")}</h1>
      <p className="typo-p2-r text-[#65686B]">{t("How can we help you today?")}</p>
    </div>
  );
}

/** Figma 1217:44470 — Ask Amiio starter prompts (editorial list). */
export function AskAiSuggestionList({
  isTyping,
  onChipSelect,
  onLeaseRenewalStart,
  onCreateInsightStart,
  className,
}: {
  isTyping?: boolean;
  onChipSelect: (label: string) => void;
  onLeaseRenewalStart?: () => void;
  onCreateInsightStart?: () => void;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div className={cn("flex w-full flex-col", className)}>
      {ASK_AI_CHIP_SUGGESTIONS.map(({ label, icon, action, tint }, index) => (
        <AskAiSuggestionRow
          key={label}
          label={t(label)}
          icon={icon}
          tint={tint}
          isFirst={index === 0}
          disabled={isTyping}
          onClick={() => {
            if (action === "lease-renewal") {
              onLeaseRenewalStart?.();
              return;
            }
            if (action === "create-insight") {
              onCreateInsightStart?.();
              return;
            }
            onChipSelect(label);
          }}
        />
      ))}
    </div>
  );
}

/** Figma 1217:44464–44470 — greeting + suggestion chips. */
export function AskAiLandingHero({
  isTyping,
  onChipSelect,
  onLeaseRenewalStart,
  onCreateInsightStart,
}: {
  isTyping?: boolean;
  onChipSelect: (label: string) => void;
  onLeaseRenewalStart?: () => void;
  onCreateInsightStart?: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-10 text-center">
      <AskAiGreeting />
      <AskAiSuggestionList
        className="mx-auto max-w-[560px]"
        isTyping={isTyping}
        onChipSelect={onChipSelect}
        onLeaseRenewalStart={onLeaseRenewalStart}
        onCreateInsightStart={onCreateInsightStart}
      />
    </div>
  );
}

/** Figma 1217:44565 / 1040:59785 — Ask Amiio prompt box. */
export function AskAiLandingInput({
  isTyping,
  onSend,
  className,
  compact = false,
  showDisclaimer = false,
}: {
  isTyping?: boolean;
  onSend: (message: string) => void;
  className?: string;
  /** Conversation dock — 98px per Figma 1040:59785 */
  compact?: boolean;
  showDisclaimer?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const disabled = isSending || isTyping;

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || disabled) return;

    setIsSending(true);
    onSend(trimmed);
    setDraft("");
    window.setTimeout(() => setIsSending(false), 600);
  };

  return (
    <div className={cn("flex w-full flex-col items-center gap-3", className)}>
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-[16px] border border-[#E9E9E9] bg-white p-2.5",
        compact ? "h-[98px]" : "h-[119px]",
      )}
    >
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Ask me anything"
        disabled={disabled}
        rows={1}
        className="min-h-0 flex-1 resize-none bg-transparent px-2 py-0.5 text-[14px] font-normal leading-5 text-[#353638] placeholder:text-[#8F8F8F] outline-none disabled:opacity-50"
      />
      <div className="flex items-end justify-between">
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]"
          aria-label="Add context"
        >
          <Plus className="size-5" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]"
            aria-label="Voice input"
          >
            <Mic className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="submit"
            disabled={disabled || !draft.trim()}
            className="flex size-8 items-center justify-center rounded-[32px] bg-[#040617] p-[6.667px] text-white shadow-[0_6.667px_9.333px_rgba(0,0,0,0.14)] transition-opacity disabled:opacity-50"
            aria-label="Send"
          >
            {isSending || isTyping ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </form>
    {showDisclaimer ? (
      <p className="w-full text-center text-[11px] font-normal leading-[1.5] text-[#969A9E]">
        Amiio AI can make mistakes. Check important info.
      </p>
    ) : null}
    </div>
  );
}
