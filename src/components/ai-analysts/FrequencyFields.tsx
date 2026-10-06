"use client";

import { Calendar, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MONTH_OPTIONS,
  MONTHLY_ON_OPTIONS,
  WEEKDAY_PILLS,
  frequencySummaryParts,
  nextRunLabel,
  validateFrequency,
} from "@/src/lib/aiAnalystScheduling";
import { FREQUENCY_LABEL, defaultFrequencyConfig } from "@/src/lib/aiAnalystsData";
import type { FrequencyConfig, FrequencyKind } from "@/src/types/aiAnalysts";

const KINDS: FrequencyKind[] = ["once", "daily", "weekly", "monthly", "quarterly", "yearly"];

const FIELD =
  "flex h-11 w-full items-center rounded-[8px] border border-[#E6E8EB] bg-[#F7F8FA] px-3 text-[16px] leading-6 text-[#353638] outline-none transition-colors focus:border-[#A7B2F2] focus:bg-white";

// Hide the native date/time picker glyph but keep it clickable over our own icon.
const NATIVE_PICKER =
  "relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

const TRIGGER =
  "h-11 w-full rounded-[8px] border-[#E6E8EB] bg-[#F7F8FA] px-3 text-[16px] leading-6 text-[#353638] shadow-none focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#A7B2F2] [&>svg]:hidden";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-[16px] leading-6 text-[#353638]">{label}</span>
      {children}
    </label>
  );
}

function SelectChevron() {
  return <ChevronDown size={20} strokeWidth={1.5} className="ml-auto shrink-0 text-[#353638]" />;
}

export function FrequencyFields({
  value,
  onChange,
  taskName,
}: {
  value: FrequencyConfig;
  onChange: (freq: FrequencyConfig) => void;
  taskName: string;
}) {
  const { dateError, timeError } = validateFrequency(value);
  const summary = frequencySummaryParts(taskName, value);
  const nextRun = nextRunLabel(value);

  const patch = (p: Partial<FrequencyConfig>) => onChange({ ...value, ...p });

  const toggleWeekday = (d: number) => {
    const set = new Set(value.weekdays ?? []);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    patch({ weekdays: [...set] });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <Field label="Frequency">
          <Select
            value={value.kind}
            onValueChange={(k) => onChange(defaultFrequencyConfig(k as FrequencyKind) as FrequencyConfig)}
          >
            <SelectTrigger className={TRIGGER}>
              <SelectValue />
              <SelectChevron />
            </SelectTrigger>
            <SelectContent>
              {KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k === "once" ? "Once" : FREQUENCY_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {value.kind === "once" ? (
          <Field label="Date">
            <div className="relative">
              <input
                type="date"
                value={value.date ?? ""}
                onChange={(e) => patch({ date: e.target.value })}
                className={cn(FIELD, NATIVE_PICKER, "pr-11", dateError && "border-[#A22D3B]")}
              />
              <Calendar
                size={20}
                strokeWidth={1.5}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#353638]"
              />
            </div>
            {dateError ? <ErrorText>{dateError}</ErrorText> : null}
          </Field>
        ) : null}

        {value.kind === "weekly" ? (
          <Field label="Repeat on">
            <div className="flex h-11 items-center gap-2">
              {WEEKDAY_PILLS.map((label, i) => {
                const active = (value.weekdays ?? []).includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleWeekday(i)}
                    className={cn(
                      "size-9 rounded-full text-[14px] font-medium transition-colors",
                      active
                        ? "bg-[#010309] text-white"
                        : "bg-[#F0F2F5] text-[#65686B] hover:bg-[#E6E8EB]",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>
        ) : null}

        {value.kind === "monthly" ? (
          <Field label="On">
            <Select value={value.monthlyOn} onValueChange={(v) => patch({ monthlyOn: v })}>
              <SelectTrigger className={TRIGGER}>
                <SelectValue />
                <SelectChevron />
              </SelectTrigger>
              <SelectContent>
                {MONTHLY_ON_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        {value.kind === "quarterly" ? (
          <>
            <Field label="Starting">
              <Select
                value={value.quarterlyStart ?? "Q1"}
                onValueChange={(v) => patch({ quarterlyStart: v as FrequencyConfig["quarterlyStart"] })}
              >
                <SelectTrigger className={TRIGGER}>
                  <SelectValue />
                  <SelectChevron />
                </SelectTrigger>
                <SelectContent>
                  {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="On">
              <Select
                value={value.monthlyOn ?? MONTHLY_ON_OPTIONS[0]}
                onValueChange={(v) => patch({ monthlyOn: v })}
              >
                <SelectTrigger className={TRIGGER}>
                  <SelectValue />
                  <SelectChevron />
                </SelectTrigger>
                <SelectContent>
                  {MONTHLY_ON_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </>
        ) : null}

        {value.kind === "yearly" ? (
          <>
            <Field label="Month">
              <Select
                value={String(value.yearlyMonth ?? 0)}
                onValueChange={(v) => patch({ yearlyMonth: Number(v) })}
              >
                <SelectTrigger className={TRIGGER}>
                  <SelectValue />
                  <SelectChevron />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m, i) => (
                    <SelectItem key={m} value={String(i)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Day">
              <input
                type="number"
                min={1}
                max={31}
                value={value.yearlyDay ?? 1}
                onChange={(e) => patch({ yearlyDay: Number(e.target.value) })}
                className={FIELD}
              />
            </Field>
          </>
        ) : null}

        {value.kind === "daily" ? <div className="hidden sm:block" /> : null}

        <Field label="Time">
          <div className="relative">
            <input
              type="time"
              value={value.time}
              onChange={(e) => patch({ time: e.target.value })}
              className={cn(FIELD, NATIVE_PICKER, "pr-11", timeError && "border-[#A22D3B]")}
            />
            <Clock
              size={20}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#353638]"
            />
          </div>
          {timeError ? <ErrorText>{timeError}</ErrorText> : null}
        </Field>

        <Field label="Timezone">
          <Select value={value.timezone} onValueChange={(v) => patch({ timezone: v })}>
            <SelectTrigger className={TRIGGER}>
              <SelectValue />
              <SelectChevron />
            </SelectTrigger>
            <SelectContent>
              {[
                ["Europe/Amsterdam", "Europe/Amsterdam (CET)"],
                ["Europe/London", "Europe/London (GMT)"],
                ["America/New_York", "America/New York (EST)"],
                ["UTC", "UTC"],
              ].map(([tz, label]) => (
                <SelectItem key={tz} value={tz!}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {summary ? (
        <div className="rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] px-5 py-4 text-[16px] leading-6">
          <p className="text-[#353638]">
            {summary.prefix}
            <span className="font-medium text-[#121212]">{summary.bold}</span>
            {summary.suffix}
          </p>
          {nextRun ? <p className="mt-1 text-[#65686B]">Next run: {nextRun}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <span className="text-[14px] leading-5 text-[#A22D3B]">{children}</span>;
}
