"use client";

import { Home } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("retrievalCard.destroyed");

  return (
    <div className="relative z-10 glass-card rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/50 max-w-lg w-full text-center">
      <div className="relative mb-8">
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-zinc-500 to-zinc-800 select-none">
          404
        </h1>
      </div>

      <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        {t("title")}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
        {t("description")}
      </p>

      <Link
        href="/"
        className="w-full text-center inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl"
      >
        <Home className="w-4 h-4 mr-2" />
        <span>{t("newSecretButton")}</span>
      </Link>

      <p className="mt-8 text-xs text-zinc-600 dark:text-zinc-500">
        VaporKey secrets are ephemeral by design
      </p>
    </div>
  );
}

