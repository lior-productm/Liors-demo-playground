"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ReportPlRow } from "@/src/lib/reportingMockData";
import { ReportEditApprovalMark } from "@/src/components/reporting/ReportEditApprovalMark";

type EditableField = "account" | "budget" | "q1Actual" | "vsBudget";

function Cell({
  children,
  className,
  highlight,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center px-2 text-[11px] leading-[1.24] text-[#353638]",
        highlight && "border-x border-[#B3B8BD] bg-[#FBFBFB]",
        align === "right" && "justify-end text-right",
        className,
      )}
    >
      {children}
    </div>
  );
}

function EditableCell({
  value,
  editable,
  align = "left",
  highlight,
  className,
  pending,
  onChange,
  onApprove,
  onReject,
}: {
  value: string;
  editable: boolean;
  align?: "left" | "right";
  highlight?: boolean;
  className?: string;
  pending?: boolean;
  onChange?: (value: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  if (!editable) {
    return (
      <Cell highlight={highlight} align={align} className={className}>
        {value}
      </Cell>
    );
  }

  return (
    <Cell
      highlight={highlight}
      align={align}
      className={cn("relative p-0", className)}
    >
      <div className="flex h-full w-full min-w-0 items-center gap-0.5 pr-0.5">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-2 text-[11px] leading-[1.24] text-[#353638] outline-none",
            align === "right" && "text-right",
            pending && "font-medium text-[#353638]",
          )}
        />
        {pending ? (
          <ReportEditApprovalMark onApprove={onApprove!} onReject={onReject!} />
        ) : null}
      </div>
    </Cell>
  );
}

function RowShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[112px_256px_1fr_90px_1fr_1fr] border-b border-[#F2F2F2]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type CellEditHandlers = {
  getValue: (field: EditableField, fallback: string) => string;
  isPending: (field: EditableField) => boolean;
  onChange: (field: EditableField, value: string) => void;
  onApprove: (field: EditableField) => void;
  onReject: (field: EditableField) => void;
};

function PlRow({
  row,
  rowIndex,
  editable,
  cellEdit,
}: {
  row: ReportPlRow;
  rowIndex: number;
  editable: boolean;
  cellEdit: CellEditHandlers;
}) {
  const cell = (field: EditableField, fallback = "") => ({
    value: cellEdit.getValue(field, (row[field] as string | undefined) ?? fallback),
    pending: cellEdit.isPending(field),
    onChange: (value: string) => cellEdit.onChange(field, value),
    onApprove: () => cellEdit.onApprove(field),
    onReject: () => cellEdit.onReject(field),
  });

  switch (row.kind) {
    case "bank-start":
    case "bank-end":
      return (
        <RowShell className="border-b border-[#B3B8BD] bg-white">
          <Cell className="font-medium">{row.category}</Cell>
          <EditableCell editable={editable} {...cell("account", row.account)} />
          <Cell />
          <Cell />
          <EditableCell
            editable={editable}
            align="right"
            className="font-semibold"
            {...cell("q1Actual", row.q1Actual ?? "")}
          />
          <EditableCell
            editable={editable}
            align="right"
            className="font-semibold"
            {...cell("vsBudget", row.vsBudget ?? "")}
          />
        </RowShell>
      );

    case "column-header":
      return (
        <RowShell className="border-b border-[#F2F2F2] bg-[#F2F2F2]">
          <Cell className="font-medium text-[#4E4F52]">{row.category}</Cell>
          <Cell className="font-medium text-[#4E4F52]">{row.account}</Cell>
          <Cell align="right" className="font-medium text-[#4E4F52]">
            {row.budget}
          </Cell>
          <Cell />
          <Cell align="right" className="font-medium text-[#4E4F52]">
            {row.q1Actual}
          </Cell>
          <Cell align="right" className="font-medium text-[#4E4F52]">
            {row.vsBudget}
          </Cell>
        </RowShell>
      );

    case "section":
      return (
        <RowShell className="bg-white">
          <Cell className="font-medium">{row.category}</Cell>
          <EditableCell editable={editable} {...cell("account", row.account)} />
          <EditableCell
            editable={editable}
            align="right"
            highlight
            {...cell("budget", row.budget ?? "")}
          />
          <Cell />
          <EditableCell
            editable={editable}
            align="right"
            {...cell("q1Actual", row.q1Actual ?? "")}
          />
          <EditableCell
            editable={editable}
            align="right"
            {...cell("vsBudget", row.vsBudget ?? "")}
          />
        </RowShell>
      );

    case "subtotal":
      return (
        <RowShell className="border-t-2 border-[#B3B8BD] bg-[#F2F2F2] shadow-[0_4px_4px_rgba(0,0,0,0.08)]">
          <Cell />
          <Cell className="font-semibold">{row.account}</Cell>
          <Cell align="right" highlight className="font-bold">
            {row.budget}
          </Cell>
          <Cell />
          <Cell align="right" className="font-bold">
            {row.q1Actual}
          </Cell>
          <Cell align="right" className="font-semibold">
            {row.vsBudget}
          </Cell>
        </RowShell>
      );

    case "highlight":
      return (
        <RowShell>
          <Cell />
          <Cell className="font-medium">{row.account}</Cell>
          <Cell align="right" highlight className="font-medium">
            {row.budget}
          </Cell>
          <Cell />
          <Cell align="right" className="font-medium">
            {row.q1Actual}
          </Cell>
          <Cell align="right" className="font-medium">
            {row.vsBudget}
          </Cell>
        </RowShell>
      );

    case "profit":
      return (
        <RowShell className="border-t-2 border-[#B3B8BD] bg-[#F2F2F2]">
          <Cell className="font-medium">{row.category}</Cell>
          <Cell />
          <Cell align="right" highlight className="font-medium">
            {row.budget}
          </Cell>
          <Cell />
          <Cell align="right" className="font-medium">
            {row.q1Actual}
          </Cell>
          <Cell align="right" className="font-medium">
            {row.vsBudget}
          </Cell>
        </RowShell>
      );

    case "line":
    default:
      return (
        <RowShell>
          <Cell />
          <EditableCell editable={editable} {...cell("account", row.account)} />
          <EditableCell
            editable={editable}
            align="right"
            highlight
            {...cell("budget", row.budget ?? "")}
          />
          <Cell />
          <EditableCell
            editable={editable}
            align="right"
            {...cell("q1Actual", row.q1Actual ?? "")}
          />
          <EditableCell
            editable={editable}
            align="right"
            {...cell("vsBudget", row.vsBudget ?? "")}
          />
        </RowShell>
      );
  }
}

export function ReportPlTable({
  rows,
  editable = false,
  pendingEdits = {},
  onCellDraft,
  onCellApprove,
  onCellReject,
}: {
  rows: ReportPlRow[];
  editable?: boolean;
  pendingEdits?: Record<string, string>;
  onCellDraft?: (rowIndex: number, field: EditableField, value: string) => void;
  onCellApprove?: (rowIndex: number, field: EditableField) => void;
  onCellReject?: (rowIndex: number, field: EditableField) => void;
}) {
  return (
    <div className="overflow-x-auto border-y border-[#B3B8BD]">
      <div className="min-w-[818px]">
        {rows.map((row, index) => {
          const keyFor = (field: EditableField) => `pl:${index}:${field}`;

          return (
            <PlRow
              key={`${row.kind}-${row.account}-${index}`}
              row={row}
              rowIndex={index}
              editable={editable}
              cellEdit={{
                getValue: (field, fallback) =>
                  pendingEdits[keyFor(field)] ?? fallback,
                isPending: (field) => keyFor(field) in pendingEdits,
                onChange: (field, value) => onCellDraft?.(index, field, value),
                onApprove: (field) => onCellApprove?.(index, field),
                onReject: (field) => onCellReject?.(index, field),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export type { EditableField as ReportPlEditableField };
