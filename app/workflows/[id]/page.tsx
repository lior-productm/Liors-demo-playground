import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const WorkflowSessionPageClient = dynamic(
  () =>
    import("@/src/components/workflows/WorkflowSessionPageClient").then(
      (m) => m.WorkflowSessionPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading workflow…" /> },
);

export default function WorkflowSessionPage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading workflow…" />}>
      <WorkflowSessionPageClient />
    </Suspense>
  );
}
