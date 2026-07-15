"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_IDLE_ROW, SIDEBAR_LINK_CLASS, SIDEBAR_SELECTED_ROW, SIDEBAR_SUBITEM_SELECTED_TEXT } from "@/src/lib/sidebarNavigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TruncatedText } from "@/src/components/ui/TruncatedText";

function SessionTitle({ title, active }: { title: string; active: boolean }) {
  return (
    <TruncatedText
      text={title}
      side="right"
      className={cn(
        SIDEBAR_LINK_CLASS,
        active ? SIDEBAR_SUBITEM_SELECTED_TEXT : "text-[#65686B] font-normal",
      )}
    />
  );
}

export function SidebarChatSessionItem({
  sessionId,
  title,
  isActive,
  hrefBase,
  indent = "pl-[68px]",
  deleteRedirect = "/ask-ai",
  onRename,
  onDelete,
}: {
  sessionId: string;
  title: string;
  isActive: boolean;
  hrefBase: "/ask-ai" | "/workflows";
  indent?: string;
  deleteRedirect?: string;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title) {
      onRename(sessionId, trimmed);
    } else {
      setDraft(title);
    }
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(sessionId);
    setDeleteOpen(false);
    if (isActive) {
      router.push(deleteRedirect);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group flex h-9 w-full min-w-0 items-center gap-1 rounded-[6px] pr-2 transition-colors",
          indent,
          isActive ? SIDEBAR_SELECTED_ROW : SIDEBAR_IDLE_ROW,
        )}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitRename();
              if (event.key === "Escape") {
                setDraft(title);
                setEditing(false);
              }
            }}
            className="min-w-0 flex-1 rounded-[4px] border border-[#A7B2F2] bg-white px-2 py-1 text-[12px] font-normal text-[#353638] outline-none"
            aria-label="Rename chat"
          />
        ) : (
          <button
            type="button"
            onClick={() => router.push(`${hrefBase}/${sessionId}`)}
            className="flex h-full min-w-0 flex-1 items-center py-0 pr-1 text-left"
          >
            <SessionTitle title={title} active={isActive} />
          </button>
        )}

        {!editing ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-6 shrink-0 items-center justify-center rounded-[4px] text-[#7E8185] opacity-0 transition-opacity hover:bg-[#E5E5E5] group-hover:opacity-100 focus:opacity-100"
                aria-label={`Actions for ${title}`}
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil className="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{title}&rdquo; will be removed from your sidebar. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function SidebarCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="flex size-[17px] shrink-0 items-center justify-center rounded-full bg-[#EBEDF9] text-[9px] font-bold leading-none text-[#4F65E5]">
      {count}
    </span>
  );
}

export function EditableSessionTitle({
  title,
  onRename,
  className,
}: {
  title: string;
  onRename: (title: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    } else {
      setDraft(title);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
          if (event.key === "Escape") {
            setDraft(title);
            setEditing(false);
          }
        }}
        className={cn(
          "min-w-0 rounded-[6px] border border-[#A7B2F2] bg-white px-2 py-0.5 text-[13px] font-medium leading-4 text-[#353638] outline-none",
          className,
        )}
        aria-label="Rename chat"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "group flex min-w-0 items-center gap-1.5 text-left transition-colors hover:text-[#233FDE]",
        className ?? SIDEBAR_LINK_CLASS,
        "group-hover:text-[#233FDE]",
      )}
      title="Click to rename"
    >
      <TruncatedText
        text={title}
        side="bottom"
        className={cn(className ?? SIDEBAR_LINK_CLASS, "group-hover:text-[#233FDE]")}
      />
      <Pencil className="size-3.5 shrink-0 text-[#969A9E] opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
