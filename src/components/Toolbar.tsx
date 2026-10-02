"use client";

import { useState, useRef, useEffect } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  filename: string | null;
  wordCount: number;
  charCount: number;
  saved: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onAbout: () => void;
  onSettings: () => void;
  onOpen: () => void;
  onSave: () => void;
  onClear: () => void;
  onRenameFile: (newName: string) => void;
}

export function Toolbar({
  filename, wordCount, charCount, saved, sidebarOpen,
  onToggleSidebar, onAbout, onSettings, onOpen, onSave, onClear, onRenameFile,
}: Props) {
  const { t } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = filename !== null;

  const startEdit = () => {
    if (!filename) return;
    setEditValue(filename);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== filename) {
      const withExt = trimmed.endsWith(".md") ? trimmed : `${trimmed}.md`;
      onRenameFile(withExt);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  return (
    <header style={{
      height: "44px",
      background: "var(--bg-toolbar)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 12px", gap: "4px",
      flexShrink: 0, userSelect: "none",
    }}>
      {/* Sidebar toggle */}
      <button onClick={onToggleSidebar} title={sidebarOpen ? t.tooltip.sidebarToClose : t.tooltip.sidebarToOpen}
        style={{ ...iconBtnStyle, color: sidebarOpen ? "var(--accent)" : "var(--text-muted)" }}>
        {sidebarOpen ? <MenuOpenIcon sx={{ fontSize: 20 }} /> : <MenuIcon sx={{ fontSize: 20 }} />}
      </button>

      {/* Logo */}
      <button onClick={onAbout} title={t.tooltip.versionInfo} style={{
        background: "none", border: "none", cursor: "pointer",
        fontWeight: 700, fontSize: "16px", letterSpacing: "-0.04em",
        color: "var(--text-primary)", margin: "0 6px", padding: "2px 4px",
        borderRadius: "4px", transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}>
        ink
      </button>

      <Sep />

      {/* File actions */}
      <Btn onClick={onOpen} title={t.tooltip.onOpen}>Open</Btn>
      <Btn onClick={onSave} disabled={!hasFile} accent title={t.tooltip.onSave}>Download</Btn>
      <Btn onClick={onClear} disabled={!hasFile} title={t.tooltip.onClear}>Clear</Btn>

      <Sep />

      {/* Filename display / edit */}
      {hasFile ? (
        <div style={{ display: "flex", alignItems: "center", gap: "4px",
          background: "var(--bg-editor)", border: "1px solid var(--border)",
          borderRadius: "6px", padding: "3px 8px", maxWidth: "280px" }}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") cancelEdit(); }}
              onBlur={confirmEdit}
              style={{
                background: "none", border: "none", outline: "none",
                fontSize: "12px", color: "var(--text-primary)",
                width: "200px", fontFamily: "inherit",
              }}
            />
          ) : (
            <>
              <span style={{ fontSize: "12px", color: "var(--text-primary)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {filename}
              </span>
              <span style={{ fontSize: "10px", color: saved ? "var(--text-muted)" : "var(--accent)",
                transition: "color 0.3s", flexShrink: 0 }}>
                {saved ? "✓" : "…"}
              </span>
              <button onClick={startEdit} title={t.tooltip.changeFileName} style={{
                ...iconBtnStyle, padding: "1px", flexShrink: 0, color: "var(--text-muted)",
              }}>
                <EditIcon sx={{ fontSize: 14 }} />
              </button>
            </>
          )}
        </div>
      ) : (
        <span style={{ fontSize: "12px", color: "var(--text-muted)", padding: "0 4px" }}>
          {t.topview.selectNote}
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Stats */}
      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
        {wordCount} words · {charCount} chars
      </span>

      <Sep />

      {/* Settings */}
      <button onClick={onSettings} title={t.tooltip.settings}
        style={{ ...iconBtnStyle, color: "var(--text-muted)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
        <SettingsIcon sx={{ fontSize: 20 }} />
      </button>
    </header>
  );
}

function Sep() {
  return <div style={{ width: "1px", height: "16px", background: "var(--border)", margin: "0 6px", flexShrink: 0 }} />;
}

function Btn({ children, onClick, disabled, accent, title }: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; accent?: boolean; title?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      background: "transparent", border: "none", cursor: disabled ? "default" : "pointer",
      padding: "4px 8px", borderRadius: "5px", fontSize: "13px",
      color: disabled ? "var(--text-muted)" : accent ? "var(--accent)" : "var(--text-secondary)",
      fontWeight: accent ? 600 : 400, opacity: disabled ? 0.5 : 1,
      transition: "background 0.15s",
    }}>
      {children}
    </button>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "transparent", border: "none", cursor: "pointer",
  padding: "4px", borderRadius: "5px", display: "flex",
  alignItems: "center", justifyContent: "center",
  transition: "color 0.15s",
};
