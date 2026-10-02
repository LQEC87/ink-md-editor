"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  const { settings } = useSettings();
  const remarkPlugins = settings.breaksEnabled
    ? [remarkMath, remarkGfm, remarkBreaks]
    : [remarkMath, remarkGfm];

  return (
    <div className="preview-content" style={{ fontSize: `${settings.previewFontSize}px` }}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}>{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
