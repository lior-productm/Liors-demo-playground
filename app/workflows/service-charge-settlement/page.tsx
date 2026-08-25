import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const ServiceChargeSettlementOverviewPageClient = dynamic(
  () =>
    import(
      "@/src/components/workflows/ServiceChargeSettlementOverviewPageClient"
    ).then((m) => m.ServiceChargeSettlementOverviewPageClient),
  { loading: () => <DashboardLoading label="Loading service charge settlement…" /> },
);

export default function ServiceChargeSettlementWorkflowPage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading service charge settlement…" />}>
      <ServiceChargeSettlementOverviewPageClient />
    </Suspense>
  );
}
