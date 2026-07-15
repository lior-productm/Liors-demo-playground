"use client";

import { WorkflowChatBar } from "@/src/components/workflows/WorkflowChatBar";
import { WorkflowChatDock } from "@/src/components/workflows/WorkflowChatDock";
import { SHELL_WORKFLOW_CHAT_COLUMN_MAX_PX } from "@/src/lib/shellLayout";

/** Bottom dock inside the main chat column (Figma 830:53562). */
export function WorkflowFloatingChatDock({
  placeholder,
}: {
  placeholder?: string;
}) {
  return (
    <WorkflowChatDock maxWidth={SHELL_WORKFLOW_CHAT_COLUMN_MAX_PX}>
      <WorkflowChatBar floating placeholder={placeholder} />
    </WorkflowChatDock>
  );
}
