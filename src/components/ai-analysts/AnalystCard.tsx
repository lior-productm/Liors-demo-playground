"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AnalystBadge } from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { analystHref } from "@/src/lib/aiAnalystsData";
import type { AnalystDef } from "@/src/types/aiAnalysts";
import { useI18n } from "@/src/hooks/useI18n";

export function AnalystCard({ analyst }: { analyst: AnalystDef }) {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = analyst;
  return (
    <button
      type="button"
      onClick={() => router.push(analystHref(analyst.id))}
      className="group flex h-full flex-col gap-4 rounded-[12px] border border-[#E6E8EB] bg-white p-6 text-left shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-3">
        <AnalystBadge analystId={analyst.id} size={32} />
        <h3 className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-[#222222]">
          {t(analyst.title)}
        </h3>
        <ArrowRight
          size={24}
          strokeWidth={1.5}
          className="shrink-0 text-[#65686B] transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
        />
      </div>

      <p className="text-[14px] leading-[1.4] text-[#65686B]">{t(analyst.description)}</p>

      <div className="mt-auto flex flex-col gap-3">
        <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.02em] text-[#7E8185]">
          {t("Template examples")}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {analyst.templateExamples.map((example) => (
            <span
              key={example}
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              className="inline-flex items-center rounded-[32px] border px-3 py-2 text-[12px] font-medium leading-4"
            >
              {t(example)}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
