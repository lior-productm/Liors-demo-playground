"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Pencil, Share2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TopNavTabId } from "@/src/types/commercial";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import {
  AmiioAiDisclaimerTrigger,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";
import {
  insightDemoWorkflowLabel,
  type InsightCardModel,
  type InsightOverviewBucket,
} from "@/src/components/pages/InsightsManageInsightsSection";
import {
  AmiioExpandedDetailGrid,
  AmiioExpandableRecentActionRow,
} from "@/src/components/commercial/AmiioExpandableRow";
import {
  insightInlineFullDescription,
  insightInlineRecentActions,
} from "@/src/components/pages/insightCardExpandedHelpers";
import {
  InsightsCommercialSummaryCard,
  InsightsFinancialSummaryCard,
} from "@/src/components/pages/InsightsOverviewPortfolioWidgets";
import { AmiioSummaryTypewriterParts } from "@/src/components/commercial/AmiioSummaryTypewriter";

/**
 * Core Design System — Tertiary Colours (Charts variations) + Gradient/Alert.
 * Doughnut chart layout & chrome — Desktop-Comfort:
 * @see https://www.figma.com/design/X14IcrYNLuva2EZe8lGiD1/Core-Design-System?node-id=147-7300
 */
const INSIGHTS_CHART_CARD_CLASS = cn(
  "flex h-full min-h-0 w-full min-w-0 flex-col gap-4 rounded-[35px] border border-[rgba(230,231,232,0.7)] p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  amiioCardHoverSurface,
);

const INSIGHTS_CHART_CARD_SURFACE: CSSProperties = {
  backgroundImage:
    "linear-gradient(-88.59deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)",
};

/** ~204px plot — matches Figma "Doughnut" frame proportions */
const INSIGHTS_PIE_INNER_RADIUS = 62;
const INSIGHTS_PIE_OUTER_RADIUS = 100;
/** Taller bar chart for “Top insights” widget */
const INSIGHTS_IMPACT_BAR_CHART_HEIGHT = 300;
const DS_CHART_TERTIARY_40 = "#7B8CEB"; // Tertiary 40%
/** Tasks segment — matches Task workflow chip (black). */
const TASK_CHART_FILL = "#010309";

const BUCKET_META: Record<
  InsightOverviewBucket,
  {
    label: string;
    /** SVG / inline fill for Recharts */
    fill: string;
    /** Category badge on significant-insight rows */
    badgeClass: string;
  }
> = {
  insights: {
    label: "Insights",
    fill: "#142587",
    badgeClass: "bg-[#EBEDF9] text-[#233FDE]",
  },
  anomalies: {
    label: "Anomalies",
    fill: "#9F2D3A",
    badgeClass: "bg-[#FBEAEC] text-[#C65A66]",
  },
  new_information: {
    label: "New information",
    fill: DS_CHART_TERTIARY_40,
    badgeClass: "bg-[#D3D9F8] text-[#1B32B3]",
  },
};

const BUCKET_ORDER: InsightOverviewBucket[] = [
  "insights",
  "anomalies",
  "new_information",
];

type OverviewNavigate =
  | { kind: "insight"; insightId: string }
  | { kind: "tab"; tab: TopNavTabId }
  | { kind: "manage" }
  | { kind: "manage_bucket"; bucket: InsightOverviewBucket };

type RecentInsightAction = {
  id: string;
  actionIcon: LucideIcon;
  actionIconBg: string;
  title: string;
  initials: string;
  avatarBg: string;
  person: string;
  time: string;
  status: "Completed" | "Draft";
  fullDescription: string;
  recentActionLines: string[];
  navigate: OverviewNavigate;
};

