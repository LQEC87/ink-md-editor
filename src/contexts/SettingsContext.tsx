"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ja } from "@/dictionaries/ja";
import { en } from "@/dictionaries/en";

type Dictionary = typeof ja;
const dictionaries = { ja, en };

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
  editorLanguage: boolean;
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
  editorLanguage: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  t: Dictionary;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  t: dictionaries.ja,
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
    <SettingsContext.Provider value={{ settings, updateSetting, t: settings.editorLanguage ? dictionaries.en : dictionaries.ja }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
