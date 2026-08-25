"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronUp,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarNavId } from "@/src/types/navigation";
import {
  navigateSidebar,
  SIDEBAR_IDLE_ROW,
  SIDEBAR_NAV_ROW,
  SIDEBAR_SELECTED_ROW,
  SIDEBAR_TOPIC_TEXT,
} from "@/src/lib/sidebarNavigation";
import { featureFlags } from "@/src/lib/featureFlags";
import {
  SHELL_SIDEBAR_COLLAPSED_PX,
  SHELL_SIDEBAR_EXPANDED_PX,
  SHELL_SIDEBAR_WIDTH_CSS_VAR,
} from "@/src/lib/shellLayout";
import { AmiioCollapsedMark, AmiioLogo } from "@/src/components/layout/AmiioLogo";
import { SidebarNavIcon } from "@/src/components/layout/SidebarNavIcons";
import { useWorkflowSessions } from "@/src/hooks/useWorkflowSessions";
import {
  WORKFLOW_TOPICS,
  getActiveWorkflowTopicId,
  getSessionTopic,
  getTopicOverviewHref,
  getInitialExpandedWorkflowTopics,
} from "@/src/lib/workflowTopics";
import type { WorkflowTopicId } from "@/src/types/workflows";
import {
  WorkflowSidebarSessionItem,
} from "@/src/components/workflows/WorkflowSidebarSessionItem";
import {
  SidebarCountBadge,
} from "@/src/components/layout/SidebarChatSessionItem";
import { requestAnalystHome } from "@/src/lib/aiAssistantNavState";
import { AI_ASSISTANT_CARDS, type AiAssistantId } from "@/src/lib/aiAssistantsData";
import { TruncatedText } from "@/src/components/ui/TruncatedText";

const SIDEBAR_EXPANDED_W = SHELL_SIDEBAR_EXPANDED_PX;
const SIDEBAR_COLLAPSED_W = SHELL_SIDEBAR_COLLAPSED_PX;
const NAV_SUB_ITEM_INDENT = "pl-8";
const NAV_SESSION_INDENT = "pl-10 pr-3";
const NAV_SECTION_BODY_GAP = "flex flex-col gap-2";
const NAV_SECTION_CHEVRON =
  "flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#353638] transition-colors hover:bg-[#F0F2F5]";
const NAV_MAIN_FEATURES_GAP = "gap-[24px]";

function NavItemBase({
  active,
  collapsed,
  className,
  children,
  onClick,
  title,
}: {
  active?: boolean;
  collapsed?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        SIDEBAR_NAV_ROW,
        collapsed ? "justify-center px-0 py-0" : "gap-2 py-0 pl-2 pr-3",
        className,
        active ? SIDEBAR_SELECTED_ROW : SIDEBAR_IDLE_ROW,
      )}
    >
      {children}
    </button>
  );
}

function NavSectionHeaderRow({
  active,
  onClick,
  children,
  trailing,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex h-9 w-full min-w-0 items-center pr-3">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          SIDEBAR_NAV_ROW,
          "min-w-0 flex-1 gap-2 py-0 pl-2 pr-2",
          active ? SIDEBAR_SELECTED_ROW : SIDEBAR_IDLE_ROW,
        )}
      >
        {children}
      </button>
      {trailing}
    </div>
  );
}

function NavLabel({
  children,
  subdued,
  topic,
  nested,
  focused,
  selected,
  className,
}: {
  children: React.ReactNode;
  subdued?: boolean;
  /** Workflow topic row — semibold sub-item */
  topic?: boolean;
  /** Nested item under a section */
  nested?: boolean;
  focused?: boolean;
  selected?: boolean;
  className?: string;
}) {
  const labelClassName = cn(
    "tracking-normal text-[13px] leading-4",
    topic || nested ? "font-medium" : "font-semibold",
    topic && SIDEBAR_TOPIC_TEXT,
    nested && !topic && SIDEBAR_TOPIC_TEXT,
    (selected || focused) && nested && !topic && SIDEBAR_TOPIC_TEXT,
    (selected || focused) && topic && SIDEBAR_TOPIC_TEXT,
    !topic &&
      !nested &&
      cn(
        selected || focused
          ? "text-[#353638]"
          : subdued
            ? SIDEBAR_TOPIC_TEXT
            : "text-[#353638]",
      ),
    className,
  );

  if (typeof children === "string") {
    return <TruncatedText text={children} className={labelClassName} side="right" />;
  }

  return <span className={cn("truncate", labelClassName)}>{children}</span>;
}

