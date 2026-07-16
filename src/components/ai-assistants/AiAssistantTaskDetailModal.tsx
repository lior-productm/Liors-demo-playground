"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TaskDeleteConfirmDialog } from "@/src/components/workspace/TaskDeleteConfirmDialog";
import type {
  AiAssistantTask,
  AiAssistantTaskInfo,
  AiAssistantTaskRunLogEntry,
} from "@/src/lib/aiAssistantsData";

type EditableTaskFields = {
  name: string;
  triggerFull: string;
  scopeFull: string;
  output: string;
  delivery: string;
  status: AiAssistantTaskInfo["status"];
  owner: string;
};

function fieldsFromTask(task: AiAssistantTask): EditableTaskFields {
  return {
    name: task.name,
    triggerFull: task.taskInfo.triggerFull,
    scopeFull: task.taskInfo.scopeFull,
    output: task.taskInfo.output,
    delivery: task.taskInfo.delivery,
    status: task.taskInfo.status,
    owner: task.taskInfo.owner,
  };
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[16px] font-medium uppercase leading-normal tracking-[1.2355px] text-[#65686B]">
        {label}
      </p>
      <div className="h-px w-full bg-[#E6E7E8]" />
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="shrink-0 text-[16px] font-normal leading-[1.25] text-[#7E8185]">
        {label}
      </p>
      <div className="flex min-w-0 items-center gap-2 sm:max-w-[65%] sm:justify-end sm:text-right">
        {children}
      </div>
    </div>
  );
}

function FieldInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#D1D5D9] bg-white px-3 py-2 text-[16px] font-normal leading-[1.5] text-[#060B27] outline-none transition-colors focus:border-[#4F65E5] focus:ring-2 focus:ring-[#A7B2F2]/40 sm:text-right"
    />
  );
}

