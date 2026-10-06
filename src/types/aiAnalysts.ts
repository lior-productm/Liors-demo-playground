/**
 * Domain model for the AI Analysts feature (clickable demo, mock data + local state).
 * No backend — everything is seeded from `aiAnalystsData.ts` and persisted to localStorage.
 */

export type AnalystId =
  | "financial"
  | "commercial"
  | "technical"
  | "debt"
  | "service-charges";

/** Per-analyst color scale (Figma: Analyst/50, /100, /700, /500). */
export type AnalystColors = {
  /** Light surface — icon badge + chip background. */
  bg: string;
  /** Border for icon badge + chips. */
  border: string;
  /** Chip text. */
  text: string;
  /** Icon stroke / accent. */
  accent: string;
};

export type ScopeLevel = "portfolio" | "entity" | "property" | "tenant";

export type FrequencyKind =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type TaskType = "template" | "custom";

export type TaskStatus = "active" | "paused" | "archived";

export type SubtaskStatus = "active" | "paused";

export type SourceType = "file" | "link" | "text";

/** A node in the scope hierarchy: portfolio -> entity -> property -> tenant. */
export type ScopeNode = {
  id: string;
  name: string;
  level: ScopeLevel;
  children?: ScopeNode[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

/** A predefined piece of work an Analyst offers, shown as a card in the Templates tab. */
export type TemplateDef = {
  id: string;
  analystId: AnalystId;
  name: string;
  description: string;
  defaultScopeLevel: ScopeLevel;
  defaultFrequency: FrequencyKind;
};

export type AnalystDef = {
  id: AnalystId;
  /** Short name used on cards and chips, e.g. "Financial". */
  name: string;
  /** Full title, e.g. "Financial Analyst". */
  title: string;
  description: string;
  /** TEMPLATE EXAMPLES chips on the analyst card. */
  templateExamples: string[];
  /** Only Financial is fully designed; the rest use placeholder templates. */
  fullyDesigned: boolean;
  /** Public path to the analyst's 18px line icon (stroke color baked in). */
  icon: string;
  colors: AnalystColors;
};

/** Which level is selected and the picked node ids at that level. */
export type ScopeSelection = {
  level: ScopeLevel | null;
  ids: string[];
};

export type FrequencyConfig = {
  kind: FrequencyKind;
  time: string; // "09:00"
  timezone: string; // "Europe/Amsterdam"
  /** once -> ISO yyyy-mm-dd */
  date?: string;
  /** weekly -> 0..6 (Mon..Sun) */
  weekdays?: number[];
  /** monthly -> e.g. "The first business day" */
  monthlyOn?: string;
  /** quarterly -> starting quarter */
  quarterlyStart?: "Q1" | "Q2" | "Q3" | "Q4";
  /** yearly */
  yearlyMonth?: number; // 0..11
  yearlyDay?: number; // 1..31
};

export type Subtask = {
  id: string;
  name: string;
  scope: ScopeSelection;
  includeGeneralInstruction: boolean;
  instructions: string;
  recipientIds: string[];
  status: SubtaskStatus;
};

export type TaskVersion = {
  id: string;
  label: string; // "v1.1"
  createdOn: string; // display date
  owner: string;
  lastModified: string;
};

export type TaskOutput = {
  id: string;
  date: string;
  version: string;
  name: string;
  summary: string;
  preview: string;
};

export type Task = {
  id: string;
  analystId: AnalystId;
  type: TaskType;
  templateId?: string;
  name: string;
  description: string;
  scope: ScopeSelection;
  instructions: string;
  sharedWithIds: string[];
  frequency: FrequencyConfig;
  subtasks: Subtask[];
  ownerId: string;
  status: TaskStatus;
  sourceIds: string[];
  versions: TaskVersion[];
  outputs: TaskOutput[];
  createdAt: number;
};

export type Source = {
  id: string;
  analystId: AnalystId;
  name: string;
  type: SourceType;
  addedById: string;
  addedAt: number;
  lastEditedAt: number;
  url?: string;
  text?: string;
};
