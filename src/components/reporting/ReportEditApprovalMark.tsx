import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function plEditKey(rowIndex: number, field: string) {
  return `pl:${rowIndex}:${field}`;
}

export function proseEditKey(
  sectionId: string,
  blockIndex: number,
  paragraphIndex: number,
) {
  return `prose:${sectionId}:${blockIndex}:${paragraphIndex}`;
}

export function ReportEditApprovalMark({
  onApprove,
  onReject,
  className,
}: {
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-0.5 rounded-md border border-[#E6E8EB] bg-white p-0.5 shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={onApprove}
        className="flex size-5 items-center justify-center rounded text-[#2E7D32] hover:bg-[#E8F5E9]"
        aria-label="Approve change"
        title="Keep change"
      >
        <Check className="size-3" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={onReject}
        className="flex size-5 items-center justify-center rounded text-[#65686B] hover:bg-[#F0F2F5]"
        aria-label="Discard change"
        title="Discard change"
      >
        <X className="size-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
