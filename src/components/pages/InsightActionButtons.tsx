"use client";

import { useState } from "react";
import { FileText, Mail, MessageSquare, Upload } from "lucide-react";
import { ActivityUploadDialog } from "@/components/activity-upload-dialog";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type InsightActionButtonsProps = {
  insightTitle: string;
  /** Sidebar / detail panel — scales with width */
  size?: "default" | "compact";
  className?: string;
};

export function InsightActionButtons({
  insightTitle,
  size = "default",
  className,
}: InsightActionButtonsProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadActivityLabel, setUploadActivityLabel] = useState("");

  const isCompact = size === "compact";

  const btn = cn(
    "inline-flex w-fit max-w-full shrink-0 items-center justify-center rounded-full bg-[#05091F] font-medium text-[#F0F2F5] transition-colors hover:bg-[#0E195B]",
    isCompact
      ? "h-7 gap-1 px-2 text-[11px] leading-none"
      : "h-8 gap-1.5 px-2.5 text-[12px] leading-tight sm:h-9 sm:gap-2 sm:px-3 sm:text-[13px]",
  );

  const iconClass = cn("shrink-0", isCompact ? "size-3" : "size-3.5 sm:size-4");

  const rowClass = cn(
    "flex w-full min-w-0 flex-wrap items-center",
    isCompact ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-2.5",
  );

  return (
    <>
      <div className={cn(rowClass, className)}>
        <button
          type="button"
          onClick={() => {
            setUploadActivityLabel("Transcript");
            setUploadOpen(true);
          }}
          className={btn}
        >
          <MessageSquare className={iconClass} aria-hidden />
          <span className="whitespace-nowrap">Transcript</span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={btn}>
              <Mail className={iconClass} aria-hidden />
              <span className="whitespace-nowrap">Email</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[10rem] border-[#E6E8EB] bg-white text-[#353638]"
          >
            <DropdownMenuItem
              className={cn(
                "cursor-pointer focus:bg-[#F2F4F7]",
                isCompact ? "text-xs" : "text-[14px]",
              )}
              onSelect={() => {
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", {
                    detail: {
                      message: `Send Email — compose for “${insightTitle}”…`,
                    },
                  }),
                );
              }}
            >
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                "cursor-pointer focus:bg-[#F2F4F7]",
                isCompact ? "text-xs" : "text-[14px]",
              )}
              onSelect={() => {
                setUploadActivityLabel("Email");
                setUploadOpen(true);
              }}
            >
              Upload Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={() => {
            setUploadActivityLabel("Notes");
            setUploadOpen(true);
          }}
          className={btn}
        >
          <FileText className={iconClass} aria-hidden />
          <span className="whitespace-nowrap">Notes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadActivityLabel("Document");
            setUploadOpen(true);
          }}
          className={btn}
        >
          <Upload className={iconClass} aria-hidden />
          <span className="whitespace-nowrap">Document</span>
        </button>
      </div>

      <ActivityUploadDialog
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open);
          if (!open) setUploadActivityLabel("");
        }}
        activityLabel={uploadActivityLabel}
      />
    </>
  );
}
