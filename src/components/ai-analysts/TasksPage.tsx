"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  PrimaryButton,
  SearchInput,
  TabButton,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { TasksTable } from "@/src/components/ai-analysts/TasksTable";
import { useAiAnalystsModals } from "@/src/components/ai-analysts/AiAnalystsModals";
import { useAiAnalystTasks } from "@/src/hooks/useAiAnalystTasks";

type TabKey = "Active" | "Archived";

export function TasksPage() {
  const modals = useAiAnalystsModals();
  const allTasks = useAiAnalystTasks();
  const [tab, setTab] = useState<TabKey>("Active");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const byTab = allTasks.filter((t) =>
    tab === "Archived" ? t.status === "archived" : t.status !== "archived",
  );
  const tasks = byTab.filter(
    (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
  );

  const tabs: TabKey[] = ["Active", "Archived"];

  return (
    <div className="flex flex-col gap-6 px-6 pb-12 pt-8">
      <header className="flex flex-col gap-6">
        <h1 className="text-[24px] font-medium leading-8 text-[#121212]">Tasks</h1>

        <div className="flex items-center justify-between gap-4 border-b border-[#E6E8EB]">
          <div className="flex">
            {tabs.map((t) => (
              <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
              </TabButton>
            ))}
          </div>
          <div className="flex items-center gap-4 pb-2">
            <SearchInput value={query} onChange={setQuery} placeholder="Search..." />
            <PrimaryButton size="md" onClick={() => modals.openNewTask("financial")}>
              <Plus size={16} strokeWidth={1.5} /> New task
            </PrimaryButton>
          </div>
        </div>
      </header>

      <TasksTable
        tasks={tasks}
        emptyTitle={tab === "Archived" ? "No archived tasks" : "No tasks configured yet"}
        emptyDescription={
          tab === "Archived"
            ? "Archived tasks will appear here."
            : "Browse ready-made templates to quickly set up your first task."
        }
      />
    </div>
  );
}
