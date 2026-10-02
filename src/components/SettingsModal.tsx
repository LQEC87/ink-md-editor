"use client";

import { useRef, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme, Theme } from "@/components/ThemeProvider";

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const { settings, updateSetting } = useSettings();
  const { theme, setTheme } = useTheme();
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
        background: "var(--bg-preview)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px 28px",
        width: "420px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>設定</span>
          <button onClick={onClose} style={closeBtnStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>✕</button>
        </div>

        {/* ── 表示 ── */}
        <Section title="表示">
          {/* Theme */}
          <SettingRow label="テーマ">
            <div style={{ display: "flex", gap: "6px" }}>
              {(["system", "light", "dark"] as Theme[]).map((t) => (
                <button key={t} onClick={() => setTheme(t)} style={{
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px",
                  border: "1px solid var(--border)", cursor: "pointer",
                  background: theme === t ? "var(--accent)" : "transparent",
                  color: theme === t ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s",
                }}>
                  {t === "system" ? "System" : t === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Editor font size */}
          <SettingRow label="エディタ文字サイズ" sub={`${settings.editorFontSize}px`}>
            <input type="range" min={11} max={22} value={settings.editorFontSize}
              onChange={e => updateSetting("editorFontSize", Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent)" }} />
          </SettingRow>

          {/* Preview font size */}
          <SettingRow label="プレビュー文字サイズ" sub={`${settings.previewFontSize}px`}>
            <input type="range" min={12} max={22} value={settings.previewFontSize}
              onChange={e => updateSetting("previewFontSize", Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent)" }} />
          </SettingRow>

          {/* Line numbers */}
          <SettingRow label="行番号を表示">
            <Toggle enabled={settings.showLineNumbers}
              onToggle={() => updateSetting("showLineNumbers", !settings.showLineNumbers)} />
          </SettingRow>
        </Section>

        {/* ── 編集 ── */}
        <Section title="編集">
          {/* Breaks */}
          <SettingRow label="改行をそのまま反映" sub="行末の \ なし・スペース2つでも改行可">
            <Toggle enabled={settings.breaksEnabled}
              onToggle={() => updateSetting("breaksEnabled", !settings.breaksEnabled)} />
          </SettingRow>

          {/* Auto close brackets */}
          <SettingRow label="括弧を自動で閉じる">
            <Toggle enabled={settings.autoCloseBrackets}
              onToggle={() => updateSetting("autoCloseBrackets", !settings.autoCloseBrackets)} />
          </SettingRow>

          {/* Line wrapping */}
          <SettingRow label="行の折り返し">
            <Toggle enabled={settings.lineWrapping}
              onToggle={() => updateSetting("lineWrapping", !settings.lineWrapping)} />
          </SettingRow>
        </Section>

        {/* ── 保存 ── */}
        <Section title="保存">
          <SettingRow label="自動保存の遅延" sub={`${settings.autoSaveDelay}ms`}>
            <input type="range" min={300} max={3000} step={100} value={settings.autoSaveDelay}
              onChange={e => updateSetting("autoSaveDelay", Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent)" }} />
          </SettingRow>
        </Section>

        {/* ── レイアウト ── */}
        <Section title="レイアウト">
          <SettingRow label="デフォルトのペイン比率" sub={`${settings.defaultSplitPercent}%`}>
            <input type="range" min={20} max={80} value={settings.defaultSplitPercent}
              onChange={e => updateSetting("defaultSplitPercent", Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent)" }} />
          </SettingRow>

          <SettingRow label="サイドバーの幅" sub={`${settings.sidebarWidth}px`}>
            <input type="range" min={160} max={340} step={10} value={settings.sidebarWidth}
              onChange={e => updateSetting("sidebarWidth", Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent)" }} />
          </SettingRow>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {title}
      </p>
      {children}
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />
    </div>
  );
}

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
      <div>
        <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: "36px", height: "20px", borderRadius: "10px", border: "none",
      background: enabled ? "var(--accent)" : "var(--border)",
      cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: "2px", left: enabled ? "18px" : "2px",
        width: "16px", height: "16px", borderRadius: "50%",
        background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

const closeBtnStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "var(--text-muted)", fontSize: "18px", lineHeight: 1,
  padding: "2px 6px", borderRadius: "4px", transition: "color 0.15s",
};
