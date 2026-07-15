/** Horizontal center of main content area (excludes left sidebar). */
export function shellContentAreaCenterLeftCss(
  sidebarWidthPx: number = SHELL_SIDEBAR_EXPANDED_PX,
) {
  return `calc(${sidebarWidthPx / 2}px + 50vw)`;
}

/** Max width for floating chrome within the main content column. */
export function shellContentAreaMaxWidthCss(
  sidebarWidthPx: number = SHELL_SIDEBAR_EXPANDED_PX,
  insetPx = 48,
) {
  return `calc(100vw - ${sidebarWidthPx}px - ${insetPx}px)`;
}

/** CSS custom property — updated by {@link SidebarNavigation} when collapsed toggles. */
export const SHELL_SIDEBAR_WIDTH_CSS_VAR = "--shell-sidebar-width";
export const SHELL_SIDEBAR_EXPANDED_PX = 240;
export const SHELL_SIDEBAR_COLLAPSED_PX = 64;
export const SHELL_CHAT_WIDTH_PX = 394;
export const SHELL_CHAT_HEIGHT_PX = 956;
export const SHELL_CHAT_TOP_PX = 36;
export const SHELL_CHAT_BOTTOM_PX = 32;
export const SHELL_COLUMN_GAP_PX = 24;

/** Side panel width defaults for horizontal resize (percent of main + side area). */
/** ~394px at 1440 viewport with 240px sidebar (1200px content area). */
export const SHELL_SIDE_PANEL_DEFAULT_PCT = 33;
export const SHELL_SIDE_PANEL_MIN_PCT = 20;
export const SHELL_SIDE_PANEL_MAX_PCT = 50;

/** Figma Chat Examples (830:52830) — lease renewal proposal side panel. */
export const SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX = SHELL_CHAT_WIDTH_PX;
export const SHELL_WORKFLOW_PROPOSAL_PANEL_HEIGHT_PX = SHELL_CHAT_HEIGHT_PX;

/** @deprecated Use fixed {@link SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX} instead. */
export const SHELL_WORKFLOW_PROPOSAL_PANEL_PCT = 30;
/** @deprecated Use fixed {@link SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX} instead. */
export const SHELL_WORKFLOW_PROPOSAL_PANEL_MIN_PX = SHELL_CHAT_WIDTH_PX;

/** Compute side-panel % so default width matches {@link SHELL_CHAT_WIDTH_PX}. */
export function computeShellSidePanelDefaultPct(viewportWidth: number) {
  const area = Math.max(600, viewportWidth - SHELL_SIDEBAR_EXPANDED_PX);
  const pct = (SHELL_CHAT_WIDTH_PX / area) * 100;
  return Math.min(SHELL_SIDE_PANEL_MAX_PCT, Math.max(SHELL_SIDE_PANEL_MIN_PCT, pct));
}

/** Figma chat bar frame (830:53562). */
export const SHELL_WORKFLOW_CHAT_BAR_MAX_PX = 661;
/** Ask Amiio full-page chat bar — Figma 1172:62206. */
export const SHELL_ASK_AI_CHAT_BAR_MAX_PX = 720;
export const SHELL_ASK_AI_CHAT_BAR_HEIGHT_PX = 56;
/** @deprecated Use {@link SHELL_ASK_AI_CHAT_BAR_MAX_PX}. */
export const SHELL_ASK_AI_CHAT_BAR_WIDTH_PX = SHELL_ASK_AI_CHAT_BAR_MAX_PX;
/** Expanded sidebar chat input max width — Figma 1172:61553. */
export const SHELL_SIDEBAR_CHAT_INPUT_MAX_PX = 349;
/** Figma dashboard main content column (830:52881) — full-size workflow target. */
export const SHELL_WORKFLOW_DASHBOARD_CONTENT_MAX_PX = 734;

/** Workflow main column max width — matches dashboard content on large viewports. */
export const SHELL_WORKFLOW_CHAT_COLUMN_MAX_PX = SHELL_WORKFLOW_DASHBOARD_CONTENT_MAX_PX;
export const SHELL_WORKFLOW_SPLIT_MAX_PX =
  SHELL_WORKFLOW_DASHBOARD_CONTENT_MAX_PX +
  SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX +
  SHELL_COLUMN_GAP_PX;

/** Scale workflow column to available main area (panel open vs full width). */
export function computeWorkflowChatColumnMaxPx(
  viewportWidth: number,
  sidePanelOpen: boolean,
) {
  const area = Math.max(600, viewportWidth - SHELL_SIDEBAR_EXPANDED_PX);
  const mainWidth = sidePanelOpen
    ? area - computeWorkflowSidePanelWidthPx(viewportWidth) - SHELL_COLUMN_GAP_PX
    : area;

  const proportional = Math.round(mainWidth * 0.86);
  return Math.min(
    SHELL_WORKFLOW_DASHBOARD_CONTENT_MAX_PX,
    Math.max(SHELL_WORKFLOW_CHAT_BAR_MAX_PX, proportional),
  );
}
/** pt-8 + page title row + mb-6 — proposal panel aligns below this header. */
export const SHELL_WORKFLOW_PAGE_HEADER_OFFSET_PX = 104;

/** Fixed bottom dock on workflow pages — chat bar, disclaimer, and gradient padding. */
export const SHELL_WORKFLOW_CHAT_DOCK_PX = 144;

/** Fixed 394px — Figma 830:52830. */
export function computeWorkflowSidePanelWidthPx(_viewportWidth?: number) {
  return SHELL_WORKFLOW_PROPOSAL_PANEL_WIDTH_PX;
}

export function shellChatHeightCss() {
  return `${SHELL_CHAT_HEIGHT_PX}px`;
}

/** Viewport-fitted height for dashboard side chat — keeps the input bar aligned with the visible view. */
export function shellSideChatPanelHeightCss() {
  return `calc(100svh - ${SHELL_CHAT_TOP_PX + SHELL_CHAT_BOTTOM_PX}px)`;
}

/** Fixed 956px — Figma 830:52830 (fits 1024 viewport with shell top/bottom insets). */
export function shellWorkflowProposalPanelHeightCss(_stageOffsetTop = 0) {
  return `${SHELL_WORKFLOW_PROPOSAL_PANEL_HEIGHT_PX}px`;
}

/** Figma 830:52527 Chat Examples — soft glass depth. */
export const SHELL_SIDE_PANEL_FRAME_CLASS =
  "shadow-[0_0_0_1px_rgba(1,3,9,0.05),0_4px_16px_rgba(0,0,0,0.08)]";

/** Inner glass highlight on side panels. */
export const SHELL_SIDE_PANEL_INSET_SHADOW_CLASS =
  "shadow-[inset_0px_2px_6px_0px_rgba(255,255,255,0.18)]";

/** Figma Gradient/Chat background overlay. */
export const SHELL_CHAT_PANEL_GRADIENT_STYLE = {
  backgroundImage:
    "linear-gradient(90.17deg, rgba(255, 255, 255, 0.3) 1.29%, rgba(255, 255, 255, 0.15) 100.09%)",
} as const;
