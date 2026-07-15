"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";

export const LEASE_RENEWAL_STEPS = [
  {
    title: "Proposal Prep",
    description: "Prepare initial renewal proposal",
  },
  {
    title: "Lease Proposal",
    description: "Draft commercial terms",
  },
  {
    title: "Review Proposal",
    description: "Review your proposal",
  },
] as const;

function StepNode({ active, done }: { active: boolean; done: boolean }) {
  if (done) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#040617] bg-[#040617] text-white">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  }
  if (active) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#040617] bg-white">
        <div className="h-4 w-4 rounded-[10px] bg-[#040617]" />
      </div>
    );
  }
  return <div className="h-10 w-10 rounded-full border-2 border-[#B3B8BD] bg-white" />;
}

export function LeaseRenewalProcessFlow({
  currentStep,
  onStepClick,
  draftAvailable,
  variant = "default",
}: {
  currentStep: 0 | 1 | 2;
  onStepClick?: (stepIndex: 0 | 1 | 2) => void;
  /** When a proposal draft exists, all steps stay navigable and Review shows as completed. */
  draftAvailable?: boolean;
  /** `embedded` fits inside dialogs and narrow panels. */
  variant?: "default" | "embedded";
}) {
  const embedded = variant === "embedded";

  const stepMeta = LEASE_RENEWAL_STEPS.map((step, i) => {
    const stepIndex = i as 0 | 1 | 2;
    const reviewDraftComplete = draftAvailable && stepIndex === 2 && currentStep !== 2;
    const done = i < currentStep || reviewDraftComplete;
    const active = i === currentStep;
    return { ...step, stepIndex, done, active };
  });

  return (
    <div
      id="lease-renewal-process-flow"
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)]",
        embedded ? "p-4" : "p-6",
        !embedded && amiioCardHoverSurface,
      )}
    >
      <div className="flex w-full items-stretch justify-center overflow-x-auto pb-1">
        <div className={cn("flex w-full min-w-0 items-stretch", !embedded && "max-w-[720px]")}>
          {stepMeta.map((step, i) => {
            const clickable = Boolean(onStepClick);
            const ContainerTag = clickable ? "button" : "div";
            return (
              <Fragment key={step.title}>
                <ContainerTag
                  type={clickable ? "button" : undefined}
                  onClick={clickable ? () => onStepClick?.(step.stepIndex) : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-2 text-center",
                    embedded ? "px-0.5" : "px-2",
                    clickable &&
                      "rounded-xl border border-transparent transition-colors hover:border-[#E6E8EB] hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE] focus-visible:ring-offset-2",
                  )}
                  aria-current={step.active ? "step" : undefined}
                  aria-label={`${step.title}. ${step.active ? "Current step" : step.done ? "Completed — go to this step" : "Go to this step"}`}
                >
                  <div className="flex h-10 shrink-0 items-center justify-center">
                    <StepNode active={step.active} done={step.done} />
                  </div>
                  <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-1">
                    <p
                      className={cn(
                        "w-full break-words font-medium leading-[1.5]",
                        embedded ? "text-[13px]" : "text-[14px]",
                        step.active || step.done ? "text-[#010309]" : "text-[#65686B]",
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        "w-full break-words font-normal leading-[1.5]",
                        embedded ? "text-[11px]" : "text-[12px]",
                        step.active || step.done ? "text-[#65686B]" : "text-[#7E8185]",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </ContainerTag>
                {i < stepMeta.length - 1 ? (
                  <div
                    className={cn(
                      "flex shrink-0 items-center self-start pt-5",
                      embedded ? "w-4 sm:w-6" : "w-10 sm:w-14",
                    )}
                  >
                    <div className="h-0.5 w-full rounded-full bg-[#D1D5D9]" />
                  </div>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
