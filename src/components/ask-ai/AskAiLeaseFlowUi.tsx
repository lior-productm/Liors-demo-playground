"use client";

import { AiPromptBubble } from "@/src/components/commercial/ChatPanel";
import { AskAiScopeSelectors } from "@/src/components/ask-ai/AskAiScopeSelectors";
import { AskAiTenantSelection } from "@/src/components/ask-ai/AskAiTenantSelection";
import {
  ASK_AI_SCOPE_SELECTION_PROMPT,
  ASK_AI_TENANT_SELECTION_PROMPT,
  ASK_AI_TENANT_SHORT_PROMPT,
  type AskAiTenantOption,
} from "@/src/lib/askAiLeaseMockData";

export { ASK_AI_SCOPE_SELECTION_PROMPT };

/** @deprecated Use {@link AiPromptBubble} — shared lamp avatar for Ask Amiio chat. */
export function AskAiAssistantAvatar() {
  return <AiPromptBubble size="md" />;
}

/** Figma 1040:59804 — inline assistant prompt (no bubble card). */
export function AskAiInlinePrompt({ question }: { question: string }) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <p className="min-w-0 flex-1 pt-0.5 text-[14px] font-normal leading-[1.5] text-[#353638]">
        {question}
      </p>
    </div>
  );
}

/** Figma 1040:59798–59805 — scope selection (selectors optional when step is complete). */
export function AskAiLeaseScopeBlock({
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
  showSelectors,
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
  showSelectors?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
          {ASK_AI_SCOPE_SELECTION_PROMPT}
        </p>
        {showSelectors ? (
          <AskAiScopeSelectors
            portfolio={portfolio}
            entity={entity}
            property={property}
            portfolioOptions={portfolioOptions}
            entityOptions={entityOptions}
            propertyOptions={propertyOptions}
            onPortfolioChange={onPortfolioChange}
            onEntityChange={onEntityChange}
            onPropertyChange={onPropertyChange}
            onScopeComplete={onScopeComplete}
            disabled={disabled}
          />
        ) : null}
      </div>
    </div>
  );
}

/** @deprecated Use AskAiLeaseScopeBlock */
export const AskAiLeaseScopeStep = AskAiLeaseScopeBlock;

/** Figma 1040:59931–59938 — tenant chips + dropdown (picker optional when step advances). */
export function AskAiLeaseTenantStep({
  chipTenants,
  allTenants,
  selectedTenantId,
  onSelect,
  disabled,
  showPicker = true,
  prompt = ASK_AI_TENANT_SELECTION_PROMPT,
}: {
  chipTenants: AskAiTenantOption[];
  allTenants: AskAiTenantOption[];
  selectedTenantId?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  showPicker?: boolean;
  prompt?: string;
}) {
  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-4 pb-3">
        <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">{prompt}</p>
        {showPicker ? (
          <AskAiTenantSelection
            chipTenants={chipTenants}
            allTenants={allTenants}
            selectedId={selectedTenantId}
            onSelect={onSelect}
            disabled={disabled}
          />
        ) : null}
      </div>
    </div>
  );
}

export { ASK_AI_TENANT_SHORT_PROMPT };
