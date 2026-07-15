export type WorkflowIntentId =
  | "lease-renewal"
  | "prepare-report"
  | "financial-forecasting"
  | "market-research"
  | "something-else";

export type WorkflowTopicId =
  | "leasing-renewal"
  | "reporting"
  | "market-research"
  | "financial-forecasting"
  | "esg";

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
  createdAt: number;
  updatedAt?: number;
};

export type WorkflowTenantOption = {
  id: string;
  name: string;
  expiryLabel: string;
  daysToExpiry: number;
};
