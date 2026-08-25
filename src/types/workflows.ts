export type WorkflowIntentId =
  | "lease-renewal"
  | "service-charge-settlement"
  | "prepare-report"
  | "financial-forecasting"
  | "market-research"
  | "something-else";

export type WorkflowTopicId =
  | "leasing-renewal"
  | "service-charge-settlement"
  | "reporting"
  | "market-research"
  | "financial-forecasting"
  | "esg";

export type ServiceChargeSettlementStage =
  | "anomaly-detection"
  | "data-review"
  | "assumptions"
  | "settlement-preview";

export type WorkflowSession = {
  id: string;
  title: string;
  step:
    | "intent"
    | "custom-intent"
    | "lease-scope"
    | "lease-tenants"
    | "lease-tenant-custom"
    | "lease-reasoning"
    | "lease-handoff"
    | "lease-renewal-active"
    | "service-charge-active"
    | "complete";
  intent?: WorkflowIntentId;
  topic?: WorkflowTopicId;
  customDescription?: string;
  portfolio?: string;
  entity?: string;
  property?: string;
  tenant?: string;
  tenantId?: string;
  /** Set when opened from Tenant Hub, Commercial, or other deep links with tenant context. */
  launchedExternally?: boolean;
  /** Lease renewal workspace UI — restored on refresh. */
  renewalSubStep?: "pipeline" | "proposal-prep" | "lease-proposal" | "review-proposal";
  proposalPanelOpen?: boolean;
  hasProposalDraft?: boolean;
  /** Service charge settlement — restored on refresh. */
  settlementStage?: ServiceChargeSettlementStage;
  /** Which fiscal year the settlement covers (e.g. "2025"). */
  settlementYear?: string;
  createdAt: number;
  updatedAt?: number;
};

export type WorkflowTenantOption = {
  id: string;
  name: string;
  expiryLabel: string;
  daysToExpiry: number;
};
