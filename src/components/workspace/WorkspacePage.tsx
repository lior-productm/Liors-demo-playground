"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import {
  ChatAside,
  ChatPanel,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { FloatingAmiioChat } from "@/src/components/commercial/FloatingAmiioChat";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { cn } from "@/lib/utils";
import { pinAiAssistant } from "@/src/lib/aiAssistantNavState";
import {
  getAnalystMeta,
  getAnalystPageHref,
  WORKSPACE_ANALYSTS,
  WORKSPACE_OUTPUTS,
  type WorkspaceAnalystId,
  type WorkspaceOutput,
} from "@/src/lib/workspaceOutputsData";
import { WorkspaceOutputsTable } from "@/src/components/workspace/WorkspaceOutputsTable";
import { WorkspaceTaskInfoModal } from "@/src/components/workspace/WorkspaceTaskInfoModal";

type WorkspaceTab = "ai-outputs" | "kanban";

function toast(message: string) {
  window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message } }));
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="flex size-[19px] items-center justify-center rounded-full bg-[#D3D9F8] text-[10px] font-bold leading-none text-[#233FDE]">
      {count}
    </span>
  );
}

function WorkspaceTabs({
  active,
  onChange,
  newCount,
}: {
  active: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
  newCount: number;
}) {
  return (
    <div className="flex h-10 items-center">
      <button
        type="button"
        onClick={() => onChange("ai-outputs")}
        className={cn(
          "flex h-10 items-center justify-center gap-2 px-3 typo-p2-b transition-colors",
          active === "ai-outputs"
            ? "border-b-2 border-[#121212] text-[#2E3033]"
            : "text-[#65686B] hover:text-[#2E3033]",
        )}
      >
        AI Outputs
        {newCount > 0 ? <CountBadge count={newCount} /> : null}
      </button>
      <button
        type="button"
        onClick={() => onChange("kanban")}
        className={cn(
          "flex h-10 items-center justify-center px-3 typo-p2-b transition-colors",
          active === "kanban"
            ? "border-b-2 border-[#121212] text-[#2E3033]"
            : "text-[#65686B] hover:text-[#2E3033]",
        )}
      >
        Kanban
      </button>
    </div>
  );
}

