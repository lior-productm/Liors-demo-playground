"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Core DS — Indicators / Comparison tag (Figma: Core Design System → Indicators → Comparison tag).
 * Sentiment colour is independent of the mathematical direction (+ / − / neutral band).
 */
export function ComparisonTag({
  direction,
  sentiment,
  value = "1.5%",
  className,
}: {
  direction: "above" | "below" | "neutral";
  sentiment: "green" | "red" | "blue";
  value?: string;
  className?: string;
}) {
  const bg =
    sentiment === "blue"
      ? "bg-[#D3D9F8]"
      : sentiment === "red"
        ? "bg-[#FBEAEC]"
        : "bg-[#E6F6F3]";
  const fg =
    sentiment === "blue"
      ? "text-[#1B32B3]"
      : sentiment === "red"
        ? "text-[#9F2D3A]"
        : "text-[#1F9E8B]";

  if (direction === "neutral") {
    return (
      <span
        className={cn(
          "inline-flex max-w-full shrink-0 items-center gap-0.5 rounded-lg px-1 py-0.5 typo-l3-b tabular-nums",
          bg,
          fg,
          className,
        )}
      >
        <span className="whitespace-pre font-medium tracking-tight">{"  —  "}</span>
        <span className="font-medium">{value}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-0.5 rounded-lg px-1 py-0.5 typo-l3-b tabular-nums",
        bg,
        fg,
        className,
      )}
    >
      {direction === "above" ? (
        <Plus className="size-4 shrink-0 stroke-[2.25]" strokeLinecap="round" strokeLinejoin="round" aria-hidden />
      ) : (
        <Minus className="size-4 shrink-0 stroke-[2.25]" strokeLinecap="round" strokeLinejoin="round" aria-hidden />
      )}
      <span className="font-medium">{value}</span>
    </span>
  );
}
