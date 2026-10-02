"use client";

import { useEffect, useRef } from "react";
import packageJson from "../../package.json";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  onClose: () => void;
}

export function AboutPopup({ onClose }: Props) {
  const { t } = useSettings();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "var(--bg-preview)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "28px 28px 24px", width: "320px",
        display: "flex", flexDirection: "column", gap: "16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontWeight: 700, fontSize: "20px", letterSpacing: "-0.04em", color: "var(--text-primary)" }}>ink</span>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>v{packageJson.version}</span>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", fontSize: "18px", lineHeight: 1,
            padding: "2px 6px", borderRadius: "4px", transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>✕</button>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
          {t.topview.description}
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>© 2025 ink contributors</p>
      </div>
    </div>
  );
}
