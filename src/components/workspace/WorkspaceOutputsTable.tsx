"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  ChevronUp,
  Eye,
  Lightbulb,
  Mail,
  MoreVertical,
  Settings,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  getAnalystMeta,
  WORKSPACE_TYPE_META,
  type WorkspaceOutput,
  type WorkspaceWorkflowStep,
} from "@/src/lib/workspaceOutputsData";

const TABLE_GRID_STYLE = {
  gridTemplateColumns:
    "224px 123px 127px 124px 115px 141px 112px minmax(196px,1fr)",
} as const;

const TABLE_MIN_WIDTH = 1124;

function TableGrid({
  className,
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("grid w-full", className)}
      style={{ ...TABLE_GRID_STYLE, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

function HeaderCell({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-1 border-b border-[#F2F4F7] bg-[rgba(240,242,245,0.8)] px-2 py-2.5",
        className,
      )}
    >
      <span className="text-[14px] font-medium leading-[1.24] text-[#65686B]">
        {label}
      </span>
      <ArrowUpDown className="size-3.5 shrink-0 text-[#B3B8BD]" strokeWidth={1.75} />
    </div>
  );
}

function TypeTag({ type }: { type: WorkspaceOutput["type"] }) {
  const Icon = WORKSPACE_TYPE_META[type].icon;
  return (
    <span className="inline-flex items-center gap-1 rounded-2xl bg-[#EBEDF9] px-2 py-1">
      <Icon className="size-3 text-[#303552]" strokeWidth={1.75} />
      <span className="text-[14px] font-medium leading-[1.24] text-[#303552]">
        {type}
      </span>
    </span>
  );
}

function AnalystCell({ analyst }: { analyst: WorkspaceOutput["analyst"] }) {
  const meta = getAnalystMeta(analyst);
  const Icon = meta.icon;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          meta.circleClassName,
        )}
      >
        <Icon className={cn("size-4", meta.iconClassName)} strokeWidth={1.75} />
      </span>
      <span className="truncate text-[14px] font-medium leading-[1.5] text-[#7E8185]">
        {meta.label}
      </span>
    </div>
  );
}

function WorkflowStepIcon({ icon }: { icon: WorkspaceWorkflowStep["icon"] }) {
  const className = "size-3.5 text-white";
  if (icon === "envelope") return <Mail className={className} strokeWidth={1.75} />;
  if (icon === "lightbulb") return <Lightbulb className={className} strokeWidth={1.75} />;
  return <Bell className={className} strokeWidth={1.75} />;
}

