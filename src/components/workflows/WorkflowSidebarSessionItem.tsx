"use client";

import type { WorkflowSession } from "@/src/types/workflows";
import { useI18n } from "@/src/hooks/useI18n";
import {
  EditableSessionTitle,
  SidebarChatSessionItem,
  SidebarCountBadge,
} from "@/src/components/layout/SidebarChatSessionItem";

export function WorkflowSidebarSessionItem({
  session,
  isActive,
  indent,
  onRename,
  onDelete,
}: {
  session: WorkflowSession;
  isActive: boolean;
  indent?: string;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <SidebarChatSessionItem
      sessionId={session.id}
      title={t(session.title)}
      isActive={isActive}
      hrefBase="/workflows"
      indent={indent}
      deleteRedirect="/workflows/new"
      onRename={onRename}
      onDelete={onDelete}
    />
  );
}

export const WorkflowCountBadge = SidebarCountBadge;
export const EditableWorkflowTitle = EditableSessionTitle;
