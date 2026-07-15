"use client";

import { useMemo } from "react";
import { AskAiLeaseHandoffReply } from "@/src/components/ask-ai/AskAiLeaseHandoffReply";
import {
  AskAiLeaseScopeBlock,
  AskAiLeaseTenantStep,
  ASK_AI_TENANT_SHORT_PROMPT,
} from "@/src/components/ask-ai/AskAiLeaseFlowUi";
import {
  AskAiReasoningStep,
  buildLeaseRenewalReasoningSteps,
} from "@/src/components/ask-ai/AskAiReasoningStep";
import {
  ASK_AI_TENANT_MOCK_OPTIONS,
  formatAskAiScopeUserLine,
  getAskAiTenantChipOptions,
} from "@/src/lib/askAiLeaseMockData";
import {
  getLeaseEntityOptions,
  getLeasePortfolioOptions,
  getLeasePropertyOptions,
} from "@/src/lib/leaseBackendData";
import type { WorkflowSession } from "@/src/types/workflows";
import {
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";
import { ASK_AI_LEASE_RENEWAL_USER_MESSAGE } from "@/src/types/askAi";

type Props = {
  session: WorkflowSession;
  revealedStep: WorkflowSession["step"];
  userPrompt: string;
  portfolio: string;
  entity: string;
  property: string;
  isTyping: boolean;
  optimisticUser: string | null;
  locked: boolean;
  onPortfolioChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onPropertyChange: (value: string) => void;
  onScopeComplete: (portfolio: string, entity: string, property: string) => void;
  onTenantSelect: (tenantId: string) => void;
  onReasoningComplete: () => void;
  onContinueWorkspace: () => void;
};

/** Ask Amiio–parity lease renewal chat (scope → tenant → reasoning → handoff). */
export function WorkflowLeaseRenewalAskFlow({
  session,
  revealedStep,
  userPrompt,
  portfolio,
  entity,
  property,
  isTyping,
  optimisticUser,
  locked,
  onPortfolioChange,
  onEntityChange,
  onPropertyChange,
  onScopeComplete,
  onTenantSelect,
  onReasoningComplete,
  onContinueWorkspace,
}: Props) {
  const portfolioOptions = useMemo(() => getLeasePortfolioOptions(), []);
  const entityOptions = useMemo(
    () => getLeaseEntityOptions(portfolio),
    [portfolio],
  );
  const propertyOptions = useMemo(
    () => getLeasePropertyOptions(portfolio, entity),
    [portfolio, entity],
  );
  const tenantChipOptions = useMemo(() => getAskAiTenantChipOptions(), []);
  const tenantAllOptions = ASK_AI_TENANT_MOCK_OPTIONS;

  const scopeLine =
    entity && property
      ? formatAskAiScopeUserLine(entity, property)
      : optimisticUser ?? "";

  const intentSubmitted =
    revealedStep !== "intent" || Boolean(optimisticUser) || Boolean(userPrompt);
  const thinkingAfterIntent =
    isTyping && revealedStep === "intent" && optimisticUser === userPrompt;

  const pastScope =
    revealedStep !== "lease-scope" &&
    revealedStep !== "intent" &&
    Boolean(session.portfolio ?? portfolio);

  const showLeaseScope =
    revealedStep === "lease-scope" && !isTyping && !optimisticUser;
  const thinkingAfterScope = isTyping && revealedStep === "lease-scope" && Boolean(optimisticUser);

  const showLeaseTenants =
    revealedStep === "lease-tenants" && !isTyping && !optimisticUser;
  const showTenantHistory =
    (revealedStep === "lease-reasoning" || revealedStep === "lease-handoff") &&
    !isTyping &&
    !optimisticUser;

  const thinkingAfterTenant =
    isTyping &&
    revealedStep === "lease-tenants" &&
    Boolean(optimisticUser) &&
    optimisticUser !== scopeLine;

  const showReasoningActive =
    revealedStep === "lease-reasoning" && Boolean(session.tenant) && !isTyping && !optimisticUser;
  const showReasoningComplete =
    revealedStep === "lease-handoff" && Boolean(session.tenant) && !isTyping && !optimisticUser;
  const showHandoff =
    revealedStep === "lease-handoff" &&
    Boolean(session.tenantId && session.tenant) &&
    !isTyping &&
    !optimisticUser;

  const reasoningSteps = useMemo(
    () => (session.tenant ? buildLeaseRenewalReasoningSteps(session.tenant) : []),
    [session.tenant],
  );

  const handlePortfolioChange = (value: string) => {
    onPortfolioChange(value);
    onEntityChange("");
    onPropertyChange("");
  };

  const handleEntityChange = (value: string) => {
    onEntityChange(value);
    onPropertyChange("");
  };

  return (
    <>
      {intentSubmitted ? (
        <WorkflowUserBubble size="sm">
          {userPrompt || ASK_AI_LEASE_RENEWAL_USER_MESSAGE}
        </WorkflowUserBubble>
      ) : null}
      {thinkingAfterIntent ? <WorkflowThinkingIndicator /> : null}

      <AskAiLeaseScopeBlock
        portfolio={portfolio}
        entity={entity}
        property={property}
        portfolioOptions={portfolioOptions}
        entityOptions={entityOptions}
        propertyOptions={propertyOptions}
        showSelectors={showLeaseScope}
        disabled={locked || isTyping || pastScope}
        onPortfolioChange={handlePortfolioChange}
        onEntityChange={handleEntityChange}
        onPropertyChange={onPropertyChange}
        onScopeComplete={onScopeComplete}
      />

      {pastScope ? (
        <WorkflowUserBubble size="sm">{scopeLine}</WorkflowUserBubble>
      ) : null}
      {thinkingAfterScope ? <WorkflowThinkingIndicator /> : null}

      {showLeaseTenants ? (
        <AskAiLeaseTenantStep
          chipTenants={tenantChipOptions}
          allTenants={tenantAllOptions}
          onSelect={onTenantSelect}
          disabled={locked || isTyping}
        />
      ) : null}

      {showTenantHistory ? (
        <AskAiLeaseTenantStep
          chipTenants={tenantChipOptions}
          allTenants={tenantAllOptions}
          showPicker={false}
          prompt={ASK_AI_TENANT_SHORT_PROMPT}
          onSelect={onTenantSelect}
          disabled
        />
      ) : null}

      {thinkingAfterTenant ? <WorkflowThinkingIndicator /> : null}

      {session.tenant && !showLeaseTenants ? (
        <WorkflowUserBubble size="sm">{session.tenant}</WorkflowUserBubble>
      ) : null}

      {showReasoningActive ? (
        <AskAiReasoningStep steps={reasoningSteps} onComplete={onReasoningComplete} />
      ) : null}

      {showReasoningComplete ? <AskAiReasoningStep steps={reasoningSteps} completed /> : null}

      {showHandoff && session.tenantId && session.tenant ? (
        <AskAiLeaseHandoffReply
          tenantId={session.tenantId}
          tenantName={session.tenant}
          onContinue={onContinueWorkspace}
          disabled={locked || isTyping}
        />
      ) : null}
    </>
  );
}
