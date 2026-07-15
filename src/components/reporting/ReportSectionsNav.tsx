"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_ITEM_ACTIVE,
  SIDEBAR_ITEM_IDLE,
  SIDEBAR_LABEL_CLASS,
  SIDEBAR_LINK_CLASS,
  SIDEBAR_META_CLASS,
  SIDEBAR_TOPIC_TEXT,
} from "@/src/lib/sidebarNavigation";

type NavSection = { id: string; label: string };

type ReportSectionsNavProps = {
  sections: readonly NavSection[];
  activeSectionId: string;
  onSectionSelect: (id: string) => void;
  updatedLabel: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  editable?: boolean;
  removedSections?: readonly NavSection[];
  onMoveSection?: (id: string, direction: "up" | "down") => void;
  onRemoveSection?: (id: string) => void;
  onRestoreSection?: (id: string) => void;
  onReorderSection?: (activeId: string, overId: string) => void;
};

function SectionRow({
  section,
  isActive,
  isFirst,
  isLast,
  editable,
  onSectionSelect,
  onMoveSection,
  onRemoveSection,
}: {
  section: NavSection;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  editable: boolean;
  onSectionSelect: (id: string) => void;
  onMoveSection?: (id: string, direction: "up" | "down") => void;
  onRemoveSection?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: section.id, disabled: !editable });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: section.id,
    disabled: !editable,
  });

  const setRefs = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  return (
    <div
      ref={setRefs}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "group relative flex h-9 w-full items-center gap-1 rounded-[6px] pr-1 transition-colors",
        editable ? "pl-1" : "pl-2",
        isActive ? SIDEBAR_ITEM_ACTIVE : SIDEBAR_ITEM_IDLE,
        isDragging && "z-10 opacity-50",
        isOver && !isDragging && "ring-2 ring-inset ring-[#A7B2F2]",
      )}
    >
      {editable ? (
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className="flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-[#B3B8BD] opacity-0 transition-opacity hover:text-[#65686B] group-hover:opacity-100 active:cursor-grabbing"
          aria-label={`Drag ${section.label} to reorder`}
        >
          <GripVertical className="size-4" strokeWidth={1.75} />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => onSectionSelect(section.id)}
        className={cn(
          "flex min-w-0 flex-1 items-center truncate text-left",
          SIDEBAR_LABEL_CLASS,
        )}
      >
        <span className="truncate">{section.label}</span>
      </button>

      {editable ? (
        <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMoveSection?.(section.id, "up")}
            className="flex size-6 items-center justify-center rounded text-[#65686B] hover:bg-[#E6E8EB] disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label={`Move ${section.label} up`}
          >
            <ChevronUp className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMoveSection?.(section.id, "down")}
            className="flex size-6 items-center justify-center rounded text-[#65686B] hover:bg-[#E6E8EB] disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label={`Move ${section.label} down`}
          >
            <ChevronDown className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onRemoveSection?.(section.id)}
            className="flex size-6 items-center justify-center rounded text-[#65686B] hover:bg-[#FBE9E7] hover:text-[#B23A2F]"
            aria-label={`Remove ${section.label}`}
          >
            <Trash2 className="size-3.5" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ReportSectionsNav({
  sections,
  activeSectionId,
  onSectionSelect,
  updatedLabel,
  collapsed = false,
  onToggleCollapse,
  editable = false,
  removedSections = [],
  onMoveSection,
  onRemoveSection,
  onRestoreSection,
  onReorderSection,
}: ReportSectionsNavProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId !== overId) onReorderSection?.(activeId, overId);
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
        aria-label="Expand sections"
      >
        <PanelLeftOpen className="size-6" strokeWidth={1.5} />
      </button>
    );
  }

  const sectionRows = sections.map((section, index) => (
    <SectionRow
      key={section.id}
      section={section}
      isActive={section.id === activeSectionId}
      isFirst={index === 0}
      isLast={index === sections.length - 1}
      editable={editable}
      onSectionSelect={onSectionSelect}
      onMoveSection={onMoveSection}
      onRemoveSection={onRemoveSection}
    />
  ));

  return (
    <aside className="flex w-[208px] shrink-0 flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full bg-[#FBF2DC] px-2 py-0.5",
              SIDEBAR_LABEL_CLASS,
              "font-medium text-[#856404]",
            )}
          >
            In Review
          </span>
          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
              aria-label="Collapse sections"
            >
              <PanelLeftClose className="size-6" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
        <p className={cn("mt-0 h-6", SIDEBAR_META_CLASS)}>{updatedLabel}</p>
        <button type="button" className={cn("h-6 w-fit text-left hover:underline", SIDEBAR_LINK_CLASS)}>
          View version history
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
        <p className={cn("flex h-9 items-center", SIDEBAR_LABEL_CLASS, SIDEBAR_TOPIC_TEXT)}>
          Sections
        </p>
        {editable && onReorderSection ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {sectionRows}
          </DndContext>
        ) : (
          sectionRows
        )}
      </nav>

      {editable && removedSections.length > 0 ? (
        <div className="flex flex-col gap-0.5 border-t border-[#E6E8EB] pt-3">
          <p className={cn("flex h-9 items-center", SIDEBAR_LABEL_CLASS, SIDEBAR_TOPIC_TEXT)}>
            Removed
          </p>
          {removedSections.map((section) => (
            <div
              key={section.id}
              className="flex h-9 w-full items-center gap-1 rounded-[6px] pl-2 pr-1"
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[#9AA0A6] line-through",
                  SIDEBAR_LABEL_CLASS,
                )}
              >
                {section.label}
              </span>
              <button
                type="button"
                onClick={() => onRestoreSection?.(section.id)}
                className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-[#4C61DB] hover:bg-[#F7F8FF]"
                aria-label={`Restore ${section.label}`}
              >
                <RotateCcw className="size-3.5" strokeWidth={1.75} />
                Restore
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
