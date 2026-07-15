"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clampInsightCardTop } from "@/src/hooks/useReportInsightSync";
import { REPORT_SECTIONS } from "@/src/lib/reportingMockData";

type ReportInsight = {
  id: string;
  title: string;
  body?: readonly string[];
  reviewed?: boolean;
  scrollTarget?: string;
  anchorOffsetPx?: number;
};

type ReportInsightsPanelProps = {
  insights: readonly ReportInsight[];
  activeInsightId: string;
  onInsightChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  positions: Record<string, number>;
  viewportHeight: number;
};

const NUMBER_SIZE = 20;
const RAIL_WIDTH = 65;
const PANEL_BODY_WIDTH = 288;
const PANEL_HEADER_HEIGHT = 54;
const PANEL_CONTENT_PADDING = 12;
const EXPANDED_CARD_HEIGHT = 340;

function sortInsightsByDocumentOrder(
  insights: readonly ReportInsight[],
  positions: Record<string, number>,
) {
  const sectionIndex = (scrollTarget?: string) => {
    if (!scrollTarget) return Number.MAX_SAFE_INTEGER;
    const index = REPORT_SECTIONS.findIndex((section) => section.id === scrollTarget);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return [...insights].sort((a, b) => {
    const yA = positions[a.id];
    const yB = positions[b.id];
    if (yA !== undefined && yB !== undefined && yA !== yB) return yA - yB;
    if (yA !== undefined && yB === undefined) return -1;
    if (yA === undefined && yB !== undefined) return 1;

    const sectionDelta = sectionIndex(a.scrollTarget) - sectionIndex(b.scrollTarget);
    if (sectionDelta !== 0) return sectionDelta;

    return (a.anchorOffsetPx ?? 0) - (b.anchorOffsetPx ?? 0);
  });
}

function InsightNumberRail({
  insights,
  activeInsightId,
  positions,
  viewportHeight,
  onInsightChange,
  showExpandButton,
  onExpandPanel,
}: {
  insights: readonly ReportInsight[];
  activeInsightId: string;
  positions: Record<string, number>;
  viewportHeight: number;
  onInsightChange: (id: string) => void;
  showExpandButton?: boolean;
  onExpandPanel?: () => void;
}) {
  const sorted = sortInsightsByDocumentOrder(insights, positions);

  return (
    <div
      className="relative shrink-0 border-l border-[#E6E8EB] bg-white"
      style={{
        width: RAIL_WIDTH,
        height: viewportHeight > 0 ? viewportHeight : "100%",
      }}
    >
      {showExpandButton ? (
        <div className="absolute right-1 top-2 z-20">
          <button
            type="button"
            onClick={onExpandPanel}
            className="flex size-7 items-center justify-center rounded-lg bg-white text-[#65686B] shadow-sm hover:bg-[#F0F2F5]"
            aria-label="Open insights panel"
          >
            <PanelRightOpen className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}

      {sorted.slice(0, -1).map((insight, index) => {
        const next = sorted[index + 1];
        const y1 = positions[insight.id];
        const y2 = positions[next.id];
        if (y1 === undefined || y2 === undefined) return null;

        const top = Math.min(y1, y2) + NUMBER_SIZE / 2;
        const height = Math.abs(y2 - y1);
        if (height < 4) return null;

        return (
          <div
            key={`${insight.id}-${next.id}`}
            className="absolute left-1/2 w-px -translate-x-1/2 rounded-full bg-[#D1D5D9]"
            style={{ top, height }}
          />
        );
      })}

      {sorted.map((insight, index) => {
        const top = positions[insight.id];
        if (top === undefined) return null;
        const isActive = insight.id === activeInsightId;
        const order = index + 1;

        return (
          <button
            key={insight.id}
            type="button"
            onClick={() => onInsightChange(insight.id)}
            className={cn(
              "absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border text-[10px] leading-[1.24] tracking-[-0.36px] transition-[opacity,transform] duration-150",
              isActive
                ? "z-10 border-[#7E8185] bg-[#040617] text-[#E6E8EB] opacity-100"
                : "border-[#7E8185] bg-[#040617] text-[#E6E8EB] opacity-60 hover:opacity-100",
            )}
            style={{
              top: top - NUMBER_SIZE / 2,
              width: NUMBER_SIZE,
              height: NUMBER_SIZE,
            }}
            aria-label={`Insight ${order}`}
          >
            {order}
          </button>
        );
      })}
    </div>
  );
}

function InsightCard({
  insight,
  expanded,
  onToggleExpanded,
}: {
  insight: ReportInsight;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  if (!expanded) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-[#D1D5D9] bg-[#FBFBFB]/95 shadow-[0_4px_8px_rgba(0,0,0,0.08)] backdrop-blur-[10px]">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-start gap-2 p-3 text-left"
        >
          <p className="flex-1 text-[12px] font-medium leading-[1.4] text-[#353638]">
            {insight.title}
          </p>
          <ChevronDown className="mt-0.5 size-3.5 shrink-0 text-[#65686B]" />
        </button>
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]" />
      </div>
    );
  }

  return (
    <div
      className="relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border border-[#D1D5D9] bg-[#FBFBFB]/95 px-3 py-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] backdrop-blur-[10px]"
      style={{ minHeight: EXPANDED_CARD_HEIGHT, maxHeight: EXPANDED_CARD_HEIGHT }}
    >
      <div className="flex shrink-0 items-start gap-1">
        <p className="flex-1 text-[12px] font-medium leading-[1.4] text-[#353638]">
          {insight.title}
        </p>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex size-5 shrink-0 items-center justify-center rounded text-[#6B7280] hover:bg-[#F0F2F5]"
          aria-label="Collapse insight"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {insight.body ? (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {insight.body.map((paragraph, index) => (
            <p key={index} className="text-[12px] leading-[1.4] text-[#353638]">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <div className="flex-1" />
      )}

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F0F2F5]"
            aria-label="Copy insight"
          >
            <Copy className="size-3.5" />
          </button>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              className="flex h-8 max-w-full items-center justify-center rounded-lg border border-[#B3B8BD] px-2 text-[11px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
            >
              Analyze Further
            </button>
            <button
              type="button"
              className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#111] pl-2 pr-2.5 text-[11px] font-medium leading-[1.24] text-[#F0F2F5] hover:bg-[#333]"
            >
              <Check className="size-3.5" />
              OK
            </button>
          </div>
        </div>

      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]" />
    </div>
  );
}

export function ReportInsightsPanel({
  insights,
  activeInsightId,
  onInsightChange,
  collapsed,
  onToggleCollapse,
  positions,
  viewportHeight,
}: ReportInsightsPanelProps) {
  const [insightCardExpanded, setInsightCardExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(56);

  const activeInsight =
    insights.find((insight) => insight.id === activeInsightId) ?? insights[0];
  const reviewedInsights = insights.filter(
    (insight) => insight.reviewed && insight.id !== activeInsightId,
  );

  const contentHeight =
    viewportHeight > 0 ? viewportHeight - PANEL_HEADER_HEIGHT : "100%";

  const activeTop = positions[activeInsightId];
  const cardTop =
    activeTop !== undefined
      ? clampInsightCardTop(
          activeTop - NUMBER_SIZE / 2,
          cardHeight,
          typeof contentHeight === "number" ? contentHeight : viewportHeight,
        )
      : 96;

  useEffect(() => {
    if (collapsed) {
      setInsightCardExpanded(false);
    }
  }, [collapsed]);

  useLayoutEffect(() => {
    if (collapsed) return;

    const node = cardRef.current;
    if (!node) return;

    const measure = () => setCardHeight(node.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeInsightId, insightCardExpanded, collapsed]);

  const handleInsightChange = (id: string) => {
    onInsightChange(id);
    setInsightCardExpanded(false);
  };

  return (
    <div
      className="flex shrink-0 self-stretch overflow-hidden bg-white"
      style={{ height: viewportHeight > 0 ? viewportHeight : "100%" }}
    >
      <InsightNumberRail
        insights={insights}
        activeInsightId={activeInsightId}
        positions={positions}
        viewportHeight={viewportHeight}
        onInsightChange={handleInsightChange}
        showExpandButton={collapsed}
        onExpandPanel={onToggleCollapse}
      />

      <div
        className={cn(
          "relative flex shrink-0 flex-col overflow-hidden border-l border-[#D1D5D9] bg-white transition-[width,opacity] duration-200 ease-out",
          collapsed && "pointer-events-none border-l-0 opacity-0",
        )}
        style={{
          width: collapsed ? 0 : PANEL_BODY_WIDTH,
          height: viewportHeight > 0 ? viewportHeight : "100%",
        }}
        aria-hidden={collapsed}
      >
        <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-[#D1D5D9] px-3 pr-2">
          <h3 className="text-[13px] font-medium leading-[1.4] text-[#05091F]">
            Insights
          </h3>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex size-7 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close insights panel"
          >
            <PanelRightClose className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div
          className="relative min-h-0 w-full flex-1 overflow-hidden"
          style={{
            height:
              typeof contentHeight === "number" ? contentHeight : undefined,
          }}
        >
          <div
            ref={cardRef}
            className="absolute z-10 transition-[top] duration-150 ease-out"
            style={{
              top: cardTop,
              left: PANEL_CONTENT_PADDING,
              right: PANEL_CONTENT_PADDING,
            }}
          >
            <InsightCard
              insight={activeInsight}
              expanded={insightCardExpanded}
              onToggleExpanded={() => setInsightCardExpanded((value) => !value)}
            />
          </div>

          {insightCardExpanded
            ? reviewedInsights.map((insight, index) => (
                <div
                  key={insight.id}
                  className="absolute z-[5] rounded-xl border border-[#D1D5D9] bg-[#F3F6FA] px-3 py-2.5"
                  style={{
                    top: clampInsightCardTop(
                      cardTop + cardHeight + 12 + index * 72,
                      56,
                      typeof contentHeight === "number" ? contentHeight : viewportHeight,
                    ),
                    left: PANEL_CONTENT_PADDING,
                    right: PANEL_CONTENT_PADDING,
                  }}
                >
                  <div className="flex items-start gap-1">
                    <p className="flex-1 text-[12px] font-medium leading-[1.4] text-[#353638]">
                      {insight.title}
                    </p>
                    <Check className="size-3.5 shrink-0 text-[#2E7D32]" />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
