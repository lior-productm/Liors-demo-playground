"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownAZ, ArrowUpAZ, Calendar, Check, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ColumnSortDir = "asc" | "desc" | null;
export type DateRange = { from: string; to: string };

type CommonProps = {
  label: string;
  active: boolean;
  sortDir: ColumnSortDir;
  onSort: (dir: ColumnSortDir) => void;
};

type SelectProps = CommonProps & {
  variant: "select";
  options: string[];
  appliedValues: string[] | null;
  onApplyValues: (values: string[] | null) => void;
};

type DateProps = CommonProps & {
  variant: "date";
  appliedRange: DateRange | null;
  onApplyRange: (range: DateRange | null) => void;
};

type Props = SelectProps | DateProps;

function SortRow({
  icon,
  label,
  bordered,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  bordered?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-3 text-left text-[14px] font-normal leading-[1.24] text-[#353638] transition-colors hover:bg-[#E6E8EB]/60",
        bordered && "border-b border-[#E6E8EB]",
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-[#676A6E]">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
    </button>
  );
}

function FilterCheckbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex h-10 w-full items-center gap-2.5 rounded px-3 text-left transition-colors",
        checked ? "bg-[#E6E8EB]" : "bg-transparent hover:bg-[#E6E8EB]/60",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-[#010309] bg-[#010309] text-white"
            : "border-[#B3B8BD] bg-white",
        )}
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="truncate text-[16px] font-normal leading-[1.25] text-[#353638]">
        {label}
      </span>
    </button>
  );
}

export function InsightsColumnFilter(props: Props) {
  const { label, active, sortDir, onSort } = props;
  const [open, setOpen] = useState(false);
  const isSelect = props.variant === "select";

  const [draftValues, setDraftValues] = useState<string[]>([]);
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");

  useEffect(() => {
    if (!open) return;
    if (props.variant === "select") {
      setDraftValues(props.appliedValues ?? [...props.options]);
    } else {
      setDraftFrom(props.appliedRange?.from ?? "");
      setDraftTo(props.appliedRange?.to ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filterHeading =
    label === "Date"
      ? "Filter Date"
      : label === "Creator"
        ? "Filter Creator"
        : `Filter ${label}`;

  const handleApply = () => {
    if (props.variant === "select") {
      const allSelected = draftValues.length === props.options.length;
      props.onApplyValues(allSelected || draftValues.length === 0 ? null : draftValues);
    } else if (draftFrom && draftTo) {
      const [from, to] = draftFrom <= draftTo ? [draftFrom, draftTo] : [draftTo, draftFrom];
      props.onApplyRange({ from, to });
    } else {
      props.onApplyRange(null);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClearAll = () => {
    onSort(null);
    if (props.variant === "select") {
      setDraftValues([]);
      props.onApplyValues(null);
    } else {
      setDraftFrom("");
      setDraftTo("");
      props.onApplyRange(null);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Filter and sort ${label}`}
          className={cn(
            "flex size-4 shrink-0 items-center justify-center transition-colors",
            active ? "text-[#233FDE]" : "text-[#676A6E]",
          )}
        >
          <Filter className="size-4" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[260px] rounded-xl border border-[#E6E8EB] bg-[#F0F2F5] p-0 shadow-[0px_10px_28px_rgba(0,0,0,0.14)]"
      >
        <div className="pt-4">
          <SortRow
            icon={<ArrowDownAZ className="size-4" strokeWidth={1.75} />}
            label="Sort A to Z"
            onClick={() => {
              onSort(sortDir === "asc" ? null : "asc");
              setOpen(false);
            }}
          />
          <SortRow
            icon={<ArrowUpAZ className="size-4" strokeWidth={1.75} />}
            label="Sort Z to A"
            bordered
            onClick={() => {
              onSort(sortDir === "desc" ? null : "desc");
              setOpen(false);
            }}
          />
        </div>

        <div className="flex flex-col gap-2 px-4 pb-2 pt-3">
          <p className="text-[14px] font-normal leading-[1.24] text-[#65686B]">
            {filterHeading}
          </p>

          {props.variant === "select" ? (
            <>
              <div className="flex h-10 items-center justify-between border-b border-[#E6E8EB]">
                <button
                  type="button"
                  onClick={() => setDraftValues([])}
                  className="text-[14px] font-medium leading-[1.5] text-[#303552]"
                >
                  Deselect all
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[14px] font-medium leading-[1.5] text-[#070D2F]"
                >
                  Clear all
                </button>
              </div>
              <div className="flex max-h-[200px] flex-col gap-[11px] overflow-y-auto [scrollbar-width:thin]">
                {props.options.length === 0 ? (
                  <p className="py-2 text-[14px] text-[#969A9E]">No values</p>
                ) : (
                  props.options.map((opt) => (
                    <FilterCheckbox
                      key={opt}
                      checked={draftValues.includes(opt)}
                      label={opt}
                      onToggle={() =>
                        setDraftValues((prev) =>
                          prev.includes(opt)
                            ? prev.filter((v) => v !== opt)
                            : [...prev, opt],
                        )
                      }
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pb-1">
              <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D1D5D9] bg-white px-3">
                <Calendar className="size-4 shrink-0 text-[#676A6E]" strokeWidth={1.5} />
                <input
                  type="date"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  aria-label="From date"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#353638] outline-none [color-scheme:light]"
                />
                <span className="shrink-0 text-[14px] text-[#969A9E]">–</span>
                <input
                  type="date"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  aria-label="To date"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#353638] outline-none [color-scheme:light]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E6E8EB] p-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#D1D5D9] bg-white px-3 text-[14px] font-medium leading-[1.24] text-[#4E4F52] transition-colors hover:bg-[#F7F8FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#111111] px-3.5 text-[14px] font-medium leading-[1.24] text-white transition-colors hover:bg-[#010309]"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
