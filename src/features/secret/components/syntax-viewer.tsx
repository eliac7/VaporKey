"use client";

import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

interface SyntaxViewerProps {
  code: string;
  language: string;
}

export function SyntaxViewer({ code, language }: SyntaxViewerProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let highlighter: Awaited<ReturnType<typeof createHighlighter>>;

    async function highlight() {
      if (language === "text") {
        setHtml(`<span class="text-zinc-300">${code}</span>`);
        return;
      }

      try {
        // Shiki v1.0+ usage
        highlighter = await createHighlighter({
          themes: ["github-dark"],
          langs: [language],
        });

        const highlightedCode = highlighter.codeToHtml(code, {
          lang: language,
          theme: "github-dark",
        });

        setHtml(highlightedCode);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<span class="text-zinc-300">${code}</span>`);
      }
    }

    highlight();

    return () => {
      if (highlighter) highlighter.dispose();
    };
  }, [code, language]);

  if (!html) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        <div className="h-4 bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