function ExpandedPanel({ output }: { output: WorkspaceOutput }) {
  return (
    <div className="flex flex-col gap-4 rounded-b-[12px] bg-[#F0F2F5] p-5 lg:flex-row lg:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Trigger</p>
        <p className="mt-2 text-sm font-normal leading-[1.4] text-[#121314]">
          {output.expandedTrigger}
        </p>
      </div>

      <div className="w-full shrink-0 lg:w-[300px]">
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Workflow steps</p>
        <div className="mt-2 flex gap-2.5">
          <div className="flex flex-col items-center">
            {output.workflowSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex size-5 items-center justify-center rounded-full bg-[#020410]">
                  <WorkflowStepIcon icon={step.icon} />
                </div>
                {index < output.workflowSteps.length - 1 ? (
                  <div className="h-8 w-px bg-[#020410]" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-9 pt-0.5">
            {output.workflowSteps.map((step) => (
              <div key={step.id} className="flex flex-col gap-1">
                <p className="text-xs font-normal leading-[1.5] text-[#353638]">
                  {step.label}
                </p>
                {step.actionLabel ? (
                  <button
                    type="button"
                    className="inline-flex h-6 w-fit items-center rounded-lg border border-[#B3B8BD] px-1.5 text-xs font-medium text-[#676A6E] transition-colors hover:bg-white"
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
          aria-label="Output settings"
        >
          <Settings className="size-5" strokeWidth={1.5} />
        </button>
        <p className="text-xs font-medium leading-[1.25] text-[#676A6E]">Outputs</p>
        <ul className="mt-2 list-disc space-y-0 pl-5 text-sm font-normal leading-[1.4] text-[#121314]">
          {output.outputItems.map((item) => (
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

function RowActionMenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[37px] w-full items-center gap-1.5 rounded px-1.5 text-left typo-l2-r transition-colors",
        danger
          ? "text-[#9F2D3A] hover:bg-[#FBEDEE]"
          : "text-[#353638] hover:bg-[#E6E8EB]",
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function RowActionsMenu({
  favorite,
  onViewTaskInfo,
  onEdit,
  onToggleFavorite,
  onDelete,
}: {
  favorite: boolean;
  onViewTaskInfo: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className="flex size-6 shrink-0 items-center justify-center text-[#65686B] transition-colors hover:text-[#353638]"
        >
          <MoreVertical className="size-5" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        onClick={(e) => e.stopPropagation()}
        className="w-[196px] rounded-[8px] border border-[#E6E8EB] bg-[#F0F2F5] px-2.5 py-2 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        <RowActionMenuItem
          icon={<Eye className="size-4 text-[#353638]" strokeWidth={1.75} />}
          label="View task info"
          onClick={() => {
            close();
            onViewTaskInfo();
          }}
        />
        <RowActionMenuItem
          icon={<SquarePen className="size-4 text-[#353638]" strokeWidth={1.75} />}
          label="Edit"
          onClick={() => {
            close();
            onEdit();
          }}
        />
        <RowActionMenuItem
          icon={
            <Star
              className={cn("size-4 text-[#353638]", favorite && "fill-[#353638]")}
              strokeWidth={1.75}
            />
          }
          label={favorite ? "Remove favorite" : "Mark as favorite"}
          onClick={() => {
            close();
            onToggleFavorite();
          }}
        />
        <RowActionMenuItem
          icon={<Trash2 className="size-4 text-[#9F2D3A]" strokeWidth={1.75} />}
          label="Delete"
          danger
          onClick={() => {
            close();
            onDelete();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function OutputRow({
  output,
  index,
  expanded,
  onToggleExpand,
  onEmailAlertChange,
  onViewTaskInfo,
  onEdit,
  onToggleFavorite,
  onDelete,
  onAction,
}: {
  output: WorkspaceOutput;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onEmailAlertChange: (next: boolean) => void;
  onViewTaskInfo: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onAction: () => void;
}) {
  const cellClass = "flex h-16 min-w-0 items-center border-b border-[#F2F4F7] px-2 py-2.5";
  const zebra = index % 2 === 1 ? "bg-[#F7F9FB]" : "bg-white";

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-row-actions]")) return;
          onToggleExpand();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if ((e.target as HTMLElement).closest("[data-row-actions]")) return;
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className={cn(
          "group grid w-full cursor-pointer items-center outline-none",
          zebra,
          expanded && "rounded-t-[12px]",
        )}
        style={TABLE_GRID_STYLE}
      >
        <div className={cn(cellClass, "gap-3 pl-4 pr-2")}>
          <span className="flex h-full w-1.5 shrink-0 items-center justify-center">
            {output.isNew ? (
              <span className="relative flex size-[6px]">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4F65E5] opacity-50" />
                <span className="relative inline-flex size-[6px] rounded-full bg-[#4F65E5]" />
              </span>
            ) : null}
          </span>
          <p className="line-clamp-2 min-w-0 text-[14px] font-medium leading-[1.5] text-[#353638]">
            {output.name}
          </p>
        </div>

        <div className={cellClass}>
          <TypeTag type={output.type} />
        </div>

        <div className={cellClass}>
          <span className="truncate text-[14px] font-medium leading-[1.5] text-[#353638]">
            {output.scope}
          </span>
        </div>

        <div className={cellClass}>
          <span className="line-clamp-2 text-[14px] font-medium leading-[1.5] text-[#7E8185]">
            {output.trigger}
          </span>
        </div>

        <div
          className={cellClass}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={output.emailAlert}
            onCheckedChange={onEmailAlertChange}
            aria-label="Email alert"
            className="h-6 w-10 border-0 data-[state=checked]:bg-[#010309] data-[state=unchecked]:bg-[#ACAEBA]"
          />
        </div>

        <div className={cellClass}>
          <AnalystCell analyst={output.analyst} />
        </div>

        <div className={cellClass}>
          <span className="truncate text-[14px] font-medium leading-[1.5] text-[#7E8185]">
            {output.nextRun}
          </span>
        </div>

        <div
          data-row-actions
          className={cn(cellClass, "justify-end gap-3 pr-4")}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-6 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[#B3B8BD] px-1.5 text-[12px] font-medium leading-[1.25] text-[#111] transition-colors hover:bg-[#F0F2F5]"
          >
            {output.actionLabel}
          </button>
          <RowActionsMenu
            favorite={Boolean(output.favorite)}
            onViewTaskInfo={onViewTaskInfo}
            onEdit={onEdit}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
          />
          <button
            type="button"
            aria-label={expanded ? "Collapse row" : "Expand row"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
              expanded ? "bg-[#F0F2F5]" : "hover:bg-[#F0F2F5]",
            )}
          >
            {expanded ? (
              <ChevronUp className="size-4 text-[#353638]" strokeWidth={1.75} />
            ) : (
              <ChevronDown className="size-4 text-[#353638]" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ExpandedPanel output={output} />
        </div>
      </div>
    </div>
  );
}

export function WorkspaceOutputsTable({
  outputs,
  onEmailAlertChange,
  onViewTaskInfo,
  onEdit,
  onToggleFavorite,
  onDelete,
  onAction,
}: {
  outputs: WorkspaceOutput[];
  onEmailAlertChange: (output: WorkspaceOutput, next: boolean) => void;
  onViewTaskInfo: (output: WorkspaceOutput) => void;
  onEdit: (output: WorkspaceOutput) => void;
  onToggleFavorite: (output: WorkspaceOutput) => void;
  onDelete: (output: WorkspaceOutput) => void;
  onAction: (output: WorkspaceOutput) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-[12px] border border-[rgba(230,231,232,0.7)] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin]">
        <div style={{ minWidth: TABLE_MIN_WIDTH }}>
          <TableGrid>
            <HeaderCell label="Name" className="pl-6" />
            <HeaderCell label="Type" />
            <HeaderCell label="Scope" />
            <HeaderCell label="Trigger" />
            <HeaderCell label="Email Alert" />
            <HeaderCell label="AI Analyst" />
            <HeaderCell label="Next run" />
            <HeaderCell label="" className="pr-6" />
          </TableGrid>

          {outputs.map((output, index) => (
            <OutputRow
              key={output.id}
              output={output}
              index={index}
              expanded={expandedId === output.id}
              onToggleExpand={() =>
                setExpandedId((current) => (current === output.id ? null : output.id))
              }
              onEmailAlertChange={(next) => onEmailAlertChange(output, next)}
              onViewTaskInfo={() => onViewTaskInfo(output)}
              onEdit={() => onEdit(output)}
              onToggleFavorite={() => onToggleFavorite(output)}
              onDelete={() => onDelete(output)}
              onAction={() => onAction(output)}
            />
          ))}
          {outputs.length === 0 ? (
            <p className="px-6 py-10 text-center text-[14px] text-[#969A9E]">
              No outputs match the selected analyst.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
