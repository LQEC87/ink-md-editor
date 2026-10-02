"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Toolbar } from "@/components/Toolbar";
import { Divider } from "@/components/Divider";
import { Sidebar } from "@/components/Sidebar";
import { AboutPopup } from "@/components/AboutPopup";
import { SettingsModal } from "@/components/SettingsModal";
import { useSettings } from "@/contexts/SettingsContext";

const Editor = dynamic(
  () => import("@/components/Editor").then((m) => m.Editor),
  { ssr: false, loading: () => <div style={{ flex: 1, background: "var(--bg-editor)" }} /> }
);
const MarkdownPreview = dynamic(
  () => import("@/components/MarkdownPreview").then((m) => m.MarkdownPreview),
  { ssr: false, loading: () => <div style={{ flex: 1 }} /> }
);

function countWords(text: string): number {
  const stripped = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$]+\$/g, "");
  return stripped.trim() === "" ? 0 : stripped.trim().split(/\s+/).length;
}

function generateFilename(): string {
  const now = new Date();
  const ts =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");
  return `note_${ts}.md`;
}

export function DesktopView() {
  const { settings, t } = useSettings();
  const [content, setContent] = useState<string>("");
  const [filename, setFilename] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const [splitPercent, setSplitPercent] = useState(settings.defaultSplitPercent);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isComposing = useRef(false);

  const saveToServer = useCallback(async (name: string, text: string) => {
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name, content: text }),
    });
    setSaved(true);
    setSidebarRefresh((n) => n + 1);
  }, []);

  const scheduleTrailingNewline = useCallback((value: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (isComposing.current) { scheduleTrailingNewline(value); return; }
      const finalContent = value.endsWith("\n") ? value : value + "\n";
      if (finalContent !== value) setContent(finalContent);
      setFilename((prev) => {
        const name = prev ?? generateFilename();
        saveToServer(name, finalContent);
        return name;
      });
    }, settings.autoSaveDelay);
  }, [saveToServer, settings.autoSaveDelay]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
    setSaved(false);
    scheduleTrailingNewline(value);
  }, [scheduleTrailingNewline]);

  const handleCompositionStart = useCallback(() => { isComposing.current = true; }, []);
  const handleCompositionEnd = useCallback(() => { isComposing.current = false; }, []);

  const handleSelectFile = useCallback(async (name: string) => {
    const res = await fetch(`/api/files/${encodeURIComponent(name)}`);
    if (!res.ok) return;
    const { content: text } = await res.json();
    setFilename(name);
    setContent(text);
    setSaved(true);
  }, []);

  const handleNew = useCallback(async () => {
    if (!saved && !confirm(t.topview.confirmNew)) return;
    const name = generateFilename();
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name, content: "" }),
    });
    setFilename(name);
    setContent("");
    setSaved(true);
    setSidebarRefresh((n) => n + 1);
  }, [saved]);

  const handleSave = useCallback(() => {
    if (!filename) return;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [filename, content]);

  const handleRenameFile = useCallback(async (newName: string) => {
    if (!filename || newName === filename) return;
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: newName, content }),
    });
    await fetch(`/api/files/${encodeURIComponent(filename)}`, { method: "DELETE" });
    setFilename(newName);
    setSidebarRefresh((n) => n + 1);
  }, [filename, content]);

  const handleOpen = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFilename(file.name);
      setContent(ev.target?.result as string);
      setSaved(false);
    };
    reader.readAsText(file, "utf-8");
    e.target.value = "";
  }, []);

  const handleClear = useCallback(() => {
    if (!confirm(t.topview.confirmClear)) return;
    handleChange("");
  }, [handleChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <input ref={fileInputRef} type="file" accept=".md,.txt" style={{ display: "none" }} onChange={handleFileSelected} />

      {showAbout && <AboutPopup onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      <Toolbar
        filename={filename}
        wordCount={countWords(content)}
        charCount={content.length}
        saved={saved}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onAbout={() => setShowAbout((v) => !v)}
        onSettings={() => setShowSettings((v) => !v)}
        onOpen={handleOpen}
        onSave={handleSave}
        onClear={handleClear}
        onRenameFile={handleRenameFile}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {sidebarOpen && (
          <Sidebar
            currentFile={filename}
            onSelect={handleSelectFile}
            onNew={handleNew}
            refreshTrigger={sidebarRefresh}
          />
        )}

        <div id="split-container" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: `${splitPercent}%`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <PaneHeader label="Editor" />
            <div style={{ flex: 1, overflow: "hidden", borderRight: "1px solid var(--border)" }}>
              <Editor
                value={content}
                onChange={handleChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
              />
            </div>
          </div>

          <Divider onResize={setSplitPercent} />

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <PaneHeader label="Preview" />
            <div style={{ flex: 1, overflow: "auto", background: "var(--bg-preview)" }}>
              <MarkdownPreview content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaneHeader({ label }: { label: string }) {
  return (
    <div style={{
      height: "28px", background: "var(--bg-toolbar)",
      borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0,
    }}>
      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}
