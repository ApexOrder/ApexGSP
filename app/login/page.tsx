import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.85))]" />

      <div className="relative w-full max-w-md rounded-3xl border border-emerald-500/20 bg-black/50 p-8 shadow-2xl shadow-emerald-950/30 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/20">
          <span className="text-2xl font-black text-emerald-300">A</span>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            ApexPanel
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Premium game server control for the ApexOrder network.
          </p>
        </div>

        <Link
          href="/login/discord"
          className="mt-8 block rounded-xl bg-emerald-500 px-5 py-3 text-center font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
        >
          Continue with Discord
        </Link>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Owner and admin access only.
        </p>
      </div>
    </main>
  );
}