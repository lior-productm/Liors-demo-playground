import dynamic from "next/dynamic";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const WorkspacePageClient = dynamic(
  () =>
    import("@/src/components/workspace/WorkspacePageClient").then(
      (m) => m.WorkspacePageClient,
    ),
  { loading: () => <DashboardLoading label="Loading workspace…" /> },
);

/** Legacy route — same Workspace experience as /workspace */
export default function InsightsPage() {
  return <WorkspacePageClient />;
}
