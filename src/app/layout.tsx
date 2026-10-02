import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ink — Markdown Editor",
  description: "A minimal markdown editor with KaTeX math support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
