import { KeyRound } from "lucide-react";

export default function Header() {
  return (
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
  );
}
