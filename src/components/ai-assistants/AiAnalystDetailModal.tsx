"use client";

import { ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AiAssistantCard } from "@/src/lib/aiAssistantsData";
import { LeaseAnalystIcon } from "@/src/components/ai-assistants/LeaseAnalystIcon";
import { FinancialAnalystIcon } from "@/src/components/ai-assistants/FinancialAnalystIcon";
import { DebtAnalystIcon } from "@/src/components/ai-assistants/DebtAnalystIcon";

/** Analyst detail modal — Figma 2453:123504. */
export function AiAnalystDetailModal({
  card,
  open,
  onOpenChange,
  onStartChat,
}: {
  card: AiAssistantCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat?: (card: AiAssistantCard) => void;
}) {
  const Icon = card?.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-50 bg-[rgba(0,0,0,0.2)] backdrop-blur-[10px]"
        className="flex w-[calc(100vw-32px)] max-w-[780px] flex-col gap-4 rounded-[12px] border-0 bg-[#FBFBFB] p-6 shadow-[0px_10px_14px_rgba(0,0,0,0.14)] sm:rounded-[12px]"
      >
        {card && Icon ? (
          <>
            <p className="text-sm font-medium leading-[1.5] text-[#7E8185]">
              AI ANALYST
            </p>

            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-2">
                    {card.id === "lease-analyst" ? (
                      <LeaseAnalystIcon className="size-5 shrink-0" />
                    ) : card.id === "reporting" ? (
                      <FinancialAnalystIcon className="size-5 shrink-0" />
                    ) : card.id === "esg" ? (
                      <DebtAnalystIcon className="size-5 shrink-0" />
                    ) : card.iconSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.iconSrc}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 shrink-0"
                        aria-hidden
                      />
                    ) : (
                      <Icon
                        className={cn(
                          "size-5 shrink-0",
                          card.iconClassName ?? "text-[#353638]",
                        )}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    )}
                    <DialogTitle className="text-xl font-medium leading-[1.25] tracking-normal text-[#121212]">
                      {card.title}
                    </DialogTitle>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartChat?.(card)}
                    className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3 py-2 text-sm font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5] sm:w-auto"
                  >
                    Start chatting
                    <ArrowRight className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
                <p className="text-sm font-normal leading-[1.5] text-[#65686B]">
                  {card.detailDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase leading-normal tracking-[1.2px] text-[#65686B]">
                  Tasks &amp; Skills
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {card.tasksSkills.map((task) => (
                    <div
                      key={task.title}
                      className="flex flex-col gap-1.5 rounded-[12px] bg-[rgba(240,242,245,0.8)] p-3.5"
                    >
                      <p className="text-sm font-medium leading-[1.5] text-[#353638]">
                        {task.title}
                      </p>
                      <p className="text-sm font-normal leading-[1.5] text-[#65686B]">
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase leading-normal tracking-[1.2px] text-[#65686B]">
                  Ouput examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.outputExamples.map((pill) => (
                    <span
                      key={pill.label}
                      className={cn(
                        "rounded-[32px] px-2.5 py-1 text-sm font-medium leading-[1.5] text-[#353638]",
                        pill.className,
                      )}
                    >
                      {pill.label}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-normal leading-[1.5] text-[#65686B]">
                  Nothing is sent or finalized without your approval.
                </p>
              </div>
            </div>

            <DialogClose className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-[32px] text-[#65686B] transition-colors hover:bg-[#F0F2F5]">
              <X className="size-4" strokeWidth={2} aria-hidden />
              <span className="sr-only">Close</span>
            </DialogClose>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
