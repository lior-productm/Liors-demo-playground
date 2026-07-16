"use client";

import { Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function TaskDeleteConfirmDialog({
  open,
  taskName,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  taskName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[60] bg-black/20 backdrop-blur-[10px]"
        className="z-[61] max-w-[480px] gap-0 border-0 bg-[#F0F2F5] p-6 shadow-[0px_10px_14px_rgba(0,0,0,0.14)] sm:rounded-xl"
      >
        <DialogClose
          className="absolute right-3 top-[3px] flex size-6 items-center justify-center rounded-full p-2.5 text-[#65686B] transition-colors hover:bg-black/5"
          aria-label="Close"
        >
          <X className="size-4" strokeWidth={1.75} />
        </DialogClose>

        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-4 pt-6">
            <div className="relative h-16 w-[74px]">
              <span className="absolute left-[7px] top-[23px] h-2 w-[29px] rounded-sm bg-[#FBEAEC]" />
              <span className="absolute left-[46px] top-9 h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
              <span className="absolute left-[14px] top-[53px] size-2 rounded-sm bg-[#FBEAEC]" />
              <span className="absolute left-[39px] top-[53px] h-2 w-[23px] rounded-sm bg-[#E6E7E8]" />
              <span className="absolute left-[35px] top-[3px] h-2 w-[27px] rounded-sm bg-[#FBEAEC]" />
              <span className="absolute left-1/2 top-2 flex size-[46px] -translate-x-1/2 items-center justify-center rounded-full bg-[#9F2D3A]">
                <Trash2 className="size-5 text-white" strokeWidth={1.75} aria-hidden />
              </span>
            </div>
            <div className="flex w-full flex-col items-center gap-2 text-center text-[#353638]">
              <DialogTitle className="text-[24px] font-medium leading-[1.25] text-[#353638]">
                Delete task?
              </DialogTitle>
              <DialogDescription className="max-w-[432px] text-[16px] font-normal leading-[1.5] text-[#353638]">
                Are you sure you want to permanently delete &ldquo;{taskName}&rdquo;? Once
                deleted, it cannot be restored.
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
              className="inline-flex h-12 min-w-[104px] items-center justify-center rounded-[32px] bg-[#9F2D3A] px-4 py-2.5 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#8A2733]"
            >
              Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