/** Smooth height expand/collapse for nested sidebar lists. */
function SidebarExpandableSection({
  open,
  children,
  className,
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}


function WorkflowTopicRow({
  label,
  count,
  open,
  onToggle,
  onTopicNavigate,
  onTopicOpen,
  topicActive,
  pathname,
  overviewHref,
  children,
}: {
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  onTopicNavigate?: () => void;
  onTopicOpen?: () => void;
  topicActive?: boolean;
  pathname: string;
  overviewHref?: string;
  children?: React.ReactNode;
}) {
  const hasItems = count > 0;

  const handleLabelClick = () => {
    const navigatingAway = Boolean(overviewHref && pathname !== overviewHref);

    if (navigatingAway) {
      onTopicNavigate?.();
      return;
    }

    if (hasItems && !open) {
      onTopicOpen?.();
      return;
    }

    onTopicNavigate?.();
  };

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className={cn(
          SIDEBAR_NAV_ROW,
          NAV_SUB_ITEM_INDENT,
          "gap-2 py-0 pr-3",
          topicActive ? SIDEBAR_SELECTED_ROW : SIDEBAR_IDLE_ROW,
        )}
      >
        <button
          type="button"
          onClick={onTopicNavigate || hasItems ? handleLabelClick : undefined}
          className="flex min-w-0 flex-1 items-center gap-2 bg-transparent p-0 text-left outline-none"
          title={label}
        >
          <NavLabel topic selected={topicActive} className="min-w-0 flex-1 truncate">
            {label}
          </NavLabel>
          <SidebarCountBadge count={count} />
        </button>
        {hasItems ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
            className={NAV_SECTION_CHEVRON}
          >
            <ChevronUp
              className={cn(
                "size-5 transition-transform duration-200 ease-out",
                !open && "rotate-180",
              )}
              strokeWidth={1.75}
            />
          </button>
        ) : null}
      </div>
      {hasItems ? (
        <SidebarExpandableSection open={open && Boolean(children)}>
          <div className="flex flex-col gap-1 pb-1">{children}</div>
        </SidebarExpandableSection>
      ) : null}
    </div>
  );
}

