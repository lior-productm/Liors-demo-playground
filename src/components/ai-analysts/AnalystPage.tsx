"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import {
  AnalystBadge,
  PrimaryButton,
  SearchInput,
  TabButton,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import { TemplatesTab } from "@/src/components/ai-analysts/TemplatesTab";
import { TasksTable } from "@/src/components/ai-analysts/TasksTable";
import { SourcesTab } from "@/src/components/ai-analysts/SourcesTab";
import { useAiAnalystsModals } from "@/src/components/ai-analysts/AiAnalystsModals";
import { useAiAnalystTasks } from "@/src/hooks/useAiAnalystTasks";
import { getAnalyst } from "@/src/lib/aiAnalystsData";
import type { AnalystId } from "@/src/types/aiAnalysts";
import { useI18n } from "@/src/hooks/useI18n";

type TabKey = "Templates" | "Tasks" | "Sources";

const TAB_PARAM: Record<string, TabKey> = {
  templates: "Templates",
  tasks: "Tasks",
  sources: "Sources",
};

export function AnalystPage({ analystId }: { analystId: AnalystId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const modals = useAiAnalystsModals();
  const analyst = getAnalyst(analystId);
  const requestedTab = TAB_PARAM[searchParams.get("tab") ?? ""] ?? null;
  const [tab, setTab] = useState<TabKey>(requestedTab ?? "Templates");
  const [query, setQuery] = useState("");

  // `?tab=` is a one-shot instruction (e.g. after activating a task). Apply it
  // and drop it from the URL so later tab clicks and repeat navigations behave.
  useEffect(() => {
    if (!requestedTab) return;
    setTab(requestedTab);
    setQuery("");
    router.replace(pathname, { scroll: false });
  }, [requestedTab, pathname, router]);
  const allTasks = useAiAnalystTasks();
  const q = query.trim().toLowerCase();
  const tasks = allTasks.filter(
    (t) =>
      t.analystId === analystId &&
      t.status !== "archived" &&
      (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
  );

  if (!analyst) {
    return (
      <div className="px-6 pt-8">
        <BackLink onClick={() => router.push("/ai-analysts")} />
        <p className="mt-6 text-[14px] text-[#65686B]">{t("Analyst not found.")}</p>
      </div>
    );
  }

  const tabs: TabKey[] = ["Templates", "Tasks", "Sources"];

  return (
    <div className="flex flex-col gap-6 px-6 pb-12 pt-8">
      <header className="flex flex-col gap-6">
        <BackLink onClick={() => router.push("/ai-analysts")} />

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <AnalystBadge analystId={analystId} size={32} />
            <h1 className="truncate text-[24px] font-medium leading-8 text-[#121212]">
              {t(analyst.title)}
            </h1>
          </div>
          {tab === "Sources" ? (
            <PrimaryButton size="md" onClick={() => modals.openAddSource(analystId)}>
              <Plus size={16} strokeWidth={1.5} /> {t("New source")}
            </PrimaryButton>
          ) : (
            <PrimaryButton size="md" onClick={() => modals.openNewTask(analystId)}>
              <Plus size={16} strokeWidth={1.5} /> {t("New task")}
            </PrimaryButton>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-[#E6E8EB]">
          <div className="flex">
            {tabs.map((tabKey) => (
              <TabButton
                key={tabKey}
                active={tab === tabKey}
                onClick={() => {
                  setTab(tabKey);
                  setQuery("");
                }}
              >
                {t(tabKey)}
              </TabButton>
            ))}
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder={t("Search...")} />
        </div>
      </header>

      {tab === "Templates" ? <TemplatesTab analystId={analystId} query={query} /> : null}
      {tab === "Tasks" ? (
        <TasksTable
          tasks={tasks}
          emptyTitle={q ? t("No tasks match your search") : t("No tasks configured yet")}
          emptyDescription={
            q
              ? t("Try a different keyword or clear the search.")
              : t("Browse ready-made templates to quickly set up your first task.")
          }
        />
      ) : null}
      {tab === "Sources" ? <SourcesTab analystId={analystId} query={query} /> : null}
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-2 text-[16px] font-medium leading-6 text-[#65686B] transition-colors hover:text-[#121212]"
    >
      <ArrowLeft size={24} strokeWidth={1.5} className="rtl:rotate-180" />
      {t("Back to Analysts")}
    </button>
  );
}
