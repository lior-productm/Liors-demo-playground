"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minimize2 } from "lucide-react";
import { ChatHistoryTrigger } from "@/src/components/commercial/ChatHistoryTrigger";
import { AppShell } from "@/src/components/layout/AppShell";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import { __assistantReplyFor, SidebarChatInputDock } from "@/src/components/commercial/ChatPanel";
import { AskAiLandingHero } from "@/src/components/ask-ai/AskAiLanding";
import { AskAiAnalystsSection } from "@/src/components/ai-assistants/AskAiAnalystsSection";
import {
  AskAiLeaseScopeBlock,
  AskAiLeaseTenantStep,
  ASK_AI_TENANT_SHORT_PROMPT,
} from "@/src/components/ask-ai/AskAiLeaseFlowUi";
import { AskAiLeaseHandoffReply } from "@/src/components/ask-ai/AskAiLeaseHandoffReply";
import {
  AskAiReasoningStep,
  buildLeaseRenewalReasoningSteps,
} from "@/src/components/ask-ai/AskAiReasoningStep";
import {
  AskAiInsightChoice,
  AskAiInsightPrompt,
  AskAiInsightValidationCard,
} from "@/src/components/ask-ai/AskAiInsightFlowUi";
import {
  ASK_AI_INSIGHT_FREQUENCY_CUSTOM_PROMPT,
  ASK_AI_INSIGHT_FREQUENCY_OPTIONS,
  ASK_AI_INSIGHT_FREQUENCY_PROMPT,
  ASK_AI_INSIGHT_TOPIC_CUSTOM_PROMPT,
  ASK_AI_INSIGHT_TOPIC_OPTIONS,
  ASK_AI_INSIGHT_TOPIC_PROMPT,
  buildInsightReasoningSteps,
  deriveInsightFormula,
} from "@/src/lib/askAiInsightMockData";
import { createInsightFromAskAi } from "@/src/lib/insightCreation";
import {
  WorkflowAiBlock,
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";
import { useAskAiSessions } from "@/src/hooks/useAskAiSessions";
import {
  ASK_AI_TENANT_MOCK_OPTIONS,
  formatAskAiScopeUserLine,
  getAskAiTenantChipOptions,
} from "@/src/lib/askAiLeaseMockData";
import { notifyAskAiSessionsChanged, upsertAskAiSession } from "@/src/lib/askAiSessions";
import {
  createWorkflowSession,
  notifyWorkflowSessionsChanged,
  readWorkflowSessions,
  upsertWorkflowSession,
} from "@/src/lib/workflowSessions";
import { intentToTopic } from "@/src/lib/workflowTopics";
import {
  getLeaseEntityOptions,
  getLeasePortfolioOptions,
  getLeasePropertyOptions,
} from "@/src/lib/leaseBackendData";
import type {
  AskAiInsightCreationState,
  AskAiLeaseRenewalState,
  AskAiSession,
} from "@/src/types/askAi";
import {
  ASK_AI_CREATE_INSIGHT_USER_MESSAGE,
  ASK_AI_LEASE_RENEWAL_USER_MESSAGE,
} from "@/src/types/askAi";
import type { ChatMessage } from "@/src/types/commercial";
import {
  SHELL_WORKFLOW_CHAT_BAR_MAX_PX,
} from "@/src/lib/shellLayout";

const THINKING_MS = 950;
const INSIGHT_CREATE_MS = 2100;
const ASK_AI_CONVERSATION_MAX_PX = 720;

function deriveTitle(text: string, fallback: string) {
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  return trimmed.length > 48 ? `${trimmed.slice(0, 48).trim()}…` : trimmed;
}

function isLeaseRenewalIntent(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("lease renewal") ||
    t.includes("lease-renewal") ||
    t === ASK_AI_LEASE_RENEWAL_USER_MESSAGE.toLowerCase()
  );
}

function isCreateInsightIntent(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("create new insight") ||
    t.includes("create insight") ||
    t.includes("new insight")
  );
}

