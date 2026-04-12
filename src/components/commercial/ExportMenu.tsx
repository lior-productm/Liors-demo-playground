"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download, MoreVertical, Share2 } from "lucide-react";

type ExportAction = {
  id: string;
  label: string;
  icon: "download" | "share";
};

const actions: ExportAction[] = [
  { id: "pdf", label: "Export PDF", icon: "download" },
  { id: "csv", label: "Export CSV", icon: "download" },
  { id: "share", label: "Share report", icon: "share" },
];

export function ExportMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-3.5 w-3.5" />
        Export
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Export menu"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        >
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Actions
          </div>
          <div className="flex flex-col pb-1">
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none"
                onClick={() => {
                  setOpen(false);
                  // Demo-only: keep it functional without downloading files.
                  // In a real app, this would trigger export.
                  window.dispatchEvent(
                    new CustomEvent("amiio:toast", {
                      detail: { message: `Export triggered: ${a.label}` },
                    }),
                  );
                }}
              >
                {a.icon === "download" ? (
                  <Download className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Share2 className="h-3.5 w-3.5 text-accent" />
                )}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

