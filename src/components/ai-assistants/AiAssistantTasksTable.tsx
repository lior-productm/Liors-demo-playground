"use client";

import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import {
  Database,
  Mail,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAssistantTask } from "@/src/lib/aiAssistantsData";
import { AiAssistantTaskDetailModal } from "@/src/components/ai-assistants/AiAssistantTaskDetailModal";

function toast(message: string) {
  window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message } }));
}

function StatusTag({ status }: { status: AiAssistantTask["status"] }) {
  const isActive = status === "active";
  return (
    <span
      className={cn(
        "inline-flex rounded-2xl px-2 py-1 text-xs font-medium leading-[1.25]",
        isActive ? "bg-[#E6F6F3] text-[#1F9E8B]" : "bg-[#E6E8EB] text-[#7E8185]",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function ToolIcons({ tools }: { tools: AiAssistantTask["tools"] }) {
  return (
    <div className="flex items-center">
      {tools.map((tool) => (
        <span
          key={tool}
          className="flex size-8 items-center justify-center rounded-lg text-[#353638]"
        >
          {tool === "database" ? (
            <Database className="size-4" strokeWidth={1.75} />
          ) : (
            <Mail className="size-4" strokeWidth={1.75} />
          )}
        </span>
      ))}
    </div>
  );
}

const TASK_TABLE_GRID_STYLE = {
  gridTemplateColumns:
    "minmax(120px, 1.15fr) minmax(140px, 1.5fr) minmax(88px, 111px) minmax(88px, 116px) minmax(120px, 1.35fr) minmax(168px, 168px)",
} as const;

const TASK_TABLE_MIN_WIDTH = 724;

function TaskTableGrid({
  className,
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("grid w-full", className)}
      style={{ ...TASK_TABLE_GRID_STYLE, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

function TaskRow({
  task,
  onOpenDetail,
}: {
  task: AiAssistantTask;
  onOpenDetail: () => void;
}) {
  const rowCellClass = "flex h-14 min-w-0 items-center overflow-hidden p-2";

  return (
    <div className="flex w-full min-w-0 flex-col">
      <TaskTableGrid className="items-center rounded-[12px] bg-[#FBFBFB]">
        <button
          type="button"
          onClick={onOpenDetail}
          className={cn(rowCellClass, "cursor-pointer gap-1.5 text-left")}
        >
          <p className="min-w-0 truncate text-sm font-medium leading-[1.5] text-[#353638]">
            {task.name}
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <p className="line-clamp-2 min-w-0 text-sm font-normal leading-[1.4] text-[#353638]">
            {task.description}
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <StatusTag status={task.status} />
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <ToolIcons tools={task.tools} />
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className={cn(rowCellClass, "min-w-0 cursor-pointer text-left")}
        >
          <p className="line-clamp-2 min-w-0 break-words text-sm font-normal leading-[1.4] text-[#353638]">
            {task.outputs}
          </p>
        </button>

        <div className="flex h-14 min-w-0 items-center justify-end gap-4 overflow-hidden py-4 pl-2 pr-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toast("Insights view (coming soon)");
            }}
            className="inline-flex h-6 max-w-full shrink-0 items-center justify-center truncate rounded-lg border border-[#B3B8BD] px-1.5 text-xs font-medium leading-[1.25] text-[#111]"
          >
            View insights
          </button>
        </div>
      </TaskTableGrid>
    </div>
  );
}

export function AiAssistantTasksTable({ tasks }: { tasks: AiAssistantTask[] }) {
  const [taskList, setTaskList] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState<AiAssistantTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const headerCellClass =
    "flex h-10 min-w-0 items-center justify-start overflow-hidden px-2 text-left";

  const openDetail = (task: AiAssistantTask) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="min-w-0 overflow-x-auto rounded-[12px] [-ms-overflow-style:none] [scrollbar-width:thin]">
        <div style={{ minWidth: TASK_TABLE_MIN_WIDTH }}>
          <TaskTableGrid className="items-center rounded-[12px] border border-[#E6E8EB] bg-[#F2F4F7]">
            <div className={headerCellClass}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">Name</span>
            </div>
            <div className={headerCellClass}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">
                Description
              </span>
            </div>
            <div className={headerCellClass}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">Status</span>
            </div>
            <div className={headerCellClass}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">
                Tools used
              </span>
            </div>
            <div className={headerCellClass}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">Outputs</span>
            </div>
            <div className={cn(headerCellClass, "justify-end pl-2 pr-4")}>
              <span className="truncate text-sm font-medium leading-[1.24] text-[#676A6E]">
                Actions
              </span>
            </div>
          </TaskTableGrid>

          <div className="mt-2 flex flex-col gap-2">
            {taskList.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onOpenDetail={() => openDetail(task)}
              />
            ))}
          </div>
        </div>
      </div>

      <AiAssistantTaskDetailModal
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={(task) => {
          setTaskList((prev) => prev.filter((item) => item.id !== task.id));
          setSelectedTask(null);
          setDetailOpen(false);
          toast(`Deleted “${task.name}”`);
        }}
        onSave={(next) => {
          setTaskList((prev) =>
            prev.map((item) => (item.id === next.id ? next : item)),
          );
          setSelectedTask(next);
          toast(`Saved “${next.name}”`);
        }}
      />
    </div>
  );
}

export function NewTaskButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[32px] bg-[#010309] px-3.5 text-sm font-medium leading-[1.24] text-[#F0F2F5] transition-opacity hover:opacity-90"
      onClick={onClick}
    >
      New task
      <Plus className="size-4" strokeWidth={2} />
    </button>
  );
}
