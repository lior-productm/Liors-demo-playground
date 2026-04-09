"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Database,
  FileText,
  GripVertical,
  LineChart,
  Mail,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const FIELD_OPTIONS = [
  "WAULT Increase",
  "RentalIncomeDecrease",
  "DecreaseAmount",
  "OPEX trend",
] as const;

const OP_OPTIONS = [
  "Greater than",
  "Less than",
  "Equals",
  "Contains",
] as const;

const TYPE_OPTIONS = [
  "Financial",
  "Commercial",
  "P&L",
  "Service Charge",
  "General",
] as const;

const FREQUENCY_OPTIONS = ["Every 24 hours", "Every 12 hours", "Every 7 days"] as const;
const ALERT_THRESHOLD_OPTIONS = ["90 days before", "60 days before", "30 days before"] as const;
const TASK_TYPE_OPTIONS = [
  "Financial Variance Detector",
  "Monitor upcoming Lease Expiry",
  "Market Intelligence Digest",
] as const;
const USER_OPTIONS = ["Tomer Zakai", "Maria Koning", "Jim Duddley", "Sara van der Berg"] as const;

const AGENT_PERMISSION_ITEMS = [
  { id: "send-emails", label: "Send Emails", icon: Mail, defaultEnabled: true },
  { id: "generate-docs", label: "Generate Docs", icon: FileText, defaultEnabled: true },
  { id: "share-reports", label: "Share Reports", icon: Share2, defaultEnabled: true },
  { id: "notify-team", label: "Notify Team", icon: Bell, defaultEnabled: false },
  { id: "read-market-data", label: "Read Market Data", icon: LineChart, defaultEnabled: true },
  { id: "update-database", label: "Update Database", icon: Database, defaultEnabled: false },
] as const;

type RuleLine = { id: string; field: string; op: string; value: string };

type NestedGroup = { id: string; join: "AND" | "OR"; rules: RuleLine[] };

function newId() {
  return crypto.randomUUID();
}

function createRuleLine(
  overrides: Partial<Pick<RuleLine, "field" | "op" | "value">> = {},
): RuleLine {
  return {
    id: newId(),
    field: overrides.field ?? FIELD_OPTIONS[0],
    op: overrides.op ?? OP_OPTIONS[0],
    value: overrides.value ?? "",
  };
}

function AndOrToggle({
  value,
  onChange,
}: {
  value: "AND" | "OR";
  onChange: (v: "AND" | "OR") => void;
}) {
  return (
    <div className="inline-flex rounded-[24px] border border-[#E6E8EB] bg-white p-0.5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
      {(["AND", "OR"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(
            "h-8 rounded-[24px] px-2 text-[14px] font-medium leading-[1.24] transition-colors",
            value === k
              ? "bg-[#010309] text-white shadow-[0px_2px_6px_rgba(0,0,0,0.16)]"
              : "text-[#4E4F52]",
          )}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-[#E6E8EB] bg-white py-0 pl-3 pr-8 text-left text-[14px] font-normal text-[#353638] accent-auto outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#353638]"
        aria-hidden
      />
    </div>
  );
}

function RuleRowEditor({
  rule,
  onChange,
  onRemove,
  showRemove,
}: {
  rule: RuleLine;
  onChange: (r: RuleLine) => void;
  onRemove?: () => void;
  showRemove: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#D1D5D9] bg-[#F7F8FA] px-3 py-2">
      <button
        type="button"
        className="flex size-6 shrink-0 cursor-grab items-center justify-center text-[#676A6E] active:cursor-grabbing"
        aria-label="Reorder"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("amiio:toast", {
              detail: { message: "Drag reorder (placeholder)" },
            }),
          )
        }
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-[140px] flex-1 sm:max-w-[193px]">
        <SelectField
          value={rule.field}
          onChange={(field) => onChange({ ...rule, field })}
          options={FIELD_OPTIONS}
        />
      </div>
      <div className="min-w-[120px] flex-1 sm:max-w-[149px]">
        <SelectField
          value={rule.op}
          onChange={(op) => onChange({ ...rule, op })}
          options={OP_OPTIONS}
        />
      </div>
      <input
        type="text"
        value={rule.value}
        onChange={(e) => onChange({ ...rule, value: e.target.value })}
        className="h-8 w-[79px] shrink-0 rounded-lg border border-[#D1D5D9] bg-white px-3 text-right text-[14px] text-[#353638] accent-auto outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
        aria-label="Value"
      />
      {showRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="flex size-8 shrink-0 items-center justify-center text-[#676A6E] hover:text-[#9F2D3A]"
          aria-label="Remove rule"
        >
          <Trash2 className="size-4" />
        </button>
      ) : (
        <div className="size-8 shrink-0" aria-hidden />
      )}
    </div>
  );
}

