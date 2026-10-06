"use client";

import { Folder, Home, LayoutGrid, Search, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getAnalyst, userInitials } from "@/src/lib/aiAnalystsData";
import type { AnalystId, ScopeLevel, TaskType } from "@/src/types/aiAnalysts";

/* -------------------------------------------------------------------------- */
/*  Shared design tokens (Figma "Analysts & Tasks")                           */
/* -------------------------------------------------------------------------- */

/** Light, blurred backdrop used by every AI Analysts modal. */
export const MODAL_OVERLAY_CLASS = "bg-[#010309]/20 backdrop-blur-[6px]";

/** Card surface used for templates, tables and configuration sections. */
export const CARD_BORDER = "border border-[rgba(230,231,232,0.7)]";

export const FOCUS_GLOW = "shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]";

/* -------------------------------------------------------------------------- */
/*  Tags & badges                                                             */
/* -------------------------------------------------------------------------- */

/** Neutral "Tag": bg #E6E8EB, 12px medium, optional leading 16px icon. */
export function Tag({
  children,
  icon,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-[16px] bg-[#E6E8EB] px-2 text-[12px] font-medium leading-4 text-[#353638]",
        className,
      )}
    >
      {icon ? <span className="inline-flex size-4 shrink-0 items-center justify-center">{icon}</span> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Analyst-tinted pill (Analyst/50 bg, /100 border, /700 text). */
export function AnalystTag({
  analystId,
  children,
  icon,
  className,
}: {
  analystId: AnalystId;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const colors = getAnalyst(analystId)?.colors;
  return (
    <span
      style={{
        backgroundColor: colors?.bg,
        borderColor: colors?.border,
        color: colors?.text,
      }}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-[16px] border px-2 text-[12px] font-medium leading-4",
        className,
      )}
    >
      {icon ? <span className="inline-flex size-4 shrink-0 items-center justify-center">{icon}</span> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Task type badge: Template = analyst tint, Custom = white outline. */
export function TypeBadge({ type, analystId }: { type: TaskType; analystId: AnalystId }) {
  if (type === "template") return <AnalystTag analystId={analystId}>Template</AnalystTag>;
  return (
    <span className="inline-flex h-6 items-center rounded-[16px] border border-[#D1D5D9] bg-white px-2 text-[12px] font-medium leading-4 text-[#353638]">
      Custom
    </span>
  );
}

/** "Link Chip" — tertiary-tinted pill with a scope-level icon (template cards). */
export function LinkChip({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-[12px] bg-[#EBEDF9] px-2 text-[12px] leading-4 text-[#353638]",
        className,
      )}
    >
      {icon ? <span className="inline-flex size-3 shrink-0 items-center justify-center">{icon}</span> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Analyst icon                                                              */
/* -------------------------------------------------------------------------- */

export function AnalystIcon({
  analystId,
  size = 18,
  className,
}: {
  analystId: AnalystId;
  size?: number;
  className?: string;
}) {
  const analyst = getAnalyst(analystId);
  if (!analyst) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={analyst.icon}
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0", className)}
    />
  );
}

/** 32px rounded square badge with the analyst icon on its tinted surface. */
export function AnalystBadge({
  analystId,
  size = 32,
  className,
}: {
  analystId: AnalystId;
  size?: number;
  className?: string;
}) {
  const colors = getAnalyst(analystId)?.colors;
  const icon = Math.round(size * 0.5625);
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: colors?.bg,
        borderColor: colors?.border,
        borderRadius: Math.round(size * 0.28),
      }}
      className={cn("inline-flex shrink-0 items-center justify-center border", className)}
    >
      <AnalystIcon analystId={analystId} size={icon} />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scope level icon                                                          */
/* -------------------------------------------------------------------------- */

export function ScopeLevelIcon({
  level,
  size = 12,
  className,
}: {
  level: ScopeLevel;
  size?: number;
  className?: string;
}) {
  const props = { size, strokeWidth: 1.5, className: cn("shrink-0", className) };
  if (level === "portfolio") return <LayoutGrid {...props} />;
  if (level === "entity") return <Folder {...props} />;
  if (level === "property") return <Home {...props} />;
  return <User {...props} />;
}

/* -------------------------------------------------------------------------- */
/*  People                                                                    */
/* -------------------------------------------------------------------------- */

export function UserAvatar({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.max(8, Math.round(size * 0.4)) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#E6E8EB] font-medium uppercase leading-none text-[#2C2C2C]",
        className,
      )}
    >
      {userInitials(name)}
    </span>
  );
}

/** Avatar + name — owner cells. */
export function UserInline({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 text-[14px] leading-5 text-[#353638]", className)}>
      <UserAvatar name={name} size={24} />
      <span className="truncate">{name}</span>
    </span>
  );
}

/** White outlined chip with avatar, name and optional remove cross. */
export function UserChip({ name, onRemove }: { name: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-[20px] border border-[#D1D5D9] bg-white py-1 pl-1 pr-2 text-[14px] leading-5 text-[#353638]">
      <UserAvatar name={name} size={24} />
      <span className="truncate">{name}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="ml-0.5 inline-flex size-3 items-center justify-center text-[#65686B] hover:text-[#010309]"
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inputs                                                                    */
/* -------------------------------------------------------------------------- */

/** Rounded search field (h32 on page headers, h40 inside cards). */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  size = "sm",
  trailing,
  autoFocus,
  onFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
  trailing?: React.ReactNode;
  autoFocus?: boolean;
  onFocus?: () => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 rounded-[32px] border bg-white",
        size === "sm" ? "h-8 w-[209px] px-3" : "h-10 w-full px-4",
        size === "md"
          ? "border-[#D3D9F8] focus-within:shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]"
          : "border-[#D1D5D9]",
        className,
      )}
    >
      <Search size={16} strokeWidth={1.5} className="shrink-0 text-[#65686B]" aria-hidden />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-[#353638] outline-none placeholder:text-[#969A9E]"
      />
      {trailing}
    </label>
  );
}

export const TEXT_INPUT_CLASS =
  "h-10 w-full rounded-[8px] border border-[#D1D5D9] bg-white px-3 text-[14px] leading-5 text-[#353638] outline-none placeholder:text-[#969A9E] focus:border-[#A7B2F2] focus:shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]";

export const FIELD_INPUT_CLASS =
  "h-11 w-full rounded-[8px] border border-[#E6E8EB] bg-[#F7F8FA] px-3 text-[16px] leading-6 text-[#353638] outline-none placeholder:text-[#969A9E] focus:border-[#A7B2F2] focus:bg-white";

/* -------------------------------------------------------------------------- */
/*  Buttons                                                                   */
/* -------------------------------------------------------------------------- */

type ButtonSize = "sm" | "md" | "lg";

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[14px]",
  md: "h-10 px-3.5 text-[14px]",
  lg: "h-12 px-4 text-[14px]",
};

export function PrimaryButton({
  children,
  size = "md",
  className,
  danger,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-[32px] font-medium leading-5 transition-colors",
        BUTTON_SIZE[size],
        danger
          ? "bg-[#A22D3B] text-white hover:bg-[#8D2432] disabled:bg-[#B3B8BD] disabled:text-[#7E8185]"
          : "bg-[#010309] text-[#F0F2F5] hover:bg-black disabled:cursor-not-allowed disabled:bg-[#B3B8BD] disabled:text-[#7E8185]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: ButtonSize }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white font-medium leading-5 text-[#010309] transition-colors hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:text-[#B3B8BD]",
        BUTTON_SIZE[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  label,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#65686B] transition-colors hover:bg-[#F0F2F5] hover:text-[#010309]",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toggle                                                                    */
/* -------------------------------------------------------------------------- */

/** Black track / white knob switch (Figma "Toggle"). */
export function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-[#010309]" : "bg-[#D1D5D9]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-1 size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Checkbox                                                                  */
/* -------------------------------------------------------------------------- */

export function CheckBox({
  checked,
  onChange,
  className,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] transition-colors",
        checked
          ? "bg-[#010309] text-white"
          : "border border-[#D1D5D9] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {checked ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tabs                                                                      */
/* -------------------------------------------------------------------------- */

export function TabButton({
  active,
  children,
  onClick,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-12 shrink-0 px-4 text-[16px] font-medium leading-6 transition-colors",
        active ? "text-[#121212]" : "text-[#65686B] hover:text-[#353638]",
        className,
      )}
    >
      {children}
      {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#121212]" /> : null}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal chrome                                                              */
/* -------------------------------------------------------------------------- */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[14px] font-medium uppercase leading-5 tracking-[0.02em] text-[#7E8185]", className)}>
      {children}
    </p>
  );
}

export function ModalCloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={cn(
        "absolute right-6 top-6 inline-flex size-6 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]",
        className,
      )}
    >
      <X size={16} strokeWidth={1.5} />
    </button>
  );
}

/** Centered confirmation dialog with a round icon, title, body and two pill buttons. */
export function ConfirmDialog({
  open,
  onOpenChange,
  icon,
  title,
  description,
  cancelLabel = "Cancel",
  actionLabel,
  onAction,
  danger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  cancelLabel?: string;
  actionLabel: string;
  onAction: () => void;
  danger?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={MODAL_OVERLAY_CLASS}
        className="w-[340px] max-w-[92vw] gap-0 rounded-[12px] border-0 bg-[#F7F8FA] p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
      >
        <ModalCloseButton onClick={() => onOpenChange(false)} className="right-4 top-4" />
        <div className="flex flex-col items-center px-6 pb-6 pt-10 text-center">
          <span
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full text-white",
              danger ? "bg-[#A22D3B]" : "bg-[#010309]",
            )}
          >
            {icon}
          </span>
          <DialogTitle className="mt-6 text-[20px] font-medium leading-7 tracking-normal text-[#121212]">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-[14px] leading-5 text-[#353638]">
            {description}
          </DialogDescription>
          <div className="mt-6 flex items-center gap-3">
            <OutlineButton size="md" className="h-11 px-5" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </OutlineButton>
            <PrimaryButton size="md" className="h-11 px-5" danger={danger} onClick={onAction}>
              {actionLabel}
            </PrimaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                               */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-10 text-center", className)}>
      <EmptyIllustration />
      <p className="mt-6 text-[14px] font-medium leading-5 text-[#353638]">{title}</p>
      {description ? <p className="mt-1 text-[12px] leading-4 text-[#65686B]">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function EmptyIllustration() {
  return (
    <svg width="132" height="84" viewBox="0 0 132 84" fill="none" aria-hidden>
      <circle cx="78" cy="40" r="40" fill="#EEF1F5" />
      <rect x="18" y="18" width="88" height="56" rx="6" fill="#FFFFFF" stroke="#D1D5D9" />
      <rect x="18" y="18" width="88" height="12" rx="6" fill="#E6E8EB" />
      <rect x="26" y="36" width="12" height="4" rx="2" fill="#D1D5D9" />
      <rect x="44" y="36" width="54" height="4" rx="2" fill="#E6E8EB" />
      <rect x="26" y="46" width="12" height="4" rx="2" fill="#D1D5D9" />
      <rect x="44" y="46" width="54" height="4" rx="2" fill="#E6E8EB" />
      <rect x="26" y="56" width="12" height="4" rx="2" fill="#D1D5D9" />
      <rect x="44" y="56" width="40" height="4" rx="2" fill="#E6E8EB" />
      <circle cx="108" cy="22" r="10" fill="#FFFFFF" stroke="#D1D5D9" />
      <path d="M105.6 19.6c.4-1.2 1.4-1.8 2.6-1.8 1.4 0 2.4.9 2.4 2.1 0 1.8-2.4 1.9-2.4 3.4" stroke="#7E8185" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="108.2" cy="26.4" r=".9" fill="#7E8185" />
      <path d="M8 60l2 2 2-2M120 68l1.5 1.5 1.5-1.5" stroke="#D1D5D9" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export { Search as SearchIcon };
