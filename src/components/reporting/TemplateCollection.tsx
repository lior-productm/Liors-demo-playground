"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Copy, Layers, Plus } from "lucide-react";
import { listTemplates, resolveTemplateOwnership, type ReportTemplateMeta } from "@/src/lib/reportTemplates";
import { readCustomSections } from "@/src/lib/reportSectionBuilder";
import { readDistributionStatus } from "@/src/lib/reportDistribution";
import { DistributionPill } from "@/src/components/reporting/ReportDistributionControls";
import { CreatorChip, OwnershipBadge } from "@/src/components/reporting/CreatorChip";
import type { DistributionStatus } from "@/src/lib/reportDistribution";
import type { ItemOwnership } from "@/src/lib/reportUser";

type TemplateCardData = ReportTemplateMeta & {
  customSectionCount: number;
  distribution: DistributionStatus;
};

function templateCardOwnership(
  template: ReportTemplateMeta,
  status: DistributionStatus,
): ItemOwnership {
  if (
    status === "pending_approval" ||
    status === "approved" ||
    status === "distributed"
  ) {
    return "organization";
  }
  return resolveTemplateOwnership(template);
}

export function TemplateCollection({
  onOpen,
  onNewTemplate,
}: {
  onOpen: (title: string) => void;
  onNewTemplate: () => void;
}) {
  const [cards, setCards] = useState<TemplateCardData[]>(() =>
    listTemplates().map((template) => ({
      ...template,
      customSectionCount: 0,
      distribution: "draft" as DistributionStatus,
    })),
  );

  useEffect(() => {
    setCards(
      listTemplates().map((template) => ({
        ...template,
        customSectionCount: readCustomSections(template.title).length,
        distribution: readDistributionStatus(template.title),
      })),
    );
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[18px] font-semibold leading-[1.25] text-[#05091F]">
          Templates
        </h2>
        <p className="text-[13px] leading-[1.5] text-[#65686B]">
          Open a template to edit its sections and objects, or create a new one.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={onNewTemplate}
          className="flex min-h-[176px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#B3B8BD] bg-[#FAFBFC] p-5 text-center transition-colors hover:border-[#A7B2F2] hover:bg-[#F7F8FF]"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF0FF] text-[#4C61DB]">
            <Plus className="size-5" strokeWidth={2} />
          </span>
          <span className="text-[14px] font-medium leading-[1.25] text-[#05091F]">
            Create new template
          </span>
          <span className="text-[12px] leading-[1.4] text-[#65686B]">
            Start blank, from a preset, or duplicate an existing one.
          </span>
        </button>

        {cards.map((card) => {
          const ownership = templateCardOwnership(card, card.distribution);
          return (
          <button
            key={card.title}
            type="button"
            onClick={() => onOpen(card.title)}
            className="group flex min-h-[176px] flex-col gap-3 rounded-xl border border-[#E6E8EB] bg-white p-5 text-left transition-shadow hover:shadow-[0px_2px_8px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-start justify-between gap-2">
              <OwnershipBadge ownership={ownership} />
              {ownership === "organization" ? (
                <DistributionPill status={card.distribution} />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <h3 className="text-[15px] font-semibold leading-[1.3] text-[#05091F]">
                {card.title}
              </h3>
              <p className="line-clamp-2 text-[12px] leading-[1.5] text-[#65686B]">
                {card.description}
              </p>
              <CreatorChip name={card.createdBy} className="mt-1" />
            </div>

            <div className="flex items-center justify-between border-t border-[#F0F2F5] pt-3">
              <span className="inline-flex items-center gap-2 text-[11px] text-[#65686B]">
                {card.basedOn ? (
                  <span className="inline-flex items-center gap-1">
                    <Copy className="size-3.5" strokeWidth={1.75} />
                    From {card.basedOn}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Layers className="size-3.5" strokeWidth={1.75} />
                    {card.customSectionCount} custom section
                    {card.customSectionCount === 1 ? "" : "s"}
                  </span>
                )}
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#4C61DB] opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </span>
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
}
