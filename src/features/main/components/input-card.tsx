"use client";

import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { Lock, Zap } from "lucide-react";
import { useState } from "react";

interface InputCardProps {
  onSuccess: (url: string) => void;
}

export function InputCard({ onSuccess }: InputCardProps) {
  const [secret, setSecret] = useState("");

  const { mutate: encrypt, isPending: isEncrypting } = useMutation({
    mutationFn: async (secret: string) => {
      const res = await client.api.secret.create.post({
        secret,
      });

      if (!res.data?.id) {
        throw new Error("Failed to create secret");
      }

      return `${window.location.origin}/s/${res.data.id}`;
    },
    onSuccess: (url) => {
      onSuccess(url);
    },
  });

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-medium text-zinc-100">
          Create Secure Link
        </h2>
      </div>

      <textarea
        placeholder="Paste your secret here... (API keys, passwords, private notes)"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="w-full min-h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 font-mono text-sm resize-none p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
      />

      <button
        onClick={() => encrypt(secret)}
        disabled={!secret.trim() || isEncrypting}
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isEncrypting ? (
          <>
            <Zap className="w-4 h-4 animate-pulse" />
            Encrypting...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Encrypt & Create Link
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-zinc-600">
        Your secret is encrypted client-side before transmission
      </p>
    </div>
  );
}
