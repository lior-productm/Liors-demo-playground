"use client";

import { ChevronDown, Clock, Send, ShieldCheck, Undo2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPROVAL_PRIORITY_LABELS,
  DISTRIBUTION_LABELS,
  DISTRIBUTION_PILL_STYLES,
  type ApprovalRequest,
  type DistributionStatus,
} from "@/src/lib/reportDistribution";
import {
  REPORT_ROLES,
  REPORT_ROLE_LABELS,
  canApproveDistribution,
  type ReportUserRole,
} from "@/src/lib/reportRole";

export function DistributionPill({ status }: { status: DistributionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium leading-4",
        DISTRIBUTION_PILL_STYLES[status],
      )}
    >
      {DISTRIBUTION_LABELS[status]}
    </span>
  );
}

export function ReportRoleSelect({
  role,
  onRoleChange,
}: {
  role: ReportUserRole;
  onRoleChange: (role: ReportUserRole) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-medium leading-[1.24] text-[#65686B]">
        Viewing as
      </span>
      <div className="relative">
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as ReportUserRole)}
          className="h-10 appearance-none rounded-lg border border-[#E8EAED] bg-white py-2 pl-3 pr-9 text-[14px] font-medium leading-[1.24] text-[#111]"
        >
          {REPORT_ROLES.map((value) => (
            <option key={value} value={value}>
              {REPORT_ROLE_LABELS[value]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
      </div>
    </div>
  );
}

const primaryBtn =
  "flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]";
const secondaryBtn =
  "flex h-10 items-center gap-1.5 rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]";

function formatDueDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApprovalRequestSummary({ request }: { request: ApprovalRequest }) {
  return (
    <div
      title={request.message}
      className="flex items-center gap-2 rounded-lg border border-[#F0E4C3] bg-[#FBF7EC] px-3 py-2 text-[12px] leading-[1.4] text-[#856404]"
    >
      <ShieldCheck className="size-4 shrink-0" strokeWidth={1.9} />
      <span>
        Sent to <span className="font-semibold">{request.approverName}</span>
        {request.priority === "high" ? (
          <span className="ml-1 inline-flex items-center rounded-full bg-[#F6E0DC] px-1.5 py-0.5 text-[10px] font-medium text-[#B23A2F]">
            {APPROVAL_PRIORITY_LABELS.high}
          </span>
        ) : null}
      </span>
      {request.dueDate ? (
        <span className="inline-flex items-center gap-1 border-l border-[#EAD9AE] pl-2 text-[#8A6D1E]">
          <Clock className="size-3.5" strokeWidth={1.9} />
          by {formatDueDate(request.dueDate)}
        </span>
      ) : null}
    </div>
  );
}

export function ReportDistributionControls({
  status,
  role,
  request,
  onRequestApproval,
  onReject,
  onDistribute,
  onNewRevision,
}: {
  status: DistributionStatus;
  role: ReportUserRole;
  request?: ApprovalRequest | null;
  onRequestApproval: () => void;
  onApprove?: () => void;
  onReject: () => void;
  onDistribute: () => void;
  onNewRevision: () => void;
}) {
  const isApprover = canApproveDistribution(role);

  return (
    <div className="flex items-center gap-2">
      <DistributionPill status={status} />

      {status === "draft" ? (
        <button type="button" onClick={onRequestApproval} className={primaryBtn}>
          <ShieldCheck className="size-4" strokeWidth={1.9} />
          Save &amp; Approve
        </button>
      ) : null}

      {status === "pending_approval" ? (
        <>
          {request ? <ApprovalRequestSummary request={request} /> : null}
          <button type="button" onClick={onReject} className={secondaryBtn}>
            <X className="size-4" strokeWidth={1.9} />
            Cancel request
          </button>
        </>
      ) : null}

      {status === "approved" ? (
        isApprover ? (
          <>
            <button type="button" onClick={onNewRevision} className={secondaryBtn}>
              <Undo2 className="size-4" strokeWidth={1.9} />
              Back to draft
            </button>
            <button type="button" onClick={onDistribute} className={primaryBtn}>
              <Send className="size-4" strokeWidth={1.9} />
              Distribute to stakeholders
            </button>
          </>
        ) : (
          <span className="text-[12px] leading-[1.4] text-[#65686B]">
            Approved — awaiting Asset Manager distribution
          </span>
        )
      ) : null}

      {status === "distributed" ? (
        <button type="button" onClick={onNewRevision} className={secondaryBtn}>
          <Undo2 className="size-4" strokeWidth={1.9} />
          New revision
        </button>
      ) : null}
    </div>
  );
}
