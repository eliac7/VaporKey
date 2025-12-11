"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { RetrievalCard } from "./retrieval-card";

export default function SecretReveal({ secretId }: { secretId: string }) {
  const router = useRouter();

  const [viewState, setViewState] = useState<
    "locked" | "revealed" | "destroyed"
  >("locked");

  const [decryptedSecret, setDecryptedSecret] = useState("");

  const { mutate: fetchSecret } = useMutation({
    mutationFn: async () => {
      const { data, error } = await client.api.secret.retrieve.get({
        query: { id: secretId },
      });

      if (error) {
        const errorMessage =
          typeof error.value === "string"
            ? error.value
            : "Secret not found or invalid request";

        throw new Error(errorMessage);
      }

      if (!data || typeof data.secret !== "string") {
        throw new Error("Invalid response from server");
      }

      return data.secret;
    },
    onSuccess: (secret) => {
      setDecryptedSecret(secret);
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
        onReveal={() => fetchSecret()}
        onDestroy={() => setViewState("destroyed")}
        onNewSecret={() => router.push("/")}
      />
    </div>
  );
}
