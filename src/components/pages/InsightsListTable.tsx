"use client";

import { useMemo, useState, type ComponentPropsWithoutRef } from "react";
import { ChevronRight, Lightbulb, MoreVertical, ToggleLeft, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { insightInlineFullDescription } from "@/src/components/pages/insightCardExpandedHelpers";
import {
  InsightsColumnFilter,
  type ColumnSortDir,
  type DateRange,
} from "@/src/components/pages/InsightsColumnFilter";
import {
  InsightConfirmDialog,
  type InsightConfirmAction,
} from "@/src/components/pages/InsightConfirmDialog";
import type { InsightCardModel, InsightTag } from "@/src/components/pages/insights-data";

type FilterColumnId = "topic" | "data" | "createdBy" | "triggered";

/** Shared column template keeps the gray header aligned with every row. */
const TABLE_GRID_STYLE = {
  gridTemplateColumns: "minmax(200px, 1fr) 112px 112px 144px 108px 240px",
} as const;

/** Row action slots: primary control | menu | expand chevron. */
const ACTIONS_CELL_CLASS =
  "grid min-w-0 grid-cols-[minmax(0,1fr)_48px_48px] items-center gap-0 px-2";

function TableGrid({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("grid w-full", className)} style={TABLE_GRID_STYLE} {...props}>
      {children}
    </div>
  );
}

const topicOf = (c: InsightCardModel) => c.tags[0]?.label ?? "";
const dataOf = (c: InsightCardModel) => c.tags[1]?.label ?? "";
const creatorOf = (c: InsightCardModel) => c.createdBy ?? "Amiio AI";

/** Only insights authored by a user (not Amiio AI) expose lifecycle actions. */
const isUserCreated = (c: InsightCardModel) =>
  Boolean(c.createdBy) && c.createdBy !== "Amiio AI";

function distinct(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function listTagClasses(label: string, kind: "topic" | "data") {
  if (kind === "topic") {
    if (label === "Commercial") return "bg-[#EBEDF9] text-[#303552]";
    return "bg-[#EBEDF9] text-[#233FDE]";
  }
  if (label === "Rent Roll" || label === "Service Charge") {
    return "bg-[#E6F6F3] text-[#1F9E8B]";
  }
  if (label === "P&L" || label === "Commercial") {
    return "bg-[#FBF2DC] text-[#C2912F]";
  }
  return "bg-[#F2F4F7] text-[#676A6E]";
}

function ListTag({ tag, kind }: { tag: InsightTag; kind: "topic" | "data" }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-2xl px-2 py-1 text-[12px] font-medium leading-[1.25]",
        listTagClasses(tag.label, kind),
      )}
    >
      {tag.label}
    </span>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CreatedByCell({ createdBy }: { createdBy?: string }) {
  const isAmiio = !createdBy || createdBy === "Amiio AI";
  if (isAmiio) {
    return (
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-xl border border-[#1B32B3] p-0.5">
          <Lightbulb className="size-3.5 text-[#1B32B3]" strokeWidth={2} aria-hidden />
        </span>
        <span
          className="truncate bg-clip-text text-[14px] leading-[1.4] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(179deg, #1B32B3 1.63%, #000000 128.52%)",
          }}
        >
          Amiio AI
        </span>
      </div>
    );
  }
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-[20px] bg-[#E6E8EB] p-0.5">
        <span className="text-[10px] font-medium leading-[1.5] text-[#2C2C2C]">
          {initialsOf(createdBy)}
        </span>
      </span>
      <span className="truncate text-[14px] font-normal leading-[1.4] text-[#353638]">
        {createdBy}
      </span>
    </div>
  );
}

function triggeredText(card: InsightCardModel): string {
  if (card.triggeredLabel) return card.triggeredLabel;
  return card.updatedLabel.replace(/^Updated\s+/i, "");
}

