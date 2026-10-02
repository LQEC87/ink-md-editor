"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { DesktopView } from "@/components/DesktopView";
import { MobileView } from "@/components/MobileView";

function AppRouter() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 657);
    check();
    window.addEventListener("resize", check);
    setMounted(true);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: "100vh", background: "var(--bg-app)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>読み込み中…</span>
      </div>
    );
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}

export default function Page() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppRouter />
      </SettingsProvider>
    </ThemeProvider>
  );
}
