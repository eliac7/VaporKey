"use client";

import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("home");

  return (
    <div className="w-full max-w-xl px-4">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center w-full gap-3 sm:pr-0">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              VaporKey
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-500">{t("subtitle")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
