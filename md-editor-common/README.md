# ink — Markdown Editor

KaTeX数式対応のMarkdownエディタ（Next.js製）

## セットアップ

```bash
gunzip my-next-app.tar.gz
docker load -i my-next-app.tar
docker compose up -d
```

ブラウザで http://localhost:3000 を開く。

## 主な機能

- 左エディタ / 右プレビューの2ペイン（ドラッグでリサイズ可能）
- KaTeX による数式レンダリング（`$...$` / `$$...$$`）
- GitHub Flavored Markdown（テーブル、タスクリスト、取り消し線）
- コードシンタックスハイライト
- ダークモード（System / Light / Dark を切り替え）
- ローカルストレージへの自動保存（800ms debounce）
- ワード数・文字数カウント

## 使い方

| 操作 | 説明 |
|------|------|
| インライン数式 | `$E = mc^2$` |
| ディスプレイ数式 | `$$\int f dx$$` |
| ペイン幅変更 | 中央の境界線をドラッグ |
| テーマ切替 | 右上の System/Light/Dark ボタン |

## 技術スタック

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- react-markdown + remark-math + rehype-katex
- @uiw/react-codemirror (エディタ)
