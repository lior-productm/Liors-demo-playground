import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const AskAiSessionPageClient = dynamic(
  () =>
    import("@/src/components/ask-ai/AskAiSessionPageClient").then(
      (m) => m.AskAiSessionPageClient,
    ),
  { loading: () => <DashboardLoading label="Loading chat…" /> },
);

export default function AskAiSessionPage() {
  return (
    <Suspense fallback={<DashboardLoading label="Loading chat…" />}>
      <AskAiSessionPageClient />
    </Suspense>
  );
}
