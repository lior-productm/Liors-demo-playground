"use client";

import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Database,
  Lightbulb,
  Mail,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAssistantTask } from "@/src/lib/aiAssistantsData";

function ExpandablePanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
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

function WorkflowStepIcon({ icon }: { icon: AiAssistantTask["workflowSteps"][0]["icon"] }) {
  const className = "size-3.5 text-white";
  if (icon === "envelope") return <Mail className={className} strokeWidth={1.75} />;
  if (icon === "lightbulb") return <Lightbulb className={className} strokeWidth={1.75} />;
  return <Bell className={className} strokeWidth={1.75} />;
}

function TaskExpandedPanel({ task }: { task: AiAssistantTask }) {
  return (
    <div className="flex flex-col gap-4 rounded-b-[12px] bg-[#F0F2F5] p-5 lg:flex-row lg:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Trigger</p>
        <p className="mt-2 text-sm font-normal leading-[1.4] text-[#121314]">{task.trigger}</p>
      </div>

      <div className="w-full shrink-0 lg:w-[300px]">
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Workflow steps</p>
        <div className="mt-2 flex gap-2.5">
          <div className="flex flex-col items-center">
            {task.workflowSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex size-5 items-center justify-center rounded-full bg-[#020410]">
                  <WorkflowStepIcon icon={step.icon} />
                </div>
                {index < task.workflowSteps.length - 1 ? (
                  <div className="h-8 w-px bg-[#020410]" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-9 pt-0.5">
            {task.workflowSteps.map((step) => (
              <div key={step.id} className="flex flex-col gap-1">
                <p className="text-xs font-normal leading-[1.5] text-[#353638]">{step.label}</p>
                {step.actionLabel ? (
                  <button
                    type="button"
                    className="inline-flex h-6 w-fit items-center rounded-lg border border-[#B3B8BD] px-1.5 text-xs font-medium text-[#676A6E]"
                  >
                    {step.actionLabel}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          className="absolute right-0 top-0 text-[#353638] lg:hidden"
          aria-label="Task settings"
        >
          <Settings className="size-5" strokeWidth={1.5} />
        </button>
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Outputs</p>
        <ul className="mt-2 list-disc space-y-0 pl-5 text-sm font-normal leading-[1.4] text-[#121314]">
          {task.outputItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <Settings
        className="hidden size-6 shrink-0 text-[#353638] lg:block"
        strokeWidth={1.5}
        aria-hidden
      />
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
  expanded,
  onToggle,
}: {
  task: AiAssistantTask;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rowCellClass = "flex h-14 min-w-0 items-center overflow-hidden p-2";

  return (
    <div className="flex w-full min-w-0 flex-col">
      <TaskTableGrid
        className={cn(
          "items-center bg-[#FBFBFB]",
          expanded ? "rounded-t-[12px]" : "rounded-[12px]",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(rowCellClass, "cursor-pointer gap-1.5 text-left")}
        >
          <p className="min-w-0 truncate text-sm font-medium leading-[1.5] text-[#353638]">
            {task.name}
          </p>
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <p className="line-clamp-2 min-w-0 text-sm font-normal leading-[1.4] text-[#353638]">
            {task.description}
          </p>
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <StatusTag status={task.status} />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(rowCellClass, "cursor-pointer text-left")}
        >
          <ToolIcons tools={task.tools} />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(rowCellClass, "min-w-0 cursor-pointer text-left")}
        >
          <p className="line-clamp-2 min-w-0 break-words text-sm font-normal leading-[1.4] text-[#353638]">
            {task.outputs}
          </p>
        </button>

        <div className="flex h-14 min-w-0 items-center justify-end gap-4 overflow-hidden py-4 pl-2 pr-4">
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-6 max-w-full shrink-0 items-center justify-center truncate rounded-lg border border-[#B3B8BD] px-1.5 text-xs font-medium leading-[1.25] text-[#111]"
          >
            View insights
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse task" : "Expand task"}
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
              expanded ? "bg-[#F0F2F5]" : "bg-transparent hover:bg-[#F0F2F5]",
            )}
          >
            {expanded ? (
              <ChevronUp className="size-4 text-[#353638]" strokeWidth={1.75} />
            ) : (
              <ChevronDown className="size-4 text-[#353638]" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </TaskTableGrid>
      <ExpandablePanel open={expanded}>
        <TaskExpandedPanel task={task} />
      </ExpandablePanel>
    </div>
  );
}

export function AiAssistantTasksTable({ tasks }: { tasks: AiAssistantTask[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const headerCellClass =
    "flex h-10 min-w-0 items-center justify-start overflow-hidden px-2 text-left";

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
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                expanded={expandedId === task.id}
                onToggle={() =>
                  setExpandedId((current) => (current === task.id ? null : task.id))
                }
              />
            ))}
          </div>
        </div>
      </div>
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
