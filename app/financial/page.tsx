import dynamic from "next/dynamic";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const FinancialPageClient = dynamic(
  () =>
    import("@/src/components/commercial/pages/FinancialPageClient").then(
      (m) => m.FinancialPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading financial dashboard…" /> },
);

export default function FinancialPage() {
  return <FinancialPageClient />;
}
