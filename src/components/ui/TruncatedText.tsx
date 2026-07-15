"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TruncatedTextProps = {
  text: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  as?: "span" | "p" | "h1";
};

export function TruncatedText({
  text,
  className,
  side = "right",
  as: Tag = "span",
}: TruncatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setIsTruncated(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    checkTruncation();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, checkTruncation]);

  const node = (
    <Tag ref={ref as never} className={cn("block min-w-0 truncate", className)}>
      {text}
    </Tag>
  );

  if (!isTruncated || !text) return node;

  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="max-w-[min(320px,90vw)] break-words border-[#E5E5E5] bg-white px-3 py-2 text-[13px] font-normal leading-snug text-[#353638] shadow-md"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
