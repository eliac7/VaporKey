"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";
import { InputCard } from "./input-card";
import { ResultCard } from "./result-card";

export function VaporKeyApp() {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <KeyRound className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
            VaporKey
          </h1>
          <p className="text-sm text-zinc-500">Ephemeral credential sharing</p>
        </div>
      </div>

      <div className="w-full max-w-lg transition-all duration-300 ease-in-out">
        {!generatedUrl ? (
          <InputCard onSuccess={(url) => setGeneratedUrl(url)} />
        ) : (
          <ResultCard
            url={generatedUrl}
            onReset={() => setGeneratedUrl(null)}
          />
        )}
      </div>
    </div>
  );
}
