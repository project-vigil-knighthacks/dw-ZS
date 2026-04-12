import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const USERS = ["admin", "alice", "bob"];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) redirect("/login");

  const user = JSON.parse(session.value);
  if (user.username !== "admin") {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="mt-2 text-zinc-400">Admin access only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-2 text-zinc-400">Manage users and system settings.</p>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Registered Users</h2>
        <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900">
          {USERS.map((u) => (
            <li key={u} className="flex items-center justify-between px-4 py-3">
              <span>{u}</span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {u === "admin" ? "admin" : "user"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
