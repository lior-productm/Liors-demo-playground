"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import type { LeaseRow } from "@/src/types/commercial";
import { Button } from "@/components/ui/button";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function recommendedAction(row: LeaseRow) {
  const delta = row.deltaPct;
  if (row.status === "Renewal" && delta >= 3) {
    return "Initiate renewal at a +3–7% step-up with a 2-year term and annual CPI-linked escalator.";
  }
  if (row.status === "Expiring" && delta >= 3) {
    return "Prepare shortlist of 3 renewal-ready tenants and negotiate market spread using updated comps.";
  }
  if (delta < 0) {
    return "Run a rent recovery plan and validate tenant sales/footfall drivers; target a renegotiation only if lease economics remain favorable.";
  }
  return "Propose renewal with a conservative step-up and confirm market rent within the next 30 days.";
}

export function LeaseDetailsModal({
  open,
  row,
  onClose,
}: {
  open: boolean;
  row: LeaseRow | null;
  onClose: () => void;
}) {
  const [generated, setGenerated] = useState(false);
  if (open && generated) {
    // Keep generated state until close, but reset on next open.
  }

  const deltaText = useMemo(() => {
    if (!row) return "";
    const sign = row.deltaPct >= 0 ? "+" : "";
    return `${sign}${row.deltaPct.toFixed(1)}%`;
  }, [row]);

  const deltaColor = row
    ? row.deltaPct >= 0
      ? "text-accent"
      : "text-destructive"
    : "text-foreground";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setGenerated(false);
          onClose();
        } else {
          setGenerated(false);
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        {!row ? null : (
          <>
            <DialogHeader>
              <DialogTitle>{row.assetName}</DialogTitle>
              <DialogDescription>
                {row.assetType} · Status: {row.status}
              </DialogDescription>
            </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Lease end
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">
                {formatDate(row.leaseEnd)}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-muted-foreground">
                Start: {formatDate(row.leaseStart)}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Rent delta vs market
              </div>
              <div className={`mt-1 text-sm font-bold ${deltaColor}`}>{deltaText}</div>
              <div className="mt-1 text-[11px] font-semibold text-muted-foreground">
                Confidence: {row.confidencePct}%
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current rent (per sqm)
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">
                ${row.currentRentPerSqm.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Market rent (per sqm)
              </div>
              <div className="mt-1 text-sm font-bold text-foreground">
                ${row.marketRentPerSqm.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </AmiioAiDisclaimerTrigger>
              <div className="text-sm font-bold text-foreground">
                Recommended negotiation notes
              </div>
            </div>
            <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {recommendedAction(row)}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <AmiioAiDisclaimerTrigger>
                <Button
                  type="button"
                  disabled={generated}
                  onClick={() => setGenerated(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {generated ? "Notes generated" : "Generate notes"}
                </Button>
              </AmiioAiDisclaimerTrigger>
              {generated && (
                <div className="text-[11px] font-semibold text-accent">
                  Ready. You can copy and use it in your commercial update.
                </div>
              )}
            </div>
          </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

