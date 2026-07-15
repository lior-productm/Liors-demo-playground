"use client";

import { AskAiChat } from "@/src/components/ask-ai/AskAiChat";

/** Blank Ask AI landing — no session persisted until the user sends a message */
export default function AskAiIndexPage() {
  return <AskAiChat />;
}
