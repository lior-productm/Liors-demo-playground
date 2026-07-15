"use client";

import type { ComponentProps, ReactElement } from "react";
import { Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Same copy as the chat composer footer (single source of truth for product). */
export const AMIIO_AI_DISCLAIMER =
  "Amiio AI can make mistakes. Verify important info.";

export const amiioAiDisclaimerTooltipContentClass =
  "z-[100] max-w-[260px] border-[#E6E8EB] bg-white px-3 py-2 text-[12px] font-medium leading-snug text-[#353638] shadow-md";

/** Default hover copy for `variant="lamp"` when no custom `lampSummary` is passed. */
export function defaultLampTooltipSummary(
  widgetName?: string,
  dataHint?: string,
): readonly [string, string] {
  const name = widgetName?.trim();
  if (name) {
    return [
      `${name}: ${dataHint ?? "the chart and KPIs here use live or demo figures for the selected scope."}`,
      "Use Analyse with Amiio to turn this view into narrative, variance checks, or next actions in chat.",
    ];
  }
  return [
    dataHint ??
      "This control ties to the metrics and visuals shown beside it for your current filters.",
    "Open chat via the lamp to ask Amiio for interpretation, comparisons, or exports.",
  ];
}

type AmiioAiDisclaimerTriggerProps = {
  children: ReactElement;
  detail?: string;
  side?: ComponentProps<typeof TooltipContent>["side"];
  contentClassName?: string;
  /** Use when `children` is a bare icon (not a button/link). */
  wrapChild?: boolean;
  wrapperClassName?: string;
  /**
   * Lamp / analyse icon controls: show “Analyse with Amiio” + icon only (no AI disclaimer).
   */
  variant?: "default" | "lamp";
  /**
   * When `variant="lamp"`, two short lines under the title explaining what the widget shows.
   */
  lampSummary?: readonly [string, string];
};

export function AmiioAiDisclaimerTrigger({
  children,
  detail,
  side = "top",
  contentClassName,
  wrapChild,
  wrapperClassName,
  variant = "default",
  lampSummary,
}: AmiioAiDisclaimerTriggerProps) {
  const trigger = wrapChild ? (
    <span
      tabIndex={0}
      className={cn(
        "inline-flex cursor-default items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE] focus-visible:ring-offset-2",
        wrapperClassName,
      )}
    >
      {children}
    </span>
  ) : (
    children
  );

  return (
    <span className="inline-flex shrink-0">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent
          side={side}
          className={cn(
            variant === "lamp"
              ? "z-[100] max-w-[min(320px,calc(100vw-24px))] border-[#E6E8EB] bg-white px-3 py-2.5 text-[12px] font-medium leading-snug text-[#353638] shadow-md"
              : amiioAiDisclaimerTooltipContentClass,
            contentClassName,
          )}
        >
          {variant === "lamp" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb
                  className="size-3.5 shrink-0 text-[#676A6E]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>Analyse with Amiio</span>
              </div>
              {lampSummary ? (
                <div className="space-y-1 border-t border-[#E6E8EB] pt-2">
                  <p className="text-[11px] font-normal leading-snug text-[#65686B]">
                    {lampSummary[0]}
                  </p>
                  <p className="text-[11px] font-normal leading-snug text-[#65686B]">
                    {lampSummary[1]}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <p>{AMIIO_AI_DISCLAIMER}</p>
              {detail ? (
                <p className="mt-2 text-[11px] font-normal leading-snug text-[#65686B]">
                  {detail}
                </p>
              ) : null}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </span>
  );
}