function AskAiNavDropdown({
  activeNav,
  collapsed,
  onExpand,
}: {
  activeNav: SidebarNavId;
  collapsed: boolean;
  onExpand?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isAskAiActive =
    activeNav === "ask-ai" ||
    pathname === "/ask-ai" ||
    pathname.startsWith("/ask-ai/");

  if (collapsed) {
    return (
      <NavItemBase
        collapsed
        active={isAskAiActive}
        title="Ask Amiio"
        onClick={() => onExpand?.()}
      >
        <SidebarNavIcon name="lightbulb" width={16.5} height={21} />
      </NavItemBase>
    );
  }

  return (
    <NavItemBase active={isAskAiActive} onClick={() => router.push("/ask-ai")}>
      <SidebarNavIcon name="lightbulb" width={16.5} height={21} />
      <NavLabel focused={isAskAiActive}>Ask Amiio</NavLabel>
    </NavItemBase>
  );
}

/** New outputs awaiting review — matches the badge in the Figma design. */
const WORKSPACE_NAV_BADGE = 1;

function WorkspaceNavItem({
  activeNav,
  collapsed,
  onExpand,
}: {
  activeNav: SidebarNavId;
  collapsed: boolean;
  onExpand?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isWorkspaceActive =
    activeNav === "insights" ||
    pathname === "/workspace" ||
    pathname.startsWith("/workspace/") ||
    pathname === "/insights" ||
    pathname.startsWith("/insights/");

  if (collapsed) {
    return (
      <NavItemBase
        collapsed
        active={isWorkspaceActive}
        title="Workspace"
        onClick={() => onExpand?.()}
      >
        <SidebarNavIcon name="workspace" size={20} />
      </NavItemBase>
    );
  }

  return (
    <NavItemBase active={isWorkspaceActive} onClick={() => router.push("/workspace")}>
      <SidebarNavIcon name="workspace" size={20} />
      <NavLabel focused={isWorkspaceActive} className="min-w-0 flex-1">
        Workspace
      </NavLabel>
      <SidebarCountBadge count={WORKSPACE_NAV_BADGE} />
    </NavItemBase>
  );
}

function AiAssistantsNavDropdown({
  activeNav,
  collapsed,
  onExpand,
}: {
  activeNav: SidebarNavId;
  collapsed: boolean;
  onExpand?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [assistantsOpen, setAssistantsOpen] = useState(true);

  const isLeaseAnalyst =
    activeNav === "lease-analyst" || pathname.startsWith("/ai-assistants/lease-analyst");
  const isAiAssistantsActive = pathname.startsWith("/ai-assistants");

  useEffect(() => {
    if (isAiAssistantsActive) setAssistantsOpen(true);
  }, [isAiAssistantsActive]);

  const navigateAssistant = (id: AiAssistantId) => {
    const card = AI_ASSISTANT_CARDS.find((c) => c.id === id);
    if (!card) return;

    // Analysts with a live workspace page navigate; others toast "coming soon".
    const LIVE_ANALYSTS: AiAssistantId[] = ["lease-analyst", "reporting", "esg"];
    if (LIVE_ANALYSTS.includes(id)) {
      if (pathname.startsWith(card.chatHref)) {
        requestAnalystHome(card.chatHref);
        return;
      }
      router.push(card.chatHref);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `${card.title} (coming soon)` },
      }),
    );
  };

  if (collapsed) {
    return (
      <NavItemBase
        collapsed
        active={isAiAssistantsActive}
        title="AI Assistants"
        onClick={() => {
          if (isLeaseAnalyst) {
            navigateAssistant("lease-analyst");
            return;
          }
          onExpand?.();
        }}
      >
        <SidebarNavIcon name="ai" size={20} />
      </NavItemBase>
    );
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col", NAV_SECTION_BODY_GAP)}>
      <NavSectionHeaderRow
        onClick={() => setAssistantsOpen(true)}
        trailing={
          <button
            type="button"
            className={NAV_SECTION_CHEVRON}
            aria-label={assistantsOpen ? "Collapse AI Assistants" : "Expand AI Assistants"}
            aria-expanded={assistantsOpen}
            onClick={() => setAssistantsOpen((open) => !open)}
          >
            <ChevronUp
              className={cn(
                "size-5 transition-transform duration-200 ease-out",
                !assistantsOpen && "rotate-180",
              )}
              strokeWidth={1.75}
            />
          </button>
        }
      >
        <SidebarNavIcon name="ai" size={20} />
        <NavLabel focused={isAiAssistantsActive}>AI Assistants</NavLabel>
      </NavSectionHeaderRow>
      <SidebarExpandableSection open={assistantsOpen}>
        <div className="flex flex-col gap-1">
          {AI_ASSISTANT_CARDS.map((card) => {
            const selected =
              card.id === "lease-analyst"
                ? isLeaseAnalyst
                : pathname === card.chatHref;
            return (
              <NavItemBase
                key={card.id}
                active={selected}
                className={cn(NAV_SUB_ITEM_INDENT, "pr-3")}
                onClick={() => {
                  setAssistantsOpen(true);
                  navigateAssistant(card.id);
                }}
              >
                <NavLabel topic selected={selected} className="min-w-0 flex-1 truncate">
                  {card.title}
                </NavLabel>
              </NavItemBase>
            );
          })}
        </div>
      </SidebarExpandableSection>
    </div>
  );
}

