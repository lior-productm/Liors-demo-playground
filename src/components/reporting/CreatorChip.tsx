import { cn } from "@/lib/utils";
import {
  OWNERSHIP_LABELS,
  SYSTEM_CREATOR_NAME,
  initialsOf,
  type ItemOwnership,
} from "@/src/lib/reportUser";

/** Small "created by {name}" avatar + label used on template/section cards. */
export function CreatorChip({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const creator = name || SYSTEM_CREATOR_NAME;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-[11px] text-[#65686B]",
        className,
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E6E8EB] text-[9px] font-medium leading-none text-[#2C2C2C]">
        {initialsOf(creator)}
      </span>
      <span className="truncate">{creator}</span>
    </span>
  );
}

/** Organization (shared) vs Personal (this user) badge for templates and sections. */
export function OwnershipBadge({
  ownership,
}: {
  ownership: ItemOwnership;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.4px]",
        ownership === "organization"
          ? "bg-[#F0F2F5] text-[#65686B]"
          : "bg-[#EEF0FF] text-[#4C61DB]",
      )}
    >
      {OWNERSHIP_LABELS[ownership]}
    </span>
  );
}

