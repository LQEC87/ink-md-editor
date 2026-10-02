"use client";

import { useRef, useCallback } from "react";

interface Props {
  onResize: (leftPercent: number) => void;
}

export function Divider({ onResize }: Props) {
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const container = document.getElementById("split-container");
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      onResize(Math.max(20, Math.min(80, pct)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [onResize]);

  return (
    <div onMouseDown={onMouseDown} style={{
      width: "5px", flexShrink: 0, background: "var(--border)", cursor: "col-resize", transition: "background 0.15s",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--accent)")}
      onMouseLeave={e => (e.currentTarget.style.background = "var(--border)")} />
  );
}
