"use client";

import { FolderOpen, Grid2x2, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Figma 1040:59805 — pill scope filters on Ask Amiio lease renewal step. */
function AskAiScopePill({
  icon: Icon,
  placeholder,
  value,
  options,
  onChange,
  disabled,
  widthClass,
  active,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  widthClass?: string;
  active?: boolean;
}) {
  const hasValue = Boolean(value);

  return (
    <Select value={hasValue ? value : undefined} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-10 w-auto gap-2.5 rounded-[32px] border border-solid bg-[#F0F2F5] px-3 py-2 shadow-none focus:ring-0 focus:ring-offset-0 [&_svg]:size-6 [&_svg]:text-[#353638]",
          widthClass,
          hasValue || active
            ? "border-[#65686B] shadow-[0_0_0.5px_rgba(76,97,219,0.3)]"
            : "border-[#D1D5D9]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-1">
          <Icon className="size-4 shrink-0 text-[#353638]" strokeWidth={1.75} />
          <SelectValue
            placeholder={placeholder}
            className={cn(
              "truncate text-left text-[14px] leading-[1.5]",
              hasValue ? "font-medium text-[#353638]" : "font-normal text-[#7E8185]",
            )}
          />
        </div>
      </SelectTrigger>
      <SelectContent className="z-[100] rounded-[8px] border border-[#E6E8EB] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            className="h-[41px] rounded-[4px] px-1.5 text-[14px] font-normal leading-[1.25] text-[#353638]"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AskAiScopeSelectors({
  portfolio,
  entity,
  property,
  portfolioOptions,
  entityOptions,
  propertyOptions,
  onPortfolioChange,
  onEntityChange,
  onPropertyChange,
  onScopeComplete,
  disabled,
}: {
  portfolio: string;
  entity: string;
  property: string;
  portfolioOptions: string[];
  entityOptions: string[];
  propertyOptions: string[];
  onPortfolioChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onPropertyChange: (value: string) => void;
  onScopeComplete: (portfolio: string, entity: string, property: string) => void;
  disabled?: boolean;
}) {
  const tryComplete = (nextEntity: string, nextProperty: string) => {
    if (portfolio && nextEntity && nextProperty && !disabled) {
      onScopeComplete(portfolio, nextEntity, nextProperty);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
      <AskAiScopePill
        icon={Grid2x2}
        placeholder="All portfolio"
        value={portfolio}
        options={portfolioOptions}
        onChange={onPortfolioChange}
        disabled={disabled}
        widthClass="w-[184px]"
        active
      />
      <AskAiScopePill
        icon={FolderOpen}
        placeholder="Selected entity"
        value={entity}
        options={entityOptions}
        onChange={(value) => {
          onEntityChange(value);
          tryComplete(value, property);
        }}
        disabled={disabled || entityOptions.length === 0}
        widthClass="min-w-[200px]"
        active={Boolean(entity)}
      />
      <AskAiScopePill
        icon={Home}
        placeholder="Select property"
        value={property}
        options={propertyOptions}
        onChange={(value) => {
          onPropertyChange(value);
          tryComplete(entity, value);
        }}
        disabled={disabled || !entity || propertyOptions.length === 0}
        widthClass="min-w-[200px]"
      />
    </div>
  );
}
