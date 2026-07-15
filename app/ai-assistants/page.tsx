import { redirect } from "next/navigation";

/** AI Assistants is a sidebar group only — no landing page. */
export default function AiAssistantsPage() {
  redirect("/ai-assistants/lease-analyst");
}
