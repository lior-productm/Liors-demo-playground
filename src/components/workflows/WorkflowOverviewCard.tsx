"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowCatalogItem } from "@/src/lib/workflowCatalog";

export function WorkflowOverviewCard({
  item,
  onClick,
}: {
  item: WorkflowCatalogItem;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-full w-full min-w-0 items-start gap-2 rounded-2xl border border-[#E6E7E8]/70 bg-white/80 p-[25px] text-left transition-colors",
        "hover:border-[#A7B2F2] hover:shadow-[0_0_2px_rgba(76,97,219,0.3)]",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
        <Icon className="size-6 shrink-0 text-[#353638]" strokeWidth={1.75} />
        <p className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">{item.title}</p>
        <p className="break-words text-[14px] font-normal leading-[1.4] text-[#2C2C2C]">
          {item.description}
        </p>
      </div>
      <ArrowRight className="size-6 shrink-0 text-[#353638]" strokeWidth={1.75} />
    </button>
  );
}
