"use client";

import { AiAnalystsShell } from "@/src/components/ai-analysts/AiAnalystsShell";
import { TasksPage } from "@/src/components/ai-analysts/TasksPage";

export default function TasksRoutePage() {
  return (
    <AiAnalystsShell activeNav="tasks">
      <TasksPage />
    </AiAnalystsShell>
  );
}
