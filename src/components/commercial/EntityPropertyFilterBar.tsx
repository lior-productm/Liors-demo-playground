"use client";

import { FolderOpen, Grid2x2, Home, Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { getFilterPortfolioOptions } from "@/src/lib/leaseBackendData";

export type EntityPropertyFilterBarProps = {
  className?: string;
  variant?: "default" | "insights";
  portfolioLabel?: string;
  entityLabel?: string;
  propertyLabel?: string;
  portfolioOptions?: string[];
  entityOptions?: string[];
  propertyOptions?: string[];
  onPortfolioChange?: (value: string) => void;
  onEntityChange?: (value: string) => void;
  onPropertyChange?: (value: string) => void;
};

function FilterClearButton({
  ariaLabel,
  onClear,
}: {
  ariaLabel: string;
  onClear: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
      aria-label={ariaLabel}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      <X className="size-3 text-[#39393A]" strokeWidth={1.75} />
    </span>
  );
}

function FilterPill({
  filled,
  accent = "default",
  forceSelected = false,
  variant = "default",
  icon: Icon,
  value,
  placeholder,
  options,
  onChange,
  onClear,
  disabled = false,
  ariaLabel,
}: {
  filled: boolean;
  accent?: "default" | "active";
  forceSelected?: boolean;
  variant?: "default" | "insights";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  const isPlaceholder = value === placeholder;
  const isSelected = forceSelected || (filled && !isPlaceholder);
  const isActive = isSelected && accent === "active";
  const showClear = isSelected && Boolean(onClear);

  return (
    <Select
      value={isPlaceholder ? undefined : value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        disabled={disabled}
        icon={
          showClear ? (
            <FilterClearButton
              ariaLabel={`Clear ${ariaLabel}`}
              onClear={onClear!}
            />
          ) : undefined
        }
        className={cn(
          "h-8 w-[160px] shrink-0 gap-1 rounded-[28px] border border-solid px-2.5 py-1 text-[13px] leading-[1.4] shadow-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 [&>span:last-child]:shrink-0 [&>svg:last-child]:ml-0 [&>svg:last-child]:size-4 [&>svg:last-child]:shrink-0",
          isActive
            ? "border-[#39393A] bg-[#F3F6FA] font-medium text-[#39393A] [&>svg:last-child]:text-[#39393A]"
            : isSelected
              ? "border-[#65686B] bg-[#F0F2F5] font-medium text-[#353638] [&>svg:last-child]:text-[#353638]"
              : variant === "insights" && isPlaceholder
                ? "border-[#D1D5D9] bg-white font-normal text-[#7E8185] [&>svg:last-child]:text-[#353638]"
                : "border-[#D1D5D9] bg-[#F0F2F5] font-normal text-[#7E8185] [&>svg:last-child]:text-[#353638]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          <Icon
            className={cn(
              "size-3.5 shrink-0",
              isActive ? "text-[#39393A]" : "text-[#353638]",
            )}
            strokeWidth={1.75}
          />
          <SelectValue
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 truncate text-left text-[13px] leading-[1.4]",
              isActive
                ? "font-medium text-[#39393A]"
                : isSelected
                  ? "font-medium text-[#353638]"
                  : "font-normal text-[#7E8185]",
            )}
          />
        </div>
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="z-[200] rounded-[8px] border border-[#E6E8EB] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
      >
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            className="cursor-pointer h-8 rounded-[4px] px-1.5 text-[13px] font-normal leading-[1.4] text-[#353638] data-[highlighted]:bg-[#F7F8FA] data-[highlighted]:text-[#353638]"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function EntityPropertyFilterBar({
  className,
  variant = "default",
  portfolioLabel = "Portfolio A",
  entityLabel = "Select entity",
  propertyLabel = "Select property",
  portfolioOptions,
  entityOptions,
  propertyOptions,
  onPortfolioChange,
  onEntityChange,
  onPropertyChange,
}: EntityPropertyFilterBarProps) {
  const resolvedPortfolioOptions = useMemo(
    () => portfolioOptions ?? getFilterPortfolioOptions(),
    [portfolioOptions],
  );
  const resolvedEntityOptions = useMemo(
    () => entityOptions ?? [],
    [entityOptions],
  );
  const resolvedPropertyOptions = useMemo(
    () => propertyOptions ?? [],
    [propertyOptions],
  );

  const isPropertySelected = propertyLabel !== "Select property";
  const isEntitySelected = entityLabel !== "Select entity";
  const isInsights = variant === "insights";

  const pills = (
    <>
      <FilterPill
        filled
        forceSelected
        variant={variant}
        accent={isPropertySelected ? "active" : "default"}
        icon={Grid2x2}
        value={portfolioLabel}
        placeholder="Portfolio A"
        options={resolvedPortfolioOptions}
        ariaLabel="Select portfolio"
        onChange={(value) => {
          onPortfolioChange?.(value);
        }}
      />
      <FilterPill
        filled={isEntitySelected}
        variant={variant}
        accent={isPropertySelected && isEntitySelected ? "active" : "default"}
        icon={FolderOpen}
        value={entityLabel}
        placeholder="Select entity"
        options={resolvedEntityOptions}
        disabled={resolvedEntityOptions.length === 0}
        ariaLabel="Select entity"
        onChange={(value) => {
          onEntityChange?.(value);
        }}
        onClear={
          isEntitySelected
            ? () => {
                onEntityChange?.("Select entity");
              }
            : undefined
        }
      />
      <FilterPill
        filled={isPropertySelected}
        variant={variant}
        accent={isPropertySelected ? "active" : "default"}
        icon={Home}
        value={propertyLabel}
        placeholder="Select property"
        options={resolvedPropertyOptions}
        disabled={!isEntitySelected || resolvedPropertyOptions.length === 0}
        ariaLabel="Select property"
        onChange={(value) => {
          onPropertyChange?.(value);
        }}
        onClear={
          isPropertySelected
            ? () => {
                onPropertyChange?.("Select property");
              }
            : undefined
        }
      />
      <div className="flex shrink-0 items-center pr-1">
        <button
          type="button"
          className="flex size-5 shrink-0 items-center justify-center text-[#39393A] transition-colors hover:text-[#65686B]"
          aria-label="Filter settings"
        >
          <Settings2 className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </>
  );

  if (isInsights) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {pills}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/30 bg-white/80 p-1.5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0px_2px_6px_0px_rgba(255,255,255,0.3)]" />
      <div className="relative flex items-center gap-1.5">
        {pills}
      </div>
    </div>
  );
}
