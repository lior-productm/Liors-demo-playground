"use client";

import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScopeLevelIcon } from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { coveredChildren, findScopeNode, SCOPE_LEVEL_PLURAL } from "@/src/lib/aiAnalystsData";
import type { ScopeSelection } from "@/src/types/aiAnalysts";

/** Single scope chip: level icon + name + covered-children counter (+ optional remove). */
export function ScopeChip({
  id,
  onRemove,
  className,
}: {
  id: string;
  onRemove?: () => void;
  className?: string;
}) {
  const node = findScopeNode(id);
  const children = coveredChildren(id);
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-[12px] bg-[#D3D9F8] px-2 text-[12px] leading-4 text-[#353638]",
        className,
      )}
    >
      {node ? <ScopeLevelIcon level={node.level} size={12} className="text-[#353638]" /> : null}
      <span className="max-w-[220px] truncate">{node?.name ?? id}</span>
      {children.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex size-4 cursor-default items-center justify-center rounded-full bg-[#EBEDF9] text-[8px] font-semibold leading-none text-[#070D2F]">
              {children.length}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[260px]">
            <p className="mb-1 font-semibold">
              Covers {children.length} {SCOPE_LEVEL_PLURAL[children[0]!.level]}
            </p>
            <ul className="list-disc space-y-0.5 pl-4">
              {children.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${node?.name ?? id}`}
          className="inline-flex size-3 items-center justify-center text-[#353638] hover:text-[#010309]"
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      ) : null}
    </span>
  );
}

export function ScopeChips({
  scope,
  onRemove,
  onReopen,
  maxVisible = 4,
  emptyLabel = "No scope selected",
}: {
  scope: ScopeSelection;
  onRemove?: (id: string) => void;
  onReopen?: () => void;
  maxVisible?: number;
  emptyLabel?: string;
}) {
  if (!scope.level || scope.ids.length === 0) {
    return <span className="text-[14px] leading-5 text-[#969A9E]">{emptyLabel}</span>;
  }

  const visible = scope.ids.slice(0, maxVisible);
  const overflow = scope.ids.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((id) => (
        <ScopeChip key={id} id={id} onRemove={onRemove ? () => onRemove(id) : undefined} />
      ))}
      {overflow > 0 ? (
        <button
          type="button"
          onClick={onReopen}
          className="text-[12px] font-medium leading-4 text-[#353638] hover:underline"
        >
          + {overflow} others
        </button>
      ) : null}
    </div>
  );
}
