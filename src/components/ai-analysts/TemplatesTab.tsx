"use client";

import { ArrowRight, Clock } from "lucide-react";
import {
  CARD_BORDER,
  EmptyState,
  LinkChip,
  ScopeLevelIcon,
  Tag,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { useAiAnalystsModals } from "@/src/components/ai-analysts/AiAnalystsModals";
import {
  FREQUENCY_LABEL,
  SCOPE_LEVEL_LABEL,
  getTemplatesForAnalyst,
} from "@/src/lib/aiAnalystsData";
import { cn } from "@/lib/utils";
import type { AnalystId } from "@/src/types/aiAnalysts";
import { useI18n } from "@/src/hooks/useI18n";

export function TemplatesTab({ analystId, query = "" }: { analystId: AnalystId; query?: string }) {
  const { t } = useI18n();
  const modals = useAiAnalystsModals();
  const q = query.trim().toLowerCase();
  const templates = getTemplatesForAnalyst(analystId).filter(
    (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[16px] leading-6 text-[#65686B]">
        {t("Choose a template and start scheduling a task")}
      </p>

      {templates.length === 0 ? (
        <div className={cn("rounded-[12px] bg-white", CARD_BORDER)}>
          <EmptyState
            title={t("No templates match your search")}
            description={t("Try a different keyword or clear the search.")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => modals.openTaskConfig({ mode: "create", analystId, template: tpl })}
              className={cn(
                "group flex h-full flex-col gap-4 rounded-[16px] bg-white p-[25px] text-left transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
                CARD_BORDER,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[18px] font-medium leading-6 text-[#2C2C2C]">{t(tpl.name)}</h3>
                <ArrowRight
                  size={24}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#65686B] transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                />
              </div>
              <p className="flex-1 text-[14px] leading-[1.4] text-[#65686B]">{t(tpl.description)}</p>
              <div className="flex flex-wrap items-center gap-2">
                <LinkChip icon={<ScopeLevelIcon level={tpl.defaultScopeLevel} size={12} />}>
                  {t(SCOPE_LEVEL_LABEL[tpl.defaultScopeLevel])}
                </LinkChip>
                <Tag icon={<Clock size={16} strokeWidth={1.5} />}>
                  {t(FREQUENCY_LABEL[tpl.defaultFrequency])}
                </Tag>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
