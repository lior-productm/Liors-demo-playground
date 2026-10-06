"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, Info, Paperclip, Pause, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AnalystIcon,
  AnalystTag,
  ConfirmDialog,
  Eyebrow,
  MODAL_OVERLAY_CLASS,
  ModalCloseButton,
  OutlineButton,
  Tag,
  Toggle,
  TypeBadge,
  UserInline,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { ScopeChips } from "@/src/components/ai-analysts/ScopeChips";
import { SubtaskCard } from "@/src/components/ai-analysts/SubtaskList";
import { useAiAnalystTasks } from "@/src/hooks/useAiAnalystTasks";
import { useAiAnalystSources } from "@/src/hooks/useAiAnalystSources";
import { setTaskStatus } from "@/src/lib/aiAnalystTasksStore";
import { FREQUENCY_LABEL, getAnalyst } from "@/src/lib/aiAnalystsData";
import { fireToast } from "@/src/lib/aiAnalystsUi";
import { useI18n } from "@/src/hooks/useI18n";
import type { Task, TaskOutput } from "@/src/types/aiAnalysts";

type TabKey = "Information" | "Subtasks" | "Outputs" | "Versions";

export function TaskDetailsModal({
  open,
  taskId,
  onOpenChange,
  onEditTemplate,
  onEditCustom,
}: {
  open: boolean;
  taskId: string | null;
  onOpenChange: (open: boolean) => void;
  onEditTemplate: (task: Task) => void;
  onEditCustom: () => void;
}) {
  const { t } = useI18n();
  const tasks = useAiAnalystTasks();
  const task = tasks.find((item) => item.id === taskId) ?? null;
  const [tab, setTab] = useState<TabKey>("Information");
  const [activeOutput, setActiveOutput] = useState<TaskOutput | null>(null);
  const [confirmPause, setConfirmPause] = useState(false);

  useEffect(() => {
    if (open) {
      setTab("Information");
      setActiveOutput(null);
    }
  }, [open, taskId]);

  if (!task) return null;

  const isActive = task.status === "active";
  const isArchived = task.status === "archived";

  const onToggle = (next: boolean) => {
    if (!next) {
      setConfirmPause(true);
      return;
    }
    setTaskStatus(task.id, "active");
    fireToast(`"${task.name}" resumed`);
  };

  const leftTabs: TabKey[] = ["Information", "Subtasks", "Outputs"];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          overlayClassName={MODAL_OVERLAY_CLASS}
          aria-describedby={undefined}
          className="flex max-h-[90vh] w-[645px] max-w-[94vw] flex-col gap-0 overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
        >
          <ModalCloseButton onClick={() => onOpenChange(false)} className="right-4 top-4" />

          <div className="flex flex-col gap-2 px-6 pt-6">
            <Eyebrow className="text-[12px] leading-4">Task details</Eyebrow>
            <div className="flex items-center justify-between gap-4 pr-8">
              <DialogTitle className="min-w-0 truncate text-[20px] font-medium leading-7 tracking-normal text-[#121212]">
                {t(task.name)}
              </DialogTitle>
              {!isArchived ? (
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-6 items-center rounded-[16px] px-2.5 text-[12px] font-medium leading-4",
                      isActive ? "bg-[#E6F6EC] text-[#1B7F4B]" : "bg-[#F0F2F5] text-[#353638]",
                    )}
                  >
                    {isActive ? "Active" : "Paused"}
                  </span>
                  <Toggle checked={isActive} onChange={onToggle} label={isActive ? "Pause task" : "Resume task"} />
                </div>
              ) : (
                <Tag>Archived</Tag>
              )}
            </div>
            <p className="text-[14px] leading-5 text-[#65686B]">{t(task.description)}</p>
          </div>

          <div className="mt-3 flex items-center justify-between border-b border-[#E6E8EB] px-6">
            <div className="flex">
              {leftTabs.map((tabKey) => (
                <DetailTab key={tabKey} active={tab === tabKey} onClick={() => switchTab(tabKey)}>
                  {tabKey}
                  {tabKey === "Subtasks" && task.subtasks.length ? ` (${task.subtasks.length})` : ""}
                </DetailTab>
              ))}
            </div>
            <DetailTab active={tab === "Versions"} onClick={() => switchTab("Versions")}>
              Versions
            </DetailTab>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {task.status === "paused" ? (
              <div className="mb-5 rounded-[8px] border border-[#E6E8EB] bg-[#F7F8FA] px-4 py-3 text-[14px] leading-5 text-[#353638]">
                This task is paused. It will not run until you resume it.
              </div>
            ) : null}
            {tab === "Information" ? <InformationTab task={task} /> : null}
            {tab === "Subtasks" ? <SubtasksTab task={task} /> : null}
            {tab === "Outputs" ? (
              activeOutput ? (
                <OutputDetail output={activeOutput} onBack={() => setActiveOutput(null)} />
              ) : (
                <OutputsTab task={task} onOpen={setActiveOutput} />
              )
            ) : null}
            {tab === "Versions" ? <VersionsTab task={task} /> : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#E6E8EB] px-6 py-5">
            <TypeBadge type={task.type} analystId={task.analystId} />
            <div className="flex items-center gap-2">
              <OutlineButton
                size="md"
                onClick={() => (task.type === "template" ? onEditTemplate(task) : onEditCustom())}
              >
                {task.type === "template" ? (
                  "Edit configuration"
                ) : (
                  <>
                    <Settings2 size={16} strokeWidth={1.5} /> Edit in Ask Amiio
                  </>
                )}
              </OutlineButton>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="About editing"
                    className="inline-flex size-6 items-center justify-center rounded-full text-[#65686B] hover:bg-[#F0F2F5]"
                  >
                    <Info size={16} strokeWidth={1.5} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="max-w-[240px] rounded-[8px] bg-[#070D2F] px-3 py-2 text-[12px] leading-4 text-white">
                  {task.type === "template"
                    ? "This task was created from a template. Edit its scope, instructions, frequency or recipients in the configuration form."
                    : "This task was created with Ask Amiio. Continue the conversation to adjust it."}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmPause}
        onOpenChange={setConfirmPause}
        icon={<Pause size={16} strokeWidth={1.5} />}
        title="Pause task?"
        description="This task will stop running until you resume it. You won't receive new results while it's paused. If you created subtasks, they will be paused too."
        actionLabel="Pause task"
        onAction={() => {
          setTaskStatus(task.id, "paused");
          fireToast(`"${task.name}" paused`);
          setConfirmPause(false);
        }}
      />
    </>
  );

  function switchTab(tabKey: TabKey) {
    setTab(tabKey);
    setActiveOutput(null);
  }
}

function DetailTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-10 px-3 text-[14px] font-medium leading-5 transition-colors",
        active ? "text-[#121212]" : "text-[#65686B] hover:text-[#353638]",
      )}
    >
      {children}
      {active ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#121212]" /> : null}
    </button>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-[14px] leading-5 text-[#65686B]">{label}</span>
      <div className="min-w-0 text-[14px] leading-5 text-[#121212]">{children}</div>
    </div>
  );
}

function InformationTab({ task }: { task: Task }) {
  const { t } = useI18n();
  const analyst = getAnalyst(task.analystId);
  const sources = useAiAnalystSources().filter((s) => task.sourceIds.includes(s.id));
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      <FieldBlock label="Analyst">
        <AnalystTag analystId={task.analystId} icon={<AnalystIcon analystId={task.analystId} size={14} />}>
          {analyst ? t(analyst.name) : null}
        </AnalystTag>
      </FieldBlock>
      <FieldBlock label="Scope">
        <ScopeChips scope={task.scope} maxVisible={2} />
      </FieldBlock>
      <FieldBlock label="Frequency">{FREQUENCY_LABEL[task.frequency.kind]}</FieldBlock>
      <FieldBlock label="Sources">
        {sources.length ? (
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <Tag key={s.id} icon={<Paperclip size={12} strokeWidth={1.5} />} className="font-normal">
                {t(s.name)}
              </Tag>
            ))}
          </div>
        ) : (
          <span className="text-[#969A9E]">No sources attached</span>
        )}
      </FieldBlock>
      <div className="sm:col-span-2">
        <FieldBlock label="Instructions">
          {task.instructions ? (
            <p className="whitespace-pre-wrap">{t(task.instructions)}</p>
          ) : (
            <span className="text-[#969A9E]">No specific instructions</span>
          )}
        </FieldBlock>
      </div>
    </div>
  );
}

