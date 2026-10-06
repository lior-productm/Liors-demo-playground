"use client";

import { useState } from "react";
import { Download, FileText, Globe, MoreVertical, Trash2, Type } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ConfirmDialog,
  EmptyState,
  IconButton,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { TABLE_CONTAINER_CLASS, TableHeaderCell } from "@/src/components/ai-analysts/TasksTable";
import { useAiAnalystSources } from "@/src/hooks/useAiAnalystSources";
import { deleteSource } from "@/src/lib/aiAnalystSourcesStore";
import { fireToast, formatDate } from "@/src/lib/aiAnalystsUi";
import { useI18n } from "@/src/hooks/useI18n";
import type { AnalystId, Source, SourceType } from "@/src/types/aiAnalysts";

const TYPE_ICON: Record<SourceType, React.ReactNode> = {
  file: <FileText size={16} strokeWidth={1.5} />,
  link: <Globe size={16} strokeWidth={1.5} />,
  text: <Type size={16} strokeWidth={1.5} />,
};

const COLS = "grid-cols-[160px_minmax(0,1fr)_48px]";

export function SourcesTab({ analystId, query = "" }: { analystId: AnalystId; query?: string }) {
  const { t } = useI18n();
  const q = query.trim().toLowerCase();
  const sources = useAiAnalystSources().filter(
    (s) => s.analystId === analystId && s.name.toLowerCase().includes(q),
  );
  const [pendingDelete, setPendingDelete] = useState<Source | null>(null);

  if (sources.length === 0) {
    return (
      <div className={TABLE_CONTAINER_CLASS}>
        <EmptyState
          title={q ? "No sources match your search" : "No sources added yet"}
          description={
            q
              ? "Try a different keyword or clear the search."
              : "Upload files or link web pages to give this analyst extra context."
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className={TABLE_CONTAINER_CLASS}>
        <div className={cn("grid h-10 items-center gap-4 bg-[#F2F4F7] px-4", COLS)}>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Source</TableHeaderCell>
          <span />
        </div>
        {sources.map((s) => (
          <div
            key={s.id}
            className={cn(
              "grid h-16 items-center gap-4 border-b border-[#E6E8EB] bg-[#FBFBFB] px-4 text-[14px] leading-5 text-[#353638] last:border-b-0",
              COLS,
            )}
          >
            <span className="truncate">{formatDate(s.addedAt)}</span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-[#65686B]">{TYPE_ICON[s.type]}</span>
              <span className="truncate font-medium">{t(s.name)}</span>
            </span>
            <div className="flex justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <IconButton label="Source actions">
                    <MoreVertical size={16} strokeWidth={1.5} />
                  </IconButton>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[200px] rounded-[12px] border border-[#E6E8EB] bg-[#F7F8FA] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
                >
                  <ActionItem
                    icon={<Download size={20} strokeWidth={1.5} />}
                    label="Download"
                    onClick={() => fireToast(`Downloading "${s.name}"…`)}
                  />
                  <ActionItem
                    icon={<Trash2 size={20} strokeWidth={1.5} />}
                    label="Delete"
                    destructive
                    onClick={() => setPendingDelete(s)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        danger
        icon={<Trash2 size={16} strokeWidth={1.5} />}
        title="Delete source?"
        description="Are you sure you want to permanently delete this item? Once deleted, it cannot be restored."
        actionLabel="Delete"
        onAction={() => {
          if (pendingDelete) {
            deleteSource(pendingDelete.id);
            fireToast(`Source "${pendingDelete.name}" removed`);
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}

export function ActionItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-[16px] leading-6 transition-colors hover:bg-[#EEF0F3]",
        destructive ? "text-[#A22D3B]" : "text-[#010309]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
