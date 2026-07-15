"use client";

import { useCallback, useState } from "react";
import { FileImage, FileSpreadsheet, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ExcelSheetInput } from "@/src/lib/commercial-export";

export type WidgetExportMenuProps = {
  variant: "table" | "chart";
  fileName: string;
  captureRef: React.RefObject<HTMLElement | null>;
  /** Single-sheet Excel (tables) */
  excel?: { columns: string[]; rows: (string | number)[][] };
  /** Multi-sheet workbook (tables) */
  excelWorkbook?: ExcelSheetInput[];
  className?: string;
  triggerClassName?: string;
};

function toast(message: string) {
  window.dispatchEvent(
    new CustomEvent("amiio:toast", { detail: { message } }),
  );
}

export function WidgetExportMenu({
  variant,
  fileName,
  captureRef,
  excel,
  excelWorkbook,
  className,
  triggerClassName,
}: WidgetExportMenuProps) {
  const [busy, setBusy] = useState(false);

  const canExcel =
    variant === "table" && Boolean(excel || (excelWorkbook && excelWorkbook.length));

  const handlePng = useCallback(async () => {
    const el = captureRef.current;
    if (!el) {
      toast("Nothing to export");
      return;
    }
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast("PNG export failed");
    } finally {
      setBusy(false);
    }
  }, [captureRef, fileName]);

  const handleExcel = useCallback(async () => {
    try {
      const { downloadExcelSingle, downloadExcelWorkbook } = await import(
        "@/src/lib/commercial-export"
      );
      if (excelWorkbook?.length) {
        await downloadExcelWorkbook(excelWorkbook, fileName);
      } else if (excel) {
        await downloadExcelSingle(excel.columns, excel.rows, fileName);
      }
    } catch {
      toast("Excel export failed");
    }
  }, [excel, excelWorkbook, fileName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={busy}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] text-[#969A9E] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF] disabled:opacity-50",
            triggerClassName,
            className,
          )}
          aria-label="Export options"
          title="Export"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {canExcel && (
          <DropdownMenuItem
            className="cursor-pointer text-[13px]"
            onSelect={(e) => {
              e.preventDefault();
              handleExcel();
            }}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel (.xlsx)
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-[13px]"
          disabled={busy}
          onSelect={(e) => {
            e.preventDefault();
            void handlePng();
          }}
        >
          <FileImage className="h-4 w-4" />
          PNG image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