function HeaderCell({
  label,
  className,
  align = "left",
  children,
}: {
  label: string;
  className?: string;
  align?: "left" | "right";
  /** Optional trailing control (e.g. a column filter trigger). */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1 px-2 text-[14px] font-medium leading-[1.24] text-[#676A6E]",
        align === "right" && "justify-end",
        className,
      )}
    >
      <span className="truncate">{label}</span>
      {children}
    </div>
  );
}

function GhostActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-6 shrink-0 items-center justify-center rounded-lg border border-[#B3B8BD] px-1.5 py-1 text-[12px] font-medium leading-[1.25] text-[#111] transition-colors hover:bg-[#F0F2F5]"
    >
      {children}
    </button>
  );
}

function RowMenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[41px] w-full items-center gap-1.5 rounded px-1.5 text-left text-[16px] font-normal leading-[1.25] transition-colors",
        danger
          ? "text-[#9F2D3A] hover:bg-[#FBEDEE]"
          : "text-[#353638] hover:bg-[#E6E8EB]",
      )}
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function RowActionsMenu({
  isInactive,
  onDeactivate,
  onDelete,
  onAnalyseFurther,
}: {
  isInactive: boolean;
  onDeactivate: () => void;
  onDelete: () => void;
  onAnalyseFurther: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className="flex size-6 shrink-0 items-center justify-center text-[#65686B] transition-colors hover:text-[#353638]"
        >
          <MoreVertical className="size-6" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[184px] rounded-lg border border-[#E6E8EB] bg-[#F0F2F5] p-2 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        {isInactive ? (
          <RowMenuItem
            icon={<Lightbulb className="size-5 text-[#65686B]" strokeWidth={1.75} />}
            label="Analyze further"
            onClick={() => {
              close();
              onAnalyseFurther();
            }}
          />
        ) : (
          <RowMenuItem
            icon={<ToggleLeft className="size-6 text-[#65686B]" strokeWidth={1.75} />}
            label="Deactivate"
            onClick={() => {
              close();
              onDeactivate();
            }}
          />
        )}
        <RowMenuItem
          icon={<Trash2 className="size-5 text-[#9F2D3A]" strokeWidth={1.75} />}
          label="Delete"
          danger
          onClick={() => {
            close();
            onDelete();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function InsightTableRow({
  card,
  expanded,
  onToggleExpand,
  onAnalyseFurther,
  onRequestDeactivate,
  onRequestActivate,
  onRequestDelete,
}: {
  card: InsightCardModel;
  expanded: boolean;
  onToggleExpand: () => void;
  onAnalyseFurther: () => void;
  onRequestDeactivate: () => void;
  onRequestActivate: () => void;
  onRequestDelete: () => void;
}) {
  const isInactive = !card.active;
  const userCreated = isUserCreated(card);
  // Active insights only show lifecycle actions when authored by a user;
  // inactive insights are user-authored by definition (only those can be
  // deactivated), so they always expose the actions menu.
  const showActionsMenu = isInactive || userCreated;
  const topicTag = card.tags[0];
  const dataTag = card.tags[1];
  const paragraphs = insightInlineFullDescription(card)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      data-insight-row={card.id}
      className={cn(
        "flex flex-col transition-colors",
        card.isNew && "bg-[#FAFBFF]",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className="group grid h-[52px] w-full cursor-pointer items-center border-b border-[#F2F4F7] outline-none transition-colors hover:bg-[#F7F8FA] focus-visible:bg-[#F7F8FA]"
        style={TABLE_GRID_STYLE}
      >
        {/* Summary + new dot */}
        <div className="flex h-full min-w-0 items-center gap-2.5 py-1.5 pl-2 pr-4">
          <span className="flex h-full w-1.5 shrink-0 items-center justify-center">
            {card.isNew ? (
              <span className="relative flex size-[6px]">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4F65E5] opacity-50" />
                <span className="relative inline-flex size-[6px] rounded-full bg-[#4F65E5]" />
              </span>
            ) : null}
          </span>
          <p
            className={cn(
              "line-clamp-2 min-w-0 flex-1 text-[13px] leading-[1.4] text-[#353638]",
              card.isNew ? "font-medium" : "font-normal",
            )}
          >
            {card.title}
          </p>
        </div>

        {/* Topic */}
        <div className="flex h-full min-w-0 items-center px-2 py-2">
          {topicTag ? <ListTag tag={topicTag} kind="topic" /> : null}
        </div>

        {/* Data */}
        <div className="flex h-full min-w-0 items-center px-2 py-2">
          {dataTag ? <ListTag tag={dataTag} kind="data" /> : null}
        </div>

        {/* Created by */}
        <div className="flex h-full min-w-0 items-center px-2 py-2">
          <CreatedByCell createdBy={card.createdBy} />
        </div>

        {/* Triggered */}
        <div className="flex h-full min-w-0 items-center px-2 py-2">
          <span className="truncate text-[13px] leading-[1.4] text-[#65686B]">
            {triggeredText(card)}
          </span>
        </div>

        {/* Actions */}
        <div
          className={cn(ACTIONS_CELL_CLASS, "h-full py-2")}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex min-w-0 items-center justify-end">
            {isInactive ? (
              <GhostActionButton onClick={onRequestActivate}>Activate Insight</GhostActionButton>
            ) : (
              <GhostActionButton onClick={onAnalyseFurther}>Analyse further</GhostActionButton>
            )}
          </div>
          {showActionsMenu ? (
            <div className="flex items-center justify-center">
              <RowActionsMenu
                isInactive={isInactive}
                onDeactivate={onRequestDeactivate}
                onDelete={onRequestDelete}
                onAnalyseFurther={onAnalyseFurther}
              />
            </div>
          ) : (
            <span aria-hidden />
          )}
          <button
            type="button"
            aria-label={expanded ? "Collapse" : "Expand"}
            onClick={onToggleExpand}
            className="flex size-12 items-center justify-center text-[#65686B] transition-colors hover:text-[#353638]"
          >
            <ChevronRight
              className={cn(
                "size-6 transition-transform duration-200",
                expanded && "rotate-90",
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      {/* Expanded: Full description */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-b border-[#F2F4F7] bg-[#F0F2F5] p-4">
            <p className="text-[12px] font-medium leading-[1.25] text-[#676A6E]">
              Full description
            </p>
            <div className="mt-2 space-y-1.5 text-[14px] leading-[1.4] text-[#121314]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightsListTable({
  cards,
  expandedInsightId,
  onToggleExpand,
  onAnalyseFurther,
  onDeactivate,
  onActivate,
  onDelete,
}: {
  cards: InsightCardModel[];
  expandedInsightId: string | null;
  onToggleExpand: (id: string) => void;
  onAnalyseFurther: (card: InsightCardModel) => void;
  onDeactivate: (card: InsightCardModel) => void;
  onActivate: (card: InsightCardModel) => void;
  onDelete: (card: InsightCardModel) => void;
}) {
  const [confirm, setConfirm] = useState<{
    action: InsightConfirmAction;
    card: InsightCardModel;
  } | null>(null);
  const [sort, setSort] = useState<{ col: FilterColumnId; dir: ColumnSortDir } | null>(null);
  const [topicSel, setTopicSel] = useState<string[] | null>(null);
  const [dataSel, setDataSel] = useState<string[] | null>(null);
  const [creatorSel, setCreatorSel] = useState<string[] | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const topicOptions = useMemo(() => distinct(cards.map(topicOf)), [cards]);
  const dataOptions = useMemo(() => distinct(cards.map(dataOf)), [cards]);
  const creatorOptions = useMemo(() => distinct(cards.map(creatorOf)), [cards]);

  const displayed = useMemo(() => {
    let list = cards;
    if (topicSel) list = list.filter((c) => topicSel.includes(topicOf(c)));
    if (dataSel) list = list.filter((c) => dataSel.includes(dataOf(c)));
    if (creatorSel) list = list.filter((c) => creatorSel.includes(creatorOf(c)));
    if (dateRange) {
      list = list.filter(
        (c) => c.triggeredAt >= dateRange.from && c.triggeredAt <= dateRange.to,
      );
    }
    if (sort) {
      const get =
        sort.col === "topic"
          ? topicOf
          : sort.col === "data"
            ? dataOf
            : sort.col === "createdBy"
              ? creatorOf
              : (c: InsightCardModel) => c.triggeredAt;
      list = [...list].sort((a, b) => {
        const av = get(a);
        const bv = get(b);
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [cards, topicSel, dataSel, creatorSel, dateRange, sort]);

  const makeSort = (col: FilterColumnId) => (dir: ColumnSortDir) => setSort({ col, dir });

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.action === "delete") onDelete(confirm.card);
    else if (confirm.action === "deactivate") onDeactivate(confirm.card);
    else onActivate(confirm.card);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E6E8EB] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin]">
        <div className="w-full min-w-[916px]">
          {/* Header */}
          <TableGrid className="items-center bg-[#F2F4F7]">
            <HeaderCell label="Summary" className="min-w-0 pl-4 pr-4" />
            <HeaderCell label="Topic" className="min-w-0">
              <InsightsColumnFilter
                label="Topic"
                variant="select"
                options={topicOptions}
                active={topicSel !== null || sort?.col === "topic"}
                appliedValues={topicSel}
                sortDir={sort?.col === "topic" ? sort.dir : null}
                onSort={makeSort("topic")}
                onApplyValues={setTopicSel}
              />
            </HeaderCell>
            <HeaderCell label="Data" className="min-w-0">
              <InsightsColumnFilter
                label="Data"
                variant="select"
                options={dataOptions}
                active={dataSel !== null || sort?.col === "data"}
                appliedValues={dataSel}
                sortDir={sort?.col === "data" ? sort.dir : null}
                onSort={makeSort("data")}
                onApplyValues={setDataSel}
              />
            </HeaderCell>
            <HeaderCell label="Created by" className="min-w-0">
              <InsightsColumnFilter
                label="Creator"
                variant="select"
                options={creatorOptions}
                active={creatorSel !== null || sort?.col === "createdBy"}
                appliedValues={creatorSel}
                sortDir={sort?.col === "createdBy" ? sort.dir : null}
                onSort={makeSort("createdBy")}
                onApplyValues={setCreatorSel}
              />
            </HeaderCell>
            <HeaderCell label="Triggered" className="min-w-0">
              <InsightsColumnFilter
                label="Date"
                variant="date"
                active={dateRange !== null || sort?.col === "triggered"}
                appliedRange={dateRange}
                sortDir={sort?.col === "triggered" ? sort.dir : null}
                onSort={makeSort("triggered")}
                onApplyRange={setDateRange}
              />
            </HeaderCell>
            <HeaderCell label="Actions" className="min-w-0 pl-10" />
          </TableGrid>

          {/* Rows */}
          {displayed.map((card) => (
            <InsightTableRow
              key={card.id}
              card={card}
              expanded={expandedInsightId === card.id}
              onToggleExpand={() => onToggleExpand(card.id)}
              onAnalyseFurther={() => onAnalyseFurther(card)}
              onRequestDeactivate={() => setConfirm({ action: "deactivate", card })}
              onRequestActivate={() => setConfirm({ action: "activate", card })}
              onRequestDelete={() => setConfirm({ action: "delete", card })}
            />
          ))}
          {displayed.length === 0 ? (
            <p className="px-4 py-8 text-center text-[14px] text-[#969A9E]">
              No insights match the selected filters.
            </p>
          ) : null}
        </div>
      </div>

      {confirm ? (
        <InsightConfirmDialog
          action={confirm.action}
          open
          onOpenChange={(open) => {
            if (!open) setConfirm(null);
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
}
