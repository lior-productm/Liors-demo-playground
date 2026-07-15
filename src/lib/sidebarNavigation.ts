import type { SidebarNavId } from "@/src/types/navigation";

/** Selected sidebar row — shared gray for focus & nested list items. */
export const SIDEBAR_SELECTED_ROW = "bg-[#F0F2F5]";
export const SIDEBAR_IDLE_ROW = "bg-white hover:bg-[#F0F2F5]/70";

/** Standard nav row height — matches Financial / Commercial sub-items. */
export const SIDEBAR_NAV_ROW =
  "flex h-9 w-full min-w-0 items-center overflow-hidden rounded-[6px] text-left transition-colors";
export const SIDEBAR_NAV_ROW_NESTED = "gap-2 py-0 pl-8 pr-3";
export const SIDEBAR_SELECTED_TEXT = "text-[#353638]";
export const SIDEBAR_TOPIC_SELECTED_TEXT = "text-[#353638] font-bold";
export const SIDEBAR_SUBITEM_SELECTED_TEXT = "text-[#353638] font-medium";

/** Shared sidebar label typography (NavLabel, section headers). */
export const SIDEBAR_LABEL_CLASS =
  "tracking-normal text-[13px] font-semibold leading-4";
export const SIDEBAR_META_CLASS =
  "text-[12px] font-normal leading-4 tracking-normal text-[#65686B]";
export const SIDEBAR_LINK_CLASS =
  "text-[13px] font-medium leading-4 tracking-normal text-[#353638]";
export const SIDEBAR_TOPIC_TEXT = "text-[#404040]";
export const SIDEBAR_ITEM_IDLE = "text-[#404040] hover:bg-[#F0F2F5]/70";
export const SIDEBAR_ITEM_ACTIVE = "bg-[#F0F2F5] text-[#353638]";

type RouterWithPush = { push: (href: string) => void };

export function navigateSidebar(nav: SidebarNavId, router: RouterWithPush) {
  switch (nav) {
    case "ask-ai":
      router.push("/ask-ai");
      break;
    case "insights":
      router.push("/workspace");
      break;
    case "ai-assistants":
      router.push("/ai-assistants/lease-analyst");
      break;
    case "lease-analyst":
      router.push("/ai-assistants/lease-analyst");
      break;
    case "financial":
      router.push("/financial");
      break;
    case "commercial":
      router.push("/commercial");
      break;
    case "workflow-new":
      router.push("/workflows/new");
      break;
    case "leasing-renewal":
      router.push("/workflows/leasing-renewal");
      break;
    case "reporting":
      router.push("/reporting");
      break;
    case "market-research":
      window.dispatchEvent(
        new CustomEvent("amiio:toast", { detail: { message: "Market research (coming soon)" } }),
      );
      break;
    case "settings":
      window.dispatchEvent(
        new CustomEvent("amiio:toast", { detail: { message: "Settings (coming soon)" } }),
      );
      break;
  }
}
