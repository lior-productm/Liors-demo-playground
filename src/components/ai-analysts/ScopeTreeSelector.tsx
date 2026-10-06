"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Info, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckBox, PrimaryButton } from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import {
  SCOPE_LEVEL_LABEL,
  SCOPE_LEVEL_PLURAL,
  SCOPE_TREE,
  findScopeNode,
  scopeSummaryLine,
} from "@/src/lib/aiAnalystsData";
import type { ScopeLevel, ScopeNode } from "@/src/types/aiAnalysts";
import { useI18n } from "@/src/hooks/useI18n";

const LEVEL_ORDER: ScopeLevel[] = ["portfolio", "entity", "property", "tenant"];

function flatten(nodes: ScopeNode[], acc: ScopeNode[] = []): ScopeNode[] {
  for (const n of nodes) {
    acc.push(n);
    if (n.children) flatten(n.children, acc);
  }
  return acc;
}

function matchesQuery(node: ScopeNode, q: string): boolean {
  if (!q) return true;
  if (node.name.toLowerCase().includes(q)) return true;
  return (node.children ?? []).some((c) => matchesQuery(c, q));
}

function childCountLabel(node: ScopeNode, translate: (key: string) => string): string | null {
  const children = node.children ?? [];
  if (children.length === 0) return null;
  const level = children[0]!.level;
  const word =
    children.length === 1
      ? translate(SCOPE_LEVEL_LABEL[level]).toLowerCase()
      : translate(SCOPE_LEVEL_PLURAL[level]);
  return `${children.length} ${word}`;
}

