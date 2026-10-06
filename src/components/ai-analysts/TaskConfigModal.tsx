"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlarmClock,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ListChecks,
  Loader2,
  MessageSquare,
  Pencil,
  Play,
  Target,
  UserRound,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CARD_BORDER,
  ConfirmDialog,
  Eyebrow,
  FOCUS_GLOW,
  MODAL_OVERLAY_CLASS,
  ModalCloseButton,
  OutlineButton,
  PrimaryButton,
  TEXT_INPUT_CLASS,
  UserChip,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { StepDots } from "@/src/components/ai-analysts/StepDots";
import { ScopeField } from "@/src/components/ai-analysts/ScopeField";
import { ScopeChip } from "@/src/components/ai-analysts/ScopeChips";
import {
  SubtaskCard,
  SubtaskList,
  canSaveSubtask,
  upsertSubtask,
} from "@/src/components/ai-analysts/SubtaskList";
import { SharedWithPicker } from "@/src/components/ai-analysts/UserPicker";
import { EnhanceWithAiTextarea } from "@/src/components/ai-analysts/EnhanceWithAiTextarea";
import { FrequencyFields } from "@/src/components/ai-analysts/FrequencyFields";
import {
  frequencySummaryParts,
  nextRunLabel,
  validateFrequency,
} from "@/src/lib/aiAnalystScheduling";
import { addTask, upsertTask } from "@/src/lib/aiAnalystTasksStore";
import {
  CURRENT_USER_ID,
  analystHref,
  defaultFrequencyConfig,
  findScopeNode,
  getUser,
  scopeSummaryLine,
} from "@/src/lib/aiAnalystsData";
import { fireToast, uid } from "@/src/lib/aiAnalystsUi";
import { useI18n } from "@/src/hooks/useI18n";
import type { TaskConfigRequest } from "@/src/components/ai-analysts/modalTypes";
import type {
  FrequencyConfig,
  ScopeSelection,
  Subtask,
  Task,
  TaskOutput,
} from "@/src/types/aiAnalysts";

type Draft = {
  id: string;
  analystId: Task["analystId"];
  type: Task["type"];
  templateId?: string;
  name: string;
  description: string;
  scope: ScopeSelection;
  instructions: string;
  ownerId: string;
  sharedWithIds: string[];
  frequency: FrequencyConfig;
  subtasks: Subtask[];
  sourceIds: string[];
  status: Task["status"];
  versions: Task["versions"];
  outputs: TaskOutput[];
  createdAt: number;
};

function draftFromRequest(req: TaskConfigRequest): Draft {
  if (req.mode === "edit") {
    const t = req.task;
    return {
      id: t.id,
      analystId: t.analystId,
      type: t.type,
      templateId: t.templateId,
      name: t.name,
      description: t.description,
      scope: t.scope,
      instructions: t.instructions,
      ownerId: t.ownerId,
      sharedWithIds: t.sharedWithIds,
      frequency: t.frequency,
      subtasks: t.subtasks,
      sourceIds: t.sourceIds,
      status: t.status,
      versions: t.versions,
      outputs: t.outputs,
      createdAt: t.createdAt,
    };
  }
  const tpl = req.template;
  return {
    id: uid("task"),
    analystId: req.analystId,
    type: tpl ? "template" : "custom",
    templateId: tpl?.id,
    name: tpl?.name ?? "",
    description: tpl?.description ?? "",
    scope: { level: tpl?.defaultScopeLevel ?? null, ids: [] },
    instructions: "",
    ownerId: CURRENT_USER_ID,
    sharedWithIds: [],
    frequency: defaultFrequencyConfig(tpl?.defaultFrequency ?? "monthly") as FrequencyConfig,
    subtasks: [],
    sourceIds: [],
    status: "active",
    versions: [],
    outputs: [],
    createdAt: Date.now(),
  };
}

function scopeNames(scope: ScopeSelection): string[] {
  return scope.ids.map((id) => findScopeNode(id)?.name ?? id);
}

function buildSampleOutput(draft: Draft): TaskOutput {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    id: uid("out"),
    date: today,
    version: "v1.0",
    name: `${draft.name} — test run`,
    summary:
      "The portfolio performed in line with expectations this period. Rental income is up against the prior period, operating expenses remain within tolerance and net operating income is stable across the selected scope.",
    preview:
      "Two postings exceeded the anomaly threshold and are listed for review: a duplicated service-charge invoice and an allocation booked to the wrong cost centre. " +
      "No further action is required at this stage; both items have been flagged to the responsible asset manager and will be re-checked on the next run.",
  };
}

