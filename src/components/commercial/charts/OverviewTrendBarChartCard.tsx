"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AmiioAnalyseIcon } from "@/src/components/commercial/AmiioAnalyseIcon";
import { AMIIO_AI_DISCLAIMER } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { COMMERCIAL_BAR_CHART_BAR_CLASS, lightenHexColor } from "@/src/lib/chartColors";
import {
  CHART_AXIS_EUR_K,
  CHART_AXIS_MAX_K,
  CHART_YEARS,
  formatOverviewBarTooltip,
  type OverviewBarChartMock,
} from "@/src/lib/commercialMockData";

const PLOT_H = 288;
const VIEWPORT_MIN_H = PLOT_H + 36;

function OverviewBarValueMarker({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-4 w-4 shrink-0 rounded-full border border-white bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)] ring-1 ring-[#D1D5D9]",
        className,
      )}
      aria-hidden
    >
      <span
        className="absolute inset-[3px] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="absolute inset-[5px] rounded-full bg-white" />
    </div>
  );
}

function defaultHighlightIndex(
  title: string,
  values: readonly number[],
): number | undefined {
  if (title === "Lease Expiry") return 1;
  let maxIdx = 0;
  values.forEach((v, i) => {
    if (v > values[maxIdx]!) maxIdx = i;
  });
  return maxIdx;
}

function barHeightPx(valueK: number, plotH = PLOT_H, maxK = CHART_AXIS_MAX_K): number {
  return Math.round((valueK / maxK) * plotH);
}

