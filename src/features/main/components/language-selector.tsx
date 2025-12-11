"use client";

import { Code2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const SUPPORTED_LANGUAGES = [
  { id: "text", name: "Plain Text" },
  { id: "typescript", name: "TypeScript" },
  { id: "javascript", name: "JavaScript" },
  { id: "json", name: "JSON" },
  { id: "python", name: "Python" },
  { id: "bash", name: "Bash" },
  { id: "sql", name: "SQL" },
  { id: "css", name: "CSS" },
  { id: "html", name: "HTML" },
] as const;

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Code2 className="w-4 h-4 text-zinc-600 dark:text-zinc-500 group-hover:text-emerald-500 transition-colors" />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        name="language-selector"
        className="appearance-none w-fit bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-300 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all cursor-pointer disabled:opacity-50"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {!isOpen ? (
          <ChevronDown className="w-4 h-4 text-emerald-500" />
        ) : (
          <ChevronUp className="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
        )}
      </div>
    </div>
  );
}
