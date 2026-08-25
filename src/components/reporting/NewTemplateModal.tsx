"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileText, LayoutTemplate, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TEMPLATE_PRESETS,
  listTemplates,
  templateExists,
  type CreateTemplateInput,
} from "@/src/lib/reportTemplates";

const PRESET_ICON = [LayoutTemplate, Sparkles, FileText, FileText];

export function NewTemplateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: CreateTemplateInput) => void;
}) {
  const templates = useMemo(() => listTemplates(), []);
  const [startMode, setStartMode] = useState<"preset" | "duplicate">("preset");
  const [presetId, setPresetId] = useState<string>(TEMPLATE_PRESETS[0].id);
  const [sourceTitle, setSourceTitle] = useState<string>(templates[0]?.title ?? "");
  const [title, setTitle] = useState<string>("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [description, setDescription] = useState<string>("");

  const activePreset = TEMPLATE_PRESETS.find((preset) => preset.id === presetId);

  // Suggested title follows the chosen preset until the user edits it.
  const effectiveTitle =
    titleTouched || title
      ? title
      : startMode === "duplicate"
        ? sourceTitle
          ? `${sourceTitle} (copy)`
          : ""
        : activePreset?.suggestedTitle ?? "";

  const trimmed = effectiveTitle.trim();
  const duplicateName = trimmed.length > 0 && templateExists(trimmed);
  const canCreate = trimmed.length > 0 && !duplicateName;

  const submit = () => {
    if (!canCreate) return;
    onCreate({
      title: trimmed,
      description,
      presetId: startMode === "preset" ? presetId : undefined,
      basedOn: startMode === "duplicate" ? sourceTitle : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
            <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
              Create new template
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Start from */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold leading-[1.25] text-[#05091F]">
              Start from
            </p>
            <div className="inline-flex w-fit rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] p-1">
              <button
                type="button"
                onClick={() => setStartMode("preset")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium leading-[1.24] transition-colors",
                  startMode === "preset"
                    ? "bg-white text-[#111] shadow-sm"
                    : "text-[#65686B] hover:text-[#353638]",
                )}
              >
                <LayoutTemplate className="size-4" strokeWidth={1.75} />
                Preset
              </button>
              <button
                type="button"
                onClick={() => setStartMode("duplicate")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium leading-[1.24] transition-colors",
                  startMode === "duplicate"
                    ? "bg-white text-[#111] shadow-sm"
                    : "text-[#65686B] hover:text-[#353638]",
                )}
              >
                <Copy className="size-4" strokeWidth={1.75} />
                Duplicate existing
              </button>
            </div>

            {startMode === "preset" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {TEMPLATE_PRESETS.map((preset, index) => {
                  const Icon = PRESET_ICON[index % PRESET_ICON.length];
                  const isActive = presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPresetId(preset.id)}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl border p-3.5 text-left transition-colors",
                        isActive
                          ? "border-2 border-[#A7B2F2] bg-[#F7F8FF]"
                          : "border-[#E6E8EB] hover:bg-[#FAFBFC]",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="size-5 text-[#353638]" strokeWidth={1.75} />
                        {isActive ? (
                          <Check className="size-4 text-[#4C61DB]" strokeWidth={2.5} />
                        ) : null}
                      </div>
                      <span className="text-[13px] font-medium leading-[1.3] text-[#05091F]">
                        {preset.name}
                      </span>
                      <span className="text-[11px] leading-[1.4] text-[#65686B]">
                        {preset.description}
                      </span>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {preset.includes.map((section) => (
                          <span
                            key={section}
                            className="inline-flex items-center rounded-full bg-[#F0F2F5] px-2 py-0.5 text-[10px] font-medium text-[#65686B]"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium leading-[1.5] text-[#353638]">
                  Duplicate from
                </label>
                <select
                  value={sourceTitle}
                  onChange={(event) => setSourceTitle(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#E6E8EB] bg-white px-3 text-[13px] font-medium text-[#353638] outline-none focus:border-[#A7B2F2]"
                >
                  {templates.map((template) => (
                    <option key={template.title} value={template.title}>
                      {template.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] leading-[1.4] text-[#65686B]">
                  Copies the source template’s sections, layout and object edits.
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium leading-[1.5] text-[#353638]">
              Template name
            </label>
            <input
              value={effectiveTitle}
              onChange={(event) => {
                setTitleTouched(true);
                setTitle(event.target.value);
              }}
              placeholder="e.g. Q4 2025 Investor Report"
              className={cn(
                "h-11 w-full rounded-lg border bg-white px-3 text-[14px] leading-[1.5] text-[#353638] outline-none",
                duplicateName
                  ? "border-[#B23A2F] focus:border-[#B23A2F]"
                  : "border-[#E6E8EB] focus:border-[#A7B2F2]",
              )}
            />
            {duplicateName ? (
              <p className="text-[11px] leading-[1.4] text-[#B23A2F]">
                A template with this name already exists.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium leading-[1.5] text-[#353638]">
              Description <span className="font-normal text-[#65686B]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              placeholder="What is this template for?"
              className="w-full resize-y rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 text-[13px] leading-[1.5] text-[#353638] outline-none focus:border-[#A7B2F2]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E6E8EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canCreate}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium leading-[1.24] text-white",
              canCreate ? "bg-[#111] hover:bg-[#333]" : "cursor-not-allowed bg-[#B3B8BD]",
            )}
          >
            <Check className="size-4" strokeWidth={2} />
            Create template
          </button>
        </div>
      </div>
    </div>
  );
}
