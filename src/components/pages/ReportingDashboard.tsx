"use client";

import type { TopNavTabId } from "@/src/types/commercial";
import { TopNav } from "@/src/components/commercial/TopNav";
import { ToastStack } from "@/src/components/commercial/ToastStack";
import { ChatPanel, ResizableChatAside } from "@/src/components/commercial/ChatPanel";
import { EntityPropertyFilterBar } from "@/src/components/commercial/EntityPropertyFilterBar";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ReportingDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--Secondary-Sea-Salt)" }}
    >
      <TopNav activeTab={activeTab} onTabChange={onTabChange} />
      <ToastStack />

      <main className="mx-auto w-full max-w-[1512px] px-8 pb-6 pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <section className="min-w-0 flex-1">
            <div className="mb-4">
              <h1 className="text-[20px] font-extrabold tracking-tight text-foreground">
                Reporting
              </h1>
            </div>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                {["Templates", "Recent", "Builder", "Schedules"].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    className={
                      idx === 0
                        ? "h-[40px] rounded-full bg-foreground px-5 text-[12px] font-semibold text-background"
                        : "h-[40px] rounded-full px-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex shrink-0 justify-end sm:ml-auto">
                <EntityPropertyFilterBar clearToastMessage="Cleared reporting filters" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <div className="rounded-xl border border-border bg-card px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-extrabold text-foreground">Templates</div>
                  <Badge variant="secondary" className="h-6 px-2 text-[10px] font-bold">12</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    ["Commercial dashboard summary", "Monthly"],
                    ["Financial overview pack", "Quarterly"],
                    ["Asset valuation memo", "Ad hoc"],
                    ["Tenant roll update", "Monthly"],
                  ].map((t) => (
                    <button
                      key={t[0]}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-left hover:bg-secondary"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("amiio:toast", { detail: { message: `Selected template: ${t[0]}` } }),
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-extrabold text-foreground">{t[0]}</div>
                        <Badge variant="secondary" className="h-6 px-2 text-[10px] font-bold">{t[1]}</Badge>
                      </div>
                      <div className="mt-1 text-[10px] font-semibold text-muted-foreground">
                        Pre-filled narrative + charts + tables
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card px-4 py-4">
                <div className="text-[12px] font-extrabold text-foreground">Recent reports</div>
                <div className="mt-4 space-y-2">
                  {[
                    ["Monthly report · January 2026", "Completed"],
                    ["Lease expiry memo · Q1 2026", "Completed"],
                    ["Service charges update · Q4 2025", "In review"],
                  ].map((r) => (
                    <div key={r[0]} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold text-foreground truncate">{r[0]}</div>
                        <div className="mt-1 text-[10px] font-semibold text-muted-foreground">Generated by Amiio</div>
                      </div>
                      <Badge variant={r[1] === "Completed" ? "secondary" : "outline"} className="h-6 px-2 text-[10px] font-bold">
                        {r[1]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-card px-4 py-4">
              <div className="text-[12px] font-extrabold text-foreground">Report builder</div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  ["Sections", "14 available"],
                  ["Charts", "22 ready"],
                  ["Tables", "18 ready"],
                ].map((x) => (
                  <div key={x[0]} className="rounded-lg border border-border bg-background px-4 py-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{x[0]}</div>
                    <div className="mt-1 text-[12px] font-extrabold text-foreground">{x[1]}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="rounded-full text-[11px] font-bold">Generate draft</Button>
              </div>
            </div>
          </section>

          <ResizableChatAside>
            <ChatPanel
              messages={chat.messages}
              suggestions={chat.suggestions}
              isTyping={chat.isTyping}
              onSend={chat.onSend}
              onNewChat={chat.onNewChat}
            />
          </ResizableChatAside>
        </div>
      </main>
    </div>
  );
}

