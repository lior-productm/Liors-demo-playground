"use client";

import { useCallback, useRef, useState } from "react";

const DRAG_THRESHOLD_PX = 8;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function useDraggablePosition({
  margin = 8,
  getSize,
}: {
  margin?: number;
  getSize: () => { width: number; height: number };
}) {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const dragRef = useRef<{
    originX: number;
    originY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const movedRef = useRef(false);

  const clampPosition = useCallback(
    (left: number, top: number) => {
      const { width, height } = getSize();
      const maxL = Math.max(margin, window.innerWidth - width - margin);
      const maxT = Math.max(margin, window.innerHeight - height - margin);
      return {
        left: clamp(left, margin, maxL),
        top: clamp(top, margin, maxT),
      };
    },
    [getSize, margin],
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number, anchorLeft: number, anchorTop: number) => {
      movedRef.current = false;
      dragRef.current = {
        originX: clientX,
        originY: clientY,
        startLeft: position?.left ?? anchorLeft,
        startTop: position?.top ?? anchorTop,
      };
    },
    [position],
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = clientX - drag.originX;
      const dy = clientY - drag.originY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) movedRef.current = true;
      setPosition(clampPosition(drag.startLeft + dx, drag.startTop + dy));
    },
    [clampPosition],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    const didMove = movedRef.current;
    movedRef.current = false;
    return didMove;
  }, []);

  return {
    position,
    startDrag,
    moveDrag,
    endDrag,
  };
}
