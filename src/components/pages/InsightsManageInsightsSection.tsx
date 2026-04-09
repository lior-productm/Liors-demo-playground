"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  ChevronDown,
  Filter,
  GripVertical,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import type { TopNavTabId } from "@/src/types/commercial";
import { InsightActionButtons } from "@/src/components/pages/InsightActionButtons";
import { InsightRuleEditorDialog } from "@/src/components/pages/InsightRuleEditorDialog";
import { InsightsOverviewSection } from "@/src/components/pages/InsightsOverviewSection";
import { AmiioExpandedDetailGrid } from "@/src/components/commercial/AmiioExpandableRow";
import {
  insightInlineFullDescription,
  insightInlineRecentActions,
} from "@/src/components/pages/insightCardExpandedHelpers";
import { InsightsAmiiopediaSection } from "@/src/components/pages/InsightsAmiiopediaSection";

type InsightTag = { label: string; variant: "accent" | "warning" | "neutral" };

type InstructionToken = { kind: "chip" | "text"; text: string };

export type KanbanColumnId = "backlog" | "in_progress" | "done";

/** Insights Overview analytics grouping */
export type InsightOverviewBucket = "insights" | "anomalies" | "new_information";

const OVERVIEW_BUCKET_LABEL: Record<InsightOverviewBucket, string> = {
  insights: "Insights",
  anomalies: "Anomalies",
  new_information: "New information",
};

export type InsightCardModel = {
  id: string;
  active: boolean;
  title: string;
  subtitle: string;
  subtitleClassName?: string;
  tags: InsightTag[];
  workflowType: "insight" | "task";
  updatedLabel: string;
  /** ISO date (YYYY-MM-DD) for “Date triggered” filter */
  triggeredAt: string;
  /** Task board column */
  kanbanColumn: KanbanColumnId;
  /** Overview tab: pie / bar distribution */
  overviewBucket: InsightOverviewBucket;
  /** Overview tab: high-impact callouts */
  impact: "standard" | "high";
  /** Expanded row: stats + instruction builder preview */
  expandDetail?: {
    triggered: string;
    createdOn: string;
    updatedBy: string;
    instructionTokens: InstructionToken[];
  };
  /** Inline expand panel (Full description + Recent actions) */
  fullDescription?: string;
  recentActionLines?: string[];
};

const SERVICE_CHARGE_INSTRUCTION: InstructionToken[] = [
  { kind: "chip", text: "RentalIncomeDecrease" },
  { kind: "text", text: "Greater than" },
  { kind: "chip", text: "5%" },
  { kind: "text", text: "years" },
  { kind: "text", text: "AND" },
  { kind: "chip", text: "DecreaseAmount" },
  { kind: "text", text: "Greater than" },
  { kind: "chip", text: "3.000" },
];

const FILTER_INSIGHT_TYPE_OPTIONS = ["Financial", "Commercial"] as const;

