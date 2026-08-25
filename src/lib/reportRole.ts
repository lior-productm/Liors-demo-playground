import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

/**
 * Lightweight role model for Reporting. The Asset Manager is the approval
 * authority: only they can approve a pending template and distribute it to
 * stakeholders. Analysts can build templates and request approval.
 */
export const REPORT_ROLE_STORAGE_KEY = "amiio:reporting:role";

export type ReportUserRole = "asset-manager" | "analyst";

export const REPORT_ROLE_LABELS: Record<ReportUserRole, string> = {
  "asset-manager": "Asset Manager",
  analyst: "Analyst",
};

export const REPORT_ROLES: ReportUserRole[] = ["asset-manager", "analyst"];

export function readReportRole(): ReportUserRole {
  const value = readLocalJson<ReportUserRole>(
    REPORT_ROLE_STORAGE_KEY,
    "asset-manager",
  );
  return value === "analyst" ? "analyst" : "asset-manager";
}

export function writeReportRole(role: ReportUserRole) {
  writeLocalJson(REPORT_ROLE_STORAGE_KEY, role);
}

/** Only the Asset Manager can approve and distribute. */
export function canApproveDistribution(role: ReportUserRole): boolean {
  return role === "asset-manager";
}
