"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type Position = { x: number; y: number };

export function useFloatingPosition() {
  const [position, setPosition] = useState<Position | null>(null);
  const drag = useRef<{ startX: number; startY: number; left: number; top: number } | null>(null);
  const moved = useRef(false);
  const element = useRef<HTMLAnchorElement>(null);

  function clamp(x: number, y: number): Position {
    const rect = element.current?.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - (rect?.width ?? 0))),
      y: Math.max(0, Math.min(y, window.innerHeight - (rect?.height ?? 0))),
    };
  }

  useEffect(() => {
    const resize = () => setPosition((current) => current ? clamp(current.x, current.y) : null);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    if (event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = { startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    if (Math.hypot(dx, dy) < 5 && !moved.current) return;
    moved.current = true;
    setPosition(clamp(drag.current.left + dx, drag.current.top + dy));
  }

  function onKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    const directions: Record<string, Position> = {
      ArrowLeft: { x: -20, y: 0 }, ArrowRight: { x: 20, y: 0 },
      ArrowUp: { x: 0, y: -20 }, ArrowDown: { x: 0, y: 20 },
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(clamp(rect.left + direction.x, rect.top + direction.y));
  }

  return {
    ref: element,
    style: position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined,
    onPointerDown,
    onPointerMove,
    onPointerUp: () => { drag.current = null; },
    onPointerCancel: () => { drag.current = null; },
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => { if (moved.current) { event.preventDefault(); moved.current = false; } },
    onKeyDown,
  };
}
