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
  GripVertical,
  Search,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import { InsightsListTable } from "@/src/components/pages/InsightsListTable";
import {
  INSIGHTS_SEED,
  type InsightCardModel,
  type InsightOverviewBucket,
  type InsightsInsightsSubTab,
  type InsightsTaskBoardLayout,
  type KanbanColumnId,
} from "@/src/components/pages/insights-data";

export type { InsightCardModel, InsightOverviewBucket, InsightsInsightsSubTab, InsightsTaskBoardLayout, KanbanColumnId };
export { INSIGHTS_SEED };

type InsightTag = { label: string; variant: "accent" | "warning" | "neutral" };

type InstructionToken = { kind: "chip" | "text"; text: string };

const OVERVIEW_BUCKET_LABEL: Record<InsightOverviewBucket, string> = {
  insights: "Insights",
  anomalies: "Anomalies",
  new_information: "New information",
};

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
  focusInsightId = null,
  onAckFocusInsight,
  onDeleteInsight,
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
  /** A freshly created insight to land on: opens All Insights, expands + scrolls to it. */
  focusInsightId?: string | null;
  onAckFocusInsight?: () => void;
  /** Permanently remove an insight (and navigate away to the dashboard). */
  onDeleteInsight?: (card: InsightCardModel) => void;
}) {
  // The Insights page now shows only the All Insights table (Task Planner /
  // Kanban has been retired), so this is fixed to "all".
  const [manageMainTab] = useState<"taskBoard" | "all">("all");
  const [listStatusFilter, setListStatusFilter] = useState<"active" | "inactive">("active");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ruleEditorOpen, setRuleEditorOpen] = useState(false);
  const [ruleEditorMode, setRuleEditorMode] = useState<"new" | "edit">("edit");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
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
      else list = list.filter((c) => !c.active);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q),
      );
    }
    if (overviewBucketFilter) {
      list = list.filter((c) => c.overviewBucket === overviewBucketFilter);
    }
    return list;
  }, [
    activeSubTab,
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

  // Land on a freshly created insight: expand its full description and smoothly
  // scroll it into view in the table.
  useEffect(() => {
    if (activeSubTab !== "manage" || !focusInsightId) return;
    setListStatusFilter("active");
    setInlineExpandedInsightId(focusInsightId);
    const raf = requestAnimationFrame(() => {
      document
        .querySelector(`[data-insight-row="${focusInsightId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    onAckFocusInsight?.();
    return () => cancelAnimationFrame(raf);
  }, [activeSubTab, focusInsightId, onAckFocusInsight]);

  const editingCard = editingCardId
    ? insights.find((c) => c.id === editingCardId)
    : undefined;

  const openEditModal = (cardId: string) => {
    setEditingCardId(cardId);
    setRuleEditorMode("edit");
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
              <div
                className="inline-flex items-center gap-2"
                role="tablist"
                aria-label="Filter by status"
              >
                {(["active", "inactive"] as const).map((key) => {
                  const selected = listStatusFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setListStatusFilter(key)}
                      className={cn(
                        "inline-flex h-10 min-w-[96px] items-center justify-center rounded-[32px] px-4 text-[14px] font-medium capitalize leading-[1.24] transition-colors",
                        selected
                          ? "bg-[#010309] text-[#F0F2F5]"
                          : "bg-transparent text-[#2C2C2C] hover:text-[#010309]",
                      )}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
              <label className="flex h-8 w-[209px] shrink-0 items-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white px-3 py-1">
                <Search className="size-4 shrink-0 text-[#969A9E]" aria-hidden />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.24] text-[#353638] placeholder:text-[#969A9E] outline-none"
                />
              </label>
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
          <InsightsListTable
            cards={filteredCards}
            expandedInsightId={inlineExpandedInsightId}
            onToggleExpand={toggleInlineExpandInsight}
            onAnalyseFurther={openInsightSidebar}
            onDeactivate={(card) => {
              setInlineExpandedInsightId(null);
              onPatchInsight(card.id, { active: false });
              setListStatusFilter("inactive");
            }}
            onActivate={(card) => {
              setInlineExpandedInsightId(null);
              onPatchInsight(card.id, { active: true });
              setListStatusFilter("active");
            }}
            onDelete={(card) => onDeleteInsight?.(card)}
          />
        )}

      {filteredCards.length === 0 ? (
        <p className="typo-p3-r text-muted-foreground">No insights match your filters.</p>
      ) : null}

      <div className="flex justify-center pt-1">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[13px] font-medium",
              page <= 1 ? "cursor-not-allowed text-[#969A9E]" : "text-[#676A6E] hover:text-[#353638]",
            )}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(1)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-[13px] leading-[1.24]",
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
                "flex size-7 items-center justify-center rounded-full text-[13px] leading-[1.24]",
                page === n ? "bg-[#39393A] text-white" : "text-[#676A6E]",
              )}
            >
              {n}
            </button>
          ))}
          <span className="flex h-7 items-center px-3 text-[13px] text-[#676A6E]">...</span>
          <button
            type="button"
            onClick={() => setPage(PAGINATION_MAX_PAGE)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-[13px] leading-[1.24]",
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
              "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[13px] font-medium",
              page >= PAGINATION_MAX_PAGE
                ? "cursor-not-allowed text-[#969A9E]"
                : "text-[#676A6E] hover:text-[#353638]",
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    );
  }

  return null;
}