function defaultLeaseRenewalState(): AskAiLeaseRenewalState {
  return {
    step: "scope",
    portfolio: "All portfolio",
    entity: "",
    property: "",
  };
}

type Props = {
  sessionId?: string;
  initialSession?: AskAiSession;
};

export function AskAiChat({ sessionId, initialSession }: Props) {
  const router = useRouter();
  const { saveSession } = useAskAiSessions();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  const [session, setSession] = useState<AskAiSession | null>(
    initialSession ??
      (sessionId
        ? {
            id: sessionId,
            title: "New chat",
            messages: [],
            createdAt: Date.now(),
          }
        : null),
  );
  const [isTyping, setIsTyping] = useState(false);
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null);
  const [scopeDraft, setScopeDraft] = useState<AskAiLeaseRenewalState>(
    session?.leaseRenewal ?? defaultLeaseRenewalState(),
  );

  const messages = session?.messages ?? [];
  const leaseRenewal = session?.leaseRenewal;
  const insightCreation = session?.insightCreation;
  const hasConversation =
    messages.length > 0 || Boolean(optimisticUser) || isTyping;

  useEffect(() => {
    if (session?.leaseRenewal) {
      setScopeDraft(session.leaseRenewal);
    }
  }, [session?.leaseRenewal]);

  const portfolioOptions = useMemo(() => getLeasePortfolioOptions(), []);
  const entityOptions = useMemo(
    () => getLeaseEntityOptions(scopeDraft.portfolio),
    [scopeDraft.portfolio],
  );
  const propertyOptions = useMemo(
    () => getLeasePropertyOptions(scopeDraft.portfolio, scopeDraft.entity),
    [scopeDraft.portfolio, scopeDraft.entity],
  );
  const tenantChipOptions = useMemo(() => getAskAiTenantChipOptions(), []);
  const tenantAllOptions = useMemo(() => ASK_AI_TENANT_MOCK_OPTIONS, []);

  useEffect(() => {
    if (!hasConversation) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [
    messages.length,
    isTyping,
    optimisticUser,
    hasConversation,
    leaseRenewal?.step,
    leaseRenewal?.tenantName,
    insightCreation?.step,
    scopeDraft.entity,
    scopeDraft.property,
  ]);

  const persist = useCallback(
    (next: AskAiSession) => {
      setSession(next);
      saveSession(next);
      notifyAskAiSessionsChanged();
    },
    [saveSession],
  );

  const appendMessages = useCallback(
    (
      userText: string,
      assistantText: string | null,
      leaseState?: AskAiLeaseRenewalState,
    ) => {
      const now = Date.now();
      const time = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const userMsg: ChatMessage = {
        id: `u-${now}`,
        role: "user",
        text: userText,
        timestamp: time,
      };
      const priorMessages = session?.messages ?? [];
      const nextMessages = assistantText
        ? [
            ...priorMessages,
            userMsg,
            {
              id: `a-${now + 1}`,
              role: "assistant" as const,
              text: assistantText,
              timestamp: time,
            },
          ]
        : [...priorMessages, userMsg];

      const base: AskAiSession = session ?? {
        id: `ai-${now}`,
        title: deriveTitle(userText, "New chat"),
        messages: [],
        createdAt: now,
      };

      const next: AskAiSession = {
        ...base,
        title:
          priorMessages.length === 0 ? deriveTitle(userText, base.title) : base.title,
        messages: nextMessages,
        leaseRenewal: leaseState,
        updatedAt: now,
      };

      if (!session) {
        upsertAskAiSession(next);
        notifyAskAiSessionsChanged();
        setSession(next);
        router.replace(`/ask-ai/${next.id}`);
      } else {
        persist(next);
      }
    },
    [persist, router, session],
  );

  const startLeaseRenewalFlow = useCallback(() => {
    if (isTyping) return;
    setOptimisticUser(ASK_AI_LEASE_RENEWAL_USER_MESSAGE);
    setIsTyping(true);
    setScopeDraft(defaultLeaseRenewalState());

    window.setTimeout(() => {
      appendMessages(ASK_AI_LEASE_RENEWAL_USER_MESSAGE, null, defaultLeaseRenewalState());
      setOptimisticUser(null);
      setIsTyping(false);
    }, THINKING_MS);
  }, [appendMessages, isTyping]);

  /** Append a user bubble + advance the in-chat insight flow, creating the session if needed. */
  const advanceInsightFlow = useCallback(
    (userText: string, nextState: AskAiInsightCreationState) => {
      const now = Date.now();
      const userMsg: ChatMessage = {
        id: `u-${now}`,
        role: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (session) {
        persist({
          ...session,
          title:
            session.messages.length === 0
              ? deriveTitle(userText, session.title)
              : session.title,
          messages: [...session.messages, userMsg],
          insightCreation: nextState,
        });
      } else {
        const created: AskAiSession = {
          id: `ai-${now}`,
          title: deriveTitle(userText, "New chat"),
          messages: [userMsg],
          createdAt: now,
          insightCreation: nextState,
        };
        upsertAskAiSession(created);
        notifyAskAiSessionsChanged();
        setSession(created);
        router.replace(`/ask-ai/${created.id}`);
      }
    },
    [persist, router, session],
  );

  const startInsightFlow = useCallback(() => {
    if (isTyping) return;
    setOptimisticUser(ASK_AI_CREATE_INSIGHT_USER_MESSAGE);
    setIsTyping(true);

    window.setTimeout(() => {
      advanceInsightFlow(ASK_AI_CREATE_INSIGHT_USER_MESSAGE, { step: "topic" });
      setOptimisticUser(null);
      setIsTyping(false);
    }, THINKING_MS);
  }, [advanceInsightFlow, isTyping]);

  const handleInsightTopic = useCallback(
    (topic: string) => {
      const trimmed = topic.trim();
      if (!trimmed || isTyping || session?.insightCreation?.step !== "topic") return;

      setOptimisticUser(trimmed);
      setIsTyping(true);

      window.setTimeout(() => {
        advanceInsightFlow(trimmed, { step: "frequency", topic: trimmed });
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [advanceInsightFlow, isTyping, session?.insightCreation?.step],
  );

  const handleInsightFrequency = useCallback(
    (frequency: string) => {
      const trimmed = frequency.trim();
      const ic = session?.insightCreation;
      if (!trimmed || isTyping || ic?.step !== "frequency" || !ic.topic) return;

      setOptimisticUser(trimmed);
      setIsTyping(true);

      window.setTimeout(() => {
        advanceInsightFlow(trimmed, {
          step: "thinking",
          topic: ic.topic,
          frequency: trimmed,
        });
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [advanceInsightFlow, isTyping, session?.insightCreation],
  );

  const handleInsightOther = useCallback(() => {
    const ic = session?.insightCreation;
    if (!session || isTyping || ic?.awaitingCustom) return;
    if (ic?.step !== "topic" && ic?.step !== "frequency") return;

    setIsTyping(true);
    window.setTimeout(() => {
      persist({
        ...session,
        insightCreation: { ...ic, awaitingCustom: true },
      });
      setIsTyping(false);
      inputRef.current?.focus();
    }, THINKING_MS);
  }, [isTyping, persist, session]);

  const completeInsightThinking = useCallback(() => {
    if (!session?.insightCreation || session.insightCreation.step !== "thinking") return;
    persist({
      ...session,
      insightCreation: { ...session.insightCreation, step: "validation" },
    });
  }, [persist, session]);

  const handleCreateInsight = useCallback(() => {
    const ic = session?.insightCreation;
    if (!session || ic?.step !== "validation" || !ic.topic || !ic.frequency) return;

    const baseSession = session;
    const topic = ic.topic;
    const frequency = ic.frequency;

    // Phase 1 — show the live "Creating Insight..." loader.
    persist({ ...baseSession, insightCreation: { ...ic, step: "creating" } });

    // Phase 2 — persist the insight, confirm, and route to Insights.
    window.setTimeout(() => {
      createInsightFromAskAi({
        topic,
        formula: deriveInsightFormula(topic),
        frequency,
      });

      persist({
        ...baseSession,
        insightCreation: { ...ic, step: "complete" },
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("amiio:toast", {
            detail: { message: `Insight “${topic}” created` },
          }),
        );
      }

      window.setTimeout(() => router.push("/workspace"), 700);
    }, INSIGHT_CREATE_MS);
  }, [persist, router, session]);

  const onSend = useCallback(
    (text: string) => {
      if (isTyping) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const ic = session?.insightCreation;
      if (ic?.step === "topic") {
        handleInsightTopic(trimmed);
        return;
      }
      if (ic?.step === "frequency") {
        handleInsightFrequency(trimmed);
        return;
      }

      if (isCreateInsightIntent(trimmed) && !insightCreation && !leaseRenewal) {
        startInsightFlow();
        return;
      }

      if (isLeaseRenewalIntent(trimmed) && !leaseRenewal) {
        startLeaseRenewalFlow();
        return;
      }

      setOptimisticUser(trimmed);
      setIsTyping(true);

      window.setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now() + 1}`,
          role: "assistant",
          text: __assistantReplyFor(trimmed),
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        const userMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          role: "user",
          text: trimmed,
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        if (session) {
          persist({
            ...session,
            title:
              session.messages.length === 0
                ? deriveTitle(trimmed, session.title)
                : session.title,
            messages: [...session.messages, userMsg, assistantMsg],
          });
        } else {
          const created: AskAiSession = {
            id: `ai-${Date.now()}`,
            title: deriveTitle(trimmed, "New chat"),
            messages: [userMsg, assistantMsg],
            createdAt: Date.now(),
          };
          upsertAskAiSession(created);
          notifyAskAiSessionsChanged();
          setSession(created);
          router.replace(`/ask-ai/${created.id}`);
        }

        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [
      handleInsightFrequency,
      handleInsightTopic,
      insightCreation,
      isTyping,
      leaseRenewal,
      persist,
      router,
      session,
      startInsightFlow,
      startLeaseRenewalFlow,
    ],
  );

  const handleScopeComplete = useCallback(
    (portfolio: string, entity: string, property: string) => {
      if (!session?.leaseRenewal || session.leaseRenewal.step !== "scope" || isTyping) return;

      const scopeLine = formatAskAiScopeUserLine(entity, property);
      setOptimisticUser(scopeLine);
      setIsTyping(true);

      window.setTimeout(() => {
        const userMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          role: "user",
          text: scopeLine,
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        persist({
          ...session,
          messages: [...session.messages, userMsg],
          leaseRenewal: { step: "tenant", portfolio, entity, property },
        });
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [isTyping, persist, session],
  );

  const handleTenantSelect = useCallback(
    (tenantId: string) => {
      if (!session?.leaseRenewal || session.leaseRenewal.step !== "tenant" || isTyping) return;
      const tenant = ASK_AI_TENANT_MOCK_OPTIONS.find((t) => t.id === tenantId);
      if (!tenant) return;

      setOptimisticUser(tenant.name);
      setIsTyping(true);

      window.setTimeout(() => {
        const userMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          role: "user",
          text: tenant.name,
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        persist({
          ...session,
          messages: [...session.messages, userMsg],
          leaseRenewal: {
            ...session.leaseRenewal!,
            step: "reasoning",
            tenantId: tenant.id,
            tenantName: tenant.name,
          },
        });
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [isTyping, persist, session],
  );

  const completeReasoning = useCallback(() => {
    if (!session?.leaseRenewal || session.leaseRenewal.step !== "reasoning") return;

    persist({
      ...session,
      leaseRenewal: { ...session.leaseRenewal, step: "complete" },
    });
  }, [persist, session]);

  const handleContinueProcess = useCallback(() => {
    const lr = session?.leaseRenewal;
    if (!lr?.tenantName || lr.step !== "complete") return;

    const tenant = lr.tenantName;
    const matched = readWorkflowSessions().find(
      (item) =>
        item.intent === "lease-renewal" &&
        item.tenant === tenant &&
        item.step === "lease-renewal-active",
    );

    if (matched) {
      router.push(`/workflows/${matched.id}`);
      return;
    }

    const wf = createWorkflowSession();
    upsertWorkflowSession({
      ...wf,
      title: tenant,
      intent: "lease-renewal",
      topic: intentToTopic("lease-renewal"),
      step: "lease-renewal-active",
      tenant,
      portfolio: lr.portfolio,
      entity: lr.entity,
      property: lr.property,
      launchedExternally: true,
      renewalSubStep: "proposal-prep",
    });
    notifyWorkflowSessionsChanged();
    router.push(`/workflows/${wf.id}`);
  }, [router, session?.leaseRenewal]);

  const reasoningSteps = useMemo(() => {
    if (!leaseRenewal?.tenantName) return [];
    return buildLeaseRenewalReasoningSteps(leaseRenewal.tenantName);
  }, [leaseRenewal?.tenantName]);

  const insightReasoningSteps = useMemo(() => {
    if (!insightCreation?.topic || !insightCreation.frequency) return [];
    return buildInsightReasoningSteps(insightCreation.topic, insightCreation.frequency);
  }, [insightCreation?.topic, insightCreation?.frequency]);

  const showLeaseScope =
    leaseRenewal?.step === "scope" && !isTyping && !optimisticUser;
  const showLeaseTenants =
    leaseRenewal?.step === "tenant" && !isTyping && !optimisticUser;
  const showTenantHistory =
    leaseRenewal &&
    (leaseRenewal.step === "reasoning" || leaseRenewal.step === "complete") &&
    !isTyping &&
    !optimisticUser;
  const showReasoningActive =
    leaseRenewal?.step === "reasoning" &&
    Boolean(leaseRenewal.tenantName) &&
    !isTyping &&
    !optimisticUser;
  const showReasoningComplete =
    leaseRenewal?.step === "complete" &&
    Boolean(leaseRenewal.tenantName) &&
    !isTyping &&
    !optimisticUser;
  const showHandoff =
    leaseRenewal?.step === "complete" &&
    Boolean(leaseRenewal.tenantId && leaseRenewal.tenantName) &&
    !isTyping &&
    !optimisticUser;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;
    setDraft("");
    onSend(trimmed);
  };

  return (
    <CommercialChatInjectContext.Provider value={onSend}>
      <AppShell activeNav="ask-ai" mainAlign="center" hideMainScrollbar>
        <div className="relative min-h-full bg-[#F7F8FA]">
          <div className="absolute right-8 top-8 z-10 flex items-center gap-1 text-[#7E8185]">
            <ChatHistoryTrigger />
            <button
              type="button"
              className="flex size-8 items-center justify-center transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]"
              aria-label="Minimize"
            >
              <Minimize2 className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          {!hasConversation ? (
            <div className="mx-auto flex min-h-full w-full flex-col items-center px-6 pb-16 pt-[120px]">
              <div
                className="flex w-full flex-col items-center"
                style={{ maxWidth: SHELL_WORKFLOW_CHAT_BAR_MAX_PX }}
              >
                <AskAiLandingHero
                  isTyping={isTyping}
                  onChipSelect={onSend}
                  onLeaseRenewalStart={startLeaseRenewalFlow}
                  onCreateInsightStart={startInsightFlow}
                />

                <div className="mt-10 flex w-full max-w-[720px] justify-center">
                  <SidebarChatInputDock
                    layout="full"
                    className="w-full"
                    draft={draft}
                    error={null}
                    isTyping={isTyping}
                    inputRef={inputRef}
                    onDraftChange={setDraft}
                    onSubmit={handleFormSubmit}
                  />
                </div>
              </div>

              <div className="mt-12 w-full max-w-[760px]">
                <AskAiAnalystsSection onStartChat={(card) => onSend(card.starterPrompt)} />
              </div>
            </div>
          ) : (
            <div className="relative mx-auto flex min-h-full w-full max-w-full flex-col bg-[#F7F8FA] px-6">
              <div
                className="mx-auto flex w-full flex-1 flex-col pt-8"
                style={{ maxWidth: ASK_AI_CONVERSATION_MAX_PX }}
              >
                <div ref={listRef} className="flex flex-col gap-6 pb-6 pt-16">
                  {insightCreation ? (
                    <>
                      {messages[0] ? (
                        <WorkflowUserBubble key={messages[0].id} size="sm">
                          {messages[0].text}
                        </WorkflowUserBubble>
                      ) : null}

                      <AskAiInsightChoice
                        prompt={ASK_AI_INSIGHT_TOPIC_PROMPT}
                        options={ASK_AI_INSIGHT_TOPIC_OPTIONS}
                        selected={insightCreation.topic}
                        answered={insightCreation.step !== "topic"}
                        awaitingCustom={
                          insightCreation.step === "topic" &&
                          insightCreation.awaitingCustom
                        }
                        disabled={isTyping}
                        onSelect={handleInsightTopic}
                        onOther={handleInsightOther}
                      />

                      {insightCreation.step === "topic" &&
                      insightCreation.awaitingCustom &&
                      !isTyping &&
                      !optimisticUser ? (
                        <AskAiInsightPrompt>
                          {ASK_AI_INSIGHT_TOPIC_CUSTOM_PROMPT}
                        </AskAiInsightPrompt>
                      ) : null}

                      {messages[1] ? (
                        <WorkflowUserBubble key={messages[1].id} size="sm">
                          {messages[1].text}
                        </WorkflowUserBubble>
                      ) : null}

                      {insightCreation.step !== "topic" ? (
                        <AskAiInsightChoice
                          prompt={ASK_AI_INSIGHT_FREQUENCY_PROMPT}
                          options={ASK_AI_INSIGHT_FREQUENCY_OPTIONS}
                          selected={insightCreation.frequency}
                          answered={insightCreation.step !== "frequency"}
                          awaitingCustom={
                            insightCreation.step === "frequency" &&
                            insightCreation.awaitingCustom
                          }
                          disabled={isTyping}
                          onSelect={handleInsightFrequency}
                          onOther={handleInsightOther}
                        />
                      ) : null}

                      {insightCreation.step === "frequency" &&
                      insightCreation.awaitingCustom &&
                      !isTyping &&
                      !optimisticUser ? (
                        <AskAiInsightPrompt>
                          {ASK_AI_INSIGHT_FREQUENCY_CUSTOM_PROMPT}
                        </AskAiInsightPrompt>
                      ) : null}

                      {messages[2] ? (
                        <WorkflowUserBubble key={messages[2].id} size="sm">
                          {messages[2].text}
                        </WorkflowUserBubble>
                      ) : null}

                      {insightCreation.step === "thinking" &&
                      !isTyping &&
                      !optimisticUser ? (
                        <AskAiReasoningStep
                          steps={insightReasoningSteps}
                          onComplete={completeInsightThinking}
                        />
                      ) : null}

                      {(insightCreation.step === "validation" ||
                        insightCreation.step === "creating" ||
                        insightCreation.step === "complete") &&
                      insightCreation.topic &&
                      insightCreation.frequency ? (
                        <>
                          <AskAiReasoningStep steps={insightReasoningSteps} completed />
                          <AskAiInsightValidationCard
                            topic={insightCreation.topic}
                            formula={deriveInsightFormula(insightCreation.topic)}
                            frequency={insightCreation.frequency}
                            creating={insightCreation.step === "creating"}
                            created={insightCreation.step === "complete"}
                            disabled={isTyping}
                            onCreate={handleCreateInsight}
                          />
                        </>
                      ) : null}
                    </>
                  ) : leaseRenewal ? (
                    <>
                      {messages[0] ? (
                        <WorkflowUserBubble key={messages[0].id} size="sm">
                          {messages[0].text}
                        </WorkflowUserBubble>
                      ) : null}

                      <AskAiLeaseScopeBlock
                        portfolio={scopeDraft.portfolio}
                        entity={scopeDraft.entity}
                        property={scopeDraft.property}
                        portfolioOptions={portfolioOptions}
                        entityOptions={entityOptions}
                        propertyOptions={propertyOptions}
                        showSelectors={showLeaseScope}
                        disabled={isTyping}
                        onPortfolioChange={(value) => {
                          const next = {
                            ...scopeDraft,
                            portfolio: value,
                            entity: "",
                            property: "",
                            step: "scope" as const,
                          };
                          setScopeDraft(next);
                          if (session) {
                            persist({ ...session, leaseRenewal: next });
                          }
                        }}
                        onEntityChange={(value) => {
                          const next = {
                            ...scopeDraft,
                            entity: value,
                            property: "",
                            step: "scope" as const,
                          };
                          setScopeDraft(next);
                          if (session) {
                            persist({ ...session, leaseRenewal: next });
                          }
                        }}
                        onPropertyChange={(value) => {
                          const next = { ...scopeDraft, property: value, step: "scope" as const };
                          setScopeDraft(next);
                          if (session) {
                            persist({ ...session, leaseRenewal: next });
                          }
                        }}
                        onScopeComplete={handleScopeComplete}
                      />

                      {messages[1] ? (
                        <WorkflowUserBubble key={messages[1].id} size="sm">
                          {messages[1].text}
                        </WorkflowUserBubble>
                      ) : null}

                      {showLeaseTenants ? (
                        <AskAiLeaseTenantStep
                          chipTenants={tenantChipOptions}
                          allTenants={tenantAllOptions}
                          onSelect={handleTenantSelect}
                          disabled={isTyping}
                        />
                      ) : null}

                      {showTenantHistory ? (
                        <AskAiLeaseTenantStep
                          chipTenants={tenantChipOptions}
                          allTenants={tenantAllOptions}
                          showPicker={false}
                          prompt={ASK_AI_TENANT_SHORT_PROMPT}
                          onSelect={handleTenantSelect}
                          disabled
                        />
                      ) : null}

                      {messages.slice(2).map((msg) =>
                        msg.role === "user" ? (
                          <WorkflowUserBubble key={msg.id} size="sm">
                            {msg.text}
                          </WorkflowUserBubble>
                        ) : (
                          <WorkflowAiBlock key={msg.id} question={msg.text} />
                        ),
                      )}

                      {showReasoningActive ? (
                        <AskAiReasoningStep
                          steps={reasoningSteps}
                          onComplete={completeReasoning}
                        />
                      ) : null}

                      {showReasoningComplete ? (
                        <AskAiReasoningStep steps={reasoningSteps} completed />
                      ) : null}

                      {showHandoff && leaseRenewal.tenantId && leaseRenewal.tenantName ? (
                        <AskAiLeaseHandoffReply
                          tenantId={leaseRenewal.tenantId}
                          tenantName={leaseRenewal.tenantName}
                          onContinue={handleContinueProcess}
                          disabled={isTyping}
                        />
                      ) : null}
                    </>
                  ) : (
                    messages.map((msg) =>
                      msg.role === "user" ? (
                        <WorkflowUserBubble key={msg.id} size="sm">
                          {msg.text}
                        </WorkflowUserBubble>
                      ) : (
                        <WorkflowAiBlock key={msg.id} question={msg.text} />
                      ),
                    )
                  )}

                  {optimisticUser ? (
                    <WorkflowUserBubble size="sm">{optimisticUser}</WorkflowUserBubble>
                  ) : null}
                  {isTyping && leaseRenewal?.step !== "reasoning" ? (
                    <WorkflowThinkingIndicator />
                  ) : null}
                </div>
              </div>

              <div
                className="sticky bottom-0 z-40 mx-auto flex w-full max-w-[720px] shrink-0 justify-center pb-6 pt-3"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, #F7F8FA 45%)",
                }}
              >
                <SidebarChatInputDock
                  layout="full"
                  className="w-full"
                  draft={draft}
                  error={null}
                  isTyping={isTyping}
                  inputRef={inputRef}
                  onDraftChange={setDraft}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </CommercialChatInjectContext.Provider>
  );
}
