"use client";

import dynamic from "next/dynamic";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";

const WorkspacePageClient = dynamic(
  () =>
    import("@/src/components/workspace/WorkspacePageClient").then(
      (m) => m.WorkspacePageClient,
    ),
  { loading: () => <DashboardLoading label="Loading workspace…" /> },
);

export default function WorkspaceRoutePage() {
  return <WorkspacePageClient />;
}
