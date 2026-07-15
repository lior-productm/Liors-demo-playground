"use client";

import { Suspense } from "react";
import {
  AppShell,
  DashboardPageBody,
} from "@/src/components/layout/AppShell";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import { lazyNamed } from "@/src/lib/lazy-component";
import type { LeaseRenewalContext } from "@/src/types/leaseRenewal";

const LeasingToolView = lazyNamed(
  () => import("@/src/components/commercial/views/LeasingToolView"),
  "LeasingToolView",
  "Loading leasing tool…",
);

/** Leasing Renewal topic overview — same pipeline / prospects view as Commercial → Leasing Tool. */
export function LeasingRenewalOverview({
  renewalContext,
  entryIntent = "default",
}: {
  renewalContext?: Partial<LeaseRenewalContext>;
  entryIntent?: "default" | "proposal-prep";
}) {
  return (
    <AppShell activeNav="leasing-renewal">
      <DashboardPageBody className="pt-8">
        <Suspense fallback={<DashboardLoading label="Loading leasing tool…" />}>
          <LeasingToolView renewalContext={renewalContext} entryIntent={entryIntent} />
        </Suspense>
      </DashboardPageBody>
    </AppShell>
  );
}
