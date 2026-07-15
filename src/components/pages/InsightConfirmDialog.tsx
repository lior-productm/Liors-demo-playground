"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type InsightConfirmAction = "delete" | "deactivate" | "activate";

type Variant = {
  illustration: React.ReactNode;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  confirmClass: string;
};

function DeleteIllustration() {
  return (
    <div className="relative h-16 w-[74px]">
      <span className="absolute left-[7px] top-[23px] h-2 w-[29px] rounded-sm bg-[#FBEAEC]" />
      <span className="absolute left-[46px] top-9 h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
      <span className="absolute left-[14px] top-[53px] size-2 rounded-sm bg-[#FBEAEC]" />
      <span className="absolute left-[39px] top-[53px] h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
      <span className="absolute left-[35px] top-[3px] h-2 w-[27px] rounded-sm bg-[#FBEAEC]" />
      <span className="absolute left-1/2 top-2 flex size-[46px] -translate-x-1/2 items-center justify-center rounded-full bg-[#9F2D3A]">
        <svg viewBox="0 0 24 24" className="size-6 text-white" fill="none" aria-hidden>
          <path
            d="M9 3h6m-8 4h10m-1 0-.7 11.4a1 1 0 0 1-1 .9H8.7a1 1 0 0 1-1-.9L7 7"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function WarningToggleIllustration() {
  return (
    <div className="relative h-16 w-[74px]">
      <span className="absolute left-[7px] top-[23px] h-2 w-[29px] rounded-sm bg-[#FBF2DC]" />
      <span className="absolute left-[46px] top-9 h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
      <span className="absolute left-[14px] top-[53px] size-2 rounded-sm bg-[#FBF2DC]" />
      <span className="absolute left-[39px] top-[53px] h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
      <span className="absolute left-[35px] top-[3px] h-2 w-[27px] rounded-sm bg-[#FBF2DC]" />
      <span className="absolute left-1/2 top-[9px] flex h-[46px] w-[46px] -translate-x-1/2 items-center justify-center">
        <svg viewBox="0 0 46 46" className="size-[46px]" fill="none" aria-hidden>
          <circle cx="23" cy="23" r="22" stroke="#D1D5D9" strokeWidth="1.5" fill="#F2F4F7" />
          <rect x="13" y="18" width="20" height="10" rx="5" fill="#65686B" />
          <circle cx="18" cy="23" r="3.5" fill="white" />
        </svg>
      </span>
    </div>
  );
}

const VARIANTS: Record<InsightConfirmAction, Variant> = {
  delete: {
    illustration: <DeleteIllustration />,
    title: "Delete insight?",
    body: "Are you sure you want to permanently delete this item? Once deleted, it cannot be restored.",
    confirmLabel: "Delete",
    confirmClass: "bg-[#9F2D3A] text-[#F0F2F5] hover:bg-[#8A2733]",
  },
  deactivate: {
    illustration: <WarningToggleIllustration />,
    title: "Deactivate insight?",
    body: (
      <>
        <p className="mb-0">Are you sure you want to deactivate this insight?</p>
        <p>You can reactivate it from Inactive Insights tab.</p>
      </>
    ),
    confirmLabel: "Deactivate",
    confirmClass: "bg-[#121212] text-[#F0F2F5] hover:bg-[#010309]",
  },
  activate: {
    illustration: <WarningToggleIllustration />,
    title: "Activate an insight",
    body: (
      <>
        <p className="mb-0">Are you sure you want to activate this insight?</p>
        <p>You can deactivate it from Active Insights tab.</p>
      </>
    ),
    confirmLabel: "Activate",
    confirmClass: "bg-[#121212] text-[#F0F2F5] hover:bg-[#010309]",
  },
};

export function InsightConfirmDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
}: {
  action: InsightConfirmAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const variant = VARIANTS[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/20 backdrop-blur-[10px]"
        className="max-w-[480px] gap-0 border-0 bg-[#F0F2F5] p-6 shadow-[0px_10px_14px_rgba(0,0,0,0.14)] sm:rounded-xl"
      >
        <DialogClose
          className="absolute right-3 top-[3px] flex size-6 items-center justify-center rounded-full p-2.5 text-[#65686B] transition-colors hover:bg-black/5"
          aria-label="Close"
        >
          <X className="size-4" strokeWidth={1.75} />
        </DialogClose>

        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-4 pt-6">
            {variant.illustration}
            <div className="flex w-full flex-col items-center gap-2 text-center text-[#353638]">
              <DialogTitle className="text-[24px] font-medium leading-[1.25] text-[#353638]">
                {variant.title}
              </DialogTitle>
              <DialogDescription asChild>
                <div className="max-w-[432px] text-[16px] font-normal leading-[1.5] text-[#353638]">
                  {variant.body}
                </div>
              </DialogDescription>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex h-12 w-[104px] items-center justify-center rounded-[32px] border border-[#B3B8BD] bg-transparent px-3 py-2.5 text-[14px] font-medium leading-[1.24] text-[#2C2C2C] transition-colors hover:bg-white/60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                "inline-flex h-12 min-w-[104px] items-center justify-center rounded-[32px] px-4 py-2.5 text-[14px] font-medium leading-[1.24] transition-colors",
                variant.confirmClass,
              )}
            >
              {variant.confirmLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
