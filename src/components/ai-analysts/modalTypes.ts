import type { AnalystId, Task, TemplateDef } from "@/src/types/aiAnalysts";

export type TaskConfigRequest =
  | { mode: "create"; analystId: AnalystId; template?: TemplateDef }
  | { mode: "edit"; task: Task };

export type ModalsApi = {
  openNewTask: (analystId: AnalystId) => void;
  openTaskConfig: (req: TaskConfigRequest) => void;
  openTaskDetails: (taskId: string) => void;
  openAddSource: (analystId: AnalystId) => void;
};
