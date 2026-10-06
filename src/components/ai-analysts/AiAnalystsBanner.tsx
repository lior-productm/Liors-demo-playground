"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnalystBadge } from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { useI18n } from "@/src/hooks/useI18n";

/** Dashboard entry point — opens the AI Analysts page with the chat open. */
export function AiAnalystsBanner() {
  const router = useRouter();
  const { t, dir } = useI18n();
  return (
    <div className="px-6 pt-6">
      <button
        type="button"
        onClick={() => router.push("/ai-analysts?chat=1")}
        className={cn(
          "group flex w-full items-center justify-between gap-4 rounded-[12px] border border-[#E6E8EB] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
          dir === "rtl" ? "text-right" : "text-left",
        )}
      >
        <span className="flex items-center gap-4">
          <span className="relative flex h-9 w-[76px] items-center">
            <AnalystBadge analystId="financial" size={28} className="absolute left-0 -rotate-6 bg-white" />
            <AnalystBadge analystId="service-charges" size={28} className="absolute left-6 z-10 bg-white" />
            <AnalystBadge analystId="technical" size={28} className="absolute left-12 rotate-6 bg-white" />
          </span>
          <span className="text-[14px] font-medium leading-5 text-[#121212]">
            {t("Speed up your work with AI Analysts")}
          </span>
        </span>
        <ArrowRight
          size={20}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 text-[#65686B] transition-transform group-hover:translate-x-0.5",
            dir === "rtl" && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}