const CREATE_STEPS = [
  "Configure task",
  "Create subtasks",
  "Test output",
  "Set-up frequency",
  "Review & Activate",
] as const;
const EDIT_STEPS = ["Configure task", "Test output", "Set-up frequency", "Review & Activate"] as const;

type StepKey = (typeof CREATE_STEPS)[number];

export function TaskConfigModal({
  open,
  request,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  request: TaskConfigRequest;
  onOpenChange: (open: boolean) => void;
  onSaved?: (taskId: string) => void;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const initial = useMemo(() => draftFromRequest(request), [request]);
  const initialJson = useRef(JSON.stringify(initial));
  const [draft, setDraft] = useState<Draft>(initial);
  const [step, setStep] = useState(0);
  const [testOutput, setTestOutput] = useState<TaskOutput | null>(initial.outputs[0] ?? null);
  const [testing, setTesting] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  // UI state that must survive moving between steps (the step components unmount).
  const [pendingSubtask, setPendingSubtask] = useState<Subtask | null>(null);
  const [openSection, setOpenSection] = useState<ConfigSection | null>("scope");

  const isEdit = request.mode === "edit";
  const steps: readonly StepKey[] = isEdit ? EDIT_STEPS : CREATE_STEPS;
  const stepKey = steps[step]!;
  const isLast = step === steps.length - 1;

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const dirty = JSON.stringify(draft) !== initialJson.current || pendingSubtask !== null;

  /**
   * Leaving a step must not lose work: a subtask that is still open in the
   * inline editor is committed if it is complete, otherwise it stays pending
   * and the editor re-opens when the user returns.
   */
  const commitPendingSubtask = () => {
    if (pendingSubtask && canSaveSubtask(pendingSubtask)) {
      update({ subtasks: upsertSubtask(draft.subtasks, pendingSubtask) });
      setPendingSubtask(null);
    }
  };

  const goToStep = (target: number) => {
    commitPendingSubtask();
    setStep(Math.max(0, Math.min(steps.length - 1, target)));
  };

  const editSubtask = (sub: Subtask) => {
    commitPendingSubtask();
    setPendingSubtask(sub);
    if (isEdit) {
      setOpenSection("subtasks");
      setStep(0);
    } else {
      setStep(steps.indexOf("Create subtasks"));
    }
  };

  const stepValid = (() => {
    if (stepKey === "Configure task") return draft.name.trim().length > 0 && draft.scope.ids.length > 0;
    if (stepKey === "Set-up frequency") return validateFrequency(draft.frequency).valid;
    return true;
  })();

  const requestClose = () => {
    if (dirty) setConfirmLeave(true);
    else onOpenChange(false);
  };

  const runTest = () => {
    if (testing) return;
    setTesting(true);
    window.setTimeout(() => {
      setTestOutput(buildSampleOutput(draft));
      setTesting(false);
    }, 1100);
  };

  const finish = () => {
    const subtasks =
      pendingSubtask && canSaveSubtask(pendingSubtask)
        ? upsertSubtask(draft.subtasks, pendingSubtask)
        : draft.subtasks;
    const ownerName = getUser(draft.ownerId)?.name ?? "Sarah Lee";
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (isEdit) {
      const newVersion = {
        id: uid("ver"),
        label: `v1.${draft.versions.length}`,
        createdOn: today,
        owner: ownerName,
        lastModified: today,
      };
      const updated: Task = {
        ...(request as { mode: "edit"; task: Task }).task,
        name: draft.name,
        description: draft.description,
        scope: draft.scope,
        instructions: draft.instructions,
        ownerId: draft.ownerId,
        sharedWithIds: draft.sharedWithIds,
        frequency: draft.frequency,
        subtasks,
        versions: [...draft.versions, newVersion],
      };
      upsertTask(updated);
      fireToast(t('Changes saved to "{name}"', { values: { name: draft.name } }));
      onSaved?.(updated.id);
    } else {
      const task: Task = {
        id: draft.id,
        analystId: draft.analystId,
        type: draft.type,
        templateId: draft.templateId,
        name: draft.name,
        description: draft.description,
        scope: draft.scope,
        instructions: draft.instructions,
        sharedWithIds: draft.sharedWithIds,
        frequency: draft.frequency,
        subtasks,
        ownerId: draft.ownerId,
        status: "active",
        sourceIds: [],
        versions: [
          { id: uid("ver"), label: "v1.0", createdOn: today, owner: ownerName, lastModified: today },
        ],
        outputs: testOutput ? [testOutput] : [],
        createdAt: Date.now(),
      };
      addTask(task);
      fireToast(
        draft.sharedWithIds.length || subtasks.some((s) => s.recipientIds.length)
          ? t('"{name}" created and shared', { values: { name: draft.name } })
          : t('"{name}" activated', { values: { name: draft.name } }),
      );
      onSaved?.(task.id);
    }
    initialJson.current = JSON.stringify(draft);
    onOpenChange(false);
    if (!isEdit) {
      // Land the user on the Tasks tab of the analyst the task belongs to.
      router.push(`${analystHref(draft.analystId)}?tab=tasks`);
    }
  };

  const nextLabel = isLast
    ? isEdit
      ? t("Save changes")
      : t("Activate task")
    : stepKey === "Set-up frequency"
      ? t("Review task")
      : t("Next");

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : requestClose())}>
        <DialogContent
          className="flex max-h-[90vh] w-[905px] max-w-[94vw] flex-col gap-0 overflow-hidden rounded-[12px] border-0 bg-[#FBFBFB] p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
          showCloseButton={false}
          overlayClassName={MODAL_OVERLAY_CLASS}
          aria-describedby={undefined}
          onInteractOutside={(e) => {
            e.preventDefault();
            requestClose();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            requestClose();
          }}
        >
          <DialogTitle className="sr-only">
            {draft.name ? `${t("Task configuration")}: ${t(draft.name)}` : t("Task configuration")}
          </DialogTitle>
          <ModalCloseButton onClick={requestClose} />

          <div className="flex flex-col gap-2 px-8 pb-6 pt-8">
            <Eyebrow>{t("Task configuration")}</Eyebrow>
            {draft.name || draft.templateId ? (
              <h2 className="text-[20px] font-medium leading-7 text-[#121212]">{t(draft.name)}</h2>
            ) : (
              <input
                value={draft.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder={t("Give the task a name")}
                className={cn(TEXT_INPUT_CLASS, "max-w-[420px] text-[20px] font-medium")}
              />
            )}
            {stepKey === "Configure task" || stepKey === "Review & Activate" ? (
              <p className="text-[16px] leading-6 text-[#65686B]">
                {t(draft.description)}
                {stepKey === "Configure task"
                  ? ` ${t("Choose a scope, add any specific instructions you need and share with your team.")}`
                  : ""}
              </p>
            ) : null}
          </div>
          <div className="mx-8 h-px bg-[#E6E8EB]" />

          <div data-config-scroll className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            {stepKey === "Configure task" ? (
              <ConfigureStep
                draft={draft}
                update={update}
                isEdit={isEdit}
                openSection={openSection}
                onOpenSectionChange={setOpenSection}
                pendingSubtask={pendingSubtask}
                onPendingSubtaskChange={setPendingSubtask}
              />
            ) : null}
            {stepKey === "Create subtasks" ? (
              <SubtaskList
                subtasks={draft.subtasks}
                onChange={(subtasks) => update({ subtasks })}
                taskScope={draft.scope}
                taskName={draft.name}
                editing={pendingSubtask}
                onEditingChange={setPendingSubtask}
                intro={{
                  description: t(
                    "Share specific outputs with your team members. Define scope, specific instructions and add a recipient.",
                  ),
                }}
              />
            ) : null}
            {stepKey === "Test output" ? (
              <TestOutputStep draft={draft} testing={testing} output={testOutput} onRun={runTest} />
            ) : null}
            {stepKey === "Set-up frequency" ? (
              <SectionCard
                open
                icon={<AlarmClock size={24} strokeWidth={1.5} />}
                title={t("Set-up frequency")}
                subtitle={t("How often do you want to schedule this task?")}
                glow
              >
                <FrequencyFields
                  value={draft.frequency}
                  onChange={(frequency) => update({ frequency })}
                  taskName={draft.name}
                />
                <p className="text-[16px] leading-6 text-[#65686B]">
                  {t("This frequency will be set for all new subtasks, but you can change it later if needed.")}
                </p>
              </SectionCard>
            ) : null}
            {stepKey === "Review & Activate" ? (
              <ReviewStep
                draft={draft}
                onEditFrequency={() => goToStep(steps.indexOf("Set-up frequency"))}
                onEditTasks={() => {
                  setOpenSection("scope");
                  goToStep(0);
                }}
                onEditSubtask={editSubtask}
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-b-[12px] border-t border-[#E6E8EB] bg-white p-6">
            <OutlineButton
              size="lg"
              className="border-[#E6E8EB] text-[#969A9E] hover:text-[#010309]"
              onClick={() => (step === 0 ? requestClose() : goToStep(step - 1))}
            >
              <ArrowLeft size={24} strokeWidth={1.5} className="rtl:rotate-180" />
              {step === 0 ? t("Cancel") : t("Back")}
            </OutlineButton>

            <StepDots steps={[...steps]} current={step} onStepClick={goToStep} />

            <PrimaryButton
              size="lg"
              disabled={!stepValid}
              onClick={() => (isLast ? finish() : goToStep(step + 1))}
            >
              {nextLabel}
              <ArrowRight size={24} strokeWidth={1.5} className="rtl:rotate-180" />
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        icon={<AlertTriangle size={16} strokeWidth={1.5} />}
        title={t("Leave without saving?")}
        description={t("Your changes to this task haven't been saved. If you leave now, they'll be lost.")}
        cancelLabel={t("Keep editing")}
        actionLabel={t("Leave")}
        onAction={() => {
          setConfirmLeave(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section card (accordion)                                                  */
/* -------------------------------------------------------------------------- */

function SectionCard({
  icon,
  title,
  subtitle,
  open,
  onToggle,
  glow,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  open: boolean;
  onToggle?: () => void;
  glow?: boolean;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-[16px] bg-white p-6 transition-shadow",
        CARD_BORDER,
        open && glow && cn("border-[#A7B2F2]", FOCUS_GLOW),
      )}
    >
      <div
        role={onToggle ? "button" : undefined}
        tabIndex={onToggle ? 0 : undefined}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (onToggle && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn("flex items-start gap-3", onToggle && "cursor-pointer select-none")}
      >
        <span className="inline-flex size-6 shrink-0 items-center justify-center text-[#010309]">{icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-medium leading-6 text-[#010309]">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-[16px] leading-6 text-[#65686B]">{subtitle}</p> : null}
        </div>
        {action ??
          (onToggle ? (
            <Chevron size={24} strokeWidth={1.5} className="shrink-0 text-[#353638]" />
          ) : null)}
      </div>
      {open && children ? <div className="flex flex-col gap-4 ps-9">{children}</div> : null}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1 — Configure                                                        */
/* -------------------------------------------------------------------------- */

type ConfigSection = "scope" | "instructions" | "share" | "subtasks";

function ConfigureStep({
  draft,
  update,
  isEdit,
  openSection,
  onOpenSectionChange,
  pendingSubtask,
  onPendingSubtaskChange,
}: {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
  isEdit: boolean;
  openSection: ConfigSection | null;
  onOpenSectionChange: (s: ConfigSection | null) => void;
  pendingSubtask: Subtask | null;
  onPendingSubtaskChange: (s: Subtask | null) => void;
}) {
  const { t } = useI18n();
  const toggle = (s: ConfigSection) => onOpenSectionChange(openSection === s ? null : s);

  const scopeSubtitle =
    draft.scope.ids.length > 0
      ? scopeSummaryLine(draft.scope, t)
      : t("Results will be organized by scope level");

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={<Target size={24} strokeWidth={1.5} />}
        title={t("Select a scope")}
        subtitle={scopeSubtitle}
        open={openSection === "scope"}
        onToggle={() => toggle("scope")}
        glow
      >
        <ScopeField scope={draft.scope} onChange={(scope) => update({ scope })} />
      </SectionCard>

      <SectionCard
        icon={<MessageSquare size={24} strokeWidth={1.5} />}
        title={t("Add instructions (optional)")}
        subtitle={
          openSection === "instructions" || !draft.instructions
            ? t("Give the analyst specific guidance for this task")
            : draft.instructions
        }
        open={openSection === "instructions"}
        onToggle={() => toggle("instructions")}
        glow
      >
        <EnhanceWithAiTextarea
          value={draft.instructions}
          onChange={(instructions) => update({ instructions })}
          placeholder={t("Perform a detailed analysis of anomalies by examining each portfolio and category thoroughly...")}
          rows={4}
        />
      </SectionCard>

      <SectionCard
        icon={<UserRound size={24} strokeWidth={1.5} />}
        title={t("Share with team member(s) (optional)")}
        subtitle={t("Sharing creates a separate copy for each team member, which they can adjust. They will receive the task's output by email.")}
        open={openSection === "share"}
        onToggle={() => toggle("share")}
        glow
      >
        <SharedWithPicker
          value={draft.sharedWithIds}
          onChange={(sharedWithIds) => update({ sharedWithIds })}
          excludeIds={[draft.ownerId]}
        />
      </SectionCard>

      {openSection !== "share" && draft.sharedWithIds.length > 0 ? (
        <div className="-mt-3 flex flex-wrap gap-2 px-6">
          {draft.sharedWithIds.map((id) => {
            const u = getUser(id);
            return u ? (
              <UserChip
                key={id}
                name={u.name}
                onRemove={() => update({ sharedWithIds: draft.sharedWithIds.filter((x) => x !== id) })}
              />
            ) : null;
          })}
        </div>
      ) : null}

      {isEdit ? (
        <SectionCard
          icon={<ListChecks size={24} strokeWidth={1.5} />}
          title={t("Subtasks")}
          subtitle={
            draft.subtasks.length
              ? draft.subtasks.length === 1
                ? t("1 subtask configured")
                : t("{count} subtasks configured", { values: { count: draft.subtasks.length } })
              : t("Share specific outputs with your team members.")
          }
          open={openSection === "subtasks"}
          onToggle={() => toggle("subtasks")}
          glow
        >
          <SubtaskList
            subtasks={draft.subtasks}
            onChange={(subtasks) => update({ subtasks })}
            taskScope={draft.scope}
            taskName={draft.name}
            editing={pendingSubtask}
            onEditingChange={onPendingSubtaskChange}
          />
        </SectionCard>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 3 — Test output                                                      */
/* -------------------------------------------------------------------------- */

function TestOutputStep({
  draft,
  testing,
  output,
  onRun,
}: {
  draft: Draft;
  testing: boolean;
  output: TaskOutput | null;
  onRun: () => void;
}) {
  const { t } = useI18n();
  const names = scopeNames(draft.scope);
  const owner = getUser(draft.ownerId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-[20px] font-medium leading-7 text-[#121212]">{t("Test output")}</h3>
          <p className="mt-1 text-[16px] leading-6 text-[#65686B]">
            {t("View the final test results here. No data will be sent or scheduled at this stage.")}
          </p>
        </div>
        <OutlineButton size="md" onClick={onRun} disabled={testing}>
          <Play size={16} strokeWidth={1.5} /> {t("Run test on all")}
        </OutlineButton>
      </div>

      {testing ? (
        <p className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#353638]">
          <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-[#4F65E5]" />
          {t("Running test…")}
        </p>
      ) : output ? (
        <p className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#121212]">
          <CheckCircle2 size={20} strokeWidth={1.5} className="text-[#1B7F4B]" />
          {t("Your instructions have been validated.")}
        </p>
      ) : (
        <p className="flex items-center gap-2 text-[16px] font-medium leading-6 text-[#353638]">
          <AlertTriangle size={20} strokeWidth={1.5} className="text-[#B5822B]" />
          {t("Your instructions have not been validated yet. Run a test to preview the result.")}
        </p>
      )}

      <div className={cn("flex flex-col gap-4 rounded-[16px] bg-white p-6", CARD_BORDER)}>
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-[16px] font-medium leading-6 text-[#010309]">
            {t(draft.name)}
            {names.length ? ` — ${names.join(", ")}` : ""}
          </h4>
          <OutlineButton size="sm" onClick={onRun} disabled={testing}>
            <Play size={16} strokeWidth={1.5} /> {t("Run test")}
          </OutlineButton>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {draft.scope.ids.map((id) => (
            <ScopeChip key={id} id={id} />
          ))}
          {owner ? (
            <>
              <span className="mx-1 h-6 w-px bg-[#D1D5D9]" />
              <UserChip name={owner.name} />
            </>
          ) : null}
        </div>

        {draft.instructions ? (
          <p className="flex items-center gap-2 text-[14px] leading-5 text-[#353638]">
            <MessageSquare size={16} strokeWidth={1.5} className="shrink-0 text-[#65686B]" />
            <span className="min-w-0 flex-1 truncate">{t(draft.instructions)}</span>
            <Pencil size={16} strokeWidth={1.5} className="shrink-0 text-[#65686B]" />
          </p>
        ) : null}

        {output && !testing ? (
          <div className="flex flex-col gap-4 rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] p-5">
            <p className="text-[14px] font-medium uppercase leading-5 tracking-[0.02em] text-[#65686B]">
              {t(draft.name)}
            </p>
            <div>
              <p className="text-[14px] leading-5 text-[#65686B]">{t("Summary")}</p>
              <p className="mt-1 text-[14px] leading-5 text-[#353638]">{t(output.summary)}</p>
            </div>
            <div>
              <p className="text-[14px] leading-5 text-[#65686B]">{t("Content")}</p>
              <p className="mt-1 text-[14px] leading-5 text-[#353638]">{output.preview}</p>
            </div>
          </div>
        ) : testing ? (
          <div className="flex flex-col gap-3 rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] p-5">
            <span className="h-3 w-1/3 animate-pulse rounded bg-[#E6E8EB]" />
            <span className="h-3 w-full animate-pulse rounded bg-[#E6E8EB]" />
            <span className="h-3 w-5/6 animate-pulse rounded bg-[#E6E8EB]" />
            <span className="h-3 w-2/3 animate-pulse rounded bg-[#E6E8EB]" />
          </div>
        ) : null}
      </div>

      {draft.subtasks.map((s) => (
        <SubtaskCard key={s.id} subtask={s} taskName={draft.name} className="bg-white" />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 5 — Review                                                           */
/* -------------------------------------------------------------------------- */

function ReviewStep({
  draft,
  onEditFrequency,
  onEditTasks,
  onEditSubtask,
}: {
  draft: Draft;
  onEditFrequency: () => void;
  onEditTasks: () => void;
  onEditSubtask: (sub: Subtask) => void;
}) {
  const { t } = useI18n();
  const [tasksOpen, setTasksOpen] = useState(true);
  const owner = getUser(draft.ownerId);
  const names = scopeNames(draft.scope);
  const summary = frequencySummaryParts(draft.name, draft.frequency);
  const nextRun = nextRunLabel(draft.frequency);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={<CheckCircle2 size={24} strokeWidth={1.5} />}
        title={t("Tasks & Subtasks")}
        open={tasksOpen}
        onToggle={() => setTasksOpen((o) => !o)}
      >
        <div className={cn("flex flex-col gap-3 rounded-[12px] bg-white p-6", CARD_BORDER)}>
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[16px] font-medium leading-6 text-[#010309]">
              {t(draft.name)}
              {names.length ? ` — ${names.join(", ")}` : ""}
            </h4>
            <button
              type="button"
              onClick={onEditTasks}
              aria-label={t("Edit task")}
              className="-me-1 -mt-1 inline-flex size-8 items-center justify-center rounded-full text-[#65686B] hover:bg-[#F0F2F5]"
            >
              <Pencil size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {draft.scope.ids.map((id) => (
              <ScopeChip key={id} id={id} />
            ))}
            {owner ? (
              <>
                <span className="mx-1 h-6 w-px bg-[#D1D5D9]" />
                <UserChip name={owner.name} />
              </>
            ) : null}
            {draft.sharedWithIds.map((id) => {
              const u = getUser(id);
              return u ? <UserChip key={id} name={u.name} /> : null;
            })}
          </div>
          {draft.instructions ? (
            <p className="flex items-start gap-2 text-[14px] leading-5 text-[#353638]">
              <MessageSquare size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#65686B]" />
              <span className="line-clamp-2">{t(draft.instructions)}</span>
            </p>
          ) : null}
        </div>

        {draft.subtasks.map((s) => (
          <SubtaskCard key={s.id} subtask={s} taskName={draft.name} onEdit={() => onEditSubtask(s)} />
        ))}
      </SectionCard>

      <SectionCard
        icon={<AlarmClock size={24} strokeWidth={1.5} />}
        title={t("Frequency")}
        subtitle={t("This frequency will be set for all new subtasks, but you can change it later if needed.")}
        open
        action={
          <button
            type="button"
            onClick={onEditFrequency}
            aria-label={t("Edit frequency")}
            className="-me-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#65686B] hover:bg-[#F0F2F5]"
          >
            <Pencil size={16} strokeWidth={1.5} />
          </button>
        }
      >
        {summary ? (
          <div className="rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] px-5 py-4 text-[16px] leading-6">
            <p className="text-[#353638]">
              {summary.prefix}
              <span className="font-medium text-[#121212]">{summary.bold}</span>
              {summary.suffix}
            </p>
            {nextRun ? (
              <p className="mt-1 text-[#65686B]">{t("Next run: {date}", { values: { date: nextRun } })}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-[16px] leading-6 text-[#A22D3B]">{t("The schedule is incomplete.")}</p>
        )}
      </SectionCard>
    </div>
  );
}
