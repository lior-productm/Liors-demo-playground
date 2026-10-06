"use client";

import { AnalystCard } from "@/src/components/ai-analysts/AnalystCard";
import { AI_ANALYSTS } from "@/src/lib/aiAnalystsData";
import { useI18n } from "@/src/hooks/useI18n";

export function AiAnalystsPage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-5 px-6 pb-12 pt-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[24px] font-medium leading-8 text-[#121212]">{t("AI Analysts")}</h1>
        <p className="text-[16px] leading-6 text-[#65686B]">
          {t("Explore our analysts and start planning tasks from pre-defined templates.")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {AI_ANALYSTS.map((analyst) => (
          <AnalystCard key={analyst.id} analyst={analyst} />
        ))}
      </div>
    </div>
  );
}
