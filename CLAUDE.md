# ink — Markdown Editor

> KaTeX数式対応・サーバー保存・設定モーダル付きのNext.js製Markdownエディタ (v0.3.0)

**IMPORTANT: Respond in Japanese (comments and code should be in English)**
**IMPORTANT: ファイルを編集する前に必ず「実装して」という指示を待つこと**
**NEVER: 変更箇所の説明を求められたときにファイルを編集してはいけない**

---

## Commands

```bash
npm run dev      # 開発サーバー起動 (localhost:3000)
npm run build    # 本番ビルド (.next/standalone に出力)
npm run lint     # ESLint
node .next/standalone/server.js  # 本番起動
```

サーバー保存先: `notes/*.md`（プロジェクトルート直下）

---

## Architecture

```
src/
  app/
    page.tsx                       # ルーター: 幅657px未満→MobileView, 以上→DesktopView
    layout.tsx                     # メタデータのみ
    globals.css                    # CSS変数(--bg-*, --text-*, --accent)・プレビューCSS
    api/files/route.ts             # GET(一覧) / POST(保存)
    api/files/[filename]/route.ts  # GET(読込) / DELETE(削除)
  components/
    DesktopView.tsx      # メインUI・状態管理・IME対応デバウンス
    MobileView.tsx       # スマホ非対応画面（将来差し替え前提）
    Toolbar.tsx          # MUIアイコン・ファイル名インライン編集
    Sidebar.tsx          # ファイル一覧（サイレント更新）
    Editor.tsx           # CodeMirror 6・IMEイベント対応
    MarkdownPreview.tsx  # react-markdown + KaTeX + highlight.js
    Divider.tsx          # split-containerを基準にリサイズ
    ThemeProvider.tsx    # light/dark/system テーマ
    AboutPopup.tsx       # バージョン情報モーダル（ink ロゴクリック）
    SettingsModal.tsx    # 全設定モーダル（歯車アイコン）
  contexts/
    SettingsContext.tsx  # 設定の一元管理・localStorage永続化
notes/                   # サーバー保存先（.gitignore済み）
```

---

## Tech Stack

- **Next.js 16** App Router / TypeScript strict / Tailwind CSS
- **CodeMirror 6** (`@uiw/react-codemirror`) — エディタ
- **react-markdown** + remark-math + rehype-katex — KaTeX数式
- **remark-gfm** + remark-breaks + rehype-highlight — GFM・コードハイライト
- **@mui/icons-material** — 全アイコン（MenuOpen, Menu, Edit, Settings, Add）

---

## Code Conventions

- コンポーネントはすべて `"use client"`
- スタイルはインラインスタイル優先（動的値）、CSS変数で統一テーマ
- `<form>` タグ禁止 → `onClick`/`onChange` で代替
- アイコンはMUIのみ（SVG自作禁止）
- 設定は `useSettings()` hook経由で取得（propsバケツリレーしない）
- ファイル名は `note_yyyymmddhhmmss.md` 自動生成、リネーム可
- 自動保存: IME確定後にデバウンス（デフォルト800ms）、末尾 `\n` 保証
- Sidebarの更新は `refreshTrigger` インクリメントで発火、サイレント更新
- バージョンは `package.json` から import して使用

---

## Settings (SettingsContext)

| key | default | 説明 |
|-----|---------|------|
| editorFontSize | 14 | エディタfontSize(px) |
| previewFontSize | 15 | プレビューfontSize(px) |
| showLineNumbers | true | 行番号 |
| breaksEnabled | false | 改行そのまま反映 |
| autoCloseBrackets | true | 括弧自動閉じ |
| lineWrapping | true | 行折り返し |
| autoSaveDelay | 800 | 自動保存delay(ms) |
| defaultSplitPercent | 50 | デフォルトペイン比率 |
| sidebarWidth | 220 | サイドバー幅(px) |

---

## 現在の状況（v0.3.0）

実装済み:
- サーバー保存・サイドバーファイル管理・サイレント更新
- ファイル名インライン編集（Editアイコン）・リネームAPI
- 設定モーダル（テーマ含む全設定）
- MUIアイコン統一
- IME対応デバウンス・末尾改行挿入
- スマホ非対応画面（657px未満）
- バージョンをpackage.jsonと同期

フォントインフラ（未有効化）:
- `globals.css` に `@font-face` を用意済み（コメントアウト中）
- フォントファイルを `src/fonts/` に配置後、コメントを外すと有効化

```
src/fonts/
  M_PLUS_1_Code/MPLUS1Code-VariableFont_wght.ttf
  BIZ_UDGothic/BIZUDGothic-{Regular,Bold}.ttf
  M_PLUS_1/MPLUS1-VariableFont_wght.ttf
  JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf
  Google_Sans_Code/GoogleSansCode-VariableFont_MONO,wght.ttf
  Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf
```

---

## 次のタスク

1. **フォント有効化** — `src/fonts/` にファイル配置後、`globals.css` の `@font-face` コメントを外す
2. **ロゴ画像の配置** — `src/app/icon.png` に配置するとfaviconとして自動認識
3. **スクロール同期** — エディタ・プレビューのスクロール比率を連動（`scroll` イベント + `scrollTop/scrollHeight`）
4. **謎の上部余白の解消** — エディタ上部の余分なpadding/marginを特定・削除
5. **スマホ版の実装** — `MobileView.tsx` の中身をモバイル対応UIに差し替え
