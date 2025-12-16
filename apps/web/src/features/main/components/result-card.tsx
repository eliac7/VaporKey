"use client";

import { Check, Copy, Link, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSection } from "./qr-code-section";

interface ResultCardProps {
  url: string;
  onReset: () => void;
}

export function ResultCard({ url, onReset }: ResultCardProps) {
  const t = useTranslations("resultCard");
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 transition-all duration-500 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Check className="w-5 h-5 text-emerald-500" />
        </div>
        <h2 className="text-lg font-medium dark:text-zinc-100 text-zinc-900">{t("title")}</h2>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-300 dark:border-zinc-800 relative group">
        <div className="flex items-center gap-2 mb-2">
          <Link className="w-4 h-4 text-zinc-600 dark:text-zinc-500" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-500 font-semibold">
            {t("oneTimeLink")}
          </span>
        </div>
        <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 break-all">
          {url}
        </div>
      </div>

      <button
        onClick={handleCopy}
        className={`w-full mt-4 h-12 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${copied
          ? "bg-emerald-500 border-emerald-500 text-white"
          : "bg-zinc-100 border-zinc-100 hover:bg-white text-zinc-900 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
          }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            {t("copied")}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {t("copyButton")}
          </>
        )}
      </button>

      <QRCodeSection url={url} />

      <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-800/50">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors text-sm py-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          {t("createAnother")}
        </button>
      </div>
    </div>
  );
}
