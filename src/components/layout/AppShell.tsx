"use client";

import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import type { SidebarNavId } from "@/src/types/navigation";
import { SidebarNavigation } from "@/src/components/layout/SidebarNavigation";
import { ToastStack } from "@/src/components/commercial/ToastStack";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SHELL_CHAT_TOP_PX,
  SHELL_CHAT_WIDTH_PX,
  SHELL_CHAT_BOTTOM_PX,
  SHELL_COLUMN_GAP_PX,
  shellSideChatPanelHeightCss,
} from "@/src/lib/shellLayout";

type ShellLayoutContextValue = {
  sideChatOpen: boolean;
};

const ShellLayoutContext = createContext<ShellLayoutContextValue>({
  sideChatOpen: false,
});

export function useShellLayout() {
  return useContext(ShellLayoutContext);
}

function ShellSideChatPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sticky top-0 hidden min-h-0 shrink-0 flex-col self-start pr-6 lg:flex"
      style={{
        width: SHELL_CHAT_WIDTH_PX,
        paddingTop: SHELL_CHAT_TOP_PX,
        paddingBottom: SHELL_CHAT_BOTTOM_PX,
        boxSizing: "border-box",
      }}
    >
      <div
        className="flex min-h-0 w-full flex-col overflow-visible"
        style={{
          height: shellSideChatPanelHeightCss(),
          maxHeight: shellSideChatPanelHeightCss(),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function AppShell({
  activeNav,
  children,
  chatPanel,
  chatMinimized = true,
  chatRestoreFab,
  className,
}: {
  activeNav: SidebarNavId;
  children: React.ReactNode;
  chatPanel?: React.ReactNode;
  chatMinimized?: boolean;
  chatRestoreFab?: React.ReactNode;
  className?: string;
  /** @deprecated Side panel uses a fixed 394×956 layout for all pages. */
  sidePanelAlign?: "default" | "workflow-stage";
}) {
  const showSidePanel = !chatMinimized && Boolean(chatPanel);

  return (
    <TooltipProvider delayDuration={250}>
      <ShellLayoutContext.Provider value={{ sideChatOpen: showSidePanel }}>
        <div
          className={cn("flex min-h-screen w-full", className)}
          style={{ backgroundColor: "var(--Secondary-Sea-Salt)" }}
        >
          <SidebarNavigation activeNav={activeNav} />
          <ToastStack />

          <div
            className="flex min-h-0 min-w-0 flex-1"
            style={{ gap: showSidePanel ? SHELL_COLUMN_GAP_PX : 0 }}
          >
            <div className="h-full min-h-0 w-full min-w-0 overflow-y-auto">{children}</div>

            {showSidePanel ? (
              <ShellSideChatPanel>{chatPanel}</ShellSideChatPanel>
            ) : null}
          </div>

          {chatMinimized ? chatRestoreFab : null}
        </div>
      </ShellLayoutContext.Provider>
    </TooltipProvider>
  );
}

export function DashboardPageHeader({
  title,
  tabs,
  filters,
  actions,
  className,
  stackToolbar,
}: {
  title: string;
  tabs?: React.ReactNode;
  filters?: React.ReactNode;
  /** Top-right action(s) aligned with the page title (e.g. a "+ New" button). */
  actions?: React.ReactNode;
  className?: string;
  /** Stack filters below tabs — defaults to true when the right chat panel is open. */
  stackToolbar?: boolean;
}) {
  const { sideChatOpen } = useShellLayout();
  const stack = stackToolbar ?? sideChatOpen;
  const showToolbar = Boolean(tabs || filters);

  return (
    <header className={cn("px-6 pt-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <h1 className="typo-page-title text-[#010309]">{title}</h1>
        {actions ? <div className="flex shrink-0 items-center">{actions}</div> : null}
      </div>
      {showToolbar ? (
        stack && tabs && filters ? (
          <div className="mt-5 flex flex-col gap-3">
            <div className="-ml-6 min-w-0 overflow-x-auto pl-6">{tabs}</div>
            <div className="flex min-w-0 items-center">{filters}</div>
          </div>
        ) : (
          <div
            className={cn(
              "mt-5 flex items-center gap-4",
              tabs && filters ? "justify-between" : filters ? "justify-end" : "justify-start",
            )}
          >
            {tabs ? (
              <div className="-ml-6 min-w-0 flex-1 overflow-x-auto pl-6">{tabs}</div>
            ) : null}
            {filters ? (
              <div className="flex shrink-0 items-center justify-end">{filters}</div>
            ) : null}
          </div>
        )
      ) : null}
    </header>
  );
}

export function DashboardPageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 pb-8 pt-5 min-w-0", className)}>
      {children}
    </div>
  );
}
