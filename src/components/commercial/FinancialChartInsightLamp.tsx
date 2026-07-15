"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";

/**
 * Core Design System — Insight AI control (Shape = Forward Point).
 * @see https://www.figma.com/design/X14IcrYNLuva2EZe8lGiD1/Core-Design-System?node-id=8138-23094
 */
export function FinancialChartInsightLamp({
  summary,
  analyseTopic,
  ariaLabel,
  className,
  popoverSide = "top",
}: {
  summary: string;
  /** Full prompt inserted when “Analyse further” is used. */
  analyseTopic: string;
  ariaLabel: string;
  className?: string;
  popoverSide?: "top" | "bottom" | "left" | "right";
}) {
  const inject = useCommercialChatInject();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={open}
          className={cn(
            "flex size-[34px] shrink-0 origin-center items-center justify-center rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] rounded-bl-none shadow-[0px_2px_6px_rgba(0,0,0,0.16)] outline-none transition-transform hover:scale-[1.04] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#1B32B3] focus-visible:ring-offset-2",
            /* Sharp BL aims down-left by default; rotate −45° so the tip points straight down. */
            "-rotate-45",
            className,
          )}
          style={{
            background: "linear-gradient(178deg, #1B32B3 1.63%, #000000 128.52%)",
          }}
        >
          <span className="flex size-[66%] rotate-45 items-center justify-center">
            <Lightbulb className="size-[57%] text-white" strokeWidth={2} aria-hidden />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-2rem,260px)] border-[#E6E8EB] bg-white p-3 text-[#353638] shadow-md"
        align="center"
        side={popoverSide}
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <p className="text-[12px] font-normal leading-snug text-[#353638]">{summary}</p>
        <div className="mt-2.5 flex justify-end">
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#D1D5D9] bg-white px-2.5 text-[11px] font-medium leading-tight text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]"
            onClick={() => {
              if (inject) inject(analyseTopic);
              else
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", {
                    detail: { message: "Open chat to analyse further" },
                  }),
                );
              setOpen(false);
            }}
          >
            <Lightbulb className="size-3 shrink-0 text-[#7E8185]" strokeWidth={1.8} aria-hidden />
            Analyse further
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
