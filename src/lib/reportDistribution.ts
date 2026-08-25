import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

/**
 * Report template distribution lifecycle. Templates are never shared
 * automatically — they move through a formal approval gate before an
 * Asset Manager can distribute them to stakeholders.
 *
 *   draft → pending_approval → approved → distributed
 *                     ↘ (rejected back to) draft
 */
export const DISTRIBUTION_STORAGE_KEY = "amiio:reporting:distribution";

export type DistributionStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "distributed";

export const DISTRIBUTION_LABELS: Record<DistributionStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  distributed: "Distributed",
};

/** Pill styles shared by the toolbar and the All-reports list. */
export const DISTRIBUTION_PILL_STYLES: Record<DistributionStatus, string> = {
  draft: "bg-[#F3F4F6] text-[#6B7280]",
  pending_approval: "bg-[#FBF2DC] text-[#856404]",
  approved: "bg-[#E7F4EC] text-[#1F7A45]",
  distributed: "bg-[#EEF0FF] text-[#1B32B3]",
};

type DistributionStore = Record<string, DistributionStatus>;

function readStore(): DistributionStore {
  return readLocalJson<DistributionStore>(DISTRIBUTION_STORAGE_KEY, {});
}

export function readDistributionStatus(reportTitle: string): DistributionStatus {
  return readStore()[reportTitle] ?? "draft";
}

export function writeDistributionStatus(
  reportTitle: string,
  status: DistributionStatus,
) {
  const store = readStore();
  writeLocalJson(DISTRIBUTION_STORAGE_KEY, { ...store, [reportTitle]: status });
}

export function readAllDistributionStatuses(): DistributionStore {
  return readStore();
}

/* -------------------------------------------------------------------------- */
/* Approval requests                                                           */
/* -------------------------------------------------------------------------- */

export type ApprovalPriority = "normal" | "high";

export const APPROVAL_PRIORITY_LABELS: Record<ApprovalPriority, string> = {
  normal: "Normal",
  high: "High priority",
};

/** People who can approve a distribution (Asset Managers / controllers). */
export type Approver = { id: string; name: string; title: string };

export const REPORT_APPROVERS: Approver[] = [
  { id: "am-eleanor", name: "Eleanor Rigby", title: "Asset Manager" },
  { id: "am-maxwell", name: "Maxwell Edison", title: "Head of Asset Management" },
  { id: "am-rita", name: "Rita Meadows", title: "Fund Controller" },
];

export type ApprovalRequest = {
  approverId: string;
  approverName: string;
  priority: ApprovalPriority;
  /** ISO date (yyyy-mm-dd) the requester wants a decision by. */
  dueDate?: string;
  message?: string;
  /** ISO timestamp the request was raised. */
  requestedAt: string;
};

export const APPROVAL_REQUEST_STORAGE_KEY = "amiio:reporting:approval-request";

type ApprovalRequestStore = Record<string, ApprovalRequest>;

function readRequestStore(): ApprovalRequestStore {
  return readLocalJson<ApprovalRequestStore>(APPROVAL_REQUEST_STORAGE_KEY, {});
}

export function readApprovalRequest(
  reportTitle: string,
): ApprovalRequest | null {
  return readRequestStore()[reportTitle] ?? null;
}

export function writeApprovalRequest(
  reportTitle: string,
  request: ApprovalRequest,
) {
  const store = readRequestStore();
  writeLocalJson(APPROVAL_REQUEST_STORAGE_KEY, {
    ...store,
    [reportTitle]: request,
  });
}

export function clearApprovalRequest(reportTitle: string) {
  const store = readRequestStore();
  delete store[reportTitle];
  writeLocalJson(APPROVAL_REQUEST_STORAGE_KEY, store);
}
