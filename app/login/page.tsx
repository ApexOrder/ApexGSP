import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050807] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-black/40 p-8 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
            ApexOrder
          </p>
          <h1 className="mt-3 text-3xl font-bold">ApexPanel</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Sign in with Discord to access the panel.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400"
          >
            Continue with Discord
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          OWNER / ADMIN access only.
        </p>
      </div>
    </main>
  );
}
