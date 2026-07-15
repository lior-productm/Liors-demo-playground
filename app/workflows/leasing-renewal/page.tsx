import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const LeasingRenewalOverviewPageClient = dynamic(
  () =>
    import("@/src/components/workflows/LeasingRenewalOverviewPageClient").then(
      (m) => m.LeasingRenewalOverviewPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading leasing renewal…" /> },
);

export default function LeasingRenewalWorkflowPage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading leasing renewal…" />}>
      <LeasingRenewalOverviewPageClient />
    </Suspense>
  );
}
