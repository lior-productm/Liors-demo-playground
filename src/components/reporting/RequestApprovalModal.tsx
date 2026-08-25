"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPROVAL_PRIORITY_LABELS,
  REPORT_APPROVERS,
  type ApprovalPriority,
  type ApprovalRequest,
} from "@/src/lib/reportDistribution";

/** Collects approver, priority, due date and a message before requesting sign-off. */
export function RequestApprovalModal({
  reportTitle,
  customSectionCount,
  onClose,
  onSubmit,
  onContinue,
}: {
  reportTitle: string;
  customSectionCount: number;
  onClose: () => void;
  onSubmit: (request: ApprovalRequest) => void;
  /** Called from the confirmation view's Continue button. Falls back to onClose. */
  onContinue?: () => void;
}) {
  const [approverId, setApproverId] = useState(REPORT_APPROVERS[0].id);
  const [priority, setPriority] = useState<ApprovalPriority>("normal");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    const approver =
      REPORT_APPROVERS.find((item) => item.id === approverId) ?? REPORT_APPROVERS[0];
    onSubmit({
      approverId: approver.id,
      approverName: approver.name,
      priority,
      dueDate: dueDate || undefined,
      message: message.trim() || undefined,
      requestedAt: new Date().toISOString(),
    });
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
            <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
              {sent ? "Request sent" : "Save & Approve"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        {sent ? (
          <>
            <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#E7F4EC] text-[#1F7A45]">
                <CheckCircle2 className="size-8" strokeWidth={1.75} />
              </span>
              <div className="flex flex-col gap-1.5">
                <p className="text-[16px] font-semibold leading-[1.3] text-[#05091F]">
                  Your approval request is sent!
                </p>
                <p className="mx-auto max-w-[380px] text-[13px] leading-[1.5] text-[#65686B]">
                  This draft will be available for your organization as soon as
                  it&apos;s approved.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[#E6E8EB] px-6 py-4">
              <button
                type="button"
                onClick={onContinue ?? onClose}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-[#E6E8EB] bg-[#FAFBFC] px-4 py-3">
            <p className="text-[13px] font-semibold leading-[1.3] text-[#05091F]">
              {reportTitle}
            </p>
            <p className="text-[12px] leading-[1.5] text-[#65686B]">
              {customSectionCount} custom section{customSectionCount === 1 ? "" : "s"} ·
              will be locked for review until a decision is made.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              Approver
            </span>
            <div className="relative">
              <select
                value={approverId}
                onChange={(event) => setApproverId(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#E8EAED] bg-white py-2 pl-3 pr-9 text-[14px] leading-[1.24] text-[#111] outline-none focus:border-[#A7B2F2]"
              >
                {REPORT_APPROVERS.map((approver) => (
                  <option key={approver.id} value={approver.id}>
                    {approver.name} — {approver.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
            </div>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              Priority
            </span>
            <div className="flex gap-2">
              {(Object.keys(APPROVAL_PRIORITY_LABELS) as ApprovalPriority[]).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    className={cn(
                      "flex h-10 flex-1 items-center justify-center rounded-lg border text-[13px] font-medium leading-[1.24] transition-colors",
                      priority === value
                        ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                        : "border-[#E6E8EB] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                    )}
                  >
                    {APPROVAL_PRIORITY_LABELS[value]}
                  </button>
                ),
              )}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              Decision needed by <span className="text-[#969A9E]">(optional)</span>
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="h-10 rounded-lg border border-[#E8EAED] bg-white px-3 text-[14px] leading-[1.24] text-[#111] outline-none focus:border-[#A7B2F2]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              Message to approver <span className="text-[#969A9E]">(optional)</span>
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              placeholder="Add context — what changed and what you need signed off."
              className="resize-y rounded-lg border border-[#E8EAED] bg-white px-3 py-2 text-[13px] leading-[1.5] text-[#353638] outline-none focus:border-[#A7B2F2]"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E6E8EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
          >
            <ShieldCheck className="size-4" strokeWidth={1.9} />
            Send request
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