function SubtasksTab({ task }: { task: Task }) {
  if (task.subtasks.length === 0) {
    return (
      <p className="rounded-[12px] border border-dashed border-[#D1D5D9] bg-[#FBFBFB] px-6 py-8 text-center text-[14px] leading-5 text-[#65686B]">
        This task has no subtasks.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {task.subtasks.map((s) => (
        <div key={s.id} className="relative">
          <SubtaskCard subtask={s} taskName={task.name} />
          <span
            className={cn(
              "absolute right-6 top-6 inline-flex h-6 items-center rounded-[16px] px-2.5 text-[12px] font-medium leading-4",
              s.status === "active" ? "bg-[#E6F6EC] text-[#1B7F4B]" : "bg-[#F0F2F5] text-[#353638]",
            )}
          >
            {s.status === "active" ? "Active" : "Paused"}
          </span>
        </div>
      ))}
    </div>
  );
}

const OUTPUT_COLS = "grid-cols-[72px_64px_minmax(0,1fr)_56px]";

function OutputsTab({ task, onOpen }: { task: Task; onOpen: (o: TaskOutput) => void }) {
  const { t } = useI18n();
  if (task.outputs.length === 0) {
    return (
      <p className="rounded-[12px] border border-dashed border-[#D1D5D9] bg-[#FBFBFB] px-6 py-8 text-center text-[14px] leading-5 text-[#65686B]">
        No outputs yet. The first output will appear after the task runs.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className={cn("grid h-8 items-center gap-3 rounded-[8px] bg-[#F2F4F7] px-3 text-[12px] font-medium leading-4 text-[#676A6E]", OUTPUT_COLS)}>
        <span>Date</span>
        <span>Version</span>
        <span>Name</span>
        <span className="text-right">Actions</span>
      </div>
      {task.outputs.map((o) => (
        <div
          key={o.id}
          role="button"
          tabIndex={0}
          onClick={() => onOpen(o)}
          onKeyDown={(e) => (e.key === "Enter" ? onOpen(o) : undefined)}
          className={cn(
            "grid cursor-pointer items-center gap-3 rounded-[8px] border border-[#E6E8EB] bg-white px-3 py-4 text-left transition-colors hover:bg-[#FBFBFB]",
            OUTPUT_COLS,
          )}
        >
          <span className="text-[12px] leading-4 text-[#65686B]">{o.date.replace(/, \d{4}$/, "")}</span>
          <span className="text-[12px] leading-4 text-[#65686B]">{o.version}</span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-medium leading-4 text-[#121212]">{t(o.name)}</span>
            <span className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-[#65686B]">{t(o.summary)}</span>
          </span>
          <span className="flex justify-end">
            <button
              type="button"
              aria-label="Download output"
              onClick={(e) => {
                e.stopPropagation();
                fireToast(`Downloading "${o.name}"…`);
              }}
              className="inline-flex size-8 items-center justify-center rounded-full border border-[#D1D5D9] text-[#65686B] hover:bg-[#F0F2F5]"
            >
              <Download size={16} strokeWidth={1.5} />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

function OutputDetail({ output, onBack }: { output: TaskOutput; onBack: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 text-[14px] font-medium leading-5 text-[#65686B] hover:text-[#121212]"
      >
        <ArrowLeft size={16} strokeWidth={1.5} /> Back to outputs
      </button>
      <div className="flex flex-col gap-4 rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-medium uppercase leading-5 tracking-[0.02em] text-[#65686B]">
              {t(output.name)}
            </p>
            <p className="mt-0.5 text-[12px] leading-4 text-[#969A9E]">
              {output.date} · {output.version}
            </p>
          </div>
          <button
            type="button"
            aria-label="Download output"
            onClick={() => fireToast(`Downloading "${output.name}"…`)}
            className="inline-flex size-8 items-center justify-center rounded-full border border-[#D1D5D9] bg-white text-[#65686B] hover:bg-[#F0F2F5]"
          >
            <Download size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div>
          <p className="text-[14px] leading-5 text-[#65686B]">Summary</p>
          <p className="mt-1 text-[14px] leading-5 text-[#353638]">{t(output.summary)}</p>
        </div>
        <div>
          <p className="text-[14px] leading-5 text-[#65686B]">Content</p>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-[14px] leading-5 text-[#353638]">
            {output.preview}
          </pre>
        </div>
      </div>
    </div>
  );
}

const VERSION_COLS = "grid-cols-[80px_1.1fr_1.2fr_1.1fr]";

function VersionsTab({ task }: { task: Task }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E6E8EB]">
      <div className={cn("grid h-8 items-center gap-3 bg-[#F2F4F7] px-3 text-[12px] font-medium leading-4 text-[#676A6E]", VERSION_COLS)}>
        <span>Name</span>
        <span>Created on</span>
        <span>Owner</span>
        <span>Last Modified</span>
      </div>
      {[...task.versions].reverse().map((v) => (
        <div
          key={v.id}
          className={cn(
            "grid h-10 items-center gap-3 border-t border-[#E6E8EB] bg-[#FBFBFB] px-3 text-[12px] leading-4 text-[#353638]",
            VERSION_COLS,
          )}
        >
          <span className="font-medium">{v.label}</span>
          <span>{v.createdOn}</span>
          <UserInline name={v.owner} className="text-[12px]" />
          <span>{v.lastModified}</span>
        </div>
      ))}
    </div>
  );
}
