# ink — Markdown Editor

KaTeX数式対応のMarkdownエディタ（Next.js製）

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## フォントのセットアップ

`src/fonts/` に以下のフォントファイルを配置し、`src/app/globals.css` の `@font-face` コメントを外してください。

```
src/fonts/
  M_PLUS_1_Code/MPLUS1Code-VariableFont_wght.ttf
  BIZ_UDGothic/BIZUDGothic-Regular.ttf
  BIZ_UDGothic/BIZUDGothic-Bold.ttf
  M_PLUS_1/MPLUS1-VariableFont_wght.ttf
  JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf
  Google_Sans_Code/GoogleSansCode-VariableFont_MONO,wght.ttf
  Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf
```

## 主な機能

- 左エディタ / 右プレビューの2ペイン（ドラッグでリサイズ可能）
- KaTeX による数式レンダリング（`$...$` / `$$...$$`）
- GFM（テーブル・タスクリスト・取り消し線）
- コードブロックのシンタックスハイライト
- サイドバーでファイル管理（サーバーに保存）
- ファイル名インライン編集
- 設定モーダル（テーマ・フォントサイズ・自動保存など）
- ダークモード対応
- 657px未満はスマートフォン非対応画面

## 本番ビルド（standalone）

```bash
npm run build
node .next/standalone/server.js
```
