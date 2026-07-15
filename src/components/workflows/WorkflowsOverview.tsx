"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell, DashboardPageBody } from "@/src/components/layout/AppShell";
import { WorkflowOverviewCard } from "@/src/components/workflows/WorkflowOverviewCard";
import { INTENT_LABELS } from "@/src/components/workflows/WorkflowChatUi";
import { WORKFLOW_CATALOG } from "@/src/lib/workflowCatalog";
import {
  createWorkflowSessionForIntent,
  startNewWorkflowChat,
} from "@/src/lib/workflowSessions";

export function WorkflowsOverview() {
  const router = useRouter();

  const handleNewWorkflow = () => {
    startNewWorkflowChat(router);
  };

  const handleSelect = (item: (typeof WORKFLOW_CATALOG)[number]) => {
    if (item.comingSoon) {
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: `${item.title} workflow is coming soon in this demo.` },
        }),
      );
      return;
    }

    if (item.href) {
      router.push(item.href);
      return;
    }

    if (item.intent) {
      const session = createWorkflowSessionForIntent(item.intent);
      router.push(`/workflows/${session.id}`);
      window.setTimeout(
        () =>
          window.dispatchEvent(
            new CustomEvent("amiio:toast", {
              detail: {
                message: `${INTENT_LABELS[item.intent!]} workflow is coming soon in this demo.`,
              },
            }),
          ),
        50,
      );
    }
  };

  return (
    <AppShell activeNav="workflow-new">
      <header className="flex items-start justify-between gap-4 px-6 pt-8">
        <h1 className="typo-page-title text-[#010309]">Workflows</h1>
        <button
          type="button"
          onClick={handleNewWorkflow}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[32px] bg-[#010309] px-3.5 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#252628]"
        >
          <Plus className="size-4" strokeWidth={2} />
          New
        </button>
      </header>
      <DashboardPageBody className="pt-[25px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {WORKFLOW_CATALOG.map((item) => (
            <WorkflowOverviewCard key={item.id} item={item} onClick={() => handleSelect(item)} />
          ))}
        </div>
      </DashboardPageBody>
    </AppShell>
  );
}
