"use client";

import { ArrowRight, Check, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { WorkspaceOutput, WorkspaceRunLogEntry } from "@/src/lib/workspaceOutputsData";

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[16px] font-medium uppercase leading-normal tracking-[1.2355px] text-[#65686B]">
        {label}
      </p>
      <div className="h-px w-full bg-[#E6E7E8]" />
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="shrink-0 text-[16px] font-normal leading-[1.25] text-[#7E8185]">
        {label}
      </p>
      <div className="flex min-w-0 items-center gap-2 sm:max-w-[65%] sm:justify-end sm:text-right">
        {children}
      </div>
    </div>
  );
}

function RunLogStatus({ entry }: { entry: WorkspaceRunLogEntry }) {
  if (entry.status === "next") {
    return (
      <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
        Next run
      </span>
    );
  }
  if (entry.status === "completed") {
    return (
      <span className="flex items-center gap-2">
        <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
          Completed
        </span>
        <span className="flex size-4 items-center justify-center rounded-full bg-[#1F9E8B]">
          <Check className="size-2.5 text-white" strokeWidth={3} />
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
        Failed
      </span>
      <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#C65A66]">
        <X className="size-2.5 text-white" strokeWidth={3} />
      </span>
    </span>
  );
}

/** Workspace task detail — Figma 2652:63940 */
export function WorkspaceTaskInfoModal({
  output,
  open,
  onOpenChange,
  onGoToAnalyst,
}: {
  output: WorkspaceOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToAnalyst?: (output: WorkspaceOutput) => void;
}) {
  if (!output) return null;

  const info = output.taskInfo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/20 backdrop-blur-[10px]"
        className="flex max-h-[90vh] w-[calc(100vw-32px)] max-w-[785px] flex-col gap-6 overflow-y-auto rounded-[12px] border-0 bg-[#FBFBFB] p-6 shadow-[0px_10px_14px_rgba(0,0,0,0.14)] sm:p-8"
      >
        <p className="text-[16px] font-medium leading-[1.5] text-[#7E8185]">TASK</p>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
            <DialogTitle className="text-[22px] font-medium leading-[1.25] tracking-normal text-[#121212] sm:text-[24px]">
              {output.name}
            </DialogTitle>

            <button
              type="button"
              onClick={() => onGoToAnalyst?.(output)}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3.5 text-[14px] font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5]"
            >
              Go to Analyst page
              <ArrowRight className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeader label="information" />
            <div className="flex flex-col gap-4">
              <SummaryRow label="Trigger">
                <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                  {info.triggerFull}
                </span>
              </SummaryRow>
              <SummaryRow label="Scope">
                <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                  {info.scopeFull}
                </span>
              </SummaryRow>
              <SummaryRow label="Output">
                <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                  {info.output}
                </span>
              </SummaryRow>
              <SummaryRow label="Delivery">
                <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                  {info.delivery}
                </span>
              </SummaryRow>
              <SummaryRow label="Status">
                <span
                  className={cn(
                    "inline-flex items-center rounded-2xl px-2 py-1 text-[14px] font-medium leading-[1.24]",
                    info.status === "Active"
                      ? "bg-[#E6F6F3] text-[#1F9E8B]"
                      : "bg-[#E6E8EB] text-[#7E8185]",
                  )}
                >
                  {info.status}
                </span>
              </SummaryRow>
              <SummaryRow label="Owner">
                <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                  {info.owner}
                </span>
              </SummaryRow>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeader label="Run log" />
            <div className="flex flex-col gap-4">
              {info.runLog.map((entry) => (
                <div
                  key={entry.label}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <p className="text-[16px] font-normal leading-[1.25] text-[#7E8185]">
                    {entry.label}
                  </p>
                  <RunLogStatus entry={entry} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogClose className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-[32px] text-[#65686B] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]">
          <X className="size-4" strokeWidth={2} />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
