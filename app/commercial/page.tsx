import dynamic from "next/dynamic";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const CommercialPageClient = dynamic(
  () =>
    import("@/src/components/commercial/pages/CommercialPageClient").then(
      (m) => m.CommercialPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading commercial dashboard…" /> },
);

export default function CommercialPage() {
  return <CommercialPageClient />;
}
