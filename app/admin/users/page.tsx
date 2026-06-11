import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/lib/admin/users";
import { redirect } from "next/navigation";

export default async function UsersAdminPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "OWNER") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-[#050807] p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
          ApexPanel
        </p>

        <h1 className="mt-3 text-3xl font-bold">User Access</h1>

        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-emerald-500/20 bg-black/40 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{user.name ?? "Unknown"}</p>
                  <p className="text-sm text-zinc-400">{user.email ?? "-"}</p>
                  <p className="text-xs text-zinc-500">
                    Discord: {user.discordId ?? "-"}
                  </p>
                </div>

                <form action={updateUserRole.bind(null, user.id)}>
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="rounded-lg border border-emerald-500/20 bg-black px-3 py-2 text-white"
                  >
                    {Object.values(Role).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="ml-3 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}