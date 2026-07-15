"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Part = { text: string; className?: string };

function useTypewriterLength(fullLength: number, charDelayMs: number, startDelayMs: number) {
  const [len, setLen] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setLen(0);
    setStarted(false);
  }, [fullLength]);

  useEffect(() => {
    if (fullLength === 0) return;
    const id = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(id);
  }, [fullLength, startDelayMs]);

  useEffect(() => {
    if (!started || fullLength === 0) return;
    if (len >= fullLength) return;
    const id = window.setTimeout(() => setLen((n) => n + 1), charDelayMs);
    return () => clearTimeout(id);
  }, [started, len, fullLength, charDelayMs]);

  const done = started && len >= fullLength;
  return { len, done };
}

/** Plain string body — headline stays outside this component. */
export function AmiioSummaryTypewriterText({
  text,
  className,
  charDelayMs = 9,
  startDelayMs = 0,
  showCaret = true,
}: {
  text: string;
  className?: string;
  charDelayMs?: number;
  startDelayMs?: number;
  showCaret?: boolean;
}) {
  const { len, done } = useTypewriterLength(text.length, charDelayMs, startDelayMs);
  const displayed = text.slice(0, len);

  return (
    <span className={cn(className, "inline")} aria-busy={!done}>
      {displayed}
      {!done && showCaret ? (
        <span
          className="ml-px inline-block h-[1em] w-px translate-y-[0.08em] bg-current align-middle opacity-60 animate-pulse"
          aria-hidden
        />
      ) : null}
    </span>
  );
}

/** Sequential text parts with optional per-segment styling (e.g. one highlighted phrase). */
export function AmiioSummaryTypewriterParts({
  parts,
  className,
  charDelayMs = 9,
  startDelayMs = 0,
  showCaret = true,
  onComplete,
}: {
  parts: readonly Part[];
  className?: string;
  charDelayMs?: number;
  startDelayMs?: number;
  showCaret?: boolean;
  onComplete?: () => void;
}) {
  const fullLength = useMemo(
    () => parts.reduce((acc, p) => acc + p.text.length, 0),
    [parts],
  );
  const { len, done } = useTypewriterLength(fullLength, charDelayMs, startDelayMs);

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const rendered: ReactNode[] = [];
  let remaining = len;
  parts.forEach((p, i) => {
    if (remaining <= 0) return;
    const take = Math.min(remaining, p.text.length);
    if (take > 0) {
      rendered.push(
        <span key={`${i}-${p.text.slice(0, 8)}`} className={p.className}>
          {p.text.slice(0, take)}
        </span>,
      );
      remaining -= take;
    }
  });

  return (
    <span className={cn(className, "inline")} aria-busy={!done}>
      {rendered}
      {!done && showCaret ? (
        <span
          className="ml-px inline-block h-[1em] w-px translate-y-[0.08em] bg-current align-middle opacity-60 animate-pulse"
          aria-hidden
        />
      ) : null}
    </span>
  );
}
