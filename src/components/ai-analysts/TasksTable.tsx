"use client";

import { useState } from "react";
import { Archive, ChevronsUpDown, Pause, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AnalystIcon,
  ConfirmDialog,
  EmptyState,
  IconButton,
  Tag,
  Toggle,
  TypeBadge,
  UserInline,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { useAiAnalystsModals } from "@/src/components/ai-analysts/AiAnalystsModals";
import { deleteTask, setTaskStatus } from "@/src/lib/aiAnalystTasksStore";
import { FREQUENCY_LABEL, findScopeNode, getUser } from "@/src/lib/aiAnalystsData";
import { fireToast } from "@/src/lib/aiAnalystsUi";
import { useI18n } from "@/src/hooks/useI18n";
import type { Task } from "@/src/types/aiAnalysts";

const COLS =
  "grid-cols-[minmax(180px,1.4fr)_minmax(160px,1.3fr)_minmax(120px,1fr)_112px_104px_minmax(130px,1fr)_88px_112px]";

export const TABLE_CONTAINER_CLASS =
  "overflow-hidden rounded-[12px] border border-[rgba(230,231,232,0.7)] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]";

export function TableHeaderCell({
  children,
  sortable = true,
  className,
}: {
  children?: React.ReactNode;
  sortable?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1 text-[14px] font-medium leading-5 text-[#676A6E]", className)}>
      <span className="truncate">{children}</span>
      {sortable && children ? <ChevronsUpDown size={16} strokeWidth={1.5} className="shrink-0 text-[#969A9E]" /> : null}
    </span>
  );
}

function scopeLabel(task: Task): string {
  if (!task.scope.level || task.scope.ids.length === 0) return "—";
  return task.scope.ids.map((id) => findScopeNode(id)?.name ?? id).join(", ");
}

export function TasksTable({
  tasks,
  emptyTitle = "No tasks configured yet",
  emptyDescription = "Browse ready-made templates to quickly set up your first task.",
  emptyAction,
}: {
  tasks: Task[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}) {
  const { t } = useI18n();
  const modals = useAiAnalystsModals();
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [pendingPause, setPendingPause] = useState<Task | null>(null);
  const [pendingArchive, setPendingArchive] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className={TABLE_CONTAINER_CLASS}>
        <EmptyState title={t(emptyTitle)} description={t(emptyDescription)} action={emptyAction} />
      </div>
    );
  }

  const onToggle = (task: Task, next: boolean) => {
    if (!next) {
      setPendingPause(task);
      return;
    }
    setTaskStatus(task.id, "active");
    fireToast(t('"{name}" resumed', { values: { name: task.name } }));
  };

  return (
    <>
      <div className={TABLE_CONTAINER_CLASS}>
        <div className="overflow-x-auto">
          <div className="min-w-[1040px]">
            <div className={cn("grid h-10 items-center gap-4 bg-[#F2F4F7] px-4", COLS)}>
              <TableHeaderCell>{t("Name")}</TableHeaderCell>
              <TableHeaderCell>{t("Description")}</TableHeaderCell>
              <TableHeaderCell>{t("Scope")}</TableHeaderCell>
              <TableHeaderCell>{t("Frequency")}</TableHeaderCell>
              <TableHeaderCell>{t("Type")}</TableHeaderCell>
              <TableHeaderCell>{t("Owner")}</TableHeaderCell>
              <TableHeaderCell>{t("Subtasks")}</TableHeaderCell>
              <TableHeaderCell sortable={false}>{t("Status")}</TableHeaderCell>
            </div>

            {tasks.map((task) => {
              const owner = getUser(task.ownerId);
              const archived = task.status === "archived";
              return (
                <div
                  key={task.id}
                  onClick={() => modals.openTaskDetails(task.id)}
                  className={cn(
                    "grid h-16 cursor-pointer items-center gap-4 border-b border-[#E6E8EB] bg-[#FBFBFB] px-4 text-[14px] leading-5 text-[#353638] transition-colors last:border-b-0 hover:bg-[#F2F4F7]",
                    COLS,
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <AnalystIcon analystId={task.analystId} size={16} />
                    <span className="truncate font-medium">{t(task.name)}</span>
                  </div>
                  <span className="truncate">{t(task.description)}</span>
                  <span className="truncate">{scopeLabel(task)}</span>
                  <span className="truncate">{t(FREQUENCY_LABEL[task.frequency.kind])}</span>
                  <span className="flex min-w-0">
                    <TypeBadge type={task.type} analystId={task.analystId} />
                  </span>
                  <span className="flex min-w-0">
                    {owner ? <UserInline name={owner.name} /> : "—"}
                  </span>
                  <span>{task.subtasks.length}</span>

                  <div
                    className="flex items-center justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {archived ? (
                      <>
                        <Tag>{t("Archived")}</Tag>
                        <IconButton
                          label={t("Restore task")}
                          onClick={() => {
                            setTaskStatus(task.id, "active");
                            fireToast(t('"{name}" restored', { values: { name: task.name } }));
                          }}
                        >
                          <RotateCcw size={16} strokeWidth={1.5} />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Toggle
                          checked={task.status === "active"}
                          onChange={(next) => onToggle(task, next)}
                          label={task.status === "active" ? t("Pause task") : t("Resume task")}
                        />
                        <IconButton label={t("Archive task")} onClick={() => setPendingArchive(task)}>
                          <Archive size={16} strokeWidth={1.5} />
                        </IconButton>
                      </>
                    )}
                    <IconButton label={t("Delete task")} onClick={() => setPendingDelete(task)}>
                      <Trash2 size={16} strokeWidth={1.5} />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingPause)}
        onOpenChange={(o) => !o && setPendingPause(null)}
        icon={<Pause size={16} strokeWidth={1.5} />}
        title={t("Pause task?")}
        description={t("This task will stop running until you resume it. You won't receive new results while it's paused. If you created subtasks, they will be paused too.")}
        actionLabel={t("Pause task")}
        onAction={() => {
          if (pendingPause) {
            setTaskStatus(pendingPause.id, "paused");
            fireToast(t('"{name}" paused', { values: { name: pendingPause.name } }));
          }
          setPendingPause(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingArchive)}
        onOpenChange={(o) => !o && setPendingArchive(null)}
        icon={<Archive size={16} strokeWidth={1.5} />}
        title={t("Archive task?")}
        description={t("This task and its subtasks will be paused and moved to the Archived tab. You can restore it later.")}
        actionLabel={t("Archive task")}
        onAction={() => {
          if (pendingArchive) {
            setTaskStatus(pendingArchive.id, "archived");
            fireToast(t('"{name}" archived', { values: { name: pendingArchive.name } }));
          }
          setPendingArchive(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        icon={<Trash2 size={16} strokeWidth={1.5} />}
        danger
        title={t("Delete task?")}
        description={t("Are you sure you want to permanently delete this item? Once deleted, it cannot be restored.")}
        actionLabel={t("Delete")}
        onAction={() => {
          if (pendingDelete) {
            deleteTask(pendingDelete.id);
            fireToast(t('"{name}" deleted', { values: { name: pendingDelete.name } }));
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}
