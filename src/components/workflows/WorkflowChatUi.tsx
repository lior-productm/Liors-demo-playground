"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  FolderOpen,
  Grid2x2,
  Home,
  Loader2,
  MessageSquarePlus,
  RefreshCw,
  Search,
} from "lucide-react";
import { AiPromptBubble } from "@/src/components/commercial/ChatPanel";
import { cn } from "@/lib/utils";
import type { WorkflowIntentId } from "@/src/types/workflows";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkflowUserBubble({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "md" | "sm";
}) {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      <div className="relative max-w-[688px] rounded-2xl bg-[#E6E8EB] px-4 py-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
        <p
          className={cn(
            "font-normal leading-[1.5] text-[#353638]",
            size === "sm" ? "text-[14px]" : "text-[16px]",
          )}
        >
          {children}
        </p>
      </div>
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E6E8EB] shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
        <span className="text-[11px] font-medium text-[#65686B]">ME</span>
      </div>
    </div>
  );
}

/** Figma lease workflow inline assistant prompt (no chat bubble container). */
export function WorkflowAiInlinePrompt({ question }: { question: string }) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[16px] font-normal leading-[1.5] text-[#353638]">{question}</p>
      </div>
    </div>
  );
}

export function WorkflowAiBlock({
  question,
  children,
}: {
  question: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="relative rounded-2xl bg-white px-3.5 py-2.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
          <p className="typo-p2-r whitespace-pre-line text-[#353638]">{question}</p>
        </div>
        {children ? <div className="min-w-0 max-w-full">{children}</div> : null}
      </div>
    </div>
  );
}

export function WorkflowThinkingIndicator() {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
        <Loader2 className="size-3 animate-spin text-[#7E8185]" />
        <span className="text-[12px] font-normal leading-[1.5] text-[#7E8185]">Thinking...</span>
      </div>
    </div>
  );
}

const INTENT_OPTIONS: {
  id: WorkflowIntentId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: "lease-renewal", label: "Lease Renewal", icon: RefreshCw },
  { id: "prepare-report", label: "Prepare a Report", icon: FileText },
  { id: "financial-forecasting", label: "Financial Forecasting", icon: BarChart3 },
  { id: "market-research", label: "Market Research", icon: Search },
  { id: "something-else", label: "Something Else", icon: MessageSquarePlus },
];

