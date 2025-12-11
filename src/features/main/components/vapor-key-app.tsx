"use client";

import { useState } from "react";
import { InputCard } from "./input-card";
import { ResultCard } from "./result-card";

export function VaporKeyApp() {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  return (
    <div className="relative z-10 px-4 py-12 max-w-xl w-full">
      <div className="w-full transition-all duration-300 ease-in-out">
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
