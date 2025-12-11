"use client";

import { AlertTriangle, Clock, Copy, Eye, Plus, Skull } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SyntaxViewer } from "./syntax-viewer";

interface RetrievalCardProps {
  state: "locked" | "revealed" | "destroyed";
  secret: string;
  language?: string;
  onReveal: () => void;
  onDestroy: () => void;
  onNewSecret: () => void;
}

export function RetrievalCard({
  state,
  secret,
  language = "text",
  onReveal,
  onDestroy,
  onNewSecret,
}: RetrievalCardProps) {
  const [displayText, setDisplayText] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showSyntaxHighlight, setShowSyntaxHighlight] = useState(false);

  // "Matrix" scramble effect
  const decryptEffect = useCallback(async () => {
    if (!secret) return;

    setIsDecrypting(true);
    setShowSyntaxHighlight(false);

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const iterations = 20;
    const delay = 40;

    for (let i = 0; i < iterations; i++) {
      const progress = i / iterations;
      let scrambled = "";

      // Only scramble the first 100 chars to avoid lag on huge code blocks
      const lengthToScramble = Math.min(secret.length, 200);

      for (let j = 0; j < lengthToScramble; j++) {
        if (Math.random() < progress) {
          scrambled += secret[j];
        } else {
          scrambled +=
            characters[Math.floor(Math.random() * characters.length)];
        }
      }
      // If secret is longer, append the rest (masked or raw)
      if (secret.length > 200) scrambled += "...";

      setDisplayText(scrambled);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setDisplayText(secret);
    setIsDecrypting(false);

    setShowSyntaxHighlight(true);
  }, [secret]);

  useEffect(() => {
    if (state === "revealed" && secret) {
      const timer = setTimeout(() => {
        decryptEffect();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [state, secret, decryptEffect]);

  useEffect(() => {
    if (state === "revealed" && !isDecrypting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, isDecrypting, onDestroy]);

  useEffect(() => {
    if (state === "revealed" && countdown === 0 && !isDecrypting) {
      onDestroy();
    }
  }, [state, countdown, isDecrypting, onDestroy]);

  if (state === "locked") {
    return (
      <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Secure Message</h2>
        </div>

        <div className="relative bg-zinc-100 dark:bg-zinc-950/50 rounded-xl p-6 border border-zinc-300 dark:border-zinc-800 overflow-hidden">
          <div className="blur-lg select-none pointer-events-none font-mono text-sm text-zinc-400 dark:text-zinc-600 break-all">
            Xj9#mK2$pL5@nR8&qS3*vW6%yZ9!bC4^fH7(jK0)mN3#pQ6$sT9@vW2&yZ5*bC8^fH1(jK4)mN7#pQ0$sT3@vW6&yZ9!bC2^fH5(jK8)
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/80 dark:bg-zinc-950/60 backdrop-blur-[2px]">
            <div className="text-center">
              <Eye className="w-8 h-8 text-zinc-600 dark:text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-700 dark:text-zinc-400 text-sm font-medium">
                Content is hidden
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <p className="text-amber-500/80 text-xs text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            This message will self-destruct immediately after reading
          </p>
        </div>

        <button
          onClick={onReveal}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20"
        >
          <Eye className="w-4 h-4" />
          Reveal Secret
        </button>
      </div>
    );
  }

  if (state === "revealed") {
    return (
      <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <Eye className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Secret Revealed
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <Clock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-red-400 font-mono text-sm font-bold">
              {countdown}s
            </span>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-300 dark:border-zinc-800 relative overflow-hidden group min-h-[100px]">
          {language !== "text" && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-zinc-200 dark:bg-zinc-900 border-b border-l border-zinc-300 dark:border-zinc-800 rounded-bl-xl text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-500 font-bold z-10">
              {language}
            </div>
          )}

          <div
            className={`font-mono text-sm transition-opacity duration-500 ${isDecrypting ? "opacity-100" : "opacity-0 absolute inset-0 p-4"
              }`}
          >
            <span className="text-emerald-500/70 whitespace-pre-wrap break-all">
              {displayText}
            </span>
          </div>

          <div
            className={`transition-opacity duration-500 ${!isDecrypting && showSyntaxHighlight ? "opacity-100" : "opacity-0"
              }`}
          >
            {showSyntaxHighlight && (
              <SyntaxViewer code={secret} language={language} />
            )}
          </div>

          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={() => navigator.clipboard.writeText(secret)}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 30) * 100}%` }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-zinc-600 dark:text-zinc-500">
          Do not refresh the page. This message is already deleted from the
          server.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center py-8">
        <div className="p-4 rounded-2xl bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 mb-6">
          <Skull className="w-12 h-12 text-zinc-500 dark:text-zinc-600" />
        </div>
        <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Secret Destroyed
        </h2>
        <p className="text-zinc-600 dark:text-zinc-500 text-center text-sm max-w-[260px] leading-relaxed">
          This message has been permanently deleted and no longer exists.
        </p>

        <button
          onClick={onNewSecret}
          className="mt-6 w-full h-12 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Secret
        </button>
      </div>
    </div>
  );
}
