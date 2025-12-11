import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 glass-card rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/50 max-w-lg w-full text-center">
      <div className="relative mb-8">
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-zinc-500 to-zinc-800 select-none">
          404
        </h1>
      </div>

      <h2 className="text-xl font-medium text-zinc-100 mb-2">
        Secret Not Found
      </h2>
      <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">
        This secret may have been destroyed, expired, or never existed in the
        first place.
      </p>

      <Link
        href="/"
        className="w-full text-center inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl"
      >
        <Home className="w-4 h-4 mr-2" />
        <span>Back to Home</span>
      </Link>

      <p className="mt-8 text-xs text-zinc-600">
        VaporKey secrets are ephemeral by design
      </p>
    </div>
  );
}
