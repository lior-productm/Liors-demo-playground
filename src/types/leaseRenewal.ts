export type LeaseRenewalContext = {
  tenantName: string;
  property?: string;
  portfolio?: string;
  entity?: string;
};

export const DEFAULT_LEASE_RENEWAL_CONTEXT: LeaseRenewalContext = {
  tenantName: "ScaleHub III B.V.",
  property: "H.J.E. Wenckebachweg 123",
};

export function resolveLeaseRenewalContext(
  partial?: Partial<LeaseRenewalContext>,
): LeaseRenewalContext {
  return {
    ...DEFAULT_LEASE_RENEWAL_CONTEXT,
    ...partial,
    tenantName: partial?.tenantName?.trim() || DEFAULT_LEASE_RENEWAL_CONTEXT.tenantName,
  };
}

export function leaseRenewalProposalRef(tenantName: string) {
  const initials = tenantName
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
  return `LRP-2026-${initials || "TEN"}-001`;
}
