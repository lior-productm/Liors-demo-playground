"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { NewTaskModal } from "@/src/components/ai-analysts/NewTaskModal";
import { TaskConfigModal } from "@/src/components/ai-analysts/TaskConfigModal";
import { TaskDetailsModal } from "@/src/components/ai-analysts/TaskDetailsModal";
import { AddSourceModal } from "@/src/components/ai-analysts/AddSourceModal";
import { useAiAnalystsChat } from "@/src/components/ai-analysts/AiAnalystsChatContext";
import type { ModalsApi, TaskConfigRequest } from "@/src/components/ai-analysts/modalTypes";
import type { AnalystId } from "@/src/types/aiAnalysts";

const ModalsContext = createContext<ModalsApi>({
  openNewTask: () => {},
  openTaskConfig: () => {},
  openTaskDetails: () => {},
  openAddSource: () => {},
});

export function useAiAnalystsModals() {
  return useContext(ModalsContext);
}

export function AiAnalystsModalsProvider({ children }: { children: React.ReactNode }) {
  const { openChat } = useAiAnalystsChat();
  const [newTask, setNewTask] = useState<{ analystId: AnalystId } | null>(null);
  const [config, setConfig] = useState<TaskConfigRequest | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [addSourceAnalyst, setAddSourceAnalyst] = useState<AnalystId | null>(null);

  const api = useMemo<ModalsApi>(
    () => ({
      openNewTask: (analystId) => setNewTask({ analystId }),
      openTaskConfig: (req) => setConfig(req),
      openTaskDetails: (taskId) => setDetailsId(taskId),
      openAddSource: (analystId) => setAddSourceAnalyst(analystId),
    }),
    [],
  );

  return (
    <ModalsContext.Provider value={api}>
      {children}

      {newTask ? (
        <NewTaskModal
          open
          analystId={newTask.analystId}
          onOpenChange={(o) => !o && setNewTask(null)}
          onPickTemplate={(template) => {
            const analystId = newTask.analystId;
            setNewTask(null);
            setConfig({ mode: "create", analystId, template });
          }}
          onCustom={() => {
            setNewTask(null);
            openChat();
          }}
        />
      ) : null}

      {config ? (
        <TaskConfigModal
          open
          request={config}
          onOpenChange={(o) => !o && setConfig(null)}
        />
      ) : null}

      {detailsId ? (
        <TaskDetailsModal
          open
          taskId={detailsId}
          onOpenChange={(o) => !o && setDetailsId(null)}
          onEditTemplate={(task) => {
            setDetailsId(null);
            setConfig({ mode: "edit", task });
          }}
          onEditCustom={() => {
            setDetailsId(null);
            openChat();
          }}
        />
      ) : null}

      {addSourceAnalyst ? (
        <AddSourceModal
          open
          analystId={addSourceAnalyst}
          onOpenChange={(o) => !o && setAddSourceAnalyst(null)}
        />
      ) : null}
    </ModalsContext.Provider>
  );
}
