import type { LeaseRenewalContext } from "@/src/types/leaseRenewal";
import { leaseRenewalProposalRef } from "@/src/types/leaseRenewal";

export type LeaseProposalDocumentFields = {
  subjectProperty: string;
  termLease: string;
  termExtension: string;
  baseRent: string;
  rentFree: string;
  breakOption: string;
  rentReview: string;
  additionalTerms: string;
};

export function buildDefaultProposalDocument(ctx: LeaseRenewalContext): LeaseProposalDocumentFields {
  const property = ctx.property ?? "the selected property";
  const tenant = ctx.tenantName;

  return {
    subjectProperty: `This Lease Renewal Proposal concerns the premises located at ${property}, comprising 3,905 square metres of lettable floor area, together with 40 parking spaces.`,
    termLease: "Lease Term: 5 (Five) years, commencing on Jul 2026.",
    termExtension: "Lease term extension — 60 months (5 years).",
    baseRent:
      "Base Rent: €225 per square meter per annum, totalling €878,625 annually.",
    rentFree:
      "Rent-Free Period: 3 (Three) months rent-free at the commencement of the lease term.",
    breakOption: `${tenant} may terminate after year 3 with 6 months' written notice.`,
    rentReview: "Rent Review: Annual Indexation based on CPI, capped at 3% per annum.",
    additionalTerms:
      "• Break option at 3 years with 6 months notice\n• CPI indexation capped at 3% annually\n• Expansion for unit 4B at €209/sqm",
  };
}

export const LEASE_PROPOSAL_DOCUMENT_VERSIONS = [
  { label: "Current", date: "", active: true },
  { label: "v78", date: "23 Nov 2025", active: false },
  { label: "v77", date: "12 Nov 2025", active: false },
  { label: "v76", date: "12 May 2025", active: false },
] as const;

export function proposalDocumentMeta(ctx: LeaseRenewalContext) {
  return {
    ref: leaseRenewalProposalRef(ctx.tenantName),
    property: ctx.property ?? "the selected property",
    tenant: ctx.tenantName,
    date: "29 March 2026",
    updatedLabel: "Updated on 23 Nov 2025",
  };
}
