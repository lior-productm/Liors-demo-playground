"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Core DS — Indicators / Trend tag (Figma: Core Design System → Indicators → Trend Tag).
 * Tokens: Success/100 #E6F6F3, Success/700 #1F9E8B, Error/100 #FBEAEC, Error/700 #9F2D3A,
 * Tertiary/200 #D3D9F8, Tertiary/700 #1B32B3; radius 8px; L3-b 12px / 500 / 1.25.
 */

/**
 * Standalone ArrowUpRight / ArrowDownRight / Minus matching `TrendPill` stroke and palette.
 */
export function TrendDirectionGlyph({
  direction,
  invert = false,
  className,
}: {
  direction: "up" | "down" | "neutral";
  /** When true, down arrow uses positive green (e.g. lower expenses). */
  invert?: boolean;
  className?: string;
}) {
  if (direction === "neutral") {
    return (
      <Minus
        className={cn("size-4 shrink-0 text-[#1B32B3]", className)}
        strokeWidth={2.25}
        strokeLinecap="round"
        aria-hidden
      />
    );
  }

  const isPositive = invert ? direction === "down" : direction === "up";
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Icon
      className={cn(
        "size-4 shrink-0",
        isPositive ? "text-[#1F9E8B]" : "text-[#9F2D3A]",
        className,
      )}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    />
  );
}

/**
 * Trend tag: direction × semantic type per design system (positive / negative / neutral band).
 */
export function TrendPill({
  direction,
  pct,
  invert = false,
  className,
}: {
  direction: "up" | "down" | "neutral";
  /** Omitted or empty on up/down = icon-only chip (e.g. compact KPI tiles). */
  pct?: string;
  /** When true, down arrow still uses “good” green (e.g. lower expenses). */
  invert?: boolean;
  className?: string;
}) {
  if (direction === "neutral") {
    return (
      <span
        className={cn(
          "inline-flex w-fit max-w-full shrink-0 items-center gap-0.5 rounded-lg bg-[#D3D9F8] px-1 py-0.5 typo-l3-b font-medium tabular-nums text-[#1B32B3]",
          className,
        )}
      >
        <TrendDirectionGlyph direction="neutral" />
        {pct ?? "0%"}
      </span>
    );
  }

  const isPositive = invert ? direction === "down" : direction === "up";
  const showPct = Boolean(pct && pct.length > 0);

  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full shrink-0 items-center gap-0.5 rounded-lg px-1 py-0.5 typo-l3-b font-medium tabular-nums",
        isPositive ? "bg-[#E6F6F3] text-[#1F9E8B]" : "bg-[#FBEAEC] text-[#9F2D3A]",
        className,
      )}
    >
      <TrendDirectionGlyph direction={direction} invert={invert} />
      {showPct ? pct : null}
    </span>
  );
}
