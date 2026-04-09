"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";
import {
  AmiioAiDisclaimerTrigger,
  defaultLampTooltipSummary,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

export function WidgetHeaderLamp({
  className,
  chatTopic,
  chatLabel,
  lampSummary,
  /** When true, parent must use `className="group"`; lamp fades in on widget hover (and focus-within). */
  revealOnHover,
}: {
  className?: string;
  /** Text placed in the chat composer when the lamp is clicked */
  chatTopic?: string;
  /** Short label for tooltips / accessibility */
  chatLabel?: string;
  /** Hover copy: two lines explaining the data; defaults from `chatLabel` / `chatTopic` when omitted. */
  lampSummary?: readonly [string, string];
  revealOnHover?: boolean;
}) {
  const inject = useCommercialChatInject();
  const topic =
    chatTopic ??
    (chatLabel
      ? `Help me interpret ${chatLabel} in the context of this dashboard.`
      : undefined);
  const canInject = Boolean(inject && topic);
  const aria =
    chatLabel ?? (topic ? `Insert into chat: ${topic.slice(0, 80)}` : "Insight");

  const resolvedLampSummary =
    lampSummary ??
    defaultLampTooltipSummary(
      chatLabel ?? (chatTopic ? "This widget" : undefined),
      chatLabel
        ? "Values and series follow your active property or portfolio filters."
        : chatTopic
          ? "The inserted prompt reflects the insight configured for this control."
          : undefined,
    );

  const icon = (
    <Lightbulb
      className={cn(
        "h-4 w-4",
        canInject ? "text-[#969A9E]" : "text-[#969A9E]",
      )}
    />
  );

  const revealCls = revealOnHover
    ? "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
    : undefined;

  if (canInject) {
    return (
      <AmiioAiDisclaimerTrigger variant="lamp" lampSummary={resolvedLampSummary}>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF]",
            revealCls,
            className,
          )}
          aria-label={aria}
          onClick={() => inject!(topic!)}
        >
          {icon}
        </button>
      </AmiioAiDisclaimerTrigger>
    );
  }

  return (
    <AmiioAiDisclaimerTrigger variant="lamp" lampSummary={resolvedLampSummary}>
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9]",
          revealCls,
          className,
        )}
        tabIndex={0}
        role="img"
        aria-label={aria}
      >
        {icon}
      </span>
    </AmiioAiDisclaimerTrigger>
  );
}
