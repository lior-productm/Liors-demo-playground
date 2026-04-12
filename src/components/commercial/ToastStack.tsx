"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type Toast = { id: string; message: string };

export function ToastStack() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ message?: string }>;
      const message = ce.detail?.message;
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [{ id, message }, ...prev].slice(0, 3));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };

    window.addEventListener("amiio:toast", handler as EventListener);
    return () => window.removeEventListener("amiio:toast", handler as EventListener);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-[72px] z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
        >
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-foreground">Done</div>
            <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">
              {t.message}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            aria-label="Dismiss toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

