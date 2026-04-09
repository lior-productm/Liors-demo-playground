"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Core DS — Indicators / Sparkline (Figma: Core Design System → Indicators → Sparkline).
 * Smooth stroke + soft gradient fill under the line for Positive / Negative / Neutral.
 */
export function Sparkline({
  values,
  variant = "positive",
  className,
  width = 96,
  height = 42,
}: {
  values: number[];
  variant?: "positive" | "negative" | "neutral";
  className?: string;
  width?: number;
  height?: number;
}) {
  const gradUid = useId().replace(/:/g, "");
  const padX = 2;
  const padY = 4;
  const w = width;
  const h = height;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const max = Math.max(...values, 1e-6);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const pts = values.map((v, i) => {
    const x = padX + (i / Math.max(values.length - 1, 1)) * innerW;
    const y = padY + (1 - (v - min) / range) * innerH;
    return { x, y };
  });

  const lineD =
    pts.length < 2
      ? ""
      : pts.reduce((acc, p, i) => {
          if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
          const prev = pts[i - 1]!;
          const cx = (prev.x + p.x) / 2;
          const cy = (prev.y + p.y) / 2;
          return `${acc} Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`;
        }, "") +
        (pts.length >= 2
          ? ` T ${pts[pts.length - 1]!.x.toFixed(2)} ${pts[pts.length - 1]!.y.toFixed(2)}`
          : "");

  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  const fillD =
    pts.length < 2 || !last || !first
      ? ""
      : `${lineD} L ${last.x.toFixed(2)} ${h - padY} L ${first.x.toFixed(2)} ${h - padY} Z`;

  const stroke =
    variant === "positive"
      ? "#1F9E8B"
      : variant === "negative"
        ? "#9F2D3A"
        : "#1B32B3";
  const gradId = `amiio-spark-${variant}-${gradUid}`;

  return (
    <svg
      className={cn("shrink-0 overflow-visible", className)}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
          <stop offset="55%" stopColor={stroke} stopOpacity={0.06} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fillD ? <path d={fillD} fill={`url(#${gradId})`} /> : null}
      {lineD ? (
        <path
          d={lineD}
          fill="none"
          stroke={stroke}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
}