export function OverviewTrendBarChartCard({
  chart,
  onAnalyse,
  fileName,
  showExport = false,
}: {
  chart: OverviewBarChartMock;
  onAnalyse?: (topic: string) => void;
  fileName?: string;
  showExport?: boolean;
}) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [clickedBarIdx, setClickedBarIdx] = useState<number | null>(null);
  const highlightIdx = defaultHighlightIndex(chart.title, chart.values);
  const barHoverColor = lightenHexColor(chart.color);
  const years = CHART_YEARS;
  const yTicks = CHART_AXIS_EUR_K;
  const maxValue = CHART_AXIS_MAX_K;

  useEffect(() => {
    if (clickedBarIdx === null) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("[data-overview-trend-bar]") ||
        el.closest("[data-overview-trend-analyse]")
      ) {
        return;
      }
      setClickedBarIdx(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clickedBarIdx]);

  const analyseTopic = (year: string, valueK: number) =>
    `${chart.title} — ${formatOverviewBarTooltip(year, valueK, chart.title)}`;

  return (
    <div
      ref={exportRef}
      className={cn(
        "rounded-[32px] border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.92)] p-6",
        amiioCardHoverSurface,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="typo-h4 text-[#353638]">{chart.title}</h3>
        <div className="flex items-center gap-2">
          {showExport && fileName ? (
            <WidgetExportMenu
              variant="chart"
              fileName={fileName}
              captureRef={exportRef}
            />
          ) : null}
          {onAnalyse ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AmiioAnalyseIcon
                    nativeTitle={false}
                    onClick={() => onAnalyse(chart.chatTopic)}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={6}
                  className="max-w-[260px] border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium text-[#F0F2F5]"
                >
                  <p>Analyse with Amiio</p>
                  <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal leading-snug text-[#F0F2F5]/90">
                    {AMIIO_AI_DISCLAIMER}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <WidgetHeaderLamp chatTopic={chart.chatTopic} chatLabel={chart.chatLabel} />
          )}
        </div>
      </div>

      <div
        className="relative mt-5 w-full shrink-0 rounded-[24px] bg-white p-3 sm:p-4"
        style={{ minHeight: VIEWPORT_MIN_H }}
      >
        <div className="flex gap-2 sm:gap-3">
          <div
            className="flex w-10 shrink-0 flex-col justify-between text-[12px] font-normal leading-[1.24] text-[#65686B]"
            style={{ height: PLOT_H }}
          >
            {yTicks.map((tick) => (
              <span key={tick}>€{tick}K</span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            <div
              className="pointer-events-none absolute inset-x-0 top-0"
              style={{ height: PLOT_H }}
            >
              {yTicks.map((tick) => (
                <div
                  key={tick}
                  className="absolute left-0 right-0 border-t border-dotted border-[#E6E8EB]"
                  style={{ bottom: `${(tick / maxValue) * 100}%` }}
                />
              ))}
            </div>

            <TooltipProvider delayDuration={200}>
              <div
                className="relative flex items-end justify-between gap-2 px-0.5 sm:gap-3 sm:px-1"
                style={{ height: PLOT_H }}
              >
                {chart.values.map((valueK, idx) => {
                  const year = years[idx]!;
                  const h = barHeightPx(valueK);
                  const active = hoveredBar === idx;
                  const isHighlight =
                    highlightIdx !== undefined &&
                    idx === highlightIdx &&
                    hoveredBar === null;
                  const showValueTooltip =
                    active || isHighlight || clickedBarIdx === idx;
                  const useHoverColor = active || clickedBarIdx === idx;
                  const dimOthers =
                    (hoveredBar !== null && hoveredBar !== idx) ||
                    (clickedBarIdx !== null && clickedBarIdx !== idx);
                  const tooltipText = formatOverviewBarTooltip(
                    year,
                    valueK,
                    chart.title,
                  );

                  return (
                    <div
                      key={`${chart.title}-${year}`}
                      className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {showValueTooltip && (
                        <>
                          <div
                            className="absolute left-1/2 z-10 max-w-[min(240px,42vw)] -translate-x-1/2 rounded-lg bg-[#060B27] p-2 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.16)]"
                            style={{ bottom: h + 20 }}
                          >
                            <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.24] text-[#F0F2F5]">
                              {tooltipText}
                            </p>
                          </div>
                          <div
                            className="absolute left-1/2 z-[5] -translate-x-1/2"
                            style={{ bottom: h - 8 }}
                          >
                            <OverviewBarValueMarker color={chart.color} />
                          </div>
                        </>
                      )}
                      <div
                        data-overview-trend-bar
                        role="button"
                        tabIndex={0}
                        aria-label={`${year}, ${tooltipText}. Click for Analyse with Amiio.`}
                        className={cn(COMMERCIAL_BAR_CHART_BAR_CLASS, dimOthers && "opacity-45")}
                        style={{
                          height: h,
                          backgroundColor: useHoverColor ? barHoverColor : chart.color,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!onAnalyse) return;
                          setClickedBarIdx((prev) => (prev === idx ? null : idx));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (!onAnalyse) return;
                            setClickedBarIdx((prev) => (prev === idx ? null : idx));
                          }
                        }}
                      />
                      {clickedBarIdx === idx && onAnalyse && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              data-overview-trend-analyse
                              className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[32px] border border-[#D1D5D9] bg-[#F0F2F5] px-2.5 py-1.5 text-left shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)] transition-colors hover:bg-[#E6E8EB]"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAnalyse(analyseTopic(year, valueK));
                                setClickedBarIdx(null);
                              }}
                            >
                              <Lightbulb className="h-4 w-4 shrink-0 text-[#353638]" />
                              <span className="text-[14px] font-medium leading-[1.25] text-[#353638]">
                                Analyse with Amiio
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            sideOffset={6}
                            className="max-w-[260px] border border-[#E6E8EB] bg-[#353638] text-[12px] font-medium leading-snug text-[#F0F2F5]"
                          >
                            <p>
                              Send an analysis request to chat for {year} (
                              {tooltipText})
                            </p>
                            <p className="mt-2 border-t border-white/15 pt-2 text-[11px] font-normal text-[#F0F2F5]/90">
                              {AMIIO_AI_DISCLAIMER}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>

            <div className="mt-2 flex justify-between text-[12px] font-medium leading-[1.25] text-[#65686B]">
              {years.map((year) => (
                <div key={`${chart.title}-${year}-label`} className="flex min-w-0 flex-1 justify-center">
                  <span className="truncate">{year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