export function ScopeTreeSelector({
  selectableLevels,
  selectedIds,
  onChange,
  onDone,
  rootIds,
  primaryLevel,
  query = "",
  className,
  listMaxHeight = 320,
}: {
  /** Levels whose rows can be ticked. Other rows are context-only. */
  selectableLevels: ScopeLevel[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onDone: () => void;
  /** Restrict the visible tree to these node subtrees (used by subtasks). */
  rootIds?: string[];
  /** Level used in the note + summary (defaults to the first selectable level). */
  primaryLevel?: ScopeLevel;
  /** Search text (owned by the field above the dropdown). */
  query?: string;
  className?: string;
  /** Caps the scrolling rows so the dropdown stays inside its window. */
  listMaxHeight?: number;
}) {
  const { t } = useI18n();
  const roots = useMemo<ScopeNode[]>(() => {
    if (!rootIds || rootIds.length === 0) return SCOPE_TREE;
    return rootIds.map((id) => findScopeNode(id)).filter((n): n is ScopeNode => Boolean(n));
  }, [rootIds]);

  const allNodes = useMemo(() => flatten(roots), [roots]);
  const q = query.trim().toLowerCase();

  const selectableNodeIds = useMemo(
    () => allNodes.filter((n) => selectableLevels.includes(n.level)).map((n) => n.id),
    [allNodes, selectableLevels],
  );

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(allNodes.filter((n) => n.children?.length).map((n) => n.id)),
  );
  const toggleNode = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onChange([...next]);
  };

  const level = primaryLevel ?? selectableLevels[0]!;

  const visibleSelectable = selectableNodeIds.filter((id) => {
    const node = findScopeNode(id);
    return node ? matchesQuery(node, q) : false;
  });

  const renderRow = (node: ScopeNode, depth: number): React.ReactNode => {
    if (!matchesQuery(node, q)) return null;
    const hasChildren = Boolean(node.children?.length);
    const isOpen = expanded.has(node.id) || q.length > 0;
    const selectable = selectableLevels.includes(node.level);
    const checked = selectedIds.includes(node.id);
    const count = childCountLabel(node, t);

    return (
      <div key={node.id}>
        <div
          onClick={() => selectable && toggleNode(node.id, !checked)}
          className={cn(
            "flex items-center gap-2 py-2 pr-4 transition-colors",
            selectable ? "cursor-pointer hover:bg-[#F7F8FA]" : "",
            checked && "bg-[#EBEDF9] hover:bg-[#EBEDF9]",
          )}
          style={{ paddingInlineStart: 16 + depth * 20 }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => {
                  const next = new Set(prev);
                  if (next.has(node.id)) next.delete(node.id);
                  else next.add(node.id);
                  return next;
                });
              }}
              className="inline-flex size-4 shrink-0 items-center justify-center text-[#65686B]"
              aria-label={isOpen ? t("Collapse") : t("Expand")}
            >
              {isOpen ? (
                <ChevronDown size={16} strokeWidth={1.5} />
              ) : (
                <ChevronRight size={16} strokeWidth={1.5} />
              )}
            </button>
          ) : (
            <span className="size-4 shrink-0" />
          )}

          {selectable ? (
            <CheckBox checked={checked} onChange={(v) => toggleNode(node.id, v)} label={node.name} />
          ) : (
            <span className="size-4 shrink-0" />
          )}

          <span
            className={cn(
              "truncate text-[14px] leading-5",
              selectable ? "text-[#010309]" : "text-[#65686B]",
            )}
          >
            {node.name}
          </span>
          <span className="ms-1 shrink-0 text-[12px] font-medium uppercase leading-4 tracking-[0.02em] text-[#7E8185]">
            {t(SCOPE_LEVEL_LABEL[node.level])}
          </span>
          {count ? (
            <span className="ms-auto shrink-0 ps-3 text-[14px] leading-5 text-[#65686B]">{count}</span>
          ) : null}
        </div>
        {hasChildren && isOpen ? <div>{node.children!.map((c) => renderRow(c, depth + 1))}</div> : null}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-[12px] border border-[#E6E8EB] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)]",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-4 border-b border-[#E6E8EB] px-4 text-[14px] font-medium leading-5 text-[#010309]">
        <button
          type="button"
          onClick={() => setExpanded(new Set())}
          className="inline-flex items-center gap-1.5 hover:text-[#4F65E5]"
        >
          <MinusCircle size={16} strokeWidth={1.5} /> {t("Collapse all")}
        </button>
        <button
          type="button"
          onClick={() => onChange([...new Set([...selectedIds, ...visibleSelectable])])}
          className="hover:text-[#4F65E5]"
        >
          {t("Select all {plural}", { values: { plural: t(SCOPE_LEVEL_PLURAL[level]) } })}
        </button>
        <span className="h-4 w-px bg-[#E6E8EB]" />
        <button type="button" onClick={() => onChange([])} className="hover:text-[#4F65E5]">
          {t("Clear all")}
        </button>
      </div>

      <div className="flex items-center gap-2 bg-[#F7F8FA] px-4 py-2 text-[14px] leading-5 text-[#353638]">
        <Info size={16} strokeWidth={1.5} className="shrink-0 text-[#65686B]" />
        {t(
          "You can select only {plural} at this level; the rest of the hierarchy is displayed for context.",
          { values: { plural: t(SCOPE_LEVEL_PLURAL[level]) } },
        )}
      </div>

      <div
        className="overflow-y-auto overscroll-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C5C8CC] [&::-webkit-scrollbar-track]:bg-transparent"
        style={{ maxHeight: listMaxHeight }}
      >
        {roots.map((n) => renderRow(n, 0))}
        {visibleSelectable.length === 0 ? (
          <p className="px-4 py-6 text-center text-[14px] text-[#969A9E]">
            {t("No results for “{query}”.", { values: { query } })}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#E6E8EB] px-4 py-3">
        <span className="text-[14px] leading-5 text-[#353638]">
          {scopeSummaryLine({ level, ids: selectedIds }, t)}
        </span>
        <PrimaryButton size="sm" onClick={onDone}>
          {t("Done")}
        </PrimaryButton>
      </div>
    </div>
  );
}

export { LEVEL_ORDER };
