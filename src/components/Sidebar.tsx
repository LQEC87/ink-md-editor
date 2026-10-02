"use client";

import { useEffect, useState, useCallback } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import AddIcon from "@mui/icons-material/Add";

interface FileEntry {
  name: string;
  size: number;
  updatedAt: string;
}

interface Props {
  currentFile: string | null;
  onSelect: (name: string) => void;
  onNew: () => void;
  refreshTrigger: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${mo}/${day} ${h}:${m}`;
}

export function Sidebar({ currentFile, onSelect, onNew, refreshTrigger }: Props) {
  const { settings, t } = useSettings();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data);
    } catch {
      console.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(false); }, [fetchFiles]);
  useEffect(() => { if (refreshTrigger === 0) return; fetchFiles(true); }, [fetchFiles, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!confirm(`"${name}" ${t.topview.confirmDelete}`)) return;
    await fetch(`/api/files/${encodeURIComponent(name)}`, { method: "DELETE" });
    fetchFiles(true);
  };

  return (
    <aside style={{
      width: `${settings.sidebarWidth}px`,
      flexShrink: 0,
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        height: "28px", padding: "0 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)", flexShrink: 0,
      }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Notes
        </span>
        <button onClick={onNew} title={t.tooltip.onNew} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", padding: "1px", borderRadius: "4px",
          display: "flex", alignItems: "center", transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
          <AddIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: "16px 12px", fontSize: "12px", color: "var(--text-muted)" }}>読み込み中…</div>
        ) : files.length === 0 ? (
          <div style={{ padding: "16px 12px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {t.topview.createNote1}
            <br />
            {t.topview.createNote2}
          </div>
        ) : (
          files.map((f) => (
            <div key={f.name} onClick={() => onSelect(f.name)} style={{
              padding: "9px 12px", cursor: "pointer",
              borderBottom: "1px solid var(--border)",
              background: currentFile === f.name ? "var(--accent-subtle)" : "transparent",
              borderLeft: currentFile === f.name ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "background 0.1s", display: "flex", flexDirection: "column",
              gap: "3px", position: "relative",
            }}
              onMouseEnter={e => {
                if (currentFile !== f.name) e.currentTarget.style.background = "var(--bg-toolbar)";
                const btn = e.currentTarget.querySelector<HTMLElement>(".delete-btn");
                if (btn) btn.style.opacity = "1";
              }}
              onMouseLeave={e => {
                if (currentFile !== f.name) e.currentTarget.style.background = "transparent";
                const btn = e.currentTarget.querySelector<HTMLElement>(".delete-btn");
                if (btn) btn.style.opacity = "0";
              }}>
              <span style={{
                fontSize: "13px", color: "var(--text-primary)",
                fontWeight: currentFile === f.name ? 600 : 400,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "18px",
              }}>{f.name}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(f.updatedAt)}</span>
              <button className="delete-btn" onClick={(e) => handleDelete(e, f.name)} title={t.tooltip.delete}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "14px", lineHeight: 1,
                  padding: "2px 4px", borderRadius: "3px", opacity: 0, transition: "opacity 0.15s, color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e05c5c")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>✕</button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
