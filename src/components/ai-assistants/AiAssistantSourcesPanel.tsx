"use client";

import { CloudDownload, Database, FileText, Paperclip, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAssistantSource } from "@/src/lib/aiAssistantsData";

/** "New source" primary button — Figma 2453:126538. */
export function NewSourceButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-[32px] bg-[#010309] px-3.5 py-1 text-sm font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#1B1D24]"
    >
      New source
      <Plus className="size-4 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );
}

function SourceRow({
  source,
  onRemove,
}: {
  source: AiAssistantSource;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <Database className="size-[18px] shrink-0 text-[#353638]" strokeWidth={1.75} aria-hidden />
        <span className="truncate text-sm font-medium leading-[1.5] text-[#353638]">
          {source.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-6 items-center justify-center text-[#65686B] transition-colors hover:text-[#353638]"
          aria-label={`Download ${source.name}`}
        >
          <CloudDownload className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onRemove(source.id)}
          className="flex size-6 items-center justify-center text-[#65686B] transition-colors hover:text-[#C65A66]"
          aria-label={`Remove ${source.name}`}
        >
          <X className="size-6" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function FileTile({
  icon: Icon,
  className,
}: {
  icon: typeof Database;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-[8px] border border-[#E6E8EB] bg-[#F2F4F7] p-[7px]",
        className,
      )}
    >
      <Icon className="size-6 text-[#65686B]" strokeWidth={1.5} aria-hidden />
    </div>
  );
}

export function AiAssistantSourcesPanel({
  sources,
  onRemove,
  onUpload,
}: {
  sources: AiAssistantSource[];
  onRemove: (id: string) => void;
  onUpload: () => void;
}) {
  if (sources.length === 0) {
    return (
      <div className="flex w-full flex-col gap-2">
        <p className="text-sm font-medium leading-[1.5] text-[#121212]">
          Give more context to your Analyst
        </p>
        <button
          type="button"
          onClick={onUpload}
          className="flex w-full flex-col items-center justify-center gap-4 rounded-[16px] border-2 border-dashed border-[#D1D5D9] bg-white px-8 py-6 transition-colors hover:border-[#B3B8BD] hover:bg-[#FAFBFC]"
        >
          <div className="flex items-center">
            <FileTile icon={Database} className="mr-[-5px] -rotate-[15deg]" />
            <FileTile icon={Paperclip} className="mr-[-5px] shadow-sm" />
            <FileTile icon={FileText} className="rotate-[13deg]" />
          </div>
          <p className="text-sm font-normal leading-[1.4] text-[#65686B]">
            Drag your files or{" "}
            <span className="font-medium text-[#121212]">click to upload</span>
          </p>
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[13px]">
      {sources.map((source) => (
        <SourceRow key={source.id} source={source} onRemove={onRemove} />
      ))}
    </div>
  );
}
