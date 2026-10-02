"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface AppSettings {
  editorFontSize: number;
  previewFontSize: number;
  showLineNumbers: boolean;
  breaksEnabled: boolean;
  autoCloseBrackets: boolean;
  lineWrapping: boolean;
  autoSaveDelay: number;
  defaultSplitPercent: number;
  sidebarWidth: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  editorFontSize: 14,
  previewFontSize: 15,
  showLineNumbers: true,
  breaksEnabled: false,
  autoCloseBrackets: true,
  lineWrapping: true,
  autoSaveDelay: 800,
  defaultSplitPercent: 50,
  sidebarWidth: 220,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem("ink-settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {}
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("ink-settings", JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
