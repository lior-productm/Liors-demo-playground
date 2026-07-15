import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

/**
 * Per-report template layout: the order of sections (base + custom) and which
 * sections are removed (hidden). Removal is reversible — removed ids stay in
 * `order` so a section returns to its original position when restored.
 */
export const TEMPLATE_LAYOUT_STORAGE_KEY = "amiio:reporting:template-layout";

export type TemplateLayout = {
  order: string[];
  removed: string[];
};

export type MoveDirection = "up" | "down";

type LayoutStore = Record<string, TemplateLayout>;

const EMPTY_LAYOUT: TemplateLayout = { order: [], removed: [] };

function readStore(): LayoutStore {
  return readLocalJson<LayoutStore>(TEMPLATE_LAYOUT_STORAGE_KEY, {});
}

export function readTemplateLayout(reportTitle: string): TemplateLayout {
  return readStore()[reportTitle] ?? EMPTY_LAYOUT;
}

export function writeTemplateLayout(reportTitle: string, layout: TemplateLayout) {
  const store = readStore();
  writeLocalJson(TEMPLATE_LAYOUT_STORAGE_KEY, { ...store, [reportTitle]: layout });
}

/** Drop ids that no longer exist and append any new ids in natural order. */
export function normalizeOrder(order: string[], naturalIds: string[]): string[] {
  const existing = order.filter((id) => naturalIds.includes(id));
  const missing = naturalIds.filter((id) => !existing.includes(id));
  return [...existing, ...missing];
}

export type ResolvedLayout = {
  order: string[];
  visibleIds: string[];
  removedIds: string[];
};

export function resolveLayout(
  layout: TemplateLayout,
  naturalIds: string[],
): ResolvedLayout {
  const order = normalizeOrder(layout.order, naturalIds);
  const removedSet = new Set(layout.removed.filter((id) => naturalIds.includes(id)));
  const visibleIds = order.filter((id) => !removedSet.has(id));
  const removedIds = order.filter((id) => removedSet.has(id));
  return { order, visibleIds, removedIds };
}

export function moveSection(
  layout: TemplateLayout,
  naturalIds: string[],
  id: string,
  direction: MoveDirection,
): TemplateLayout {
  const order = normalizeOrder(layout.order, naturalIds);
  const removedSet = new Set(layout.removed);
  const visible = order.filter((item) => !removedSet.has(item));

  const visibleIndex = visible.indexOf(id);
  const swapIndex = direction === "up" ? visibleIndex - 1 : visibleIndex + 1;
  if (visibleIndex < 0 || swapIndex < 0 || swapIndex >= visible.length) {
    return { order, removed: layout.removed };
  }

  const a = visible[visibleIndex];
  const b = visible[swapIndex];
  const next = [...order];
  next[order.indexOf(a)] = b;
  next[order.indexOf(b)] = a;
  return { order: next, removed: layout.removed };
}

/** Move `activeId` to `overId`'s slot among the visible sections (drag reorder). */
export function reorderSection(
  layout: TemplateLayout,
  naturalIds: string[],
  activeId: string,
  overId: string,
): TemplateLayout {
  const order = normalizeOrder(layout.order, naturalIds);
  if (activeId === overId) return { order, removed: layout.removed };

  const removedSet = new Set(layout.removed);
  const visible = order.filter((item) => !removedSet.has(item));
  const from = visible.indexOf(activeId);
  const to = visible.indexOf(overId);
  if (from < 0 || to < 0) return { order, removed: layout.removed };

  const nextVisible = [...visible];
  nextVisible.splice(to, 0, nextVisible.splice(from, 1)[0]);

  // Rebuild full order, keeping removed items anchored at their original slots.
  let visibleIndex = 0;
  const next = order.map((id) => (removedSet.has(id) ? id : nextVisible[visibleIndex++]));
  return { order: next, removed: layout.removed };
}

export function removeSection(
  layout: TemplateLayout,
  naturalIds: string[],
  id: string,
): TemplateLayout {
  const order = normalizeOrder(layout.order, naturalIds);
  if (layout.removed.includes(id)) return { order, removed: layout.removed };
  return { order, removed: [...layout.removed, id] };
}

export function restoreSection(
  layout: TemplateLayout,
  naturalIds: string[],
  id: string,
): TemplateLayout {
  const order = normalizeOrder(layout.order, naturalIds);
  return { order, removed: layout.removed.filter((item) => item !== id) };
}
