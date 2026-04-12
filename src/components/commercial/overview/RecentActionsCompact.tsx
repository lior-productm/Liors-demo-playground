"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Wand2 } from "lucide-react";

export function RecentActionsCompact() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="text-[12px] font-extrabold text-foreground">Recent actions</div>

      <div className="mt-4 space-y-2">
        {[
          { icon: FileText, title: "Lease scenario analysis · Q1 2026", who: "From Amiio", when: "2 hours ago", status: "Completed" },
          { icon: Wand2, title: "Monthly rent report · January 2026", who: "Amiio Gen", when: "1 day ago", status: "Completed" },
          { icon: FileText, title: "Vacancy analysis · Use 3", who: "From Amiio", when: "3 days ago", status: "Completed" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.title} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-foreground truncate">{a.title}</div>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                  <span>{a.who}</span>
                  <span>·</span>
                  <span>{a.when}</span>
                </div>
              </div>
              <Badge variant="secondary" className="h-6 gap-1 px-2 text-[10px] font-bold text-accent">
                <CheckCircle2 className="h-4 w-4" />
                {a.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

