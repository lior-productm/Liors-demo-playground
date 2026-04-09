import type { TopNavTabId } from "@/src/types/commercial";

/** External Reporting (active reports) — same-tab navigation from top nav. */
export const AMIIO_DEMO_ACTIVE_REPORTS_URL =
  "https://demo.dev.amiio.com/reporting/active-reports" as const;

type RouterWithPush = { push: (href: string) => void };

export function navigateTopNavTab(tab: TopNavTabId, router: RouterWithPush) {
  if (tab === "reporting") {
    window.location.assign(AMIIO_DEMO_ACTIVE_REPORTS_URL);
    return;
  }
  switch (tab) {
    case "amiio":
      router.push("/insights");
      break;
    case "finance":
      router.push("/financial");
      break;
    case "commercial":
      router.push("/commercial");
      break;
    case "browser":
      router.push("/browser");
      break;
  }
}
