"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AiPromptBubble } from "@/src/components/commercial/ChatPanel";
import { cn } from "@/lib/utils";
import {
  ASK_AI_LEASE_HANDOFF_CTA_QUESTION,
  ASK_AI_LEASE_HANDOFF_FOOTER,
  ASK_AI_LEASE_RENEWAL_STEPS,
  getAskAiExecutiveSummary,
  getAskAiLeaseHandoffIntro,
} from "@/src/lib/askAiLeaseMockData";

function MiniLeaseRenewalStepper({ currentStep }: { currentStep: 0 | 1 | 2 }) {
  return (
    <div className="flex w-full items-start justify-center overflow-x-auto">
      {ASK_AI_LEASE_RENEWAL_STEPS.map((step, i) => {
        const active = i === currentStep;
        const done = i < currentStep;
        return (
          <div key={step.title} className="flex min-w-0 flex-1 items-start">
            <div className="flex w-full min-w-[100px] flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-full items-center justify-center">
                {i > 0 ? (
                  <div className="h-0.5 min-w-[8px] flex-1 rounded-full bg-[#D1D5D9]" />
                ) : (
                  <div className="min-w-[8px] flex-1" />
                )}
                {done ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#040617] bg-[#040617] text-white">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                ) : active ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#040617] bg-white">
                    <div className="h-4 w-4 rounded-[10px] bg-[#040617]" />
                  </div>
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-full border-2 border-[#B3B8BD] bg-white" />
                )}
                {i < ASK_AI_LEASE_RENEWAL_STEPS.length - 1 ? (
                  <div className="h-0.5 min-w-[8px] flex-1 rounded-full bg-[#D1D5D9]" />
                ) : (
                  <div className="min-w-[8px] flex-1" />
                )}
              </div>
              <div className="flex h-14 flex-col items-center justify-between">
                <p
                  className={cn(
                    "text-[14px] font-medium leading-[1.5]",
                    active || done ? "text-[#010309]" : "text-[#65686B]",
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "h-[35px] max-w-[142px] text-[12px] font-normal leading-[1.5]",
                    active || done ? "text-[#65686B]" : "text-[#7E8185]",
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Figma 1040:60095 — post-reasoning lease renewal handoff in Ask Amiio chat. */
export function AskAiLeaseHandoffReply({
  tenantId,
  tenantName,
  onContinue,
  disabled,
}: {
  tenantId: string;
  tenantName: string;
  onContinue: () => void;
  disabled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { preview, fullParagraphs } = getAskAiExecutiveSummary(tenantId, tenantName);

  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <AiPromptBubble size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
          {getAskAiLeaseHandoffIntro(tenantName)}
        </p>

        <div className="relative w-full rounded-2xl bg-white p-5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-medium leading-[1.24] text-[#676A6E]">
                Amiio&apos;s Executive Summary
              </p>
              <div className="space-y-3 text-[14px] font-normal leading-[1.5] text-[#353638]">
                <p>
                  {preview}
                  {!expanded ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="font-semibold text-[#353638] underline-offset-2 hover:underline"
                      >
                        See more
                      </button>
                    </>
                  ) : null}
                </p>
                {expanded ? (
                  <div className="space-y-3 border-t border-[#E6E8EB] pt-3">
                    {fullParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    <button
                      type="button"
                      onClick={() => setExpanded(false)}
                      className="font-semibold text-[#353638] underline-offset-2 hover:underline"
                    >
                      See less
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <MiniLeaseRenewalStepper currentStep={0} />

            <p className="text-[14px] font-normal leading-[1.5] text-[#353638]">
              {ASK_AI_LEASE_HANDOFF_FOOTER}
              <span className="font-medium">{ASK_AI_LEASE_HANDOFF_CTA_QUESTION}</span>
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={onContinue}
                className="flex h-10 items-center justify-center rounded-[32px] bg-[#010309] px-3.5 py-1 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue the process
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
