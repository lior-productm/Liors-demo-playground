"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SidebarChatHeader,
  SidebarChatInputDock,
  SidebarChatShell,
} from "@/src/components/commercial/ChatPanel";
import {
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";
import { AskAiReasoningStep } from "@/src/components/ask-ai/AskAiReasoningStep";
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
import { ASK_AI_CREATE_INSIGHT_USER_MESSAGE } from "@/src/types/askAi";
import { createInsightFromAskAi } from "@/src/lib/insightCreation";
import type { InsightCardModel } from "@/src/components/pages/insights-data";

const THINKING_MS = 950;
const INSIGHT_CREATE_MS = 2100;
const COMPLETE_HANDOFF_MS = 800;

type Step = "topic" | "frequency" | "thinking" | "validation" | "creating" | "complete";

/**
 * Docked "Create new insight" chat — the Ask Amiio insight flow embedded in the
 * Insights page right panel (Figma 1907:54975). Ephemeral: no session/route state.
 */
export function InsightCreationChatPanel({
  onCreated,
  onClose,
}: {
  /** Called once the insight is persisted, so the page can land on it. */
  onCreated: (insight: InsightCardModel) => void;
  onClose: () => void;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState("");

  // The "Create new insight" prompt is already sent; the topic step shows immediately.
  const [step, setStep] = useState<Step>("topic");
  const [topic, setTopic] = useState<string | undefined>();
  const [frequency, setFrequency] = useState<string | undefined>();
  const [awaitingCustom, setAwaitingCustom] = useState(false);
  const [userMessages, setUserMessages] = useState<string[]>([
    ASK_AI_CREATE_INSIGHT_USER_MESSAGE,
  ]);
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [userMessages.length, isTyping, optimisticUser, step, awaitingCustom]);

  const selectTopic = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isTyping || step !== "topic") return;
      setOptimisticUser(trimmed);
      setIsTyping(true);
      window.setTimeout(() => {
        setTopic(trimmed);
        setAwaitingCustom(false);
        setUserMessages((m) => [...m.slice(0, 1), trimmed]);
        setStep("frequency");
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [isTyping, step],
  );

  const selectFrequency = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isTyping || step !== "frequency") return;
      setOptimisticUser(trimmed);
      setIsTyping(true);
      window.setTimeout(() => {
        setFrequency(trimmed);
        setAwaitingCustom(false);
        setUserMessages((m) => [...m.slice(0, 2), trimmed]);
        setStep("thinking");
        setOptimisticUser(null);
        setIsTyping(false);
      }, THINKING_MS);
    },
    [isTyping, step],
  );

  const handleOther = useCallback(() => {
    if (isTyping || awaitingCustom) return;
    if (step !== "topic" && step !== "frequency") return;
    setIsTyping(true);
    window.setTimeout(() => {
      setAwaitingCustom(true);
      setIsTyping(false);
      inputRef.current?.focus();
    }, THINKING_MS);
  }, [awaitingCustom, isTyping, step]);

  const completeThinking = useCallback(() => {
    setStep((s) => (s === "thinking" ? "validation" : s));
  }, []);

  const handleCreate = useCallback(() => {
    if (step !== "validation" || !topic || !frequency) return;
    setStep("creating");
    window.setTimeout(() => {
      const insight = createInsightFromAskAi({
        topic,
        formula: deriveInsightFormula(topic),
        frequency,
      });
      setStep("complete");
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: `Insight “${topic}” created` },
        }),
      );
      window.setTimeout(() => onCreated(insight), COMPLETE_HANDOFF_MS);
    }, INSIGHT_CREATE_MS);
  }, [frequency, onCreated, step, topic]);

  const onSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;
      if (step === "topic") selectTopic(trimmed);
      else if (step === "frequency") selectFrequency(trimmed);
    },
    [isTyping, selectFrequency, selectTopic, step],
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;
    setDraft("");
    onSend(trimmed);
  };

  const reasoningSteps =
    topic && frequency ? buildInsightReasoningSteps(topic, frequency) : [];

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <SidebarChatShell>
        <SidebarChatHeader onMinimize={onClose} />

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-6 pb-4 pt-4">
          <div
            ref={listRef}
            className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
          >
            {userMessages[0] ? (
              <WorkflowUserBubble size="sm">{userMessages[0]}</WorkflowUserBubble>
            ) : null}

            {userMessages[0] ? (
              <AskAiInsightChoice
                prompt={ASK_AI_INSIGHT_TOPIC_PROMPT}
                options={ASK_AI_INSIGHT_TOPIC_OPTIONS}
                selected={topic}
                answered={step !== "topic"}
                awaitingCustom={step === "topic" && awaitingCustom}
                disabled={isTyping}
                onSelect={selectTopic}
                onOther={handleOther}
              />
            ) : null}

            {step === "topic" && awaitingCustom && !isTyping && !optimisticUser ? (
              <AskAiInsightPrompt>{ASK_AI_INSIGHT_TOPIC_CUSTOM_PROMPT}</AskAiInsightPrompt>
            ) : null}

            {userMessages[1] ? (
              <WorkflowUserBubble size="sm">{userMessages[1]}</WorkflowUserBubble>
            ) : null}

            {step !== "topic" ? (
              <AskAiInsightChoice
                prompt={ASK_AI_INSIGHT_FREQUENCY_PROMPT}
                options={ASK_AI_INSIGHT_FREQUENCY_OPTIONS}
                selected={frequency}
                answered={step !== "frequency"}
                awaitingCustom={step === "frequency" && awaitingCustom}
                disabled={isTyping}
                onSelect={selectFrequency}
                onOther={handleOther}
              />
            ) : null}

            {step === "frequency" && awaitingCustom && !isTyping && !optimisticUser ? (
              <AskAiInsightPrompt>{ASK_AI_INSIGHT_FREQUENCY_CUSTOM_PROMPT}</AskAiInsightPrompt>
            ) : null}

            {userMessages[2] ? (
              <WorkflowUserBubble size="sm">{userMessages[2]}</WorkflowUserBubble>
            ) : null}

            {step === "thinking" && !isTyping && !optimisticUser ? (
              <AskAiReasoningStep steps={reasoningSteps} onComplete={completeThinking} />
            ) : null}

            {(step === "validation" || step === "creating" || step === "complete") &&
            topic &&
            frequency ? (
              <>
                <AskAiReasoningStep steps={reasoningSteps} completed />
                <AskAiInsightValidationCard
                  topic={topic}
                  formula={deriveInsightFormula(topic)}
                  frequency={frequency}
                  creating={step === "creating"}
                  created={step === "complete"}
                  disabled={isTyping}
                  onCreate={handleCreate}
                />
              </>
            ) : null}

            {optimisticUser ? (
              <WorkflowUserBubble size="sm">{optimisticUser}</WorkflowUserBubble>
            ) : null}
            {isTyping ? <WorkflowThinkingIndicator /> : null}
          </div>

          <SidebarChatInputDock
            draft={draft}
            error={null}
            isTyping={isTyping}
            inputRef={inputRef}
            onDraftChange={setDraft}
            onSubmit={handleFormSubmit}
          />
        </div>
      </SidebarChatShell>
    </div>
  );
}
