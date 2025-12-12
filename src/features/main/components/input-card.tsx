"use client";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { Lock, Zap, KeyRound } from "lucide-react";
import { useState } from "react";
import { SyntaxSelector } from "./syntax-selector";
import { Turnstile } from "@marsidev/react-turnstile";
import { useLocale, useTranslations } from "next-intl";
import {
  encryptData,
  exportKey,
  generateKey,
  deriveKeyFromPassword,
  generateSalt,
  bufferToString
} from "@/lib/crypto";

interface InputCardProps {
  onSuccess: (url: string) => void;
}

export function InputCard({ onSuccess }: InputCardProps) {
  const t = useTranslations("inputCard");
  const locale = useLocale();
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("text");
  const [isTurnstileValid, setIsTurnstileValid] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const { mutate: encrypt, isPending: isEncrypting } = useMutation({
    mutationFn: async () => {
      const payload = JSON.stringify({
        secret,
        language,
      });

      let key: CryptoKey;
      let finalEncryptedData: string;
      let urlHash = "";

      if (password && showPasswordInput) {
        const salt = generateSalt();
        key = await deriveKeyFromPassword(password, salt);
        const encryptedContent = await encryptData(payload, key);
        finalEncryptedData = `${bufferToString(salt)}:${encryptedContent}`;
      } else {
        key = await generateKey();
        finalEncryptedData = await encryptData(payload, key);

        const keyString = await exportKey(key);
        urlHash = `#${keyString}`;
      }

      const res = await client.api.secret.create.post({
        encryptedData: finalEncryptedData,
      });

      if (!res.data?.id) {
        throw new Error("Failed to create secret");
      }

      return `${window.location.origin}/s/${res.data.id}${urlHash}`;
    },
    onSuccess: (url) => {
      onSuccess(url);
    },
  });

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {t("title")}
          </h2>
        </div>

        <div className="w-full md:w-52">
          <SyntaxSelector
            value={language}
            onChange={setLanguage}
            disabled={isEncrypting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          placeholder={t("placeholder")}
          value={secret}
          autoFocus
          autoComplete="off"
          onChange={(e) => setSecret(e.target.value)}
          className="w-full min-h-40 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-mono text-sm resize-none p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          spellCheck={false}
          rows={8}
        />
        <div className="flex justify-end items-end pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-600">
            {t("characterCount", { count: secret.length })}
          </span>
        </div>


        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setShowPasswordInput(!showPasswordInput);
              if (showPasswordInput) setPassword("");
            }}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors w-fit"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {showPasswordInput ? t("removePassword") : t("addPassword")}
          </button>

          {showPasswordInput && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              />
              <p className="text-[10px] text-zinc-500 mt-1.5 ml-1">
                {t("passwordHint")}
              </p>
            </div>
          )}
        </div>


        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{
            language: locale,
            size: "flexible",
          }}
          onSuccess={() => setIsTurnstileValid(true)}
          onError={() => setIsTurnstileValid(false)}
        />
      </div>

      <button
        onClick={() => encrypt()}
        disabled={!secret.trim() || isEncrypting || !isTurnstileValid || (showPasswordInput && !password)}
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isEncrypting ? (
          <>
            <Zap className="w-4 h-4 animate-pulse" />
            {t("encrypting")}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            {t("encryptButton")}
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-600">
        {t("privacyNote")}
      </p>
    </div>
  );
}
