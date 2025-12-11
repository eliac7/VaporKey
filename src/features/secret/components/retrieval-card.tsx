"use client";

import {
  AlertTriangle,
  ClipboardCopy,
  Clock,
  Eye,
  Plus,
  Skull,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface RetrievalCardProps {
  state: "locked" | "revealed" | "destroyed";
  secret: string;
  onReveal: () => void;
  onDestroy: () => void;
  onNewSecret: () => void;
}

export function RetrievalCard({
  state,
  secret,
  onReveal,
  onDestroy,
  onNewSecret,
}: RetrievalCardProps) {
  const [displayText, setDisplayText] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // "Matrix" scramble effect
  const decryptEffect = useCallback(async () => {
    if (!secret) return;

    setIsDecrypting(true);

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const iterations = 20;
    const delay = 40;

    for (let i = 0; i < iterations; i++) {
      const progress = i / iterations;
      let scrambled = "";

      for (let j = 0; j < secret.length; j++) {
        if (Math.random() < progress) {
          scrambled += secret[j];
        } else {
          scrambled +=
            characters[Math.floor(Math.random() * characters.length)];
        }
      }
      setDisplayText(scrambled);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setDisplayText(secret);
    setIsDecrypting(false);
  }, [secret]);

  useEffect(() => {
    if (state === "revealed" && secret) {
      // We use a timeout to decouple the render from the state update.
      // This satisfies the linter and prevents cascading renders.
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
            onDestroy();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, isDecrypting, onDestroy]);

  if (state === "locked") {
    return (
      <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-medium text-zinc-100">Secure Message</h2>
        </div>

        {/* Blurred Preview */}
        <div className="relative bg-zinc-950/50 rounded-xl p-6 border border-zinc-800 overflow-hidden">
          <div className="blur-lg select-none pointer-events-none font-mono text-sm text-zinc-600 break-all">
            Xj9#mK2$pL5@nR8&qS3*vW6%yZ9!bC4^fH7(jK0)mN3#pQ6$sT9@vW2&yZ5*bC8^fH1(jK4)mN7#pQ0$sT3@vW6&yZ9!bC2^fH5(jK8)
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-[2px]">
            <div className="text-center">
              <Eye className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm font-medium">
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
            <h2 className="text-lg font-medium text-zinc-100">
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

        <div className="bg-zinc-950/50 rounded-xl p-6 border border-zinc-800 relative overflow-hidden group">
          <pre
            className={`font-mono text-base sm:text-lg whitespace-pre-wrap break-all leading-relaxed transition-colors duration-300 ${
              isDecrypting ? "text-emerald-500/70" : "text-emerald-400"
            }`}
          >
            {displayText}
          </pre>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigator.clipboard.writeText(secret)}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <ClipboardCopy className="w-4 h-4 " />
            </button>
          </div>
        </div>

        <div className="mt-6 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 30) * 100}%` }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Do not refresh the page. This message is already deleted from the
          server.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center py-8">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-6">
          <Skull className="w-12 h-12 text-zinc-600" />
        </div>
        <h2 className="text-xl font-medium text-zinc-300 mb-2">
          Secret Destroyed
        </h2>
        <p className="text-zinc-500 text-center text-sm max-w-[260px] leading-relaxed">
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
