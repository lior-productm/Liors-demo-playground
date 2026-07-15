/**
 * UI feature flags — flip to `true` when a section should be visible again.
 * Routes and components stay in the codebase; only nav/display is gated.
 */
export const featureFlags = {
  /** Sidebar Workflows section + collapsed icon */
  showWorkflowsNav: false,
  /** Sidebar Insights nav item (Figma: Ask Amiio → Insights → …) */
  showInsightsNav: true,
  /** Internal-only "Create new section" builder in Reporting (Deep Agent) */
  showReportSectionBuilder: true,
} as const;
