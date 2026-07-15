"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell, DashboardPageBody } from "@/src/components/layout/AppShell";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import { WorkflowChatBar } from "@/src/components/workflows/WorkflowChatBar";
import { LeaseProposalDocumentPanel } from "@/src/components/workflows/LeaseProposalDocumentPanel";
import {
  INTENT_LABELS,
  WorkflowAiBlock,
  WorkflowStageLanding,
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";
import { WorkflowLeaseRenewalAskFlow } from "@/src/components/workflows/WorkflowLeaseRenewalAskFlow";
import { useWorkflowSessions } from "@/src/hooks/useWorkflowSessions";
import type { WorkflowIntentId, WorkflowSession } from "@/src/types/workflows";
import { notifyWorkflowSessionsChanged } from "@/src/lib/workflowSessions";
import { intentToTopic } from "@/src/lib/workflowTopics";
import { EditableWorkflowTitle } from "@/src/components/workflows/WorkflowSidebarSessionItem";
import { lazyNamed } from "@/src/lib/lazy-component";
import { __assistantReplyFor } from "@/src/components/commercial/ChatPanel";
import {
  ASK_AI_TENANT_MOCK_OPTIONS,
  formatAskAiScopeUserLine,
} from "@/src/lib/askAiLeaseMockData";
import { ASK_AI_LEASE_RENEWAL_USER_MESSAGE } from "@/src/types/askAi";
import { useWorkflowChatColumnMaxPx } from "@/src/hooks/useWorkflowChatColumnMaxPx";
import {
  SHELL_WORKFLOW_CHAT_DOCK_PX,
  shellWorkflowProposalPanelHeightCss,
} from "@/src/lib/shellLayout";
import { WorkflowChatDock } from "@/src/components/workflows/WorkflowChatDock";
import { cn } from "@/lib/utils";

const LeasingToolView = lazyNamed(
  () => import("@/src/components/commercial/views/LeasingToolView"),
  "LeasingToolView",
  "Loading renewal workspace…",
);

const THINKING_MS = 950;

const SOMETHING_ELSE_PROMPT =
  "Sure — please tell me what you need, and I'll help you create the right workflow.";

const SOMETHING_ELSE_LABEL = INTENT_LABELS["something-else"];

function normalizeWorkflowStep(session: WorkflowSession): WorkflowSession["step"] {
  if (
    session.step === "complete" &&
    session.intent === "lease-renewal" &&
    session.tenant
  ) {
    return "lease-renewal-active";
  }
  return session.step;
}

function reviewProposalPanelMessage(tenant: string, property?: string) {
  const headline = "First Lease Renewal Proposal is ready !";
  const secondParagraph =
    "You can review it in the side panel, and I'm here to help with any additional actions or next steps for the renewal.";
  if (property) {
    return `${headline}\n\nI've drafted the lease renewal proposal for ${tenant} at ${property}.\n\n${secondParagraph}`;
  }
  return `${headline}\n\nI've drafted the lease renewal proposal for ${tenant}.\n\n${secondParagraph}`;
}

type FollowUpMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Props = {
  sessionId: string;
  initialSession?: WorkflowSession;
};

export function WorkflowCreationChat({ sessionId, initialSession }: Props) {
  const { saveSession } = useWorkflowSessions();
  const listRef = useRef<HTMLDivElement>(null);

  const initial = initialSession ?? {
    id: sessionId,
    title: "New workflow",
    step: "intent" as const,
    createdAt: Date.now(),
  };
  const normalizedInitial: WorkflowSession = {
    ...initial,
    step: normalizeWorkflowStep(initial),
  };

  const [session, setSession] = useState<WorkflowSession>(normalizedInitial);
  const [revealedStep, setRevealedStep] = useState<WorkflowSession["step"]>(
    normalizedInitial.step,
  );

  useEffect(() => {
    if (initial.step !== normalizedInitial.step) {
      saveSession(normalizedInitial);
    }
    // Migrate legacy sessions once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [portfolio, setPortfolio] = useState(session.portfolio ?? "All portfolio");
  const leaseRenewalUserPrompt = ASK_AI_LEASE_RENEWAL_USER_MESSAGE;
  const [entity, setEntity] = useState(session.entity ?? "");
  const [property, setProperty] = useState(session.property ?? "");
  const [locked, setLocked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null);
  const [selectedPromptLabel, setSelectedPromptLabel] = useState<string | null>(null);
  const [renewalSubStep, setRenewalSubStep] = useState<
    "pipeline" | "proposal-prep" | "lease-proposal" | "review-proposal"
  >(session.renewalSubStep ?? "proposal-prep");
  const [proposalPanelOpen, setProposalPanelOpen] = useState(session.proposalPanelOpen ?? false);
  const [hasProposalDraft, setHasProposalDraft] = useState(session.hasProposalDraft ?? false);
  const [showReviewProposalMessage, setShowReviewProposalMessage] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [followUpTyping, setFollowUpTyping] = useState(false);

  const renewalContext = useMemo(
    () => ({
      tenantName: session.tenant ?? "",
      property: session.property ?? property,
      portfolio: session.portfolio ?? portfolio,
      entity: session.entity ?? entity,
    }),
    [session.tenant, session.property, session.portfolio, session.entity, property, portfolio, entity],
  );

  useEffect(() => {
    if (renewalSubStep !== "review-proposal") {
      setShowReviewProposalMessage(false);
      return;
    }
    setHasProposalDraft(true);
    setProposalPanelOpen(false);
    setShowReviewProposalMessage(true);
  }, [renewalSubStep]);

  const handleProposalDraftReady = useCallback(() => {
    setShowReviewProposalMessage(true);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [revealedStep, isTyping, optimisticUser, session.step, renewalSubStep, followUpMessages, followUpTyping, showReviewProposalMessage]);

  const persist = useCallback(
    (next: WorkflowSession) => {
      const merged: WorkflowSession = {
        ...next,
        renewalSubStep,
        proposalPanelOpen,
        hasProposalDraft,
      };
      setSession(merged);
      saveSession(merged);
      notifyWorkflowSessionsChanged();
    },
    [saveSession, renewalSubStep, proposalPanelOpen, hasProposalDraft],
  );

  useEffect(() => {
    if (session.step !== "lease-renewal-active") return;
    saveSession({
      ...session,
      renewalSubStep,
      proposalPanelOpen,
      hasProposalDraft,
    });
  }, [renewalSubStep, proposalPanelOpen, hasProposalDraft, saveSession, session]);

  const thinkThenReveal = useCallback(
    (userText: string, nextSession: WorkflowSession, after?: () => void) => {
      setOptimisticUser(userText);
      setIsTyping(true);
      setLocked(true);
      window.setTimeout(() => {
        persist(nextSession);
        setRevealedStep(nextSession.step);
        setOptimisticUser(null);
        setIsTyping(false);
        setLocked(false);
        after?.();
      }, THINKING_MS);
    },
    [persist],
  );

  const sendRenewalFollowUp = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || followUpTyping || session.step !== "lease-renewal-active") return;

      const userMsg: FollowUpMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
      };
      setFollowUpMessages((prev) => [...prev, userMsg]);
      setFollowUpTyping(true);

      window.setTimeout(() => {
        const assistantMsg: FollowUpMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: __assistantReplyFor(trimmed),
        };
        setFollowUpMessages((prev) => [...prev, assistantMsg]);
        setFollowUpTyping(false);
      }, THINKING_MS);
    },
    [followUpTyping, isTyping, session.step],
  );

  const handleAnalyseWithAmiio = useCallback(
    (topic: string) => {
      sendRenewalFollowUp(`Analyse ${topic}`);
    },
    [sendRenewalFollowUp],
  );

  const startWorkflowFromIntent = (intent: WorkflowIntentId, userLabel: string) => {
    if (locked || isTyping) return;
    setSelectedPromptLabel(userLabel);

    if (intent === "something-else") {
      const tagged = { ...session, intent };
      setSession(tagged);
      saveSession(tagged);
      thinkThenReveal(userLabel, {
        ...tagged,
        step: "custom-intent",
      });
      return;
    }

    const topic = intentToTopic(intent);
    const tagged = topic ? { ...session, intent, topic } : { ...session, intent };
    setSession(tagged);
    saveSession(tagged);

    if (intent === "lease-renewal") {
      thinkThenReveal(ASK_AI_LEASE_RENEWAL_USER_MESSAGE, {
        ...tagged,
        title: "Lease Renewal",
        step: "lease-scope",
        portfolio: portfolio || "All portfolio",
      });
      return;
    }

    thinkThenReveal(userLabel, {
      ...tagged,
      title: INTENT_LABELS[intent],
      step: "complete",
    });
    window.setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent("amiio:toast", {
            detail: { message: `${INTENT_LABELS[intent]} workflow is coming soon in this demo.` },
          }),
        ),
      THINKING_MS + 50,
    );
  };

  const handlePromptSelect = (prompt: { label: string; intent: WorkflowIntentId }) => {
    startWorkflowFromIntent(prompt.intent, prompt.label);
  };

  const handleCustomIntent = (description: string) => {
    if (locked || isTyping || session.step !== "custom-intent") return;

    const title =
      description.length > 48 ? `${description.slice(0, 48).trim()}…` : description.trim();

    thinkThenReveal(description, {
      ...session,
      title,
      customDescription: description,
      step: "complete",
    });
    window.setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent("amiio:toast", {
            detail: {
              message:
                "Thanks for the details — custom workflow creation is coming soon in this demo.",
            },
          }),
        ),
      THINKING_MS + 50,
    );
  };

  const handleScopeComplete = (nextPortfolio: string, nextEntity: string, nextProperty: string) => {
    if (locked || isTyping || session.step !== "lease-scope") return;
    setPortfolio(nextPortfolio);
    setEntity(nextEntity);
    setProperty(nextProperty);
    thinkThenReveal(formatAskAiScopeUserLine(nextEntity, nextProperty), {
      ...session,
      step: "lease-tenants",
      portfolio: nextPortfolio,
      entity: nextEntity,
      property: nextProperty,
    });
  };

  const handleTenantSelect = (tenantId: string) => {
    if (locked || isTyping || session.step !== "lease-tenants") return;
    const tenant = ASK_AI_TENANT_MOCK_OPTIONS.find((t) => t.id === tenantId);
    if (!tenant) return;

    thinkThenReveal(tenant.name, {
      ...session,
      title: tenant.name,
      step: "lease-reasoning",
      tenant: tenant.name,
      tenantId: tenant.id,
      portfolio,
      entity,
      property,
      topic: session.topic ?? intentToTopic("lease-renewal"),
    });
  };

  const completeLeaseReasoning = () => {
    if (session.step !== "lease-reasoning") return;
    const next = { ...session, step: "lease-handoff" as const };
    persist(next);
    setRevealedStep("lease-handoff");
  };

  const handleContinueLeaseWorkspace = () => {
    if (session.step !== "lease-handoff" || !session.tenant) return;
    const next: WorkflowSession = {
      ...session,
      step: "lease-renewal-active",
      renewalSubStep: "proposal-prep",
    };
    persist(next);
    setRevealedStep("lease-renewal-active");
  };

  /** Chip landing only — New/+ never start lease renewal until a leasing prompt is chosen. */
  const showPromptChipLanding =
    !session.intent && revealedStep === "intent" && !isTyping;

  const showLeaseRenewalChatFlow = session.intent === "lease-renewal";

  const somethingElseSubmitted =
    session.intent === "something-else" &&
    (revealedStep !== "intent" || Boolean(optimisticUser));
  const thinkingAfterSomethingElse =
    isTyping && session.intent === "something-else" && revealedStep === "intent";
  const showSomethingElsePrompt =
    revealedStep === "custom-intent" && !thinkingAfterSomethingElse;
  const somethingElsePromptLabel = selectedPromptLabel ?? SOMETHING_ELSE_LABEL;
  const thinkingAfterCustomDescription =
    isTyping &&
    Boolean(optimisticUser) &&
    optimisticUser !== somethingElsePromptLabel &&
    session.intent === "something-else";
  const customDescriptionSubmitted =
    Boolean(session.customDescription) ||
    (Boolean(optimisticUser) &&
      optimisticUser !== somethingElsePromptLabel &&
      session.intent === "something-else" &&
      (revealedStep === "complete" || thinkingAfterCustomDescription));
  const leaseRenewalActive = session.step === "lease-renewal-active";
  const isExternalLeaseRenewal =
    Boolean(session.launchedExternally) &&
    session.intent === "lease-renewal" &&
    leaseRenewalActive &&
    Boolean(session.tenant);

  const showFloatingProposalPanel =
    proposalPanelOpen &&
    hasProposalDraft &&
    Boolean(session.tenant) &&
    leaseRenewalActive &&
    renewalSubStep !== "review-proposal";

  const chatColumnMaxPx = useWorkflowChatColumnMaxPx(showFloatingProposalPanel);

  const proposalContext = {
    tenantName: session.tenant ?? "",
    property: session.property ?? property,
    portfolio: session.portfolio ?? portfolio,
    entity: session.entity ?? entity,
  };

  const showLeaseRenewalAskChat =
    showLeaseRenewalChatFlow && revealedStep !== "lease-renewal-active";

  const chatColumnClass = "w-full min-w-0";

  const isLeaseRenewalWorkspace =
    session.intent === "lease-renewal" &&
    session.step === "lease-renewal-active" &&
    Boolean(session.tenant);

  if (isLeaseRenewalWorkspace) {
    return (
      <AppShell activeNav="leasing-renewal">
        <div className="min-h-screen bg-[#F7F8FA]">
          <DashboardPageBody className="pt-8">
            <Suspense fallback={<DashboardLoading label="Loading renewal workspace…" />}>
              <LeasingToolView
                entryIntent="proposal-prep"
                renewalContext={renewalContext}
                renewalSubStep={renewalSubStep}
                onRenewalStepChange={setRenewalSubStep}
                proposalDraftAvailable={hasProposalDraft}
                proposalPanelOpen={proposalPanelOpen}
                onOpenProposalPanel={() => setProposalPanelOpen(true)}
                onProposalDraftReady={handleProposalDraftReady}
                onAnalyseWithAmiio={handleAnalyseWithAmiio}
              />
            </Suspense>
          </DashboardPageBody>
        </div>
      </AppShell>
    );
  }

  const workflowChatMessages = (
    <>
      {!isExternalLeaseRenewal && showPromptChipLanding ? (
        <div className={chatColumnClass}>
          <WorkflowStageLanding
            onPromptSelect={handlePromptSelect}
            disabled={locked || isTyping}
          />
        </div>
      ) : null}

      {session.intent === "something-else" ? (
        <div className={chatColumnClass}>
          {somethingElseSubmitted ? (
            <WorkflowUserBubble>{somethingElsePromptLabel}</WorkflowUserBubble>
          ) : null}
          {thinkingAfterSomethingElse ? <WorkflowThinkingIndicator /> : null}
          {showSomethingElsePrompt ? (
            <WorkflowAiBlock question={SOMETHING_ELSE_PROMPT} />
          ) : null}
          {customDescriptionSubmitted ? (
            <WorkflowUserBubble>
              {optimisticUser && optimisticUser !== somethingElsePromptLabel
                ? optimisticUser
                : session.customDescription}
            </WorkflowUserBubble>
          ) : null}
          {thinkingAfterCustomDescription ? <WorkflowThinkingIndicator /> : null}
        </div>
      ) : showLeaseRenewalAskChat && !isExternalLeaseRenewal ? (
        <div
          className={cn(chatColumnClass, "mx-auto flex max-w-[720px] flex-col gap-6")}
        >
          <WorkflowLeaseRenewalAskFlow
            session={session}
            revealedStep={revealedStep}
            userPrompt={leaseRenewalUserPrompt}
            portfolio={portfolio}
            entity={entity}
            property={property}
            isTyping={isTyping}
            optimisticUser={optimisticUser}
            locked={locked}
            onPortfolioChange={setPortfolio}
            onEntityChange={setEntity}
            onPropertyChange={setProperty}
            onScopeComplete={handleScopeComplete}
            onTenantSelect={handleTenantSelect}
            onReasoningComplete={completeLeaseReasoning}
            onContinueWorkspace={handleContinueLeaseWorkspace}
          />
        </div>
      ) : session.intent && revealedStep !== "intent" ? (
        <div className={chatColumnClass}>
          <WorkflowUserBubble>
            {selectedPromptLabel ?? INTENT_LABELS[session.intent]}
          </WorkflowUserBubble>
          {isTyping ? <WorkflowThinkingIndicator /> : null}
        </div>
      ) : null}
    </>
  );

  return (
    <AppShell
      activeNav="workflow-new"
      sidePanelAlign={showFloatingProposalPanel ? "workflow-stage" : "default"}
      chatPanel={
        showFloatingProposalPanel ? (
          <LeaseProposalDocumentPanel
            layout="floating"
            context={proposalContext}
            onClose={() => setProposalPanelOpen(false)}
            onDraftReady={handleProposalDraftReady}
          />
        ) : undefined
      }
    >
      <div className="relative flex min-h-screen w-full min-w-0 flex-col bg-[#F7F8FA]">
        <div
          className="mx-auto flex w-full min-w-0 flex-1 flex-col px-6 pt-8"
          style={{
            maxWidth: chatColumnMaxPx,
            paddingBottom: SHELL_WORKFLOW_CHAT_DOCK_PX,
          }}
        >
          <div className="mb-6 flex shrink-0 items-center gap-2">
            <EditableWorkflowTitle
              title={session.title}
              className="typo-page-title text-[#010309]"
              onRename={(title) => {
                persist({ ...session, title });
              }}
            />
            <span className="rounded-full bg-[#EBEDF9] px-2 py-0.5 text-[11px] font-medium text-[#233FDE]">
              Workflows
            </span>
          </div>

          <div ref={listRef} className="flex w-full min-w-0 flex-col gap-6">
            {workflowChatMessages}
          </div>
        </div>

        <WorkflowChatDock maxWidth={chatColumnMaxPx}>
          <WorkflowChatBar
            floating
            isTyping={isTyping || followUpTyping}
            placeholder={
              session.step === "custom-intent"
                ? "Describe the workflow you need…"
                : session.step === "lease-renewal-active"
                  ? "Ask anything about this renewal…"
                  : "Ask anything about this workflow…"
            }
            onSend={
              session.step === "custom-intent"
                ? handleCustomIntent
                : session.step === "lease-renewal-active"
                  ? sendRenewalFollowUp
                  : undefined
            }
          />
        </WorkflowChatDock>
      </div>
    </AppShell>
  );
}
