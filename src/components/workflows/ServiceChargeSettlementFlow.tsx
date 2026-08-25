"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { AppShell, DashboardPageBody } from "@/src/components/layout/AppShell";
import { WorkflowChatBar } from "@/src/components/workflows/WorkflowChatBar";
import { WorkflowChatDock } from "@/src/components/workflows/WorkflowChatDock";
import {
  WorkflowAiBlock,
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";
import { EditableWorkflowTitle } from "@/src/components/workflows/WorkflowSidebarSessionItem";
import { ServiceChargeProcessFlow } from "@/src/components/workflows/ServiceChargeProcessFlow";
import { ServiceChargeSettlementPreview } from "@/src/components/workflows/ServiceChargeSettlementPreview";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import { useWorkflowSessions } from "@/src/hooks/useWorkflowSessions";
import { notifyWorkflowSessionsChanged } from "@/src/lib/workflowSessions";
import { __assistantReplyFor } from "@/src/components/commercial/ChatPanel";
import {
  SHELL_WORKFLOW_CHAT_DOCK_PX,
} from "@/src/lib/shellLayout";
import { cn } from "@/lib/utils";
import type {
  ServiceChargeSettlementStage,
  WorkflowSession,
} from "@/src/types/workflows";
import {
  getStageIndex,
  parseAdjustmentInstruction,
  SERVICE_CHARGE_ANOMALIES,
  SERVICE_CHARGE_ASSUMPTIONS,
  SERVICE_CHARGE_PROPERTY,
  SERVICE_CHARGE_SOURCE_SYSTEM,
  SERVICE_CHARGE_YEAR,
  type SettlementAnomaly,
  type SettlementAssumption,
} from "@/src/lib/serviceChargeSettlementData";

const THINKING_MS = 950;
const CHAT_COLUMN_MAX_PX = 900;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function anomalyIcon(severity: SettlementAnomaly["severity"]) {
  if (severity === "error") return XCircle;
  if (severity === "warning") return AlertTriangle;
  return Info;
}

function anomalyTone(severity: SettlementAnomaly["severity"]) {
  if (severity === "error") return "text-[#B23A48]";
  if (severity === "warning") return "text-[#E7B65A]";
  return "text-[#65686B]";
}

function AnomalyList() {
  return (
    <div className="flex flex-col gap-2">
      {SERVICE_CHARGE_ANOMALIES.map((anomaly) => {
        const Icon = anomalyIcon(anomaly.severity);
        return (
          <div
            key={anomaly.id}
            className="flex items-start gap-2.5 rounded-2xl border border-[rgba(230,231,232,0.7)] bg-white px-3.5 py-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <Icon
              className={cn("mt-0.5 size-4 shrink-0", anomalyTone(anomaly.severity))}
              strokeWidth={1.9}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-[1.4] text-[#353638]">
                {anomaly.title}
              </p>
              <p className="mt-0.5 text-[13px] font-normal leading-[1.5] text-[#65686B]">
                {anomaly.detail}
              </p>
              <p className="mt-1 text-[11px] font-normal leading-[1.4] text-[#969A9E]">
                {anomaly.reference}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GateButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center rounded-[32px] bg-[#010309] px-4 py-1 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#252628]",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      {label}
    </button>
  );
}

function AssumptionChips({
  assumption,
  disabled,
  onAnswer,
}: {
  assumption: SettlementAssumption;
  disabled?: boolean;
  onAnswer: (answer: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {assumption.options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(option)}
          className={cn(
            "inline-flex h-9 items-center rounded-[32px] border-[1.5px] border-[#E6E8EB] bg-white px-3 text-[13px] font-medium leading-[1.24] text-[#353638] transition-colors hover:border-[#A7B2F2] hover:bg-[#FAFBFC]",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ServiceChargeSettlementFlow({
  sessionId,
  initialSession,
}: {
  sessionId: string;
  initialSession?: WorkflowSession;
}) {
  const { saveSession } = useWorkflowSessions();
  const listRef = useRef<HTMLDivElement>(null);

  const initial: WorkflowSession =
    initialSession ?? {
      id: sessionId,
      title: "Service Charge Settlement",
      step: "service-charge-active",
      intent: "service-charge-settlement",
      topic: "service-charge-settlement",
      settlementStage: "anomaly-detection",
      settlementYear: SERVICE_CHARGE_YEAR,
      property: SERVICE_CHARGE_PROPERTY,
      createdAt: Date.now(),
    };

  const [session, setSession] = useState<WorkflowSession>(initial);
  const stage: ServiceChargeSettlementStage =
    session.settlementStage ?? "anomaly-detection";
  const stageIndex = getStageIndex(stage);
  const property = session.property ?? SERVICE_CHARGE_PROPERTY;
  const year = session.settlementYear ?? SERVICE_CHARGE_YEAR;

  const [isTyping, setIsTyping] = useState(false);
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  // Index of the assumption currently being asked (during the "assumptions" stage).
  const [assumptionIndex, setAssumptionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [followUps, setFollowUps] = useState<ChatMessage[]>([]);
  const [followUpTyping, setFollowUpTyping] = useState(false);
  // Per-line gross overrides applied by adjustment instructions — drives live recalculation.
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const persist = useCallback(
    (next: WorkflowSession) => {
      const merged = { ...next };
      setSession(merged);
      saveSession(merged);
      notifyWorkflowSessionsChanged();
    },
    [saveSession],
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [stage, isTyping, optimisticUser, assumptionIndex, followUps, followUpTyping]);

  const advanceStage = useCallback(
    (userText: string, nextStage: ServiceChargeSettlementStage, after?: () => void) => {
      setOptimisticUser(userText);
      setIsTyping(true);
      setLocked(true);
      window.setTimeout(() => {
        persist({ ...session, settlementStage: nextStage });
        setOptimisticUser(null);
        setIsTyping(false);
        setLocked(false);
        after?.();
      }, THINKING_MS);
    },
    [persist, session],
  );

  // --- Stage transitions ---
  const confirmDataReviewed = () => {
    if (locked || isTyping) return;
    advanceStage("Yes, I've reviewed the findings — the data is ready.", "assumptions", () => {
      setAssumptionIndex(0);
    });
  };

  const answerAssumption = (assumption: SettlementAssumption, answer: string) => {
    if (locked || isTyping) return;
    setOptimisticUser(answer);
    setIsTyping(true);
    setLocked(true);
    window.setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [assumption.id]: answer }));
      setOptimisticUser(null);
      setIsTyping(false);
      setLocked(false);
      setAssumptionIndex((idx) => idx + 1);
    }, THINKING_MS);
  };

  const generatePreview = () => {
    if (locked || isTyping) return;
    advanceStage(
      "No further input — please generate the settlement preview.",
      "settlement-preview",
    );
  };

  const sendFollowUp = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || followUpTyping) return;
      const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
      setFollowUps((prev) => [...prev, userMsg]);
      setFollowUpTyping(true);

      // Try to apply a settlement adjustment so the preview recalculates.
      const adjustment = parseAdjustmentInstruction(trimmed, overrides);

      window.setTimeout(() => {
        if (adjustment) {
          setOverrides(adjustment.overrides);
        }
        const reply: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: adjustment ? adjustment.reply : __assistantReplyFor(trimmed),
        };
        setFollowUps((prev) => [...prev, reply]);
        setFollowUpTyping(false);
      }, THINKING_MS);
    },
    [followUpTyping, isTyping, overrides],
  );

  const handleExport = useCallback((kind: "xlsx" | "pdf") => {
    const message =
      kind === "xlsx"
        ? "Excel settlement exported — values, assumptions & formulas written to the template."
        : "Customer-facing PDF generated from the finalized settlement.";
    window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message } }));
  }, []);

  const handleAnalyseFurther = useCallback(
    (topic: string) => {
      sendFollowUp(`Analyse ${topic}`);
    },
    [sendFollowUp],
  );

  const goToStage = (index: 0 | 1 | 2 | 3) => {
    const target = ["anomaly-detection", "data-review", "assumptions", "settlement-preview"][
      index
    ] as ServiceChargeSettlementStage;
    if (target === stage) return;
    persist({ ...session, settlementStage: target });
    if (target === "assumptions") setAssumptionIndex(0);
  };

  const allAssumptionsAnswered = assumptionIndex >= SERVICE_CHARGE_ASSUMPTIONS.length;
  const currentAssumption = SERVICE_CHARGE_ASSUMPTIONS[assumptionIndex];

  const chatBarPlaceholder =
    stage === "settlement-preview"
      ? "Request an adjustment, or click an amount to analyse…"
      : "Ask anything about this settlement…";

  const kickoffLine = `I want to start the ${year} service charge settlement for ${property}.`;

  return (
    <CommercialChatInjectContext.Provider value={stage === "settlement-preview" ? handleAnalyseFurther : null}>
      <AppShell activeNav="workflow-new">
        <div className="relative flex min-h-screen w-full min-w-0 flex-col bg-[#F7F8FA]">
          <div
            className="mx-auto flex w-full min-w-0 flex-1 flex-col px-6 pt-8"
            style={{ maxWidth: CHAT_COLUMN_MAX_PX, paddingBottom: SHELL_WORKFLOW_CHAT_DOCK_PX }}
          >
            <div className="mb-6 flex shrink-0 items-center gap-2">
              <EditableWorkflowTitle
                title={session.title}
                className="typo-page-title text-[#010309]"
                onRename={(title) => persist({ ...session, title })}
              />
              <span className="rounded-full bg-[#EBEDF9] px-2 py-0.5 text-[11px] font-medium text-[#233FDE]">
                Workflows
              </span>
            </div>

            <div className="mb-6 shrink-0">
              <ServiceChargeProcessFlow
                currentStep={stageIndex}
                furthestStep={stageIndex}
                onStepClick={goToStage}
              />
            </div>

            <div ref={listRef} className="flex w-full min-w-0 flex-col gap-6">
              {/* Kickoff */}
              <WorkflowUserBubble>{kickoffLine}</WorkflowUserBubble>

              {/* Stage 1 — anomaly detection */}
              <WorkflowAiBlock
                question={`Before I generate the settlement, I'll run a quality-control check on the ${year} service charge postings recorded in ${SERVICE_CHARGE_SOURCE_SYSTEM}. Here's what I found — please review before we proceed.`}
              >
                <AnomalyList />
              </WorkflowAiBlock>

              {stage === "anomaly-detection" ? (
                <WorkflowAiBlock question="Have you reviewed these findings? Confirm when the data is ready and I'll continue.">
                  <div className="flex flex-wrap gap-2">
                    <GateButton
                      label="Data reviewed — continue"
                      onClick={confirmDataReviewed}
                      disabled={locked || isTyping}
                    />
                  </div>
                </WorkflowAiBlock>
              ) : null}

              {/* User confirmed data review */}
              {stageIndex >= getStageIndex("assumptions") ? (
                <WorkflowUserBubble>
                  Yes, I&apos;ve reviewed the findings — the data is ready.
                </WorkflowUserBubble>
              ) : null}

              {/* Stage transition thinking */}
              {optimisticUser && stage === "anomaly-detection" ? (
                <>
                  <WorkflowUserBubble>{optimisticUser}</WorkflowUserBubble>
                  {isTyping ? <WorkflowThinkingIndicator /> : null}
                </>
              ) : null}

              {/* Stage 3 — assumptions Q&A */}
              {stageIndex >= getStageIndex("assumptions") ? (
                <>
                  <WorkflowAiBlock question="Great. Now I'll walk through the assumptions from the settlement notes so we agree on them before generating anything." />

                  {SERVICE_CHARGE_ASSUMPTIONS.slice(0, assumptionIndex).map((assumption) => (
                    <div key={assumption.id} className="flex flex-col gap-2">
                      <WorkflowAiBlock question={assumption.question} />
                      <WorkflowUserBubble size="sm">
                        {answers[assumption.id] ?? assumption.defaultAnswer}
                      </WorkflowUserBubble>
                    </div>
                  ))}

                  {stage === "assumptions" && !allAssumptionsAnswered && currentAssumption ? (
                    <>
                      {optimisticUser ? (
                        <>
                          <WorkflowAiBlock question={currentAssumption.question} />
                          <WorkflowUserBubble size="sm">{optimisticUser}</WorkflowUserBubble>
                          {isTyping ? <WorkflowThinkingIndicator /> : null}
                        </>
                      ) : (
                        <WorkflowAiBlock question={currentAssumption.question}>
                          <AssumptionChips
                            assumption={currentAssumption}
                            disabled={locked || isTyping}
                            onAnswer={(answer) => answerAssumption(currentAssumption, answer)}
                          />
                        </WorkflowAiBlock>
                      )}
                    </>
                  ) : null}

                  {stage === "assumptions" && allAssumptionsAnswered ? (
                    <WorkflowAiBlock question="I've incorporated your answers. Is there any additional input before I generate the settlement?">
                      <div className="flex flex-wrap gap-2">
                        <GateButton
                          label="No — generate the settlement"
                          onClick={generatePreview}
                          disabled={locked || isTyping}
                        />
                      </div>
                    </WorkflowAiBlock>
                  ) : null}

                  {optimisticUser && stage === "assumptions" && allAssumptionsAnswered ? (
                    <>
                      <WorkflowUserBubble>{optimisticUser}</WorkflowUserBubble>
                      {isTyping ? <WorkflowThinkingIndicator /> : null}
                    </>
                  ) : null}
                </>
              ) : null}

              {/* Stage 4 — settlement preview */}
              {stage === "settlement-preview" ? (
                <>
                  <WorkflowUserBubble>
                    No further input — please generate the settlement preview.
                  </WorkflowUserBubble>
                  <WorkflowAiBlock
                    question={`Here's the initial ${year} settlement for ${property}. Every assumption you confirmed is applied and noted below. Click any amount to analyse it further, or ask for an adjustment in the chat — the preview updates after each change.`}
                  >
                    <ServiceChargeSettlementPreview
                      answers={answers}
                      overrides={overrides}
                      onAnalyseFurther={handleAnalyseFurther}
                      onExport={handleExport}
                    />
                  </WorkflowAiBlock>

                  {followUps.map((msg) =>
                    msg.role === "user" ? (
                      <WorkflowUserBubble key={msg.id}>{msg.text}</WorkflowUserBubble>
                    ) : (
                      <WorkflowAiBlock key={msg.id} question={msg.text} />
                    ),
                  )}
                  {followUpTyping ? <WorkflowThinkingIndicator /> : null}
                </>
              ) : null}
            </div>
          </div>

          <WorkflowChatDock maxWidth={CHAT_COLUMN_MAX_PX}>
            <WorkflowChatBar
              floating
              isTyping={isTyping || followUpTyping}
              placeholder={chatBarPlaceholder}
              onSend={stage === "settlement-preview" ? sendFollowUp : undefined}
            />
          </WorkflowChatDock>
        </div>
      </AppShell>
    </CommercialChatInjectContext.Provider>
  );
}