export const INSIGHTS_SEED: InsightCardModel[] = [
  {
    id: "1",
    active: true,
    title: "Rental income decrease",
    subtitle: "Decrease of 5% with minimum of €3.000",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "P&L", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 1 hour ago",
    triggeredAt: "2024-12-10",
    kanbanColumn: "backlog",
    overviewBucket: "anomalies",
    impact: "high",
  },
  {
    id: "2",
    active: true,
    title: "Expenses increase (general)",
    subtitle: "Increase of 5% with minimum of €3.000",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Commercial", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated 2 hours ago",
    triggeredAt: "2024-12-20",
    kanbanColumn: "backlog",
    overviewBucket: "insights",
    impact: "standard",
  },
  {
    id: "3",
    active: false,
    title: "OPEX trend",
    subtitle: "Consecutive months of OPEX Increase",
    tags: [
      { label: "Financial", variant: "neutral" },
      { label: "P&L", variant: "neutral" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 1 sec ago",
    triggeredAt: "2024-12-05",
    kanbanColumn: "in_progress",
    overviewBucket: "new_information",
    impact: "high",
  },
  {
    id: "4",
    active: true,
    title: "Service Charges discrepancy",
    subtitle: "10% YTD gap between advances and expenses",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Service Charge", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated on 20 Aug 2025",
    triggeredAt: "2024-12-18",
    kanbanColumn: "in_progress",
    expandDetail: {
      triggered: "15 times (last 7 days)",
      createdOn: "12 Sep 2025",
      updatedBy: "@jimduddley",
      instructionTokens: SERVICE_CHARGE_INSTRUCTION,
    },
    overviewBucket: "anomalies",
    impact: "high",
  },
  {
    id: "5",
    active: true,
    title: "Expense increase (Z C.V.)",
    subtitle: "Any increase in expenses for Z C.V.",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "P&L", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated on 10 Aug 2025",
    triggeredAt: "2024-12-22",
    kanbanColumn: "done",
    overviewBucket: "insights",
    impact: "standard",
  },
  {
    id: "6",
    active: true,
    title: "Delayed payment tenant X Ltd",
    subtitle: "Notification of any late payment of tenant X Ltd",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "General", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated on 30 Jul 2025",
    triggeredAt: "2024-12-28",
    kanbanColumn: "done",
    overviewBucket: "anomalies",
    impact: "high",
  },
  {
    id: "7",
    active: true,
    title: "Vacancy spike — logistics cluster",
    subtitle: "Portfolio vacancy 2.1pp above threshold on three assets",
    tags: [
      { label: "Commercial", variant: "accent" },
      { label: "Occupancy", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 4 hours ago",
    triggeredAt: "2025-01-02",
    kanbanColumn: "backlog",
    overviewBucket: "insights",
    impact: "high",
  },
  {
    id: "8",
    active: true,
    title: "Rent indexation batch due Q1",
    subtitle: "Twelve leases eligible — model c. €180K indexed rent uplift",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Leasing", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated 6 hours ago",
    triggeredAt: "2025-01-03",
    kanbanColumn: "in_progress",
    overviewBucket: "insights",
    impact: "high",
  },
];

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function endOfLocalDay(iso: string): Date {
  const d = parseLocalDate(iso);
  d.setHours(23, 59, 59, 999);
  return d;
}

function tagClasses(variant: InsightTag["variant"]) {
  switch (variant) {
    case "accent":
      return "bg-[#D3D9F8] text-[#233FDE]";
    case "warning":
      return "bg-[#FEFAF2] text-[#E7B65A]";
    default:
      return "bg-[#F2F4F7] text-[#676A6E]";
  }
}

function workflowTagClasses(kind: "Insight" | "Task") {
  return kind === "Insight"
    ? "bg-[#142587] text-[#F0F2F5]"
    : "bg-[#010309] text-[#F0F2F5]";
}

/** Deterministic demo label so chips and overview charts stay aligned. */
export function insightDemoWorkflowLabel(cardId: string): "Insight" | "Task" {
  const hash = [...cardId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return hash % 2 === 0 ? "Insight" : "Task";
}

function InsightCardChrome({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative isolate flex h-full min-h-[232px] w-full min-w-0 flex-col rounded-xl p-6",
        amiioCardHoverSurface,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl backdrop-blur-[6px]"
        style={{
          backgroundImage:
            "linear-gradient(-88.38deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%)",
        }}
      />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{children}</div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_6px_rgba(255,255,255,0.2)]"
      />
    </div>
  );
}

export const KANBAN_COLUMNS: { id: KanbanColumnId; label: string }[] = [
  { id: "backlog", label: "To do" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
];

const KANBAN_STATUS_TAG_CLASS: Record<KanbanColumnId, string> = {
  backlog: "bg-[#EDEEF2] text-[#3D4249]",
  in_progress: "bg-[#DCE8FA] text-[#1A4D8C]",
  done: "bg-[#D8F0E0] text-[#146B3A]",
};

export function kanbanStatusTagClass(column: KanbanColumnId): string {
  return KANBAN_STATUS_TAG_CLASS[column];
}

function InsightKanbanCard({
  card,
  selected,
  expanded,
  onToggleExpand,
  onOpenDetail,
  onEdit,
  onActiveChange,
  dragHandleProps,
  dragHandleRef,
}: {
  card: InsightCardModel;
  selected: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenDetail: () => void;
  onEdit: () => void;
  onActiveChange: (next: boolean) => void;
  dragHandleProps: ComponentPropsWithoutRef<"button">;
  dragHandleRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E6E8EB] bg-white/95 p-3",
        amiioCardHoverSurface,
        selected ? "ring-2 ring-[#233FDE] ring-offset-2" : "hover:border-[#233FDE]/35",
      )}
    >
      <div
        className="flex items-start gap-1.5"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={dragHandleRef}
          className={cn(
            "mt-0.5 flex size-8 shrink-0 touch-none items-center justify-center rounded-lg text-[#969A9E] transition-colors hover:bg-[#F2F4F7] hover:text-[#676A6E]",
            "cursor-grab active:cursor-grabbing",
          )}
          aria-label="Drag to move card"
          {...dragHandleProps}
        >
          <GripVertical className="size-4" strokeWidth={1.5} />
        </button>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <Switch
            checked={card.active}
            onCheckedChange={onActiveChange}
            className="h-5 w-9 shrink-0 scale-90 border-0 data-[state=checked]:bg-[#05091F] data-[state=unchecked]:bg-[#ACAEBA]"
          />
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-[12px] font-medium text-[#4E4F52] hover:text-[#010309]"
          >
            Edit
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggleExpand}
        className="mt-2 w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/40"
      >
        <p className="text-[14px] font-medium leading-snug text-[#353638]">{card.title}</p>
        <p
          className={cn(
            "mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[#676A6E]",
            card.subtitleClassName,
          )}
        >
          {card.subtitle}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {card.tags.map((t) => (
            <span
              key={`${card.id}-kb-${t.label}`}
              className={cn(
                "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium leading-none",
                tagClasses(t.variant),
              )}
            >
              {t.label}
            </span>
          ))}
          {(() => {
            const workflowTag = insightDemoWorkflowLabel(card.id);
            return (
              <span
                className={cn(
                  "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium leading-none",
                  workflowTagClasses(workflowTag),
                )}
              >
                {workflowTag}
              </span>
            );
          })()}
        </div>
      </button>
      {expanded ? (
        <div className="mt-3 min-w-0 border-t border-[#E6E8EB] pt-3">
          <AmiioExpandedDetailGrid
            fullDescription={insightInlineFullDescription(card)}
            recentActionLines={insightInlineRecentActions(card)}
            onAnalyseWithAmiio={onOpenDetail}
          />
          <div className="border-t border-[#E6E8EB] bg-[#F3F4F6] px-3 pb-3 pt-3 sm:px-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
              className="text-[13px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
            >
              Open full detail →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isKanbanColumnId(id: unknown): id is KanbanColumnId {
  return id === "backlog" || id === "in_progress" || id === "done";
}

function KanbanDraggableCard({
  card,
  selected,
  expanded,
  onToggleExpand,
  onOpenDetail,
  onEdit,
  onActiveChange,
}: {
  card: InsightCardModel;
  selected: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenDetail: () => void;
  onEdit: () => void;
  onActiveChange: (next: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("rounded-xl", isDragging && "z-10 opacity-40")}
      role="group"
    >
      <InsightKanbanCard
        card={card}
        selected={selected}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
        onActiveChange={onActiveChange}
        dragHandleProps={{ ...listeners, ...attributes }}
        dragHandleRef={setActivatorNodeRef}
      />
    </div>
  );
}

function KanbanDroppableColumn({
  columnId,
  label,
  count,
  layout,
  children,
}: {
  columnId: KanbanColumnId;
  label: string;
  count: number;
  layout: "horizontal" | "vertical";
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      className={cn(
        "flex min-h-[240px] flex-col gap-3 rounded-xl border border-[#E6E8EB] bg-[#F7F8FA]/90 p-3 shadow-[0px_2px_12px_rgba(0,0,0,0.04)]",
        layout === "horizontal"
          ? "min-w-[min(100%,280px)] flex-1 basis-[260px]"
          : "w-full",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#676A6E]">
          {label}
        </h3>
        <span className="text-[12px] font-medium tabular-nums text-[#969A9E]">{count}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[160px] flex-1 flex-col gap-2 rounded-lg p-0.5 transition-[background-color,box-shadow]",
          isOver && "bg-[#233FDE]/[0.07] ring-2 ring-inset ring-[#233FDE]/25",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function InsightKanbanBoardDnd({
  layout,
  filteredCards,
  selectedDetailInsightId,
  expandedInsightId,
  onToggleExpandInsight,
  onOpenInsight,
  onEdit,
  onActiveChange,
  onPatchInsight,
}: {
  layout: "horizontal" | "vertical";
  filteredCards: InsightCardModel[];
  selectedDetailInsightId: string | null;
  expandedInsightId: string | null;
  onToggleExpandInsight: (cardId: string) => void;
  onOpenInsight: (card: InsightCardModel) => void;
  onEdit: (cardId: string) => void;
  onActiveChange: (cardId: string, next: boolean) => void;
  onPatchInsight: (id: string, patch: Partial<InsightCardModel>) => void;
}) {
  const [activeCard, setActiveCard] = useState<InsightCardModel | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveCard(filteredCards.find((c) => c.id === id) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || !isKanbanColumnId(over.id)) return;
    const cardId = String(active.id);
    const targetColumn = over.id;
    const card = filteredCards.find((c) => c.id === cardId);
    if (!card || card.kanbanColumn === targetColumn) return;
    onPatchInsight(cardId, { kanbanColumn: targetColumn });
  };

  const handleDragCancel = () => {
    setActiveCard(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={cn(
          "gap-4",
          layout === "horizontal" ? "flex flex-row flex-wrap items-start" : "flex flex-col",
        )}
      >
        {KANBAN_COLUMNS.map((col) => {
          const columnCards = filteredCards.filter((c) => c.kanbanColumn === col.id);
          return (
            <KanbanDroppableColumn
              key={col.id}
              columnId={col.id}
              label={col.label}
              count={columnCards.length}
              layout={layout}
            >
              {columnCards.map((card) => (
                <KanbanDraggableCard
                  key={card.id}
                  card={card}
                  selected={selectedDetailInsightId === card.id}
                  expanded={expandedInsightId === card.id}
                  onToggleExpand={() => onToggleExpandInsight(card.id)}
                  onOpenDetail={() => onOpenInsight(card)}
                  onEdit={() => onEdit(card.id)}
                  onActiveChange={(next) => onActiveChange(card.id, next)}
                />
              ))}
            </KanbanDroppableColumn>
          );
        })}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.25,1,0.5,1)" }}>
        {activeCard ? (
          <div className="pointer-events-none w-[min(100%,248px)] rounded-xl border border-[#E6E8EB] bg-white/98 p-3 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] ring-2 ring-[#233FDE]/20">
            <p className="text-[14px] font-medium leading-snug text-[#353638]">{activeCard.title}</p>
            <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[#676A6E]">
              {activeCard.subtitle}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function InsightManageCard({
  card,
  expanded,
  onToggleExpand,
  onOpenSidePanel,
  onEdit,
  onActiveChange,
  selected,
}: {
  card: InsightCardModel;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenSidePanel: () => void;
  onEdit: () => void;
  onActiveChange: (next: boolean) => void;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-full w-full rounded-xl",
        selected && "ring-2 ring-[#233FDE] ring-offset-2",
      )}
    >
      <InsightCardChrome>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div
            className="flex h-8 items-center justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Switch
                checked={card.active}
                onCheckedChange={onActiveChange}
                className="h-6 w-10 shrink-0 border-0 data-[state=checked]:bg-[#05091F] data-[state=unchecked]:bg-[#ACAEBA]"
              />
              <span className="text-[12px] font-medium leading-[1.25] text-[#676A6E]">
                {card.active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#B3B8BD] text-[#353638] transition-colors hover:bg-[#F2F4F7]"
              aria-label="More"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "Insight options" } }),
                )
              }
            >
              <MoreVertical className="size-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 cursor-pointer flex-col gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/40 focus-visible:ring-offset-2"
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} details for ${card.title}`}
            onClick={onToggleExpand}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleExpand();
              }
            }}
          >
            <div className="flex min-h-[56px] flex-col gap-1.5 pt-2 leading-[1.5]">
              <p className="line-clamp-2 text-[16px] font-medium text-[#353638]">{card.title}</p>
              <p
                className={cn(
                  "line-clamp-2 text-[12px] text-[#676A6E]",
                  card.subtitleClassName,
                )}
              >
                {card.subtitle}
              </p>
            </div>

            <div className="flex min-h-6 flex-wrap gap-3">
              {card.tags.map((t) => (
                <span
                  key={`${card.id}-${t.label}`}
                  className={cn(
                    "inline-flex h-6 items-center rounded-2xl px-2 py-1 text-[12px] font-medium leading-[1.25]",
                    tagClasses(t.variant),
                  )}
                >
                  {t.label}
                </span>
              ))}
              {(() => {
                const workflowTag = insightDemoWorkflowLabel(card.id);
                return (
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-2xl px-2 py-1 text-[12px] font-medium leading-[1.25]",
                      workflowTagClasses(workflowTag),
                    )}
                  >
                    {workflowTag}
                  </span>
                );
              })()}
            </div>
          </div>

          {expanded ? (
            <div className="min-w-0 border-t border-[#E6E8EB] pt-3">
              <AmiioExpandedDetailGrid
                fullDescription={insightInlineFullDescription(card)}
                recentActionLines={insightInlineRecentActions(card)}
                onAnalyseWithAmiio={onOpenSidePanel}
              />
              <div className="border-t border-[#E6E8EB] bg-[#F3F4F6] px-0 pb-1 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSidePanel();
                  }}
                  className="text-[13px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
                >
                  Open full detail →
                </button>
              </div>
            </div>
          ) : null}

          <div
            className="mt-auto flex h-10 items-start justify-between border-t border-[#E6E8EB] pt-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-[12px] font-medium leading-[1.5] text-[#676A6E]">
              <Calendar className="size-4 shrink-0" strokeWidth={1.5} />
              <span>{card.updatedLabel}</span>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="flex h-8 items-center gap-1 px-2 py-1 text-[14px] font-medium leading-[1.5] text-[#4E4F52] transition-colors hover:text-[#010309]"
            >
              <Pencil className="size-4" strokeWidth={1.5} />
              Edit
            </button>
          </div>
        </div>
      </InsightCardChrome>
    </div>
  );
}

export type InsightsInsightsSubTab = "overview" | "manage" | "amiiopedia";

export type InsightsTaskBoardLayout = "horizontal" | "vertical";

const PAGINATION_MAX_PAGE = 10;

export function InsightsManageInsightsSection({
  activeSubTab,
  insights,
  onPatchInsight,
  onOpenInsightDetail,
  selectedDetailInsightId = null,
  incomingManageBucket = null,
  onAckIncomingManageBucket,
  onOverviewOpenInsight,
  onOverviewGoToManage,
  onOverviewGoToManageWithBucket,
  onOverviewNavigateTab,
  taskBoardLayout,
}: {
  activeSubTab: InsightsInsightsSubTab;
  insights: InsightCardModel[];
  onPatchInsight: (id: string, patch: Partial<InsightCardModel>) => void;
  onOpenInsightDetail?: (card: InsightCardModel) => void;
  selectedDetailInsightId?: string | null;
  incomingManageBucket?: InsightOverviewBucket | null;
  onAckIncomingManageBucket?: () => void;
  onOverviewOpenInsight?: (card: InsightCardModel) => void;
  onOverviewGoToManage?: () => void;
  onOverviewGoToManageWithBucket?: (bucket: InsightOverviewBucket) => void;
  onOverviewNavigateTab?: (tab: TopNavTabId) => void;
  taskBoardLayout: InsightsTaskBoardLayout;
}) {
  const [manageMainTab, setManageMainTab] = useState<"taskBoard" | "all">(
    "taskBoard",
  );
  const [listStatusFilter, setListStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [ruleEditorMode, setRuleEditorMode] = useState<"new" | "edit">("edit");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedInsightTypes, setAppliedInsightTypes] = useState<string[]>([]);
  const [appliedDateFrom, setAppliedDateFrom] = useState<string | null>(null);
  const [appliedDateTo, setAppliedDateTo] = useState<string | null>(null);
  const [draftInsightTypes, setDraftInsightTypes] = useState<string[]>([]);
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");
  const [inlineExpandedInsightId, setInlineExpandedInsightId] = useState<string | null>(null);
  const [overviewBucketFilter, setOverviewBucketFilter] =
    useState<InsightOverviewBucket | null>(null);

  const setInsightActive = (id: string, nextActive: boolean) => {
    onPatchInsight(id, { active: nextActive });
  };

  const filteredCards = useMemo(() => {
    let list = [...insights];
    if (activeSubTab === "manage" && manageMainTab === "all") {
      if (listStatusFilter === "active") list = list.filter((c) => c.active);
      else if (listStatusFilter === "inactive")
        list = list.filter((c) => !c.active);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q),
      );
    }
    if (appliedInsightTypes.length > 0) {
      list = list.filter((c) =>
        c.tags.some((tag) => appliedInsightTypes.includes(tag.label)),
      );
    }
    if (appliedDateFrom && appliedDateTo) {
      const fromT = parseLocalDate(appliedDateFrom).getTime();
      const toT = endOfLocalDay(appliedDateTo).getTime();
      list = list.filter((c) => {
        const t = parseLocalDate(c.triggeredAt).getTime();
        return t >= fromT && t <= toT;
      });
    }
    if (overviewBucketFilter) {
      list = list.filter((c) => c.overviewBucket === overviewBucketFilter);
    }
    return list;
  }, [
    activeSubTab,
    appliedDateFrom,
    appliedDateTo,
    appliedInsightTypes,
    insights,
    listStatusFilter,
    manageMainTab,
    overviewBucketFilter,
    search,
  ]);

  useEffect(() => {
    if (
      activeSubTab === "manage" &&
      incomingManageBucket != null
    ) {
      setOverviewBucketFilter(incomingManageBucket);
      onAckIncomingManageBucket?.();
    }
  }, [activeSubTab, incomingManageBucket, onAckIncomingManageBucket]);

  useEffect(() => {
    if (
      inlineExpandedInsightId &&
      !filteredCards.some((c) => c.id === inlineExpandedInsightId)
    ) {
      setInlineExpandedInsightId(null);
    }
  }, [inlineExpandedInsightId, filteredCards]);

  useEffect(() => {
    setInlineExpandedInsightId(null);
  }, [manageMainTab]);

  const filtersAreActive =
    appliedInsightTypes.length > 0 ||
    Boolean(appliedDateFrom && appliedDateTo) ||
    Boolean(overviewBucketFilter);

  const filterBadgeCount = filtersAreActive ? filteredCards.length : null;

  const handleFiltersOpenChange = (open: boolean) => {
    setFiltersOpen(open);
    if (open) {
      setDraftInsightTypes([...appliedInsightTypes]);
      setDraftDateFrom(appliedDateFrom ?? "");
      setDraftDateTo(appliedDateTo ?? "");
    }
  };

  const toggleDraftInsightType = (label: string) => {
    setDraftInsightTypes((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const applyFilters = () => {
    setAppliedInsightTypes([...draftInsightTypes]);
    if (draftDateFrom && draftDateTo) {
      setAppliedDateFrom(draftDateFrom);
      setAppliedDateTo(draftDateTo);
    } else {
      setAppliedDateFrom(null);
      setAppliedDateTo(null);
    }
    setFiltersOpen(false);
  };

  const clearAllFilters = () => {
    setDraftInsightTypes([]);
    setDraftDateFrom("");
    setDraftDateTo("");
    setAppliedInsightTypes([]);
    setAppliedDateFrom(null);
    setAppliedDateTo(null);
    setOverviewBucketFilter(null);
  };

  const editingCard = editingCardId
    ? insights.find((c) => c.id === editingCardId)
    : undefined;

  const openEditModal = (cardId: string) => {
    setEditingCardId(cardId);
    setRuleEditorMode("edit");
    setRuleEditorOpen(true);
  };

  const openNewModal = () => {
    setEditingCardId(null);
    setRuleEditorMode("new");
    setRuleEditorOpen(true);
  };

  if (activeSubTab === "amiiopedia") {
    return <InsightsAmiiopediaSection onOpenManageInsights={onOverviewGoToManage} />;
  }

  if (activeSubTab === "overview") {
    if (
      !onOverviewOpenInsight ||
      !onOverviewGoToManage ||
      !onOverviewGoToManageWithBucket ||
      !onOverviewNavigateTab
    ) {
      return (
        <div className="rounded-xl border border-border bg-card px-6 py-8">
          <p className="typo-p3-r text-muted-foreground">
            Overview navigation is not configured.
          </p>
        </div>
      );
    }
    return (
      <InsightsOverviewSection
        insights={insights}
        onOpenInsight={onOverviewOpenInsight}
        onGoToManage={onOverviewGoToManage}
        onGoToManageWithBucket={onOverviewGoToManageWithBucket}
        onNavigateTab={onOverviewNavigateTab}
      />
    );
  }

  const openInsightSidebar = (card: InsightCardModel) => {
    setInlineExpandedInsightId(null);
    onOpenInsightDetail?.(card);
  };

  const toggleInlineExpandInsight = (cardId: string) => {
    setInlineExpandedInsightId((id) => (id === cardId ? null : cardId));
  };

  if (activeSubTab === "manage") {
    const manageGridClass = cn(
      "grid gap-6",
      taskBoardLayout === "horizontal"
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1",
    );
    const renderManageCardSlot = (card: InsightCardModel) => (
      <div key={card.id} className="flex w-full min-h-[232px]">
        <InsightManageCard
          card={card}
          selected={selectedDetailInsightId === card.id}
          expanded={inlineExpandedInsightId === card.id}
          onToggleExpand={() => toggleInlineExpandInsight(card.id)}
          onOpenSidePanel={() => openInsightSidebar(card)}
          onEdit={() => openEditModal(card.id)}
          onActiveChange={(next) => setInsightActive(card.id, next)}
        />
      </div>
    );

    return (
      <div className="flex flex-col gap-6">
        {overviewBucketFilter ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D3D9F8] bg-[#EEF0FF] px-4 py-2.5">
            <p className="text-[13px] font-medium text-[#233FDE]">
              Filtered from Overview:{" "}
              <span className="font-semibold text-[#010309]">
                {OVERVIEW_BUCKET_LABEL[overviewBucketFilter]}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setOverviewBucketFilter(null)}
              className="text-[13px] font-semibold text-[#233FDE] underline-offset-2 hover:underline"
            >
              Clear category filter
            </button>
          </div>
        ) : null}
        <InsightRuleEditorDialog
          open={ruleEditorOpen}
          onOpenChange={setRuleEditorOpen}
          mode={ruleEditorMode}
          initialName={editingCard?.title}
          initialDescription={editingCard?.subtitle}
          initialTypeChips={editingCard?.tags.map((t) => t.label)}
        />

        <div className="flex flex-col gap-2">
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="flex min-w-0 min-h-9 flex-1 flex-col gap-2 basis-[min(100%,420px)] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="inline-flex w-fit rounded-[24px] border border-[#E6E8EB] bg-white p-0.5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
                  {(["taskBoard", "all"] as const).map((key) => {
                    const selected =
                      key === "taskBoard"
                        ? manageMainTab === "taskBoard"
                        : manageMainTab === "all";
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setManageMainTab(key);
                          if (key === "taskBoard") setListStatusFilter("all");
                        }}
                        className={cn(
                          "flex h-8 min-w-[72px] items-center justify-center rounded-[24px] px-3 text-[14px] font-medium capitalize leading-[1.24] transition-colors sm:min-w-[96px]",
                          selected
                            ? "bg-[#111] text-white shadow-[0px_2px_6px_rgba(0,0,0,0.16)]"
                            : "text-[#4E4F52]",
                        )}
                      >
                        {key === "taskBoard" ? "Task Planner" : "All Insights"}
                      </button>
                    );
                  })}
                </div>
                {manageMainTab === "all" ? (
                  <div
                    className="inline-flex w-fit rounded-[20px] border border-[#E6E8EB] bg-[#F8F9FA] p-0.5"
                    role="tablist"
                    aria-label="Filter by status"
                  >
                    {(["all", "active", "inactive"] as const).map((key) => {
                      const selected = listStatusFilter === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setListStatusFilter(key)}
                          className={cn(
                            "flex h-7 min-w-[64px] items-center justify-center rounded-[18px] px-2.5 text-[13px] font-medium capitalize leading-[1.24] transition-colors sm:min-w-[76px]",
                            selected
                              ? "bg-white text-[#010309] shadow-[0px_1px_4px_rgba(0,0,0,0.08)]"
                              : "text-[#676A6E]",
                          )}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <label className="flex h-9 w-[min(209px,42vw)] min-w-[140px] max-w-[209px] items-center gap-2 rounded-full border border-[#D1D5D9] bg-white px-2.5 py-1.5">
                  <Search className="size-4 shrink-0 text-[#969A9E]" aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.24] text-[#353638] placeholder:text-[#969A9E] outline-none"
                  />
                </label>
                <Popover open={filtersOpen} onOpenChange={handleFiltersOpenChange}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="relative inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[#E6E8EB] bg-white pl-3 pr-3.5 text-[14px] font-medium leading-[1.24] text-[#353638] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#FAFAFA]"
                    >
                      <Filter className="size-4 text-[#4E4F52]" aria-hidden />
                      Filters
                      {filterBadgeCount !== null ? (
                        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#020410] px-1 text-[11px] font-semibold leading-none text-white">
                          {filterBadgeCount > 99 ? "99+" : filterBadgeCount}
                        </span>
                      ) : null}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="w-[290px] rounded-xl border border-[#E6E8EB] bg-white p-0 text-[#353638] shadow-[0px_10px_28px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex items-start justify-between border-b border-[#E6E8EB] px-4 py-3">
                      <p className="text-[14px] font-medium leading-[1.24] text-[#676A6E]">
                        Select filters
                      </p>
                      <button
                        type="button"
                        className="flex size-6 shrink-0 items-center justify-center rounded text-[#353638] hover:bg-black/5"
                        aria-label="Close filters"
                        onClick={() => handleFiltersOpenChange(false)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-5 px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-[14px] font-medium text-[#353638]">Insight types</p>
                        <div className="flex flex-wrap gap-2">
                          {FILTER_INSIGHT_TYPE_OPTIONS.map((label) => {
                            const selected = draftInsightTypes.includes(label);
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleDraftInsightType(label)}
                                className={cn(
                                  "inline-flex h-8 items-center rounded-full px-3 text-[14px] font-medium leading-[1.24] transition-colors",
                                  selected
                                    ? "border border-[#233FDE] bg-[#EBF0FE] text-[#233FDE]"
                                    : "bg-[#F2F4F7] text-[#353638]",
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-[14px] font-medium text-[#353638]">Date triggered</p>
                        <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D1D5D9] bg-white px-2.5">
                          <Calendar className="size-4 shrink-0 text-[#676A6E]" strokeWidth={1.5} />
                          <input
                            type="date"
                            value={draftDateFrom}
                            onChange={(e) => setDraftDateFrom(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#353638] outline-none [color-scheme:light]"
                            aria-label="From date"
                          />
                          <span className="shrink-0 text-[12px] text-[#969A9E]">–</span>
                          <input
                            type="date"
                            value={draftDateTo}
                            onChange={(e) => setDraftDateTo(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#353638] outline-none [color-scheme:light]"
                            aria-label="To date"
                          />
                          <ChevronDown className="size-4 shrink-0 text-[#353638]" aria-hidden />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-[#E6E8EB] px-4 py-3">
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#E6E8EB] bg-white px-3 text-[14px] font-medium text-[#353638] hover:bg-[#F7F8FA]"
                      >
                        Clear all
                      </button>
                      <button
                        type="button"
                        onClick={applyFilters}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-[#020410] px-3 text-[14px] font-medium text-white hover:bg-[#010309]"
                      >
                        Apply filters
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
        </div>

        {manageMainTab === "taskBoard" ? (
          <InsightKanbanBoardDnd
            layout={taskBoardLayout}
            filteredCards={filteredCards}
            selectedDetailInsightId={selectedDetailInsightId ?? null}
            expandedInsightId={inlineExpandedInsightId}
            onToggleExpandInsight={toggleInlineExpandInsight}
            onOpenInsight={openInsightSidebar}
            onEdit={openEditModal}
            onActiveChange={(cardId, next) => setInsightActive(cardId, next)}
            onPatchInsight={onPatchInsight}
          />
        ) : (
          <div className={manageGridClass}>{filteredCards.map(renderManageCardSlot)}</div>
        )}

      {filteredCards.length === 0 ? (
        <p className="typo-p3-r text-muted-foreground">No insights match your filters.</p>
      ) : null}

      <div className="flex flex-col items-stretch gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
        {manageMainTab === "taskBoard" ? (
          <div className="hidden sm:block sm:flex-1" aria-hidden />
        ) : null}

        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2 sm:justify-center",
            manageMainTab === "all" && "sm:flex-1",
            manageMainTab === "taskBoard" && "hidden",
          )}
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[14px] font-medium",
              page <= 1 ? "cursor-not-allowed text-[#969A9E]" : "text-[#676A6E] hover:text-[#353638]",
            )}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(1)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
              page === 1 ? "bg-[#39393A] text-white" : "text-[#676A6E]",
            )}
          >
            1
          </button>
          {[2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
                page === n ? "bg-[#39393A] text-white" : "text-[#676A6E]",
              )}
            >
              {n}
            </button>
          ))}
          <span className="flex h-8 items-center px-4 text-[14px] text-[#676A6E]">...</span>
          <button
            type="button"
            onClick={() => setPage(PAGINATION_MAX_PAGE)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
              page === PAGINATION_MAX_PAGE ? "bg-[#39393A] text-white" : "text-[#676A6E]",
            )}
          >
            {PAGINATION_MAX_PAGE}
          </button>
          <button
            type="button"
            disabled={page >= PAGINATION_MAX_PAGE}
            onClick={() => setPage((p) => Math.min(PAGINATION_MAX_PAGE, p + 1))}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[14px] font-medium",
              page >= PAGINATION_MAX_PAGE
                ? "cursor-not-allowed text-[#969A9E]"
                : "text-[#676A6E] hover:text-[#353638]",
            )}
          >
            Next
          </button>
        </div>

        <button
          type="button"
          title="Creat new insight"
          className="flex size-12 shrink-0 items-center justify-center rounded-[32px] bg-[#020410] text-white shadow-[0px_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90"
          aria-label="Creat new insight"
          onClick={openNewModal}
        >
          <Plus className="size-6" strokeWidth={2} />
        </button>
      </div>
    </div>
    );
  }

  return null;
}