const RECENT_ACTIONS: RecentInsightAction[] = [
  {
    id: "a1",
    actionIcon: Share2,
    actionIconBg: "bg-primary",
    title: "Reviewed insight — Service Charges discrepancy",
    initials: "MK",
    avatarBg: "bg-[#436367]",
    person: "Maria Koning",
    time: "Today · 09:12",
    status: "Completed",
    fullDescription:
      "Maria closed the loop on the service-charge variance flagged for this asset. Amiio reconciled billed vs. recovered amounts across three cost centres and confirmed the driver was a timing difference on utilities true-up.\n\nThe insight status moved to reviewed; no restatement of prior quarters was required.",
    recentActionLines: [
      "Comment thread resolved in the insight with a link to the FM invoice pack.",
      "Finance copied the final bridge into the monthly asset pack.",
      "No new anomalies were raised on the same charge lines.",
    ],
    navigate: { kind: "insight", insightId: "4" },
  },
  {
    id: "a2",
    actionIcon: Download,
    actionIconBg: "bg-muted-foreground",
    title: "Exported insights workbook (Financial scope)",
    initials: "JD",
    avatarBg: "bg-[#0E195B]",
    person: "Jim Duddley",
    time: "Yesterday · 16:40",
    status: "Completed",
    fullDescription:
      "Jim exported the Financial-scope insights workbook for the quarterly board read. The extract includes severity, owner, and last-updated timestamps so offline reviewers can sort without opening each card.\n\nFile is xlsx with three tabs: open, in review, and closed in period.",
    recentActionLines: [
      "Export job finished without row-level errors.",
      "Link to the file was posted in the portfolio Slack channel.",
      "CFO office downloaded a copy for the audit trail.",
    ],
    navigate: { kind: "tab", tab: "finance" },
  },
  {
    id: "a3",
    actionIcon: Pencil,
    actionIconBg: "bg-warning",
    title: "Draft edit — OPEX trend rule",
    initials: "MK",
    avatarBg: "bg-[#436367]",
    person: "Maria Koning",
    time: "Yesterday · 11:05",
    status: "Draft",
    fullDescription:
      "Maria is editing the OPEX trend detection rule after Q4 data landed. The draft widens the tolerance band for seasonal energy spikes so winter months stop generating false positives.\n\nChanges are not published — peer review is required before the rule runs in production.",
    recentActionLines: [
      "Diff view shows three threshold parameters adjusted.",
      "Data science asked for one more week of back-test results.",
    ],
    navigate: { kind: "insight", insightId: "3" },
  },
  {
    id: "a4",
    actionIcon: Share2,
    actionIconBg: "bg-[#7B8CEB]",
    title: "Assigned follow-up — Delayed payment tenant X Ltd",
    initials: "TZ",
    avatarBg: "bg-[#010309]",
    person: "Tomer Zakai",
    time: "2 days ago · 14:22",
    status: "Completed",
    fullDescription:
      "Tomer assigned collections follow-up on tenant X Ltd after Amiio surfaced a 21-day aged balance with no matching remittance advice. The task routes to the asset’s relationship owner with suggested email copy.\n\nExposure is modest relative to gross income; the goal is early dialogue before escalation.",
    recentActionLines: [
      "AR ticket created with medium priority.",
      "Legal notified only on a no-response path after day 10.",
      "Insight card updated with owner = Tomer and due date = Friday.",
    ],
    navigate: { kind: "insight", insightId: "6" },
  },
];

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  if (!row) return null;
  return (
    <div className="rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 text-[14px] font-medium leading-[1.24] text-[#353638] shadow-md">
      <span className="block text-[13px] font-normal text-[#65686B]">{row.name}</span>
      <span className="tabular-nums text-[#121212]">{row.value}</span>
    </div>
  );
}

