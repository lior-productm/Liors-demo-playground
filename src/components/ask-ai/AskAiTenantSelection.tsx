"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AskAiTenantOption } from "@/src/lib/askAiLeaseMockData";

/** Figma 1187:44318 — quick-select tenant chip (184×40). */
function AskAiTenantChip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 w-[184px] shrink-0 items-center justify-center rounded-[32px] border border-solid px-3 py-2 transition-colors",
        selected
          ? "border-[#65686B] bg-[#F0F2F5] shadow-[0_0_0.5px_rgba(76,97,219,0.3)]"
          : "border-[#D1D5D9] bg-[#F0F2F5] hover:border-[#65686B]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span className="truncate text-[14px] font-medium leading-[1.5] text-[#353638]">
        {label}
      </span>
    </button>
  );
}

/** Figma 1040:59938 — tenant chips + “Select tenant” dropdown. */
export function AskAiTenantSelection({
  chipTenants,
  allTenants,
  selectedId,
  onSelect,
  disabled,
}: {
  chipTenants: AskAiTenantOption[];
  allTenants: AskAiTenantOption[];
  selectedId?: string;
  onSelect: (tenantId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start gap-4">
      {chipTenants.map((tenant) => (
        <AskAiTenantChip
          key={tenant.id}
          label={tenant.name}
          selected={selectedId === tenant.id}
          disabled={disabled}
          onClick={() => onSelect(tenant.id)}
        />
      ))}

      <Select
        value={selectedId}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-10 w-auto min-w-[200px] gap-2.5 rounded-[32px] border border-solid bg-[#F0F2F5] px-3 py-2 shadow-none focus:ring-0 focus:ring-offset-0 [&_svg]:size-6 [&_svg]:text-[#353638]",
            selectedId
              ? "border-[#65686B] shadow-[0_0_0.5px_rgba(76,97,219,0.3)]"
              : "border-[#65686B] shadow-[0_0_0.5px_rgba(76,97,219,0.3)]",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-1">
            <Users className="size-4 shrink-0 text-[#353638]" strokeWidth={1.75} />
            <SelectValue
              placeholder="Select tenant"
              className={cn(
                "truncate text-left text-[14px] leading-[1.5]",
                selectedId ? "font-medium text-[#353638]" : "font-normal text-[#7E8185]",
              )}
            />
          </div>
        </SelectTrigger>
        <SelectContent className="z-[100] min-w-[var(--radix-select-trigger-width)] rounded-[8px] border border-[#E6E8EB] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
          {allTenants.map((tenant) => (
            <SelectItem
              key={tenant.id}
              value={tenant.id}
              className="h-[41px] rounded-[4px] px-1.5 text-[14px] font-normal leading-[1.25] text-[#353638] data-[highlighted]:bg-[#EBEDF9] data-[highlighted]:font-medium data-[state=checked]:bg-[#EBEDF9] data-[state=checked]:font-medium"
            >
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