function RunLogStatus({ entry }: { entry: AiAssistantTaskRunLogEntry }) {
  if (entry.status === "next") {
    return (
      <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
        Next run
      </span>
    );
  }
  if (entry.status === "completed") {
    return (
      <span className="flex items-center gap-2">
        <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
          Completed
        </span>
        <span className="flex size-4 items-center justify-center rounded-full bg-[#1F9E8B]">
          <Check className="size-2.5 text-white" strokeWidth={3} />
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
        Failed
      </span>
      <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#C65A66]">
        <X className="size-2.5 text-white" strokeWidth={3} />
      </span>
    </span>
  );
}

/** Task detail popup — Figma AI Analysts Task detail (2453:129345). */
export function AiAssistantTaskDetailModal({
  task,
  open,
  onOpenChange,
  onDelete,
  onSave,
}: {
  task: AiAssistantTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (task: AiAssistantTask) => void;
  onSave?: (task: AiAssistantTask) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<EditableTaskFields | null>(null);

  useEffect(() => {
    if (!open || !task) {
      setEditing(false);
      setConfirmDelete(false);
      setDraft(null);
      return;
    }
    setEditing(false);
    setConfirmDelete(false);
    setDraft(fieldsFromTask(task));
  }, [open, task]);

  if (!task || !draft) return null;

  const info = task.taskInfo;
  const display = editing ? draft : fieldsFromTask(task);

  const patchDraft = (patch: Partial<EditableTaskFields>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const handleSave = () => {
    const next: AiAssistantTask = {
      ...task,
      name: draft.name.trim() || task.name,
      status: draft.status === "Active" ? "active" : "inactive",
      taskInfo: {
        ...task.taskInfo,
        triggerFull: draft.triggerFull.trim(),
        scopeFull: draft.scopeFull.trim(),
        output: draft.output.trim(),
        delivery: draft.delivery.trim(),
        status: draft.status,
        owner: draft.owner.trim(),
      },
    };
    onSave?.(next);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft(fieldsFromTask(task));
    setEditing(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setEditing(false);
            setConfirmDelete(false);
          }
          onOpenChange(next);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/20 backdrop-blur-[10px]"
          className="flex max-h-[90vh] w-[calc(100vw-32px)] max-w-[785px] flex-col gap-6 overflow-y-auto rounded-[12px] border-0 bg-[#FBFBFB] p-6 shadow-[0px_10px_14px_rgba(0,0,0,0.14)] sm:p-8"
        >
          <p className="text-[16px] font-medium leading-[1.5] text-[#7E8185]">TASK</p>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
              {editing ? (
                <>
                  <DialogTitle className="sr-only">Edit task</DialogTitle>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => patchDraft({ name: e.target.value })}
                    aria-label="Task name"
                    className="w-full min-w-0 flex-1 rounded-lg border border-[#D1D5D9] bg-white px-3 py-2 text-[22px] font-medium leading-[1.25] text-[#121212] outline-none focus:border-[#4F65E5] focus:ring-2 focus:ring-[#A7B2F2]/40 sm:text-[24px]"
                  />
                </>
              ) : (
                <DialogTitle className="text-[22px] font-medium leading-[1.25] tracking-normal text-[#121212] sm:text-[24px]">
                  {display.name}
                </DialogTitle>
              )}

              <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-4 sm:w-auto">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3.5 text-[14px] font-medium leading-[1.24] text-[#2C2C2C] transition-colors hover:bg-[#F0F2F5] sm:flex-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[32px] bg-[#010309] px-3.5 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-opacity hover:opacity-90 sm:flex-none"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3.5 text-[14px] font-medium leading-[1.24] text-[#9F2D3A] transition-colors hover:bg-[#FBEAEC] sm:flex-none"
                    >
                      <Trash2 className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(fieldsFromTask(task));
                        setEditing(true);
                      }}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3.5 text-[14px] font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5] sm:flex-none"
                    >
                      <Pencil className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <SectionHeader label="information" />
              <div className="flex flex-col gap-4">
                <SummaryRow label="Trigger">
                  {editing ? (
                    <FieldInput
                      value={draft.triggerFull}
                      onChange={(value) => patchDraft({ triggerFull: value })}
                    />
                  ) : (
                    <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                      {display.triggerFull}
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow label="Scope">
                  {editing ? (
                    <FieldInput
                      value={draft.scopeFull}
                      onChange={(value) => patchDraft({ scopeFull: value })}
                    />
                  ) : (
                    <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                      {display.scopeFull}
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow label="Output">
                  {editing ? (
                    <FieldInput
                      value={draft.output}
                      onChange={(value) => patchDraft({ output: value })}
                    />
                  ) : (
                    <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                      {display.output}
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow label="Delivery">
                  {editing ? (
                    <FieldInput
                      value={draft.delivery}
                      onChange={(value) => patchDraft({ delivery: value })}
                    />
                  ) : (
                    <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                      {display.delivery}
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow label="Status">
                  {editing ? (
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        patchDraft({
                          status: e.target.value as AiAssistantTaskInfo["status"],
                        })
                      }
                      className="w-full rounded-lg border border-[#D1D5D9] bg-white px-3 py-2 text-[14px] font-medium leading-[1.24] text-[#060B27] outline-none focus:border-[#4F65E5] focus:ring-2 focus:ring-[#A7B2F2]/40 sm:w-auto"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-2xl px-2 py-1 text-[14px] font-medium leading-[1.24]",
                        display.status === "Active"
                          ? "bg-[#E6F6F3] text-[#1F9E8B]"
                          : "bg-[#E6E8EB] text-[#7E8185]",
                      )}
                    >
                      {display.status}
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow label="Owner">
                  {editing ? (
                    <FieldInput
                      value={draft.owner}
                      onChange={(value) => patchDraft({ owner: value })}
                    />
                  ) : (
                    <span className="text-[16px] font-normal leading-[1.5] text-[#060B27]">
                      {display.owner}
                    </span>
                  )}
                </SummaryRow>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <SectionHeader label="Run log" />
              <div className="flex flex-col gap-4">
                {info.runLog.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <p className="text-[16px] font-normal leading-[1.25] text-[#7E8185]">
                      {entry.label}
                    </p>
                    <RunLogStatus entry={entry} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogClose className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-[32px] text-[#65686B] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]">
            <X className="size-4" strokeWidth={2} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <TaskDeleteConfirmDialog
        open={confirmDelete}
        taskName={task.name}
        onOpenChange={setConfirmDelete}
        onConfirm={() => onDelete?.(task)}
      />
    </>
  );
}
