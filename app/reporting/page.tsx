import dynamic from "next/dynamic";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const ReportingPageClient = dynamic(
  () =>
    import("@/src/components/commercial/pages/ReportingPageClient").then(
      (m) => m.ReportingPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading reports…" /> },
);

export default function ReportingPage() {
  return <ReportingPageClient />;
}