function WorkflowsNavDropdown({
  activeNav,
  collapsed,
  onExpand,
}: {
  activeNav: SidebarNavId;
  collapsed: boolean;
  onExpand?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { sessions, removeSession, renameSession } = useWorkflowSessions();
  const [workflowsOpen, setWorkflowsOpen] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Record<WorkflowTopicId, boolean>>(() =>
    getInitialExpandedWorkflowTopics(pathname, sessions),
  );
  const topicSessionCountsRef = useRef<Record<WorkflowTopicId, number>>({
    "leasing-renewal": 0,
    "service-charge-settlement": 0,
    reporting: 0,
    "market-research": 0,
    "financial-forecasting": 0,
    esg: 0,
  });

  const activeSessionId = useMemo(() => {
    const match = pathname.match(/^\/workflows\/([^/]+)$/);
    if (!match || match[1] === "new" || match[1] === "leasing-renewal") return null;
    return match[1];
  }, [pathname]);

  const activeTopicId = useMemo(
    () => getActiveWorkflowTopicId(pathname, sessions),
    [pathname, sessions],
  );

  const sessionsByTopic = useMemo(() => {
    const grouped = {} as Record<WorkflowTopicId, typeof sessions>;
    for (const topic of WORKFLOW_TOPICS) {
      grouped[topic.id] = sessions
        .filter((session) => getSessionTopic(session) === topic.id)
        .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt));
    }
    return grouped;
  }, [sessions]);

  useEffect(() => {
    if (!pathname.startsWith("/workflows/")) return;
    setWorkflowsOpen(true);
  }, [pathname]);

  useEffect(() => {
    setExpandedTopics((current) => {
      let changed = false;
      const next = { ...current };

      for (const topic of WORKFLOW_TOPICS) {
        const count = sessionsByTopic[topic.id].length;
        const previousCount = topicSessionCountsRef.current[topic.id] ?? 0;

        if (previousCount > 0 && count === 0 && next[topic.id]) {
          next[topic.id] = false;
          changed = true;
        }

        topicSessionCountsRef.current[topic.id] = count;
      }

      return changed ? next : current;
    });
  }, [sessionsByTopic]);

  const openTopic = (topicId: WorkflowTopicId) => {
    if (sessionsByTopic[topicId].length === 0) return;
    setWorkflowsOpen(true);
    setExpandedTopics((current) => {
      if (current[topicId]) return current;
      return { ...current, [topicId]: true };
    });
  };

  const toggleTopic = (topicId: WorkflowTopicId) => {
    if (sessionsByTopic[topicId].length === 0) return;
    setExpandedTopics((current) => ({ ...current, [topicId]: !current[topicId] }));
  };

  const isWorkflowActive =
    activeNav === "workflow-new" ||
    activeNav === "leasing-renewal" ||
    activeNav === "reporting" ||
    activeNav === "market-research" ||
    pathname === "/workflows/new" ||
    pathname.startsWith("/workflows/");

  if (collapsed) {
    return (
      <NavItemBase
        collapsed
        active={isWorkflowActive}
        title="Workflows"
        onClick={() => onExpand?.()}
      >
        <SidebarNavIcon name="workflows" size={18} />
      </NavItemBase>
    );
  }

  return (
    <div className={cn("flex w-full min-w-0 flex-col", NAV_SECTION_BODY_GAP)}>
      <NavSectionHeaderRow
        active={pathname === "/workflows/new"}
        onClick={() => {
          router.push("/workflows/new");
          setWorkflowsOpen(true);
        }}
        trailing={
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              className={NAV_SECTION_CHEVRON}
              aria-label={workflowsOpen ? "Collapse workflows" : "Expand workflows"}
              aria-expanded={workflowsOpen}
              onClick={() => setWorkflowsOpen((value) => !value)}
            >
              <ChevronUp
                className={cn(
                  "size-5 transition-transform duration-200 ease-out",
                  !workflowsOpen && "rotate-180",
                )}
                strokeWidth={1.75}
              />
            </button>
          </div>
        }
      >
        <SidebarNavIcon name="workflows" size={18} />
        <NavLabel>Workflows</NavLabel>
      </NavSectionHeaderRow>
      <SidebarExpandableSection open={workflowsOpen}>
        <div className="flex flex-col gap-1">
          {WORKFLOW_TOPICS.filter(
            (topic) =>
              topic.id === "leasing-renewal" ||
              topic.id === "service-charge-settlement",
          ).map((topic) => {
            const topicSessions = sessionsByTopic[topic.id];
            const count = topicSessions.length;
            const overviewHref = getTopicOverviewHref(topic.id);
            return (
              <WorkflowTopicRow
                key={topic.id}
                label={topic.label}
                count={count}
                open={expandedTopics[topic.id]}
                pathname={pathname}
                overviewHref={overviewHref}
                onToggle={() => toggleTopic(topic.id)}
                onTopicOpen={() => openTopic(topic.id)}
                onTopicNavigate={
                  overviewHref
                    ? () => {
                        if (pathname !== overviewHref) router.push(overviewHref);
                      }
                    : undefined
                }
                topicActive={activeTopicId === topic.id}
              >
                {topicSessions.map((session) => (
                  <WorkflowSidebarSessionItem
                    key={session.id}
                    session={session}
                    isActive={activeSessionId === session.id}
                    indent={NAV_SESSION_INDENT}
                    onRename={renameSession}
                    onDelete={removeSession}
                  />
                ))}
              </WorkflowTopicRow>
            );
          })}
        </div>
      </SidebarExpandableSection>
    </div>
  );
}

