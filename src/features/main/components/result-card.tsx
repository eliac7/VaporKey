"use client";

import { Check, Copy, Link, Plus, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface ResultCardProps {
  url: string;
  onReset: () => void;
}

export function ResultCard({ url, onReset }: ResultCardProps) {
  const t = useTranslations("resultCard");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
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
        <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 break-all pr-8">
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

      <div className="gap-3 mt-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className={`h-10 w-full rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer border ${showQR
            ? "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            : "bg-transparent border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            }`}
        >
          <QrCode className="w-4 h-4" />
          {showQR ? t("hideQR") : t("qrCode")}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${showQR ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <div className="flex justify-center p-4 bg-white rounded-xl">
          <QRCodeSVG value={url} size={180} />
        </div>
      </div>

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
