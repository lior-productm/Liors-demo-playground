"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/src/hooks/useI18n";

/** Footer stepper: current step label above a row of 8px dots. */
export function StepDots({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[14px] font-medium leading-5 text-[#7E8185]">{t(steps[current] ?? "")}</span>
      <div className="flex items-center gap-4">
        {steps.map((label, i) => {
          const clickable = Boolean(onStepClick) && i < current;
          return (
            <button
              key={label}
              type="button"
              aria-label={t(label)}
              aria-current={i === current ? "step" : undefined}
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === current ? "bg-[#010309]" : "bg-[#D1D5D9]",
                clickable && "cursor-pointer hover:bg-[#969A9E]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
