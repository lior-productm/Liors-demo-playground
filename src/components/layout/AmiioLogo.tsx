import { cn } from "@/lib/utils";

/** Figma logo frame (830:52770 / 830:52773) — base container 70.923×31.254, mark 69.942×18.67. */
const LOGO_SCALE = 1.2;
const LOGO_FRAME_W = 70.923 * LOGO_SCALE;
const LOGO_FRAME_H = 31.254 * LOGO_SCALE;
const LOGO_MARK_W = 69.942 * LOGO_SCALE;
const LOGO_MARK_H = 18.67 * LOGO_SCALE;
const LOGO_MARK_LEFT = 0.42 * LOGO_SCALE;
const LOGO_MARK_TOP_OFFSET = -0.28 * LOGO_SCALE;

export function AmiioLogo({
  className,
  "aria-label": ariaLabel = "Amiio",
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      className={cn("relative shrink-0 overflow-clip", className)}
      style={{ width: LOGO_FRAME_W, height: LOGO_FRAME_H }}
      role="img"
      aria-label={ariaLabel}
    >
      <img
        src="/amiio-wordmark.svg"
        alt=""
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          width: LOGO_MARK_W,
          height: LOGO_MARK_H,
          left: LOGO_MARK_LEFT,
          top: `calc(50% + ${LOGO_MARK_TOP_OFFSET}px)`,
          transform: "translateY(-50%)",
        }}
        draggable={false}
      />
    </div>
  );
}

/** Collapsed sidebar mark — Figma 1172:59409 (23×24, A + blue period). */
export function AmiioCollapsedMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: 23, height: 24 }}
      role="img"
      aria-label="Amiio"
    >
      <img
        src="/amiio-collapsed-mark.svg"
        alt=""
        className="pointer-events-none block size-full select-none"
        draggable={false}
      />
    </span>
  );
}
