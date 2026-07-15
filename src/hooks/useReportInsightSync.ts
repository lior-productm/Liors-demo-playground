"use client";

import { useCallback, useEffect, useState, type MutableRefObject, type RefObject } from "react";

type InsightWithTarget = {
  id: string;
  scrollTarget: string;
};

function getAnchorCenterY(
  anchor: HTMLElement,
  container: HTMLElement,
): number {
  const containerRect = container.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  return anchorRect.top - containerRect.top + anchorRect.height / 2;
}

export function useReportInsightSync({
  scrollContainerRef,
  insightAnchorRefs,
  insights,
  activeInsightId,
  onActiveInsightChange,
  isProgrammaticScrollRef,
  syncKey = 0,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
  insightAnchorRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  insights: readonly InsightWithTarget[];
  activeInsightId: string;
  onActiveInsightChange: (id: string) => void;
  isProgrammaticScrollRef: MutableRefObject<boolean>;
  syncKey?: number;
}) {
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [viewportHeight, setViewportHeight] = useState(0);

  const update = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setViewportHeight(container.clientHeight);

    const next: Record<string, number> = {};
    for (const insight of insights) {
      const anchor = insightAnchorRefs.current[insight.id];
      if (!anchor) continue;
      next[insight.id] = getAnchorCenterY(anchor, container);
    }
    setPositions(next);

    if (isProgrammaticScrollRef.current) return;

    const focusLine = container.clientHeight * 0.32;
    let bestId = activeInsightId;
    let bestDistance = Infinity;

    for (const insight of insights) {
      const y = next[insight.id];
      if (y === undefined) continue;
      const distance = Math.abs(y - focusLine);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = insight.id;
      }
    }

    if (bestId !== activeInsightId) {
      onActiveInsightChange(bestId);
    }
  }, [
    activeInsightId,
    insightAnchorRefs,
    insights,
    isProgrammaticScrollRef,
    onActiveInsightChange,
    scrollContainerRef,
  ]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    update();

    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);

    const mountRefresh = window.setTimeout(update, 80);

    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
      window.clearTimeout(mountRefresh);
    };
  }, [scrollContainerRef, update, syncKey]);

  const scrollToInsight = useCallback(
    (insightId: string) => {
      const container = scrollContainerRef.current;
      const anchor = insightAnchorRefs.current[insightId];
      if (!container || !anchor) return;

      isProgrammaticScrollRef.current = true;
      onActiveInsightChange(insightId);

      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const focusLine = container.clientHeight * 0.32;
      const nextTop =
        anchorRect.top -
        containerRect.top +
        container.scrollTop -
        focusLine;

      container.scrollTo({
        top: Math.max(0, nextTop),
        behavior: "smooth",
      });

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        update();
      }, 450);
    },
    [
      insightAnchorRefs,
      isProgrammaticScrollRef,
      onActiveInsightChange,
      scrollContainerRef,
      update,
    ],
  );

  return { positions, viewportHeight, scrollToInsight, refresh: update };
}

export function clampInsightCardTop(
  top: number,
  cardHeight: number,
  viewportHeight: number,
  padding = 12,
): number {
  if (viewportHeight <= 0 || cardHeight <= 0) return Math.max(padding, top);
  const maxTop = viewportHeight - cardHeight - padding;
  return Math.max(padding, Math.min(top, maxTop));
}
