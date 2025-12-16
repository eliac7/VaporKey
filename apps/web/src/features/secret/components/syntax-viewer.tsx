"use client";

import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import { useTheme } from "@/providers/theme-provider";

interface SyntaxViewerProps {
  code: string;
  language: string;
}

export function SyntaxViewer({ code, language }: SyntaxViewerProps) {
  const [html, setHtml] = useState<string>("");
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    let highlighter: Awaited<ReturnType<typeof createHighlighter>>;

    async function highlight() {
      const isDark = resolvedTheme === "dark" || (!resolvedTheme && theme === "dark");

      if (language === "text") {
        setHtml(`<span class="${isDark ? "text-zinc-300" : "text-zinc-800"}">${code}</span>`);
        return;
      }

      try {
        // Shiki v1.0+ usage
        const selectedTheme = isDark ? "github-dark" : "github-light";
        highlighter = await createHighlighter({
          themes: [selectedTheme],
          langs: [language],
        });

        const highlightedCode = highlighter.codeToHtml(code, {
          lang: language,
          theme: selectedTheme,
        });

        setHtml(highlightedCode);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<span class="${isDark ? "text-zinc-300" : "text-zinc-800"}">${code}</span>`);
      }
    }

    highlight();

    return () => {
      if (highlighter) highlighter.dispose();
    };
  }, [code, language, theme, resolvedTheme]);

  if (!html) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-1/2"></div>
        <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-full"></div>
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
