"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "./ThemeProvider";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
}

const lightTheme = EditorView.theme({
  "&": { background: "var(--bg-editor) !important" },
  ".cm-content": { caretColor: "var(--accent)", paddingBottom: "40vh" },
  ".cm-gutters": {
    background: "var(--bg-editor) !important",
    borderRight: "1px solid var(--border) !important",
    color: "var(--text-muted) !important",
  },
  ".cm-activeLineGutter": { background: "transparent !important" },
  ".cm-activeLine": { background: "rgba(74,111,165,0.06) !important" },
  ".cm-selectionBackground, ::selection": { background: "rgba(74,111,165,0.18) !important" },
  ".cm-cursor": { borderLeftColor: "var(--accent) !important" },
});

export function Editor({ value, onChange, onCompositionStart, onCompositionEnd }: Props) {
  const { resolvedTheme } = useTheme();
  const { settings } = useSettings();

  const extensions = [
    markdown({ base: markdownLanguage }),
    ...(settings.lineWrapping ? [EditorView.lineWrapping] : []),
    EditorView.domEventHandlers({
      compositionstart: () => { onCompositionStart?.(); return false; },
      compositionend: () => { onCompositionEnd?.(); return false; },
    }),
  ];

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={resolvedTheme === "dark" ? oneDark : lightTheme}
      basicSetup={{
        lineNumbers: settings.showLineNumbers,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: settings.autoCloseBrackets,
        autocompletion: false,
        highlightSelectionMatches: false,
        searchKeymap: true,
      }}
      style={{ height: "100%", fontSize: `${settings.editorFontSize}px` }}
    />
  );
}
