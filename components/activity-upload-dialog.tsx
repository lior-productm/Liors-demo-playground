"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ActivityUploadDialog({
  open,
  onOpenChange,
  activityLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityLabel: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [open]);

  const applyFile = useCallback((file: File | undefined) => {
    if (file) setFileName(file.name);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!fileName) {
      window.dispatchEvent(
        new CustomEvent("amiio:toast", { detail: { message: "Choose a file to upload." } }),
      );
      return;
    }
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `${activityLabel} uploaded: ${fileName}` },
      }),
    );
    onOpenChange(false);
  }, [activityLabel, fileName, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-medium text-[#2C2C2C]">
            Upload {activityLabel || "file"}
          </DialogTitle>
          <DialogDescription className="text-[14px] leading-relaxed text-[#65686B]">
            Add a file from your device. You can also drag and drop into the area below.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          onChange={(e) => applyFile(e.target.files?.[0])}
        />

        <label
          htmlFor={inputId}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            applyFile(e.dataTransfer.files?.[0]);
          }}
          className="flex min-h-[152px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D1D5D9] bg-[#FAFBFC] px-4 py-8 text-center text-[14px] text-[#65686B] transition-colors hover:border-[#233FDE]/50 hover:bg-[#F3F6FA]"
        >
          <Upload className="h-9 w-9 text-[#969A9E]" aria-hidden />
          <span className="font-medium text-[#353638]">Click to browse</span>
          <span className="text-[13px] text-[#7E8185]">or drop a file here</span>
          {fileName ? (
            <span className="mt-1 max-w-full truncate px-2 text-[13px] font-medium text-[#233FDE]">
              {fileName}
            </span>
          ) : null}
        </label>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-[#B3B8BD] text-[#010309]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full bg-[#121212] text-[#F0F2F5] hover:bg-[#353638]"
            onClick={handleConfirm}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
