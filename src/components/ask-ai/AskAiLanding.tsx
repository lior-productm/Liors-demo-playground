"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  Loader2,
  Mic,
  Plus,
  Send,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Figma 1864:61222 — quick-start chips on Ask Amiio blank state. */
export const ASK_AI_CHIP_SUGGESTIONS: {
  label: string;
  icon: LucideIcon;
  action?: "lease-renewal" | "create-insight";
}[] = [
  { label: "Analyze asset performance", icon: BarChart3 },
  { label: "Initiate a Lease renewal", icon: Building2, action: "lease-renewal" },
  { label: "Draft an Investor report", icon: FileText },
  { label: "Create new insight", icon: Sparkles, action: "create-insight" },
];

function AskAiSuggestionChip({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 shrink-0 items-center gap-1 rounded-[32px] border-[1.5px] border-[#E6E8EB] bg-white px-3 py-2 transition-colors hover:bg-[#FAFBFC] disabled:opacity-50",
      )}
    >
      <Icon className="size-4 shrink-0 text-[#65686B]" strokeWidth={1.75} aria-hidden />
      <span className="typo-p2-b whitespace-nowrap text-[#65686B]">{label}</span>
    </button>
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
      <div className="flex w-full flex-col items-center gap-3">
        <h1 className="typo-h3 text-[#040617]">
          Good afternoon, Tomer!
        </h1>
        <p className="typo-p2-r text-[#65686B]">
          How can we help you today?
        </p>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {ASK_AI_CHIP_SUGGESTIONS.map(({ label, icon, action }) => (
          <AskAiSuggestionChip
            key={label}
            label={label}
            icon={icon}
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
