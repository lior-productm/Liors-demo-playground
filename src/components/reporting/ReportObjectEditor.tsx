"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportDocumentBlock } from "@/src/lib/reportingMockData";

/**
 * Inline editor for a single report object (block). Adapts its fields to the
 * block type and returns an edited block of the same type. Used by the
 * Template Studio's per-object "Edit" action.
 */

const OBJECT_TYPE_LABEL: Record<ReportDocumentBlock["type"], string> = {
  prose: "Text",
  "pl-table": "P&L table",
  metrics: "KPI metrics",
  updates: "Bullet list",
  heading: "Heading",
  table: "Table",
  chart: "Chart",
  photos: "Photos",
  "ai-summary": "AI Summary",
};

const inputClass =
  "w-full rounded-lg border border-[#E6E8EB] bg-white px-3 py-2 text-[13px] leading-[1.5] text-[#353638] outline-none focus:border-[#A7B2F2]";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[12px] font-medium leading-[1.5] text-[#353638]">
      {children}
    </label>
  );
}

function RowRemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#FBE9E7] hover:text-[#B23A2F]"
      aria-label="Remove row"
    >
      <Trash2 className="size-4" strokeWidth={1.75} />
    </button>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#B3B8BD] px-3 text-[13px] font-medium text-[#65686B] hover:bg-[#FAFBFC]"
    >
      <Plus className="size-4" strokeWidth={2} />
      {label}
    </button>
  );
}

