"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { RetrievalCard } from "./retrieval-card";
import { decryptData, importKey } from "@/lib/crypto";

export default function SecretReveal({ secretId }: { secretId: string }) {
  const router = useRouter();

  const [viewState, setViewState] = useState<
    "locked" | "revealed" | "destroyed"
  >("locked");

  const [decryptedSecret, setDecryptedSecret] = useState("");
  const [language, setLanguage] = useState("text");
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        setDecryptionKey(hash as string);
      }, 0);
    }
  }, []);

  const { mutate: fetchSecret } = useMutation({
    mutationFn: async () => {
      if (!decryptionKey) {
        throw new Error("Missing decryption key in URL");
      }

      const { data, error } = await client.api.secret.retrieve.get({
        query: { id: secretId },
      });

      if (error || !data?.encryptedData) {
        throw new Error("Secret not found or already destroyed");
      }

      try {
        const key = await importKey(decryptionKey);
        const jsonString = await decryptData(data.encryptedData, key);

        const payload = JSON.parse(jsonString);
        return {
          secret: payload.secret,
          language: payload.language || "text"
        };
      } catch (e) {
        console.error("Decryption failed", e);
        throw new Error("Failed to decrypt secret. Invalid key?");
      }
    },
    onSuccess: (data) => {
      setDecryptedSecret(data.secret);
      setLanguage(data.language);
      setViewState("revealed");
    },
    onError: () => {
      setViewState("destroyed");
    },
  });

  return (
    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
      <RetrievalCard
        state={viewState}
        secret={decryptedSecret}
        language={language}
        onReveal={() => fetchSecret()}
        onDestroy={() => setViewState("destroyed")}
        onNewSecret={() => router.push("/")}
      />
    </div>
  );
}