export function InsightsOverviewSection({
  insights,
  onOpenInsight,
  onGoToManage,
  onGoToManageWithBucket,
  onNavigateTab,
}: {
  insights: InsightCardModel[];
  onOpenInsight: (card: InsightCardModel) => void;
  onGoToManage: () => void;
  onGoToManageWithBucket: (bucket: InsightOverviewBucket) => void;
  onNavigateTab: (tab: TopNavTabId) => void;
}) {
  const pieData = useMemo(() => {
    const buckets = BUCKET_ORDER.map((key) => ({
      key,
      name: BUCKET_META[key].label,
      value: insights.filter((i) => i.overviewBucket === key).length,
      fill: BUCKET_META[key].fill,
    }));
    const taskValue = insights.filter(
      (i) => insightDemoWorkflowLabel(i.id) === "Task",
    ).length;
    return [
      ...buckets,
      {
        key: "task" as const,
        name: "Tasks",
        value: taskValue,
        fill: TASK_CHART_FILL,
      },
    ];
  }, [insights]);

  const barData = useMemo(() => {
    const buckets = BUCKET_ORDER.map((key) => ({
      key,
      name: BUCKET_META[key].label,
      high: insights.filter(
        (i) => i.overviewBucket === key && i.impact === "high",
      ).length,
      fill: BUCKET_META[key].fill,
    }));
    const taskHigh = insights.filter(
      (i) =>
        insightDemoWorkflowLabel(i.id) === "Task" && i.impact === "high",
    ).length;
    return [
      ...buckets,
      {
        key: "task" as const,
        name: "Tasks",
        high: taskHigh,
        fill: TASK_CHART_FILL,
      },
    ];
  }, [insights]);

  const highImpactCards = useMemo(
    () => insights.filter((c) => c.impact === "high"),
    [insights],
  );

  const activeCount = useMemo(
    () => insights.filter((c) => c.active).length,
    [insights],
  );

  const navigate = (target: OverviewNavigate) => {
    if (target.kind === "insight") {
      const card = insights.find((c) => c.id === target.insightId);
      if (card) onOpenInsight(card);
      return;
    }
    if (target.kind === "tab") {
      onNavigateTab(target.tab);
      return;
    }
    if (target.kind === "manage_bucket") {
      onGoToManageWithBucket(target.bucket);
      return;
    }
    onGoToManage();
  };

  const totalSignals = insights.length;
  const anomaliesCount = pieData.find((d) => d.key === "anomalies")?.value ?? 0;
  const newInformationCount = pieData.find((d) => d.key === "new_information")?.value ?? 0;
  const insightsCount = pieData.find((d) => d.key === "insights")?.value ?? 0;

  const [expandedSignificantId, setExpandedSignificantId] = useState<string | null>(
    null,
  );
  const [showAllSignificant, setShowAllSignificant] = useState(false);
  const significantCardsToRender = showAllSignificant
    ? highImpactCards
    : highImpactCards.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Amiio Insights Summary */}
      <button
        type="button"
        onClick={() => navigate({ kind: "manage" })}
        className={cn(
          "relative w-full rounded-2xl border border-[rgba(230,231,232,0.85)] bg-[rgba(255,255,255,0.92)] p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          amiioCardHoverSurface,
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <Sparkles className="size-5 shrink-0 text-[#010309]" aria-hidden />
            </AmiioAiDisclaimerTrigger>
            <span className="text-[16px] font-semibold text-[#010309]">
              Amiio Insights Summary
            </span>
          </div>
          <span className="text-[12px] text-[#969A9E]">
            {activeCount} active · {totalSignals} total signals
          </span>
        </div>
        <p className="text-[14px] leading-[1.65] text-[#353638]">
          <AmiioSummaryTypewriterParts
            charDelayMs={7}
            parts={[
              { text: "Your portfolio generated " },
              { text: String(totalSignals), className: "font-semibold text-[#010309]" },
              { text: " evaluated signals this period. " },
              {
                text: `${anomaliesCount} anomalies`,
                className: "font-semibold text-[#9F2D3A]",
              },
              { text: " need review, " },
              {
                text: `${newInformationCount} new information`,
                className: "font-semibold text-[#7B8CEB]",
              },
              { text: " items refreshed from feeds, and recurring " },
              {
                text: `${insightsCount} insights`,
                className: "font-semibold text-[#142587]",
              },
              {
                text: " remain on watchlists. High-impact items are concentrated in service charges, income variance, and collections — open Manage Insights for full drill-down.",
              },
            ]}
          />
        </p>
        <p className="mt-3 text-[12px] font-medium text-primary">
          Open Manage Insights →
        </p>
      </button>

      {/* Charts */}
      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
          Insights Snapshot
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate({ kind: "manage" })}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate({ kind: "manage" });
              }
            }}
            className={cn(INSIGHTS_CHART_CARD_CLASS, "cursor-pointer")}
            style={INSIGHTS_CHART_CARD_SURFACE}
          >
            <div className="flex w-full shrink-0 items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="typo-h4 text-[#353638]">
                  Insights by type
                </p>
                <p className="text-[14px] font-normal leading-[1.24] text-[#65686B]">
                  Click a segment to filter Manage Insights by category.
                </p>
              </div>
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <WidgetHeaderLamp
                  chatLabel="Insights by type"
                  chatTopic="Explain how evaluated signals split across Insights, Anomalies, New information, and Tasks, and what each segment means for my portfolio."
                />
              </div>
            </div>
            <div className="relative mx-auto flex min-h-[240px] w-full max-w-[320px] flex-1 shrink-0 flex-col items-center justify-center">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex w-[min(52%,9.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                aria-hidden
              >
                <span className="w-full text-[14px] font-normal leading-[1.24] text-[#65686B]">
                  Total signals
                </span>
                <span className="w-full text-[48px] font-medium leading-[1.25] tracking-tight text-[#303552] tabular-nums sm:text-[40px]">
                  {totalSignals}
                </span>
              </div>
              <div className="relative z-10 h-[240px] w-full shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <Pie
                      {...AMIIO_CHART_MOTION}
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={INSIGHTS_PIE_INNER_RADIUS}
                      outerRadius={INSIGHTS_PIE_OUTER_RADIUS}
                      paddingAngle={3}
                      cornerRadius={5}
                      startAngle={90}
                      endAngle={-270}
                      stroke="#ffffff"
                      strokeWidth={2}
                      onClick={(_, index, e) => {
                        (e as MouseEvent<SVGElement> | undefined)?.stopPropagation();
                        const row = pieData[index];
                        if (!row) return;
                        if (row.key === "task") {
                          navigate({ kind: "manage" });
                          return;
                        }
                        navigate({ kind: "manage_bucket", bucket: row.key });
                      }}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.key} fill={entry.fill} className="cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex w-full shrink-0 justify-center gap-8 sm:gap-10">
              <div className="flex min-w-0 flex-col gap-3">
                {pieData.slice(0, 2).map((d) => (
                  <div
                    key={d.key}
                    className="flex min-w-0 items-center gap-4"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[1.24] text-[#65686B]">
                      {d.name}
                    </span>
                    <span className="w-8 shrink-0 text-right text-[14px] font-medium leading-[1.24] text-[#121212] tabular-nums">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                {pieData.slice(2).map((d) => (
                  <div
                    key={d.key}
                    className="flex min-w-0 items-center gap-4"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-normal leading-[1.24] text-[#65686B]">
                      {d.name}
                    </span>
                    <span className="w-8 shrink-0 text-right text-[14px] font-medium leading-[1.24] text-[#121212] tabular-nums">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate({ kind: "manage" })}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate({ kind: "manage" });
              }
            }}
            className={cn(INSIGHTS_CHART_CARD_CLASS, "cursor-pointer")}
            style={INSIGHTS_CHART_CARD_SURFACE}
          >
            <div className="flex w-full shrink-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="typo-h4 text-[#353638]">
                  Top insights
                </p>
                <p className="text-[14px] font-normal leading-[1.24] text-[#65686B]">
                  Count of high-impact signals per category.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <WidgetHeaderLamp
                    chatLabel="Top insights"
                    chatTopic="Interpret high-impact signals by category: how counts compare across Insights, Anomalies, New information, and Tasks."
                  />
                </div>
              </div>
            </div>
            <div
              className="relative z-10 w-full shrink-0"
              style={{ height: INSIGHTS_IMPACT_BAR_CHART_HEIGHT }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 4, right: 24, top: 16, bottom: 16 }}
                  barCategoryGap="12%"
                >
                  <CartesianGrid horizontal vertical={false} stroke="#E6E8EB" strokeDasharray="4 4" />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={132}
                    tick={{ fontSize: 14, fill: "#65686B", fontWeight: 400 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    {...AMIIO_CHART_MOTION}
                    dataKey="high"
                    maxBarSize={34}
                    radius={[0, 6, 6, 0]}
                  >
                    <LabelList
                      dataKey="high"
                      position="right"
                      offset={10}
                      style={{ fill: "#121212", fontSize: 14, fontWeight: 500 }}
                      formatter={(v: number) => (v > 0 ? String(v) : "")}
                    />
                    {barData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.fill}
                        className="cursor-pointer"
                        onClick={(e: MouseEvent<SVGElement>) => {
                          e.stopPropagation();
                          if (entry.key === "task") {
                            navigate({ kind: "manage" });
                            return;
                          }
                          navigate({ kind: "manage_bucket", bucket: entry.key });
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* High-impact list */}
      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
          Significant insights
        </h3>
        <div className="flex flex-col gap-3">
          {significantCardsToRender.map((card) => {
            const expanded = expandedSignificantId === card.id;
            return (
              <div
                key={card.id}
                className={cn(
                  "overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.9)] text-left",
                  amiioCardHoverSurface,
                )}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  onClick={() =>
                    setExpandedSignificantId((id) => (id === card.id ? null : card.id))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedSignificantId((id) => (id === card.id ? null : card.id));
                    }
                  }}
                  className="flex w-full cursor-pointer flex-col gap-2 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#010309]">{card.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[#65686B]">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        BUCKET_META[card.overviewBucket].badgeClass,
                      )}
                    >
                      {BUCKET_META[card.overviewBucket].label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInsight(card);
                      }}
                      className="text-[12px] font-medium text-primary underline-offset-2 hover:underline"
                    >
                      Open full detail →
                    </button>
                  </div>
                </div>
                {expanded ? (
                  <div className="border-t border-[rgba(230,231,232,0.7)] px-4 pb-4 pt-1">
                    <AmiioExpandedDetailGrid
                      fullDescription={insightInlineFullDescription(card)}
                      recentActionLines={insightInlineRecentActions(card)}
                      onAnalyseWithAmiio={() => onOpenInsight(card)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {highImpactCards.length > 3 ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAllSignificant((v) => !v);
                setExpandedSignificantId(null);
              }}
              className="inline-flex h-8 items-center rounded-full border border-[#D1D5D9] bg-white px-3 text-[12px] font-medium text-[#353638] transition-colors hover:bg-[#F7F8FA]"
            >
              {showAllSignificant ? "See less" : "See more"}
            </button>
          </div>
        ) : null}
      </div>

      {/* Portfolio context — Financial & Commercial (Core DS: tertiary, semantic green/orange) */}
      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
          Portfolio snapshot
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <InsightsFinancialSummaryCard
            onDetails={() => onNavigateTab("finance")}
          />
          <InsightsCommercialSummaryCard
            onDetails={() => onNavigateTab("commercial")}
          />
        </div>
      </div>

      {/* Recent actions */}
      <div>
        <h3 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
          Recent actions
        </h3>
        <div
          className="mb-1.5 hidden h-9 items-center border-b border-[rgba(230,231,232,0.7)] pl-4 pr-[52px] text-[12px] font-medium text-[#7E8185] sm:flex"
          aria-hidden
        >
          <span className="min-w-0 flex-1 pl-8">Title</span>
          <span className="w-[160px] shrink-0">Author</span>
          <span className="w-[112px] shrink-0">Time</span>
          <span className="w-[120px] shrink-0 text-right">Status</span>
        </div>
        <div className="flex flex-col gap-2">
          {RECENT_ACTIONS.map((a) => (
            <AmiioExpandableRecentActionRow
              key={a.id}
              actionIcon={a.actionIcon}
              actionIconBg={a.actionIconBg}
              title={a.title}
              initials={a.initials}
              avatarBg={a.avatarBg}
              person={a.person}
              time={a.time}
              status={a.status}
              fullDescription={a.fullDescription}
              recentActionLines={a.recentActionLines}
              onNavigate={() => navigate(a.navigate)}
              navigateLabel="Open related insight or workspace"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
