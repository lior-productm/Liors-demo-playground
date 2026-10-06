"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Textarea with a mock "Enhance with AI" affordance. Enhancing simply rewrites
 * the current text into a tidier instruction — no backend call.
 */
export function EnhanceWithAiTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const [enhancing, setEnhancing] = useState(false);

  const enhance = () => {
    const base = value.trim();
    if (!base || enhancing) return;
    setEnhancing(true);
    window.setTimeout(() => {
      const tidy = base.charAt(0).toUpperCase() + base.slice(1);
      const withPeriod = /[.!?]$/.test(tidy) ? tidy : `${tidy}.`;
      onChange(
        `${withPeriod} Please be concise, cite the underlying figures, and flag any anomalies for review.`,
      );
      setEnhancing(false);
    }, 650);
  };

  return (
    <div
      className={cn(
        "relative rounded-[12px] border border-[#E6E8EB] bg-white transition-shadow focus-within:border-[#A7B2F2] focus-within:shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]",
        className,
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none bg-transparent px-4 pb-10 pt-3 text-[16px] leading-6 text-[#353638] outline-none placeholder:text-[#969A9E]"
      />
      <button
        type="button"
        onClick={enhance}
        disabled={!value.trim() || enhancing}
        className={cn(
          "absolute bottom-2 right-2 inline-flex h-8 items-center gap-1.5 rounded-[32px] px-3 text-[12px] font-medium transition-colors",
          value.trim() && !enhancing
            ? "bg-[#EBEDF9] text-[#4F65E5] hover:bg-[#D3D9F8]"
            : "cursor-not-allowed bg-[#F0F2F5] text-[#B3B8BD]",
        )}
      >
        <Sparkles size={14} strokeWidth={1.5} className={cn(enhancing && "animate-pulse")} />
        {enhancing ? "Enhancing…" : "Enhance with AI"}
      </button>
    </div>
  );
}
