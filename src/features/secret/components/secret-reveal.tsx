"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { client } from "@/lib/client";
import { RetrievalCard } from "./retrieval-card";
import { decryptData, importKey, deriveKeyFromPassword, stringToBuffer } from "@/lib/crypto";
import { ArrowRight, Loader2, Link2Off } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function SecretReveal({ secretId }: { secretId: string }) {
  const t = useTranslations("retrievalCard");
  const router = useRouter();

  const [viewState, setViewState] = useState<"checking" | "locked" | "input_required" | "revealed" | "destroyed">("checking");
  const [decryptedSecret, setDecryptedSecret] = useState("");
  const [language, setLanguage] = useState("text");

  const [userInput, setUserInput] = useState("");

  const urlHashKey = useRef<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      urlHashKey.current = hash;
      setTimeout(() => {
        setViewState("locked");
      }, 0);
    } else {
      setTimeout(() => {
        setViewState("input_required");
      }, 0);
    }
  }, []);

  const { mutate: fetchAndDecrypt, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await client.api.secret.retrieve.get({
        query: { id: secretId },
      });

      if (error || !data?.encryptedData) {
        setViewState("destroyed");
        return;
      }

      try {
        let key: CryptoKey;
        const encryptedData = data.encryptedData;

        // SCENARIO 1: Key was in URL (Standard)
        if (urlHashKey.current) {
          key = await importKey(urlHashKey.current);
        }
        // SCENARIO 2: User manually provided input
        else {
          const isProbablyRawKey = userInput.length > 30 && userInput.includes("=");

          if (isProbablyRawKey) {
            try {
              key = await importKey(userInput);
            } catch {
              const parts = encryptedData.split(":");
              const salt = stringToBuffer(parts[0]);
              key = await deriveKeyFromPassword(userInput, salt);
            }
          } else {
            const parts = encryptedData.split(":");

            if (parts.length === 3) {
              const salt = stringToBuffer(parts[0]);
              key = await deriveKeyFromPassword(userInput, salt);
            } else {
              key = await importKey(userInput);
            }
          }
        }

        const jsonString = await decryptData(encryptedData, key);
        const payload = JSON.parse(jsonString);

        return {
          secret: payload.secret,
          language: payload.language || "text"
        };

      } catch (e) {
        console.error("Decryption failed", e);
        throw new Error("Invalid key or password");
      }
    },
    onSuccess: (data) => {
      if (data) {
        setDecryptedSecret(data.secret);
        setLanguage(data.language);
        setViewState("revealed");
      }
    },
    onError: () => {
      setViewState("destroyed");
    },
  });

  if (viewState === "checking") return null;

  if (viewState === "input_required") {
    return (
      <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-black/50 max-w-xl w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Link2Off className="w-8 h-8 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{t("inputRequired.title")}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            {t("inputRequired.description")} <br />
            {t("inputRequired.instruction")}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            autoFocus
            placeholder={t("inputRequired.placeholder")}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && userInput && fetchAndDecrypt()}
            className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />

          <button
            onClick={() => fetchAndDecrypt()}
            disabled={!userInput || isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("inputRequired.unlocking")}
              </>
            ) : (
              <>
                {t("inputRequired.unlockButton")} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
      <RetrievalCard
        state={viewState as "locked" | "revealed" | "destroyed"}
        secret={decryptedSecret}
        language={language}
        onReveal={() => fetchAndDecrypt()}
        onDestroy={() => setViewState("destroyed")}
        onNewSecret={() => router.push("/")}
      />
    </div>
  );
}