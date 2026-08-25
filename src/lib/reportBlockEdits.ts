import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import type {
  ReportDocumentBlock,
  ReportDocumentSection,
} from "@/src/lib/reportingMockData";

/**
 * Per-report, object-level (block) edits inside the Template Studio.
 *
 * Sections come from a mix of the shared base document and persisted custom
 * sections; this module overlays edits on top of those blocks so a user can
 * edit, replace, or remove individual objects (metrics, tables, charts, …)
 * without mutating the source data.
 *
 * Edits are keyed by the block's ORIGINAL index within its section
 * (`${sectionId}#${index}`), so keys stay stable even after other blocks in
 * the same section are removed or replaced.
 */
export const BLOCK_EDITS_STORAGE_KEY = "amiio:reporting:block-edits";

export function blockEditKey(sectionId: string, originalIndex: number): string {
  return `${sectionId}#${originalIndex}`;
}

export type ReportBlockEdits = {
  /** Edit keys whose original block is hidden. */
  removed: string[];
  /** Edit key → replacement block(s) (edit in place or replace with new objects). */
  overrides: Record<string, ReportDocumentBlock[]>;
};

export const EMPTY_BLOCK_EDITS: ReportBlockEdits = { removed: [], overrides: {} };

type BlockEditsStore = Record<string, ReportBlockEdits>;

function readStore(): BlockEditsStore {
  return readLocalJson<BlockEditsStore>(BLOCK_EDITS_STORAGE_KEY, {});
}

export function readBlockEdits(reportTitle: string): ReportBlockEdits {
  const entry = readStore()[reportTitle];
  if (!entry) return EMPTY_BLOCK_EDITS;
  return {
    removed: entry.removed ?? [],
    overrides: entry.overrides ?? {},
  };
}

export function writeBlockEdits(reportTitle: string, edits: ReportBlockEdits) {
  const store = readStore();
  writeLocalJson(BLOCK_EDITS_STORAGE_KEY, { ...store, [reportTitle]: edits });
}

/** A single rendered block plus the edit key of the original slot it maps to. */
export type ResolvedBlock = {
  block: ReportDocumentBlock;
  editKey: string;
  /** True when this block was substituted by the user (edit/replace). */
  overridden: boolean;
};

/**
 * Overlay the edits onto a section, returning the final blocks to render and
 * the edit key each rendered block maps back to. Removed slots are dropped;
 * overridden slots emit their replacement block(s) (all sharing the slot key).
 */
export function resolveSectionBlocks(
  section: ReportDocumentSection,
  edits: ReportBlockEdits,
): ResolvedBlock[] {
  const removed = new Set(edits.removed);
  const resolved: ResolvedBlock[] = [];

  section.blocks.forEach((block, index) => {
    const editKey = blockEditKey(section.id, index);
    if (removed.has(editKey)) return;

    const override = edits.overrides[editKey];
    if (override && override.length > 0) {
      override.forEach((overrideBlock) =>
        resolved.push({ block: overrideBlock, editKey, overridden: true }),
      );
      return;
    }

    resolved.push({ block, editKey, overridden: false });
  });

  return resolved;
}

export function removeBlockEdit(
  edits: ReportBlockEdits,
  editKey: string,
): ReportBlockEdits {
  if (edits.removed.includes(editKey)) return edits;
  // Removing supersedes any prior override for the slot.
  const overrides = { ...edits.overrides };
  delete overrides[editKey];
  return { removed: [...edits.removed, editKey], overrides };
}

export function restoreBlockEdit(
  edits: ReportBlockEdits,
  editKey: string,
): ReportBlockEdits {
  const overrides = { ...edits.overrides };
  delete overrides[editKey];
  return {
    removed: edits.removed.filter((key) => key !== editKey),
    overrides,
  };
}

export function setBlockOverride(
  edits: ReportBlockEdits,
  editKey: string,
  blocks: ReportDocumentBlock[],
): ReportBlockEdits {
  return {
    removed: edits.removed.filter((key) => key !== editKey),
    overrides: { ...edits.overrides, [editKey]: blocks },
  };
}

/** Count of edits applied to a section (for the "N edits" nav badge). */
export function countSectionEdits(
  section: ReportDocumentSection,
  edits: ReportBlockEdits,
): number {
  let count = 0;
  section.blocks.forEach((_block, index) => {
    const key = blockEditKey(section.id, index);
    if (edits.removed.includes(key) || edits.overrides[key]) count += 1;
  });
  return count;
}