export const SidebarNavigation = memo(function SidebarNavigation({
  activeNav,
  className,
}: {
  activeNav: SidebarNavId;
  className?: string;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardsOpen, setDashboardsOpen] = useState(true);

  useEffect(() => {
    if (activeNav === "financial" || activeNav === "commercial") {
      setDashboardsOpen(true);
    }
  }, [activeNav]);

  const go = (nav: SidebarNavId) => navigateSidebar(nav, router);

  const width = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  useEffect(() => {
    document.documentElement.style.setProperty(SHELL_SIDEBAR_WIDTH_CSS_VAR, `${width}px`);
    return () => {
      document.documentElement.style.removeProperty(SHELL_SIDEBAR_WIDTH_CSS_VAR);
    };
  }, [width]);

  return (
    <aside
      className={cn("z-30 flex h-svh shrink-0 bg-white", className)}
      style={{ width }}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between overflow-y-auto">
        <div
          className={cn(
            "flex shrink-0 flex-col pt-8",
            collapsed ? "items-center gap-6" : "gap-6",
          )}
        >
          {/* Header — Figma 830:54312 px-20 */}
          <div
            className={cn(
              "flex w-full shrink-0 items-center",
              collapsed ? "justify-center px-6" : "justify-between px-5",
            )}
          >
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label="Expand sidebar"
                className="group relative flex size-6 shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-[#F0F2F5]"
              >
                <AmiioCollapsedMark className="absolute transition-opacity group-hover:opacity-0" />
                <SidebarNavIcon
                  name="collapse"
                  size={20}
                  className="absolute scale-x-[-1] opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>
            ) : (
              <>
                <AmiioLogo />
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="flex size-6 shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-[#F0F2F5]"
                  aria-label="Collapse sidebar"
                >
                  <SidebarNavIcon name="collapse" size={20} />
                </button>
              </>
            )}
          </div>

          {/* Navigation — Figma 1217:45513 */}
          <nav
            className={cn(
              "flex w-full flex-col",
              collapsed ? cn("px-2", NAV_MAIN_FEATURES_GAP) : cn("px-5", NAV_MAIN_FEATURES_GAP),
            )}
          >
            <AskAiNavDropdown
              activeNav={activeNav}
              collapsed={collapsed}
              onExpand={() => setCollapsed(false)}
            />

            {featureFlags.showInsightsNav ? (
              <WorkspaceNavItem
                activeNav={activeNav}
                collapsed={collapsed}
                onExpand={() => setCollapsed(false)}
              />
            ) : null}

            <AiAssistantsNavDropdown
              activeNav={activeNav}
              collapsed={collapsed}
              onExpand={() => setCollapsed(false)}
            />

            {collapsed ? (
              <>
                {featureFlags.showWorkflowsNav ? (
                  <WorkflowsNavDropdown
                    activeNav={activeNav}
                    collapsed
                    onExpand={() => setCollapsed(false)}
                  />
                ) : null}
                <NavItemBase
                  collapsed
                  active={activeNav === "financial" || activeNav === "commercial"}
                  title="Dashboards"
                  onClick={() => go(activeNav === "financial" ? "financial" : "commercial")}
                >
                  <SidebarNavIcon name="dashboards" size={20} />
                </NavItemBase>
                <NavItemBase
                  collapsed
                  active={activeNav === "reporting"}
                  title="Reports"
                  onClick={() => go("reporting")}
                >
                  <SidebarNavIcon name="reports" size={20} />
                </NavItemBase>
              </>
            ) : (
              <>
                {featureFlags.showWorkflowsNav ? (
                  <WorkflowsNavDropdown activeNav={activeNav} collapsed={false} />
                ) : null}

                <div className={cn("flex w-full flex-col", NAV_SECTION_BODY_GAP)}>
                  <NavSectionHeaderRow
                    onClick={() => setDashboardsOpen(true)}
                    trailing={
                      <button
                        type="button"
                        aria-label={dashboardsOpen ? "Collapse dashboards" : "Expand dashboards"}
                        aria-expanded={dashboardsOpen}
                        onClick={() => setDashboardsOpen((open) => !open)}
                        className={NAV_SECTION_CHEVRON}
                      >
                        <ChevronUp
                          className={cn(
                            "size-5 shrink-0 transition-transform duration-200 ease-out",
                            !dashboardsOpen && "rotate-180",
                          )}
                          strokeWidth={1.75}
                        />
                      </button>
                    }
                  >
                    <SidebarNavIcon name="dashboards" size={20} />
                    <NavLabel>Dashboards</NavLabel>
                  </NavSectionHeaderRow>
                  {dashboardsOpen ? (
                    <div className="flex flex-col gap-1">
                      <NavItemBase
                        active={activeNav === "financial"}
                        className={cn(NAV_SUB_ITEM_INDENT, "pr-3")}
                        onClick={() => {
                          setDashboardsOpen(true);
                          go("financial");
                        }}
                      >
                        <NavLabel topic selected={activeNav === "financial"}>
                          Financial
                        </NavLabel>
                      </NavItemBase>
                      <NavItemBase
                        active={activeNav === "commercial"}
                        className={cn(NAV_SUB_ITEM_INDENT, "pr-3")}
                        onClick={() => {
                          setDashboardsOpen(true);
                          go("commercial");
                        }}
                      >
                        <NavLabel topic selected={activeNav === "commercial"}>
                          Commercial
                        </NavLabel>
                      </NavItemBase>
                    </div>
                  ) : null}
                </div>

                <NavItemBase
                  active={activeNav === "reporting"}
                  onClick={() => go("reporting")}
                >
                  <SidebarNavIcon name="reports" size={20} />
                  <NavLabel focused={activeNav === "reporting"}>Reports</NavLabel>
                </NavItemBase>
              </>
            )}
          </nav>
        </div>

        {/* Footer — Figma 1217:45560 */}
        <div
          className={cn(
            "flex shrink-0 flex-col pb-8",
            collapsed ? "gap-4 px-4" : "gap-6 px-4",
          )}
        >
          <div className="h-px w-full bg-[#E5E5E5]" />

          {collapsed ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full justify-center px-2">
                <img
                  src="/property-partners-logo.svg"
                  alt=""
                  className="size-5 shrink-0"
                  aria-hidden
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <NavItemBase
                  collapsed
                  active={activeNav === "settings"}
                  title="Settings"
                  onClick={() => go("settings")}
                >
                  <Settings className="size-5 text-[#353638]" strokeWidth={1.5} />
                </NavItemBase>
                <NavItemBase
                  collapsed
                  title="Log out"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("amiio:toast", {
                        detail: { message: "Logged out (demo)" },
                      }),
                    )
                  }
                >
                  <LogOut className="size-5 text-[#353638]" strokeWidth={1.5} />
                </NavItemBase>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex justify-center px-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/property-partners-logo.svg"
                    alt=""
                    className="size-6 shrink-0"
                    aria-hidden
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <TruncatedText
                      text="Penny Lane"
                      className="text-[13px] font-semibold leading-5 text-[#171717]"
                    />
                    <TruncatedText
                      text="tomer@propertypartners"
                      className="text-[13px] font-normal leading-5 text-[#525252]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <NavItemBase
                  active={activeNav === "settings"}
                  onClick={() => go("settings")}
                >
                  <Settings className="size-5 shrink-0 text-[#353638]" strokeWidth={1.5} />
                  <NavLabel focused={activeNav === "settings"}>Settings</NavLabel>
                </NavItemBase>

                <NavItemBase
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("amiio:toast", {
                        detail: { message: "Logged out (demo)" },
                      }),
                    )
                  }
                >
                  <LogOut className="size-5 shrink-0 text-[#353638]" strokeWidth={1.5} />
                  <NavLabel>Log out</NavLabel>
                </NavItemBase>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-full w-px shrink-0 bg-[#E5E5E5]" aria-hidden />
    </aside>
  );
});
