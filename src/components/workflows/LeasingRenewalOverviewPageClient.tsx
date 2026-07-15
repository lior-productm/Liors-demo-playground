"use client";

import { useSearchParams } from "next/navigation";
import { LeasingRenewalOverview } from "@/src/components/workflows/LeasingRenewalOverview";
import { LeasingRenewalWorkflow } from "@/src/components/workflows/LeasingRenewalWorkflow";

/** Overview by default; legacy `?tenant=` links still open a workflow session. */
export function LeasingRenewalOverviewPageClient() {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const launchOverview = searchParams.get("launch") === "overview";

  const hasLegacyLaunchParams =
    !launchOverview &&
    (searchParams.has("tenant") ||
      searchParams.has("portfolio") ||
      searchParams.has("entity") ||
      searchParams.has("property"));

  if (hasLegacyLaunchParams) {
    return <LeasingRenewalWorkflow />;
  }

  if (launchOverview && tenant) {
    return (
      <LeasingRenewalOverview
        entryIntent="proposal-prep"
        renewalContext={{
          tenantName: tenant,
          portfolio: searchParams.get("portfolio") ?? undefined,
          entity: searchParams.get("entity") ?? undefined,
          property: searchParams.get("property") ?? undefined,
        }}
      />
    );
  }

  return <LeasingRenewalOverview />;
}