export function WorkspacePage() {
  const router = useRouter();
  const chat = useAmiioChat("amiio", "workspace-chat");
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatDraftPayload, setChatDraftPayload] = useState<ChatDraftPayload>(null);

  const [outputs, setOutputs] = useState<WorkspaceOutput[]>([...WORKSPACE_OUTPUTS]);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("ai-outputs");
  const [selectedAnalyst, setSelectedAnalyst] = useState<WorkspaceAnalystId | null>(null);
  const [search, setSearch] = useState("");
  const [taskInfoOutput, setTaskInfoOutput] = useState<WorkspaceOutput | null>(null);
  const [taskInfoOpen, setTaskInfoOpen] = useState(false);

  const newCount = useMemo(() => outputs.filter((o) => o.isNew).length, [outputs]);

  const analystCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of outputs) counts[o.analyst] = (counts[o.analyst] ?? 0) + 1;
    return counts;
  }, [outputs]);

  const displayed = useMemo(() => {
    let list = outputs;
    if (selectedAnalyst) list = list.filter((o) => o.analyst === selectedAnalyst);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.scope.toLowerCase().includes(q) ||
          o.type.toLowerCase().includes(q),
      );
    }
    return list;
  }, [outputs, selectedAnalyst, search]);

  const patch = (id: string, next: Partial<WorkspaceOutput>) =>
    setOutputs((prev) => prev.map((o) => (o.id === id ? { ...o, ...next } : o)));

  const handleViewTaskInfo = (output: WorkspaceOutput) => {
    setTaskInfoOutput(output);
    setTaskInfoOpen(true);
  };

  const showChatFab = !chatExpanded;

  return (
    <AppShell
      activeNav="insights"
      chatMinimized={!chatExpanded}
      chatPanel={
        <ChatAside id="amiio-workspace-chat">
          <ChatPanel
            variant="ask-ai"
            messages={chat.messages}
            suggestions={chat.suggestions}
            isTyping={chat.isTyping}
            onSend={chat.onSend}
            onNewChat={chat.onNewChat}
            onMinimize={() => setChatExpanded(false)}
            chatDraftPayload={chatDraftPayload}
            onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
          />
        </ChatAside>
      }
      chatRestoreFab={
        showChatFab ? (
          <FloatingAmiioChat
            messages={chat.messages}
            suggestions={chat.suggestions}
            isTyping={chat.isTyping}
            onSend={chat.onSend}
            onExpandPanel={() => setChatExpanded(true)}
            chatDraftPayload={chatDraftPayload}
            onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
          />
        ) : undefined
      }
    >
      <DashboardPageHeader
        title="Workspace"
        className="[&_h1]:typo-h3"
        stackToolbar
        tabs={
          <WorkspaceTabs active={activeTab} onChange={setActiveTab} newCount={newCount} />
        }
        filters={
          <label className="flex h-11 w-full min-w-[180px] items-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white px-3 py-1 sm:w-[209px]">
            <Search className="size-4 shrink-0 text-[#969A9E]" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent typo-l2-r text-[#353638] outline-none placeholder:text-[#969A9E]"
            />
          </label>
        }
      />

      <DashboardPageBody className="flex flex-col gap-6">
        {activeTab === "ai-outputs" ? (
          <>
            <div className="flex flex-col gap-3">
              <p className="typo-l3-b uppercase tracking-[1.2px] text-[#65686B]">
                Analysts
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {WORKSPACE_ANALYSTS.map((analyst) => {
                  const Icon = analyst.icon;
                  const selected = selectedAnalyst === analyst.id;
                  const count = analystCounts[analyst.id] ?? 0;
                  return (
                    <button
                      key={analyst.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setSelectedAnalyst((current) =>
                          current === analyst.id ? null : analyst.id,
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 transition-colors",
                        selected
                          ? "ring-1 ring-[#233FDE] ring-offset-0"
                          : "hover:bg-[#FAFBFC]",
                      )}
                    >
                      <Icon className={cn("size-4", analyst.iconClassName)} strokeWidth={1.75} />
                      <span className="typo-p2-r text-[#040617]">
                        {analyst.label}
                      </span>
                      {count > 0 ? (
                        <span className="flex size-[18px] items-center justify-center rounded-full bg-[#D3D9F8] text-[10px] font-medium leading-none text-[#233FDE]">
                          {count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <WorkspaceOutputsTable
              outputs={displayed}
              onEmailAlertChange={(output, next) => patch(output.id, { emailAlert: next })}
              onViewTaskInfo={handleViewTaskInfo}
              onEdit={() => toast("Edit output (coming soon)")}
              onToggleFavorite={(output) => {
                patch(output.id, { favorite: !output.favorite });
                toast(output.favorite ? "Removed from favorites" : "Marked as favorite");
              }}
              onDelete={(output) => {
                setOutputs((prev) => prev.filter((o) => o.id !== output.id));
                toast("Output deleted");
              }}
              onAction={(output) => toast(`${output.actionLabel} (coming soon)`)}
            />
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-[12px] border border-[rgba(230,231,232,0.7)] bg-white px-6 py-16 text-center shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            <p className="text-[16px] font-medium text-[#353638]">Kanban view</p>
            <p className="text-[14px] text-[#969A9E]">
              A board view of your AI outputs is coming soon.
            </p>
          </div>
        )}
      </DashboardPageBody>

      <WorkspaceTaskInfoModal
        output={taskInfoOutput}
        open={taskInfoOpen}
        onOpenChange={setTaskInfoOpen}
        onGoToAnalyst={(output) => {
          setTaskInfoOpen(false);
          const href = getAnalystPageHref(output.analyst);
          if (href) {
            if (output.analyst === "leasing") pinAiAssistant("lease-analyst");
            router.push(href);
            return;
          }
          toast(`${getAnalystMeta(output.analyst).label} page (coming soon)`);
        }}
      />
    </AppShell>
  );
}
