"use client";

import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-zinc-950 noise-bg flex items-center justify-center p-4">
      <div className="relative z-10 glass-card rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/50 max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-zinc-500 to-zinc-800 select-none">
            404
          </h1>
        </div>

        <h2 className="text-xl font-medium text-zinc-100 mb-2">
          Page Not Found
        </h2>
        <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
