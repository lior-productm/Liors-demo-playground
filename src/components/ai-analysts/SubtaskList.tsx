"use client";

import { useState } from "react";
import { MessageSquare, Pencil, Plus, Target, Trash2, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CheckBox,
  FOCUS_GLOW,
  IconButton,
  OutlineButton,
  PrimaryButton,
  UserChip,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { ScopeField } from "@/src/components/ai-analysts/ScopeField";
import { ScopeChip } from "@/src/components/ai-analysts/ScopeChips";
import { SharedWithPicker } from "@/src/components/ai-analysts/UserPicker";
import { EnhanceWithAiTextarea } from "@/src/components/ai-analysts/EnhanceWithAiTextarea";
import { findScopeNode, getUser } from "@/src/lib/aiAnalystsData";
import { uid } from "@/src/lib/aiAnalystsUi";
import { useI18n } from "@/src/hooks/useI18n";
import type { I18n } from "@/src/lib/i18n";
import type { ScopeLevel, ScopeSelection, Subtask } from "@/src/types/aiAnalysts";

const LEVELS: ScopeLevel[] = ["portfolio", "entity", "property", "tenant"];

/** Subtasks target one level below the task scope (or the same level for tenants). */
function subtaskLevel(level: ScopeLevel | null): ScopeLevel {
  if (!level) return "property";
  const idx = LEVELS.indexOf(level);
  return LEVELS[Math.min(idx + 1, LEVELS.length - 1)]!;
}

function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export function subtaskDisplayName(taskName: string, sub: Subtask): string {
  if (sub.name.trim()) return sub.name;
  const names = sub.scope.ids.map((id) => findScopeNode(id)?.name ?? id);
  return names.length ? `${taskName || "Task"} for ${joinNames(names)}` : taskName || "Subtask";
}

/**
 * Localizes a subtask's display name. Names like "Eleanor Court anomalies" are
 * rendered via a "{name} anomalies" template so the property proper noun stays
 * English while the generic word is translated.
 */
function translateSubtaskName(t: I18n["t"], taskName: string, sub: Subtask): string {
  if (sub.name.trim()) {
    const scopeName = sub.scope.ids[0] ? findScopeNode(sub.scope.ids[0])?.name : undefined;
    if (scopeName && sub.name === `${scopeName} anomalies`) {
      return t("{name} anomalies", { values: { name: scopeName } });
    }
    return t(sub.name);
  }
  return subtaskDisplayName(taskName, sub);
}

export const SUBTASK_CARD_CLASS =
  "rounded-[12px] border border-[#E6E8EB] bg-[#F5F6FD] p-6";

/** Read-only subtask card (used in the Create subtasks step and Review). */
export function SubtaskCard({
  subtask,
  taskName,
  onEdit,
  onDelete,
  className,
}: {
  subtask: Subtask;
  taskName: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}) {
  const { t } = useI18n();
  const recipients = subtask.recipientIds.map((id) => getUser(id)).filter(Boolean);
  return (
    <div className={cn(SUBTASK_CARD_CLASS, "flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[16px] font-medium leading-6 text-[#010309]">
          {translateSubtaskName(t, taskName, subtask)}
        </h4>
        {onEdit || onDelete ? (
          <div className="-mr-2 -mt-1 flex items-center">
            {onEdit ? (
              <IconButton label="Edit subtask" onClick={onEdit}>
                <Pencil size={16} strokeWidth={1.5} />
              </IconButton>
            ) : null}
            {onDelete ? (
              <IconButton label="Delete subtask" onClick={onDelete}>
                <Trash2 size={16} strokeWidth={1.5} />
              </IconButton>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {subtask.scope.ids.map((id) => (
          <ScopeChip key={id} id={id} />
        ))}
        {recipients.length ? (
          <>
            <span className="mx-1 h-6 w-px bg-[#D1D5D9]" />
            {recipients.map((u) => (
              <UserChip key={u!.id} name={u!.name} />
            ))}
          </>
        ) : null}
      </div>

      {subtask.instructions ? (
        <p className="flex items-start gap-2 text-[14px] leading-5 text-[#353638]">
          <MessageSquare size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#65686B]" />
          <span className="line-clamp-2">{t(subtask.instructions)}</span>
        </p>
      ) : null}
    </div>
  );
}

export function newSubtask(taskScope: ScopeSelection): Subtask {
  return {
    id: uid("sub"),
    name: "",
    scope: { level: subtaskLevel(taskScope.level), ids: [] },
    includeGeneralInstruction: false,
    instructions: "",
    recipientIds: [],
    status: "active",
  };
}

/** A pending subtask can be committed once it has a scope. */
export function canSaveSubtask(sub: Subtask): boolean {
  return sub.scope.ids.length > 0;
}

export function upsertSubtask(subtasks: Subtask[], sub: Subtask): Subtask[] {
  const exists = subtasks.some((s) => s.id === sub.id);
  return exists ? subtasks.map((s) => (s.id === sub.id ? sub : s)) : [...subtasks, sub];
}

export function SubtaskList({
  subtasks,
  onChange,
  taskScope,
  taskName,
  intro,
  editing: controlledEditing,
  onEditingChange,
}: {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
  taskScope: ScopeSelection;
  taskName: string;
  /** Optional heading block rendered above the list (Create subtasks step). */
  intro?: { title?: string; description: string };
  /**
   * In-progress subtask being edited. When provided (together with
   * `onEditingChange`) the editor state lives in the parent, so it survives
   * unmounting — e.g. navigating between steps of the configuration flow.
   */
  editing?: Subtask | null;
  onEditingChange?: (s: Subtask | null) => void;
}) {
  const [internalEditing, setInternalEditing] = useState<Subtask | null>(null);
  const isControlled = controlledEditing !== undefined;
  const editing = isControlled ? controlledEditing : internalEditing;
  const setEditing = (s: Subtask | null) => {
    if (!isControlled) setInternalEditing(s);
    onEditingChange?.(s);
  };

  const startAdd = () => setEditing(newSubtask(taskScope));

  const save = (sub: Subtask) => {
    onChange(upsertSubtask(subtasks, sub));
    setEditing(null);
  };

  const isEditingNew = editing ? !subtasks.some((s) => s.id === editing.id) : false;

  return (
    <div className="flex flex-col gap-4">
      {intro ? (
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            {intro.title ? (
              <h3 className="text-[20px] font-medium leading-7 text-[#121212]">{intro.title}</h3>
            ) : null}
            <p className="mt-1 text-[16px] leading-6 text-[#65686B]">{intro.description}</p>
          </div>
          <OutlineButton size="md" onClick={startAdd} disabled={Boolean(editing)}>
            <Plus size={16} strokeWidth={1.5} /> Add subtask
          </OutlineButton>
        </div>
      ) : (
        <div className="flex justify-end">
          <OutlineButton size="md" onClick={startAdd} disabled={Boolean(editing)}>
            <Plus size={16} strokeWidth={1.5} /> Add subtask
          </OutlineButton>
        </div>
      )}

      {subtasks.map((s) =>
        editing && editing.id === s.id ? (
          <SubtaskEditor
            key={s.id}
            subtask={editing}
            taskScope={taskScope}
            onChange={setEditing}
            onCancel={() => setEditing(null)}
            onSave={save}
          />
        ) : (
          <SubtaskCard
            key={s.id}
            subtask={s}
            taskName={taskName}
            onEdit={() => setEditing(s)}
            onDelete={() => onChange(subtasks.filter((x) => x.id !== s.id))}
          />
        ),
      )}

      {editing && isEditingNew ? (
        <SubtaskEditor
          subtask={editing}
          taskScope={taskScope}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      ) : null}

      {subtasks.length === 0 && !editing ? (
        <p className="rounded-[12px] border border-dashed border-[#D1D5D9] bg-white px-6 py-8 text-center text-[14px] leading-5 text-[#65686B]">
          No subtasks yet. Add one to share a specific part of the scope with a team member.
        </p>
      ) : null}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#010309]">
      <span className="inline-flex size-6 items-center justify-center text-[#010309]">{icon}</span>
      {children}
    </h4>
  );
}

function SubtaskEditor({
  subtask: draft,
  taskScope,
  onChange: setDraft,
  onCancel,
  onSave,
}: {
  subtask: Subtask;
  taskScope: ScopeSelection;
  onChange: (s: Subtask) => void;
  onCancel: () => void;
  onSave: (s: Subtask) => void;
}) {
  const canSave = canSaveSubtask(draft);

  return (
    <div className={cn(SUBTASK_CARD_CLASS, "flex flex-col gap-6 border-[#A7B2F2]", FOCUS_GLOW)}>
      <p className="text-[14px] font-medium uppercase leading-5 tracking-[0.02em] text-[#7E8185]">
        Subtask
      </p>

      <div className="flex flex-col gap-3">
        <SectionTitle icon={<Target size={20} strokeWidth={1.5} />}>Select a specific scope</SectionTitle>
        <ScopeField
          scope={draft.scope}
          onChange={(scope) => setDraft({ ...draft, scope })}
          rootIds={taskScope.ids}
          showLevels={false}
          helperText="You can select an asset included in the initial scope selected."
        />
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle icon={<MessageSquare size={20} strokeWidth={1.5} />}>Add instructions</SectionTitle>
        <EnhanceWithAiTextarea
          value={draft.instructions}
          onChange={(v) => setDraft({ ...draft, instructions: v })}
          placeholder="Generate results per property, group by region..."
          rows={3}
        />
        <label className="flex cursor-pointer items-center gap-2 text-[14px] leading-5 text-[#353638]">
          <CheckBox
            checked={draft.includeGeneralInstruction}
            onChange={(v) => setDraft({ ...draft, includeGeneralInstruction: v })}
            label="Include the general task instruction"
          />
          Include the general task instruction
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <SectionTitle icon={<UserRound size={20} strokeWidth={1.5} />}>Share with team member(s)</SectionTitle>
        <SharedWithPicker
          value={draft.recipientIds}
          onChange={(ids) => setDraft({ ...draft, recipientIds: ids })}
          helperText="Sharing creates a separate copy for each team member, which they can adjust. They will receive the task's output by email."
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-8 rounded-[32px] px-3 text-[14px] font-medium text-[#65686B] hover:text-[#010309]"
        >
          Cancel
        </button>
        <PrimaryButton size="sm" disabled={!canSave} onClick={() => onSave(draft)}>
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}