export type InsightRuleEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "new" | "edit";
  initialName?: string;
  initialDescription?: string;
  initialTypeChips?: string[];
};

export function InsightRuleEditorDialog({
  open,
  onOpenChange,
  mode,
  initialName = "",
  initialDescription = "",
  initialTypeChips,
}: InsightRuleEditorDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<"insight" | "task">("insight");
  const [assignedPickerOpen, setAssignedPickerOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<string>(FREQUENCY_OPTIONS[0]);
  const [alertThreshold, setAlertThreshold] = useState<string>(ALERT_THRESHOLD_OPTIONS[0]);
  const [taskType, setTaskType] = useState<string>(TASK_TYPE_OPTIONS[0]);
  const [agentPermissions, setAgentPermissions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(AGENT_PERMISSION_ITEMS.map((item) => [item.id, item.defaultEnabled])),
  );
  const [mainRules, setMainRules] = useState<RuleLine[]>([]);
  const [mainJoins, setMainJoins] = useState<("AND" | "OR")[]>([]);
  const [nestedGroups, setNestedGroups] = useState<NestedGroup[]>([]);
  /** Avoid infinite loops: parent may pass a new `initialTypeChips` array every render. */
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setName(mode === "new" ? "Lease Expiry Monitor" : initialName || "WAULT Decrease");
      setDescription(
        mode === "new"
          ? "Decreases greater than 5%"
          : initialDescription || "Decreases greater than 5%",
      );
      setChips(
        mode === "new"
          ? ["Financial", "Commercial"]
          : initialTypeChips?.length
            ? [...initialTypeChips]
            : ["Financial"],
      );
      setFrequency(FREQUENCY_OPTIONS[0]);
      setAlertThreshold(ALERT_THRESHOLD_OPTIONS[0]);
      setTaskType(TASK_TYPE_OPTIONS[0]);
      setEditorTab(mode === "new" ? "task" : "insight");
      setAssignedUsers(mode === "new" ? ["Tomer Zakai"] : []);
      setAgentPermissions(
        Object.fromEntries(AGENT_PERMISSION_ITEMS.map((item) => [item.id, item.defaultEnabled])),
      );
      setMainRules([
        createRuleLine({
          field: "WAULT Increase",
          op: "Greater than",
          value: "34",
        }),
        createRuleLine({
          field: "WAULT Increase",
          op: "Greater than",
          value: "34",
        }),
      ]);
      setMainJoins(["AND", "AND"]);
      setNestedGroups([
        {
          id: newId(),
          join: "OR",
          rules: [
            createRuleLine({
              field: "WAULT Increase",
              op: "Greater than",
              value: "34",
            }),
          ],
        },
      ]);
    }
    wasOpenRef.current = open;
  }, [open, mode, initialName, initialDescription]);

  const removeChip = (label: string) => {
    setChips((c) => c.filter((x) => x !== label));
  };

  const addType = (t: string) => {
    setChips((c) => (c.includes(t) ? c : [...c, t]));
    setTypePickerOpen(false);
  };

  const addMainCondition = () => {
    setMainRules((r) => [...r, createRuleLine()]);
    setMainJoins((j) => [...j, "AND"]);
  };

  const removeMainRule = (id: string) => {
    setMainRules((rules) => {
      const idx = rules.findIndex((x) => x.id === id);
      if (idx < 0 || rules.length <= 1) return rules;
      const next = rules.filter((x) => x.id !== id);
      setMainJoins((j) => {
        const copy = [...j];
        if (idx < copy.length) copy.splice(idx, 1);
        while (copy.length < next.length) copy.push("AND");
        while (copy.length > next.length) copy.pop();
        return copy.length ? copy : ["AND"];
      });
      return next;
    });
  };

  const updateMainRule = (id: string, next: RuleLine) => {
    setMainRules((rules) => rules.map((r) => (r.id === id ? next : r)));
  };

  const addNestedCondition = (groupId: string) => {
    setNestedGroups((groups) =>
      groups.map((g) =>
        g.id === groupId ? { ...g, rules: [...g.rules, createRuleLine()] } : g,
      ),
    );
  };

  const addNestedGroup = () => {
    setNestedGroups((g) => [
      ...g,
      { id: newId(), join: "OR", rules: [createRuleLine()] },
    ]);
  };

  const removeNestedRule = (groupId: string, ruleId: string) => {
    setNestedGroups((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        if (g.rules.length <= 1) return g;
        return { ...g, rules: g.rules.filter((r) => r.id !== ruleId) };
      }),
    );
  };

  const updateNestedRule = (groupId: string, next: RuleLine) => {
    setNestedGroups((groups) =>
      groups.map((g) =>
        g.id === groupId
          ? { ...g, rules: g.rules.map((r) => (r.id === next.id ? next : r)) }
          : g,
      ),
    );
  };

  const title = mode === "new" ? "New Insight" : "Edit Insight";
  const availableTypes = TYPE_OPTIONS.filter((t) => !chips.includes(t));
  const availableUsers = USER_OPTIONS.filter((u) => !assignedUsers.includes(u));

  const removeAssignedUser = (label: string) => {
    setAssignedUsers((prev) => prev.filter((u) => u !== label));
  };

  const addAssignedUser = (label: string) => {
    setAssignedUsers((prev) => (prev.includes(label) ? prev : [...prev, label]));
    setAssignedPickerOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(90vh,956px)] max-w-[min(832px,calc(100vw-24px))] gap-0 overflow-y-auto rounded-xl border-0 bg-[#F0F2F5] p-6 sm:p-8 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 flex size-6 items-center justify-center rounded text-[#353638] hover:bg-black/5"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="mx-auto flex w-full max-w-[min(680px,100%)] flex-col items-stretch gap-6">
          <div className="flex items-end gap-7 border-b border-[#D1D5D9]">
            {([
              { id: "insight" as const, label: mode === "new" ? "New Insight" : "Edit Insight" },
              { id: "task" as const, label: mode === "new" ? "New Task" : "Edit Task" },
            ]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEditorTab(tab.id)}
                className={cn(
                  "relative pb-3 text-[16px] font-medium leading-[1.24] transition-colors",
                  editorTab === tab.id ? "text-[#121314]" : "text-[#7E8185] hover:text-[#4E4F52]",
                )}
              >
                {tab.label}
                {editorTab === tab.id ? (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#010309] shadow-[0px_1px_4px_rgba(0,0,0,0.24)]" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#D1D5D9] bg-white px-3 text-[14px] text-[#353638] accent-auto outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
              />
            </label>
            {editorTab === "task" ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">Type</span>
                <SelectField
                  value={taskType}
                  onChange={setTaskType}
                  options={TASK_TYPE_OPTIONS}
                  className="w-full"
                />
              </label>
            ) : null}
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">
                Description
              </span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#D1D5D9] bg-white px-3 text-[14px] text-[#353638] accent-auto outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">Frequency</span>
                <SelectField
                  value={frequency}
                  onChange={setFrequency}
                  options={FREQUENCY_OPTIONS}
                  className="w-full"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">
                  Alert threshold
                </span>
                <SelectField
                  value={alertThreshold}
                  onChange={setAlertThreshold}
                  options={ALERT_THRESHOLD_OPTIONS}
                  className="w-full"
                />
              </label>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">Assigned</span>
              <Popover open={assignedPickerOpen} onOpenChange={setAssignedPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-lg border border-[#E6E8EB] bg-white px-3 py-1 text-left outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
                  >
                    {assignedUsers.map((u) => (
                      <span
                        key={u}
                        className="inline-flex h-6 items-center gap-1 rounded-full bg-[#ECEEF2] pl-2 pr-1 text-[13px] text-[#353638]"
                      >
                        {u}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAssignedUser(u);
                          }}
                          className="flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
                          aria-label={`Remove ${u}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    <ChevronDown
                      className={cn(
                        "ml-auto size-4 shrink-0 text-[#353638]",
                        assignedUsers.length === 0 && "ml-0",
                      )}
                      aria-hidden
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[240px] max-w-sm p-2" align="start">
                  {availableUsers.length === 0 ? (
                    <p className="px-2 py-1.5 text-[14px] text-muted-foreground">
                      All users assigned
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-0.5">
                      {availableUsers.map((u) => (
                        <li key={u}>
                          <button
                            type="button"
                            className="w-full rounded-md px-2 py-2 text-left text-[14px] text-[#353638] hover:bg-[#F0F2F5]"
                            onClick={() => addAssignedUser(u)}
                          >
                            {u}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            {editorTab === "insight" ? (
              <div className="flex w-full max-w-md flex-col gap-1.5 sm:mx-auto sm:max-w-[342px]">
                <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">
                  Type
                </span>
                <Popover open={typePickerOpen} onOpenChange={setTypePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-lg border border-[#E6E8EB] bg-white px-3 py-1 text-left outline-none focus-visible:[outline:2px_solid_Highlight] focus-visible:[outline-offset:2px]"
                    >
                      {chips.map((c) => (
                        <span
                          key={c}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-[#D3D9F8] pl-2 pr-1 text-[14px] text-[#353638]"
                        >
                          {c}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeChip(c);
                            }}
                            className="flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
                            aria-label={`Remove ${c}`}
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <ChevronDown
                        className={cn(
                          "ml-auto size-4 shrink-0 text-[#353638]",
                          chips.length === 0 && "ml-0",
                        )}
                        aria-hidden
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[240px] max-w-sm p-2" align="start">
                    {availableTypes.length === 0 ? (
                      <p className="px-2 py-1.5 text-[14px] text-muted-foreground">
                        All types added
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-0.5">
                        {availableTypes.map((t) => (
                          <li key={t}>
                            <button
                              type="button"
                              className="w-full rounded-md px-2 py-2 text-left text-[14px] text-[#353638] hover:bg-[#F0F2F5]"
                              onClick={() => addType(t)}
                            >
                              {t}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            ) : null}
          </div>

          {editorTab === "insight" ? (
          <div className="flex w-full min-w-0 flex-col gap-1.5">
            <span className="text-[14px] font-normal leading-[1.24] text-[#4E4F52]">
              Conditions
            </span>
            <div className="relative min-h-[280px] w-full rounded-xl bg-white p-4 sm:p-5">
              {mainRules.map((rule, idx) => (
                <div key={rule.id} className="mb-3 flex flex-col gap-3 pl-0 sm:pl-14">
                  <AndOrToggle
                    value={mainJoins[idx] ?? "AND"}
                    onChange={(v) =>
                      setMainJoins((j) => {
                        const copy = [...j];
                        while (copy.length < mainRules.length) copy.push("AND");
                        copy[idx] = v;
                        return copy;
                      })
                    }
                  />
                  <RuleRowEditor
                    rule={rule}
                    onChange={(r) => updateMainRule(rule.id, r)}
                    onRemove={() => removeMainRule(rule.id)}
                    showRemove={mainRules.length > 1}
                  />
                </div>
              ))}

              {nestedGroups.map((group) => (
                <div
                  key={group.id}
                  className="mb-3 rounded-xl border border-[#D1D5D9] bg-[#D1D5D9] p-1"
                >
                  <div className="space-y-3 rounded-[10px] bg-[#F7F8FA] p-3">
                    <AndOrToggle
                      value={group.join}
                      onChange={(v) =>
                        setNestedGroups((gs) =>
                          gs.map((g) => (g.id === group.id ? { ...g, join: v } : g)),
                        )
                      }
                    />
                    {group.rules.map((r) => (
                      <RuleRowEditor
                        key={r.id}
                        rule={r}
                        onChange={(next) => updateNestedRule(group.id, next)}
                        onRemove={() => removeNestedRule(group.id, r.id)}
                        showRemove={group.rules.length > 1}
                      />
                    ))}
                    <div className="flex flex-wrap gap-4 pl-1 pt-1">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[14px] font-medium text-[#4E4F52] hover:text-[#010309]"
                        onClick={() => addNestedCondition(group.id)}
                      >
                        <Plus className="size-4" />
                        Add condition
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[14px] font-medium text-[#4E4F52] hover:text-[#010309]"
                        onClick={addNestedGroup}
                      >
                        <Plus className="size-4" />
                        Add Group
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex flex-wrap gap-4 border-t border-[#E6E8EB] pt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[14px] font-medium text-[#4E4F52] hover:text-[#010309]"
                  onClick={addMainCondition}
                >
                  <Plus className="size-4" />
                  Add condition
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[14px] font-medium text-[#4E4F52] hover:text-[#010309]"
                  onClick={addNestedGroup}
                >
                  <Plus className="size-4" />
                  Add Group
                </button>
              </div>
            </div>
          </div>
          ) : null}

          {editorTab === "task" ? (
            <div className="flex w-full min-w-0 flex-col gap-2">
              <h3 className="text-[14px] font-semibold uppercase tracking-[0.06em] text-[#7E8185]">
                Agent Permissions
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {AGENT_PERMISSION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const checked = agentPermissions[item.id] ?? false;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-[rgba(230,231,232,0.9)] bg-white px-4 py-3 shadow-[0px_1px_4px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F8FA] text-[#676A6E]">
                          <Icon className="size-4" strokeWidth={1.75} />
                        </span>
                        <span className="truncate text-[14px] font-medium text-[#121314]">
                          {item.label}
                        </span>
                      </div>
                      <Switch
                        checked={checked}
                        onCheckedChange={(next) =>
                          setAgentPermissions((prev) => ({ ...prev, [item.id]: next }))
                        }
                        className="data-[state=checked]:bg-[#010309] data-[state=unchecked]:bg-[#E6E8EB]"
                        aria-label={`Toggle ${item.label}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-center gap-[19px] pt-2 sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 items-center justify-center rounded-[32px] border border-[#E6E8EB] bg-white px-3.5 text-[14px] font-medium text-[#969A9E] hover:bg-[#F7F8FA]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", {
                    detail: {
                      message:
                        mode === "new" ? "Insight submitted (demo)" : "Insight saved (demo)",
                    },
                  }),
                );
                onOpenChange(false);
              }}
              className="flex h-10 items-center justify-center rounded-[32px] bg-[#010309] px-3.5 text-[14px] font-medium text-[#F0F2F5] hover:bg-[#020410]"
            >
              Submit
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
