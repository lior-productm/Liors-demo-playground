"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { USERS, getUser } from "@/src/lib/aiAnalystsData";
import {
  SearchInput,
  UserAvatar,
  UserChip,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { cn } from "@/lib/utils";

function UserOptionList({
  selectedIds,
  excludeIds,
  query,
  onToggle,
}: {
  selectedIds: string[];
  excludeIds: string[];
  query: string;
  onToggle: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const filtered = USERS.filter(
    (u) => !excludeIds.includes(u.id) && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
  );
  return (
    <div className="max-h-[260px] overflow-y-auto py-1">
      {filtered.length === 0 ? (
        <p className="px-4 py-3 text-[14px] text-[#969A9E]">No team members found</p>
      ) : (
        filtered.map((u) => {
          const checked = selectedIds.includes(u.id);
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onToggle(u.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[#F7F8FA]",
                checked && "bg-[#EBEDF9] hover:bg-[#EBEDF9]",
              )}
            >
              <UserAvatar name={u.name} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] leading-5 text-[#010309]">{u.name}</span>
                <span className="block truncate text-[12px] leading-4 text-[#7E8185]">{u.email}</span>
              </span>
              {checked ? <Check size={16} strokeWidth={1.5} className="text-[#4F65E5]" /> : null}
            </button>
          );
        })
      )}
    </div>
  );
}

/** Single-select owner picker (kept for edit flows; owner defaults to the current user). */
export function OwnerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const owner = getUser(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white px-3 text-[14px] text-[#353638] hover:bg-[#F7F8FA]"
        >
          {owner ? <UserAvatar name={owner.name} size={24} /> : null}
          <span>{owner?.name ?? "Select owner"}</span>
          <ChevronDown size={16} strokeWidth={1.5} className="text-[#65686B]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px] rounded-[12px] border-[#E6E8EB] p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
        <div className="border-b border-[#E6E8EB] p-2">
          <SearchInput size="md" value={query} onChange={setQuery} placeholder="Search team members" autoFocus />
        </div>
        <UserOptionList
          selectedIds={value ? [value] : []}
          excludeIds={[]}
          query={query}
          onToggle={(id) => {
            onChange(id);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/** Multi-select "share with" picker: search field + chips below. */
export function SharedWithPicker({
  value,
  onChange,
  excludeIds = [],
  helperText,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  excludeIds?: string[];
  helperText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  };
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <SearchInput
              size="md"
              value={query}
              onChange={(v) => {
                setQuery(v);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search team members"
              className={cn(open && "shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]")}
              trailing={
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={cn("shrink-0 text-[#65686B] transition-transform", open && "rotate-180")}
                />
              }
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[var(--radix-popover-trigger-width)] rounded-[12px] border-[#E6E8EB] p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
        >
          <UserOptionList selectedIds={value} excludeIds={excludeIds} query={query} onToggle={toggle} />
        </PopoverContent>
      </Popover>

      {helperText ? <p className="text-[14px] leading-5 text-[#65686B]">{helperText}</p> : null}

      {value.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {value.map((id) => {
            const u = getUser(id);
            return u ? <UserChip key={id} name={u.name} onRemove={() => toggle(id)} /> : null;
          })}
        </div>
      ) : null}
    </div>
  );
}