export function WorkflowIntentCards({
  onSelect,
  disabled,
}: {
  onSelect: (id: WorkflowIntentId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2">
      {INTENT_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl bg-white p-2.5 text-left shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
              "hover:border-2 hover:border-[#A7B2F2] hover:shadow-[0_0_2px_rgba(76,97,219,0.3)]",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <Icon className="size-4 shrink-0 text-[#353638]" strokeWidth={1.75} />
            <span className="text-[14px] font-medium leading-normal text-[#353638]">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Figma 941:58813 — quick-start prompt chips on new workflow chat. */
export const WORKFLOW_PROMPT_CHIPS: { label: string; intent: WorkflowIntentId }[] = [
  { label: "Lesing preperation", intent: "lease-renewal" },
  { label: "Tenant risk list", intent: "market-research" },
  { label: "Renewal recommendation", intent: "lease-renewal" },
  { label: "Draft renewal email", intent: "lease-renewal" },
  { label: "Missing data checklist", intent: "financial-forecasting" },
  { label: "Report-ready leasing commentary", intent: "prepare-report" },
  { label: "Other", intent: "something-else" },
];

export function isLeaseRenewalWorkflowIntent(intent?: WorkflowIntentId) {
  return intent === "lease-renewal";
}

export function getLeaseRenewalPromptChips() {
  return WORKFLOW_PROMPT_CHIPS.filter((chip) => isLeaseRenewalWorkflowIntent(chip.intent));
}

function WorkflowPromptChip({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 shrink-0 items-center rounded-[32px] border-[1.5px] border-[#E6E8EB] bg-white px-3 py-2 transition-colors hover:bg-[#FAFBFC]",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      <span className="typo-p2-b whitespace-nowrap text-[#65686B]">{label}</span>
    </button>
  );
}

export function WorkflowStageLanding({
  onPromptSelect,
  disabled,
}: {
  onPromptSelect: (prompt: { label: string; intent: WorkflowIntentId }) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-10 pt-8">
      <p className="text-center text-[18px] font-medium leading-[1.25] text-[#65686B]">
        How can we help you today?
      </p>
      <div className="flex w-full max-w-[729px] flex-wrap gap-3">
        {WORKFLOW_PROMPT_CHIPS.map((prompt) => (
          <WorkflowPromptChip
            key={prompt.label}
            label={prompt.label}
            disabled={disabled}
            onClick={() => onPromptSelect(prompt)}
          />
        ))}
      </div>
    </div>
  );
}

function ScopeSelector({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  disabled,
  widthClass,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  widthClass?: string;
}) {
  const isPlaceholder = !value;

  return (
    <Select
      value={isPlaceholder ? undefined : value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-12 w-full max-w-full gap-2 rounded-2xl border bg-white px-3 py-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)] focus:ring-2 focus:ring-[#A7B2F2] focus:ring-offset-0 md:w-auto",
          widthClass,
          !isPlaceholder
            ? "border-2 border-[#A7B2F2] shadow-[0_0_2px_rgba(76,97,219,0.3)]"
            : "border-transparent",
        )}
      >
        <Icon className="size-5 shrink-0 text-[#353638]" strokeWidth={1.75} />
        <SelectValue
          placeholder={label}
          className={cn(
            "flex-1 truncate text-left text-[16px] font-medium leading-[1.5]",
            isPlaceholder ? "text-[#65686B]" : "text-[#353638]",
          )}
        />
      </SelectTrigger>
      <SelectContent className="z-[100]">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function WorkflowScopeSelectors({
  portfolio,
  entity,
  property,
  portfolioOptions,
  entityOptions,
  propertyOptions,
  onPortfolioChange,
  onEntityChange,
  onPropertyChange,
  onContinue,
  disabled,
}: {
  portfolio: string;
  entity: string;
  property: string;
  portfolioOptions: string[];
  entityOptions: string[];
  propertyOptions: string[];
  onPortfolioChange: (v: string) => void;
  onEntityChange: (v: string) => void;
  onPropertyChange: (v: string) => void;
  onContinue: () => void;
  disabled?: boolean;
}) {
  const tryAutoContinue = (nextEntity: string, nextProperty: string) => {
    if (portfolio && nextEntity && nextProperty && !disabled) {
      onContinue();
    }
  };

  const handleEntityChange = (value: string) => {
    onEntityChange(value);
    tryAutoContinue(value, property);
  };

  const handlePropertyChange = (value: string) => {
    onPropertyChange(value);
    tryAutoContinue(entity, value);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-3 gap-y-2 md:flex-nowrap">
        <ScopeSelector
          icon={Grid2x2}
          label="All portfolio"
          value={portfolio}
          options={portfolioOptions}
          onChange={onPortfolioChange}
          disabled={disabled}
          widthClass="md:w-[173px]"
        />
        <ScopeSelector
          icon={FolderOpen}
          label="Selected entity"
          value={entity}
          options={entityOptions}
          onChange={handleEntityChange}
          disabled={disabled}
          widthClass="md:w-[221px]"
        />
        <ScopeSelector
          icon={Home}
          label="Selected property"
          value={property}
          options={propertyOptions}
          onChange={handlePropertyChange}
          disabled={disabled}
          widthClass="md:w-[263px]"
        />
      </div>
    </div>
  );
}

export function WorkflowTenantCards({
  tenants,
  onSelect,
  disabled,
  includeElse = true,
}: {
  tenants: { id: string; name: string; expiryLabel: string }[];
  onSelect: (id: string) => void;
  disabled?: boolean;
  includeElse?: boolean;
}) {
  if (tenants.length === 0 && !includeElse) {
    return (
      <p className="text-[14px] font-normal leading-[1.5] text-[#65686B]">
        No tenants found for this property. You can type a tenant name in the chat below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tenants.map((tenant) => (
        <button
          key={tenant.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(tenant.id)}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-left shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
            "hover:border-2 hover:border-[#A7B2F2] hover:shadow-[0_0_2px_rgba(76,97,219,0.3)]",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <span className="truncate text-[16px] font-medium text-[#353638]">{tenant.name}</span>
          {tenant.expiryLabel ? (
            <span className="shrink-0 text-[14px] text-[#65686B]">{tenant.expiryLabel}</span>
          ) : null}
        </button>
      ))}
      {includeElse ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("else")}
          className={cn(
            "rounded-2xl bg-white px-4 py-3 text-left shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)] transition-colors",
            "hover:border-2 hover:border-[#A7B2F2] hover:shadow-[0_0_2px_rgba(76,97,219,0.3)]",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <span className="text-[16px] font-medium text-[#353638]">Else</span>
          <span className="mt-0.5 block text-[14px] text-[#65686B]">
            View all tenants or enter a name in chat
          </span>
        </button>
      ) : null}
    </div>
  );
}

export const ELSE_TENANT_LABEL = "My tenant isn't listed";

export const INTENT_LABELS: Record<WorkflowIntentId, string> = {
  "lease-renewal": "Lease Renewal",
  "prepare-report": "Prepare a Report",
  "financial-forecasting": "Financial Forecasting",
  "market-research": "Market Research",
  "something-else": "Something Else",
};
