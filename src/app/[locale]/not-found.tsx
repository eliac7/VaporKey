"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/50 max-w-md w-full text-center">
        <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          404
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          {t("secretNotFound")}
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