export function ReportObjectEditor({
  block,
  onCancel,
  onSave,
}: {
  block: ReportDocumentBlock;
  onCancel: () => void;
  onSave: (next: ReportDocumentBlock) => void;
}) {
  const [draft, setDraft] = useState<ReportDocumentBlock>(() =>
    structuredClone(block),
  );

  const commit = () => onSave(draft);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[15px] font-semibold leading-[1.25] text-[#05091F]">
              Edit object
            </h3>
            <p className="text-[12px] leading-[1.4] text-[#65686B]">
              {OBJECT_TYPE_LABEL[draft.type]} · changes apply to this object only
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label="Close editor"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
          {draft.type === "heading" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Title</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Subtitle</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.subtitle ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, subtitle: event.target.value })
                  }
                />
              </div>
            </>
          ) : null}

          {draft.type === "prose" ? (
            <div className="flex flex-col gap-3">
              {draft.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-2">
                  <textarea
                    rows={3}
                    className={cn(inputClass, "resize-y")}
                    value={paragraph}
                    onChange={(event) => {
                      const paragraphs = [...draft.paragraphs];
                      paragraphs[index] = event.target.value;
                      setDraft({ ...draft, paragraphs });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        paragraphs: draft.paragraphs.filter((_, i) => i !== index),
                      })
                    }
                  />
                </div>
              ))}
              <AddRowButton
                label="Add paragraph"
                onClick={() =>
                  setDraft({ ...draft, paragraphs: [...draft.paragraphs, ""] })
                }
              />
            </div>
          ) : null}

          {draft.type === "ai-summary" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Headline</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.headline}
                  onChange={(event) =>
                    setDraft({ ...draft, headline: event.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <FieldLabel>Summary paragraphs</FieldLabel>
                {draft.paragraphs.map((paragraph, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      className={cn(inputClass, "resize-y")}
                      value={paragraph}
                      onChange={(event) => {
                        const paragraphs = [...draft.paragraphs];
                        paragraphs[index] = event.target.value;
                        setDraft({ ...draft, paragraphs });
                      }}
                    />
                    <RowRemoveButton
                      onClick={() =>
                        setDraft({
                          ...draft,
                          paragraphs: draft.paragraphs.filter((_, i) => i !== index),
                        })
                      }
                    />
                  </div>
                ))}
                <AddRowButton
                  label="Add paragraph"
                  onClick={() =>
                    setDraft({ ...draft, paragraphs: [...draft.paragraphs, ""] })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Entities (comma separated)</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.entities.join(", ")}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      entities: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>KPIs (comma separated)</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.kpis.join(", ")}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      kpis: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            </>
          ) : null}

          {draft.type === "metrics" ? (
            <div className="flex flex-col gap-3">
              {draft.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={cn(inputClass, "flex-1")}
                    placeholder="Label"
                    value={item.label}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = { ...items[index], label: event.target.value };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <input
                    className={cn(inputClass, "w-[130px]")}
                    placeholder="Value"
                    value={item.value}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = { ...items[index], value: event.target.value };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        items: draft.items.filter((_, i) => i !== index),
                      })
                    }
                  />
                </div>
              ))}
              <AddRowButton
                label="Add KPI"
                onClick={() =>
                  setDraft({
                    ...draft,
                    items: [...draft.items, { label: "New KPI", value: "—" }],
                  })
                }
              />
            </div>
          ) : null}

          {draft.type === "updates" ? (
            <div className="flex flex-col gap-3">
              {draft.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={cn(inputClass, "flex-1")}
                    value={item}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = event.target.value;
                      setDraft({ ...draft, items });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        items: draft.items.filter((_, i) => i !== index),
                      })
                    }
                  />
                </div>
              ))}
              <AddRowButton
                label="Add item"
                onClick={() => setDraft({ ...draft, items: [...draft.items, ""] })}
              />
            </div>
          ) : null}

          {draft.type === "chart" ? (
            <div className="flex flex-col gap-3">
              {draft.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={cn(inputClass, "flex-1")}
                    placeholder="Label"
                    value={item.label}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = { ...items[index], label: event.target.value };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <input
                    className={cn(inputClass, "w-[120px]")}
                    placeholder="Value"
                    value={item.value}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = { ...items[index], value: event.target.value };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    className={cn(inputClass, "w-[84px]")}
                    title="Bar ratio (0–1)"
                    value={item.ratio}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = {
                        ...items[index],
                        ratio: Math.max(0, Math.min(1, Number(event.target.value) || 0)),
                      };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        items: draft.items.filter((_, i) => i !== index),
                      })
                    }
                  />
                </div>
              ))}
              <AddRowButton
                label="Add bar"
                onClick={() =>
                  setDraft({
                    ...draft,
                    items: [...draft.items, { label: "New", value: "0", ratio: 0.5 }],
                  })
                }
              />
            </div>
          ) : null}

          {draft.type === "photos" ? (
            <div className="flex flex-col gap-3">
              {draft.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={cn(inputClass, "flex-1")}
                    placeholder="Caption"
                    value={item.label}
                    onChange={(event) => {
                      const items = [...draft.items];
                      items[index] = { label: event.target.value };
                      setDraft({ ...draft, items });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        items: draft.items.filter((_, i) => i !== index),
                      })
                    }
                  />
                </div>
              ))}
              <AddRowButton
                label="Add photo"
                onClick={() =>
                  setDraft({
                    ...draft,
                    items: [...draft.items, { label: "New photo" }],
                  })
                }
              />
            </div>
          ) : null}

          {draft.type === "table" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Columns (comma separated)</FieldLabel>
                <input
                  className={inputClass}
                  value={draft.columns.join(", ")}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      columns: event.target.value.split(",").map((c) => c.trim()),
                    })
                  }
                />
              </div>
              <FieldLabel>Rows</FieldLabel>
              {draft.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <input
                    className={cn(inputClass, "flex-1")}
                    value={row.join(" | ")}
                    onChange={(event) => {
                      const rows = [...draft.rows];
                      rows[rowIndex] = event.target.value
                        .split("|")
                        .map((cell) => cell.trim());
                      setDraft({ ...draft, rows });
                    }}
                  />
                  <RowRemoveButton
                    onClick={() =>
                      setDraft({
                        ...draft,
                        rows: draft.rows.filter((_, i) => i !== rowIndex),
                      })
                    }
                  />
                </div>
              ))}
              <p className="text-[11px] leading-[1.4] text-[#65686B]">
                Separate cells with “ | ”.
              </p>
              <AddRowButton
                label="Add row"
                onClick={() =>
                  setDraft({
                    ...draft,
                    rows: [...draft.rows, draft.columns.map(() => "")],
                  })
                }
              />
            </div>
          ) : null}

          {draft.type === "pl-table" ? (
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Table title</FieldLabel>
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
              />
              <p className="text-[11px] leading-[1.4] text-[#65686B]">
                Edit individual figures directly in the table cells.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E6E8EB] px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 items-center rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            className="flex h-10 items-center rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
