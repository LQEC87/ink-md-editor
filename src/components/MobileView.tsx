"use client";

export function MobileView() {
  return (
    <div style={{
      height: "100lvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-app)", padding: "0", textAlign: "center", gap: "16px",
    }}>
      <span style={{ fontSize: "40px" }}>🖥️</span>
      <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
        スマートフォンには対応していません
      </h1>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
        PCまたはタブレットからアクセスしてください。<br />
        モバイル対応は今後追加予定です。
      </p>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>ink — Markdown Editor</p>
    </div>
  );
}
