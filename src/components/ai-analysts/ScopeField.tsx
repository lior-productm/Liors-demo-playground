"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScopeLevelIcon, SearchInput } from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { ScopeTreeSelector } from "@/src/components/ai-analysts/ScopeTreeSelector";
import { ScopeChips } from "@/src/components/ai-analysts/ScopeChips";
import { SCOPE_LEVEL_LABEL } from "@/src/lib/aiAnalystsData";
import { useI18n } from "@/src/hooks/useI18n";
import type { ScopeLevel, ScopeSelection } from "@/src/types/aiAnalysts";

const LEVELS: ScopeLevel[] = ["portfolio", "entity", "property", "tenant"];
/** Header, note and Done row. The rows scroll in whatever room is left. */
const DROPDOWN_CHROME = 168;
const DROPDOWN_GAP = 8;

/** Level pills + search field that opens the scope tree + selected chips. */
export function ScopeField({
  scope,
  onChange,
  rootIds,
  allowedLevels = LEVELS,
  showLevels = true,
  helperText,
  searchPlaceholder = "Search...",
}: {
  scope: ScopeSelection;
  onChange: (scope: ScopeSelection) => void;
  /** Restrict the selectable subtree (used by subtasks). */
  rootIds?: string[];
  /** Which level pills are shown (subtasks: task level or lower). */
  allowedLevels?: ScopeLevel[];
  showLevels?: boolean;
  helperText?: string;
  searchPlaceholder?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogEl, setDialogEl] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState({ top: 0, left: 0, width: 0, listMaxHeight: 320 });
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      // Pull the field to the top of the window so the list below it has room to scroll.
      const scroller = anchor.closest("[data-config-scroll]") as HTMLElement | null;
      if (scroller) {
        const shift =
          anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 8;
        if (shift > 4) scroller.scrollTop += shift;
      }
      const dialog = anchor.closest("[role='dialog']") as HTMLElement | null;
      const limit = dialog?.getBoundingClientRect() ?? {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth,
      };
      const anchorBox = anchor.getBoundingClientRect();
      const room = limit.bottom - anchorBox.bottom - DROPDOWN_GAP - 12;
      setDialogEl(dialog);
      setBox({
        top: anchorBox.bottom - limit.top + DROPDOWN_GAP,
        left: anchorBox.left - limit.left,
        width: anchorBox.width,
        listMaxHeight: Math.max(48, room - DROPDOWN_CHROME),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    document.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      document.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="flex flex-col gap-3">
      {showLevels ? (
        <div className="flex flex-wrap gap-2">
          {allowedLevels.map((lvl) => {
            const active = scope.level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  onChange({ level: lvl, ids: active ? scope.ids : [] });
                  if (!active) setOpen(true);
                }}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-[32px] border px-3 text-[14px] leading-5 transition-colors",
                  active
                    ? "border-[#A7B2F2] bg-[#EBEDF9] font-medium text-[#4F65E5]"
                    : "border-transparent bg-[#F0F2F5] text-[#65686B] hover:bg-[#E6E8EB]",
                )}
              >
                <ScopeLevelIcon level={lvl} size={16} />
                {t(SCOPE_LEVEL_LABEL[lvl])}
              </button>
            );
          })}
        </div>
      ) : null}

      {scope.level ? (
        <div ref={anchorRef}>
          <SearchInput
            size="md"
            value={query}
            onChange={(v) => {
              setQuery(v);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t(searchPlaceholder)}
            className={cn(open && "shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]")}
            trailing={
              <button
                type="button"
                aria-label={open ? t("Close scope list") : t("Open scope list")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex"
              >
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    "shrink-0 text-[#65686B] transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>
            }
          />
          {open && dialogEl
            ? createPortal(
                <div
                  ref={panelRef}
                  className="absolute z-[80]"
                  style={{ top: box.top, left: box.left, width: box.width }}
                >
                  <ScopeTreeSelector
                    selectableLevels={[scope.level]}
                    selectedIds={scope.ids}
                    onChange={(ids) => onChange({ level: scope.level, ids })}
                    onDone={() => setOpen(false)}
                    rootIds={rootIds}
                    query={query}
                    listMaxHeight={box.listMaxHeight}
                  />
                </div>,
                dialogEl,
              )
            : null}
        </div>
      ) : null}

      {helperText ? <p className="text-[14px] leading-5 text-[#65686B]">{helperText}</p> : null}

      {scope.level && scope.ids.length > 0 ? (
        <ScopeChips
          scope={scope}
          maxVisible={8}
          onRemove={(id) => onChange({ level: scope.level, ids: scope.ids.filter((x) => x !== id) })}
          onReopen={() => setOpen(true)}
        />
      ) : null}
    </div>
  );
}
