"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Database, FileText, Globe, Paperclip, Type, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CARD_BORDER,
  Eyebrow,
  MODAL_OVERLAY_CLASS,
  ModalCloseButton,
  OutlineButton,
  PrimaryButton,
  TEXT_INPUT_CLASS,
  Tag,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { addSource } from "@/src/lib/aiAnalystSourcesStore";
import { CURRENT_USER_ID } from "@/src/lib/aiAnalystsData";
import { fireToast, uid } from "@/src/lib/aiAnalystsUi";
import type { AnalystId, SourceType } from "@/src/types/aiAnalysts";

const MODES: { key: SourceType; label: string; icon: React.ReactNode }[] = [
  { key: "file", label: "Upload file", icon: <FileText size={20} strokeWidth={1.5} /> },
  { key: "link", label: "Web link", icon: <Globe size={20} strokeWidth={1.5} /> },
  { key: "text", label: "Text input", icon: <Type size={20} strokeWidth={1.5} /> },
];

export function AddSourceModal({
  open,
  analystId,
  onOpenChange,
}: {
  open: boolean;
  analystId: AnalystId;
  onOpenChange: (open: boolean) => void;
}) {
  const [mode, setMode] = useState<SourceType | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [urlDraft, setUrlDraft] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMode(null);
      setFiles([]);
      setLinks([]);
      setUrlDraft("");
      setTitle("");
      setText("");
      setError(null);
    }
  }, [open]);

  const nowMs = () => Date.now();
  const base = (name: string, type: SourceType) => ({
    id: uid("src"),
    analystId,
    name,
    type,
    addedById: CURRENT_USER_ID,
    addedAt: nowMs(),
    lastEditedAt: nowMs(),
  });

  const addLink = () => {
    const v = urlDraft.trim();
    if (!v) return;
    if (!/^https?:\/\//i.test(v)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }
    setLinks((prev) => [...prev, v]);
    setUrlDraft("");
    setError(null);
  };

  const canSubmit =
    (mode === "file" && files.length > 0) ||
    (mode === "link" && (links.length > 0 || urlDraft.trim().length > 0)) ||
    (mode === "text" && text.trim().length > 0);

  const submit = () => {
    if (mode === "file") {
      files.forEach((f) => addSource(base(f, "file")));
      fireToast(`${files.length} file${files.length > 1 ? "s" : ""} added as sources`);
    } else if (mode === "link") {
      const all = [...links];
      const pending = urlDraft.trim();
      if (pending) {
        if (!/^https?:\/\//i.test(pending)) {
          setError("Enter a valid URL starting with http:// or https://");
          return;
        }
        all.push(pending);
      }
      all.forEach((u) => {
        const host = u.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
        addSource({ ...base(host || u, "link"), url: u });
      });
      fireToast(`${all.length} web link${all.length > 1 ? "s" : ""} added as sources`);
    } else if (mode === "text") {
      const name = title.trim() || text.trim().slice(0, 40) + (text.trim().length > 40 ? "…" : "");
      addSource({ ...base(name, "text"), text: text.trim() });
      fireToast(`Source "${name}" added`);
    }
    onOpenChange(false);
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => f.name)]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={MODAL_OVERLAY_CLASS}
        className="flex max-h-[90vh] w-[645px] max-w-[94vw] flex-col gap-0 overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
      >
        <ModalCloseButton onClick={() => onOpenChange(false)} className="right-4 top-4" />

        <div className="flex flex-col gap-2 px-6 pt-6">
          <Eyebrow className="text-[12px] leading-4">New source</Eyebrow>
          <DialogTitle className="text-[16px] font-medium leading-6 tracking-normal text-[#121212]">
            Add a source
          </DialogTitle>
          <DialogDescription className="text-[14px] leading-5 text-[#65686B]">
            Upload files or link a web page. Add as many as you need, then confirm — the analyst
            starts reading them on its next run.
          </DialogDescription>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {mode === null ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={cn(
                    "flex flex-col gap-3 rounded-[12px] bg-white p-4 text-left transition-colors hover:border-[#D1D5D9]",
                    CARD_BORDER,
                  )}
                >
                  <span className="flex items-center justify-between text-[#121212]">
                    {m.icon}
                    <ArrowRight size={16} strokeWidth={1.5} className="text-[#65686B]" />
                  </span>
                  <span className="text-[16px] font-medium leading-6 text-[#121212]">{m.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {mode === "file" ? (
            <div className="flex flex-col gap-3">
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  onFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-3 rounded-[12px] border border-dashed px-6 py-8 text-center transition-colors",
                  dragging ? "border-[#A7B2F2] bg-[#F5F6FD]" : "border-[#D1D5D9] bg-white hover:bg-[#FBFBFB]",
                )}
              >
                <span className="relative flex h-8 w-[88px] items-center justify-center">
                  <IconTile className="-rotate-6 translate-x-[-26px]">
                    <Database size={16} strokeWidth={1.5} />
                  </IconTile>
                  <IconTile className="z-10">
                    <Paperclip size={16} strokeWidth={1.5} />
                  </IconTile>
                  <IconTile className="rotate-6 translate-x-[26px]">
                    <FileText size={16} strokeWidth={1.5} />
                  </IconTile>
                </span>
                <p className="text-[14px] font-medium leading-5 text-[#121212]">Drag files here</p>
                <p className="text-[12px] leading-4 text-[#65686B]">
                  PDF, PNG, JPG, XLSX, CSV - up to 25 MB per file
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
              </div>
              {files.length ? (
                <div className="flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <Tag key={`${f}-${i}`} icon={<Paperclip size={12} strokeWidth={1.5} />} className="font-normal">
                      {f}
                      <button
                        type="button"
                        aria-label={`Remove ${f}`}
                        onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="ml-1 inline-flex text-[#65686B] hover:text-[#010309]"
                      >
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    </Tag>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {mode === "link" ? (
            <div className={cn("flex flex-col gap-3 rounded-[12px] bg-white p-4", CARD_BORDER)}>
              <p className="text-[14px] font-medium leading-5 text-[#121212]">Paste a page URL</p>
              <div className="flex items-center gap-2">
                <label className="flex h-8 flex-1 items-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white px-3">
                  <Globe size={14} strokeWidth={1.5} className="shrink-0 text-[#65686B]" />
                  <input
                    value={urlDraft}
                    onChange={(e) => {
                      setUrlDraft(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                    placeholder="https://companyspace.com/"
                    className="min-w-0 flex-1 bg-transparent text-[12px] leading-4 text-[#353638] outline-none placeholder:text-[#969A9E]"
                  />
                </label>
                <OutlineButton size="sm" className="text-[12px]" onClick={addLink} disabled={!urlDraft.trim()}>
                  Add link
                </OutlineButton>
              </div>
              <p className="text-[12px] leading-4 text-[#65686B]">
                Amiio reads the page and refreshes it on every run.
              </p>
              {links.length ? (
                <div className="flex flex-wrap gap-2">
                  {links.map((l, i) => (
                    <Tag key={`${l}-${i}`} icon={<Globe size={12} strokeWidth={1.5} />} className="max-w-full font-normal">
                      {l}
                      <button
                        type="button"
                        aria-label={`Remove ${l}`}
                        onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                        className="ml-1 inline-flex text-[#65686B] hover:text-[#010309]"
                      >
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    </Tag>
                  ))}
                </div>
              ) : null}
              {error ? <p className="text-[12px] leading-4 text-[#A22D3B]">{error}</p> : null}
            </div>
          ) : null}

          {mode === "text" ? (
            <div className={cn("flex flex-col gap-3 rounded-[12px] bg-white p-4", CARD_BORDER)}>
              <p className="text-[14px] font-medium leading-5 text-[#121212]">
                Paste or type text to add it to this project&apos;s files.
              </p>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] leading-4 text-[#353638]">Title (optional)</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your information"
                  className={cn(TEXT_INPUT_CLASS, "h-8 text-[12px]")}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] leading-4 text-[#353638]">Text</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={9}
                  placeholder="Paste or type your text here..."
                  className="resize-none rounded-[8px] border border-[#D1D5D9] bg-white px-3 py-2.5 text-[12px] leading-4 text-[#353638] outline-none placeholder:text-[#969A9E] focus:border-[#A7B2F2]"
                />
              </label>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E6E8EB] px-6 py-5">
          {mode === null || mode === "text" ? (
            <OutlineButton size="md" onClick={() => (mode === null ? onOpenChange(false) : setMode(null))}>
              Cancel
            </OutlineButton>
          ) : (
            <OutlineButton size="md" onClick={() => setMode(null)}>
              <ArrowLeft size={16} strokeWidth={1.5} /> Back
            </OutlineButton>
          )}
          <PrimaryButton size="md" disabled={!canSubmit} onClick={submit}>
            {mode === "text" ? "Save & Add source" : "Add source"}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IconTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "absolute inline-flex size-8 items-center justify-center rounded-[8px] border border-[#E6E8EB] bg-white text-[#353638] shadow-[0_2px_6px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
