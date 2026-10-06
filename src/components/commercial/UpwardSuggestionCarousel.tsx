"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SUGGESTION_LINE_HEIGHT_PX = 24;
export const SUGGESTION_TRANSITION_MS = 550;
export const SUGGESTION_ROTATION_INTERVAL_MS = 3800;

export function UpwardSuggestionCarousel({
  suggestions,
  paused,
  className,
}: {
  suggestions: readonly string[];
  paused: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const looped =
    suggestions.length > 1 ? [...suggestions, suggestions[0]!] : suggestions;

  useEffect(() => {
    if (paused || suggestions.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((current) => current + 1);
    }, SUGGESTION_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [paused, suggestions.length]);

  useEffect(() => {
    if (suggestions.length <= 1 || index !== suggestions.length) return;

    const id = window.setTimeout(() => {
      setTransitionEnabled(false);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }, SUGGESTION_TRANSITION_MS);

    return () => window.clearTimeout(id);
  }, [index, suggestions.length]);

  if (suggestions.length === 0) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          transitionEnabled &&
            "transition-transform duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        )}
        style={{ transform: `translateY(-${index * SUGGESTION_LINE_HEIGHT_PX}px)` }}
      >
        {looped.map((suggestion, suggestionIndex) => (
          <p
            key={`${suggestionIndex}-${suggestion}`}
            className="truncate text-[16px] font-normal leading-6 text-[#8F8F8F]"
            style={{ height: SUGGESTION_LINE_HEIGHT_PX }}
          >
            {suggestion}
          </p>
        ))}
      </div>
    </div>
  );
}
