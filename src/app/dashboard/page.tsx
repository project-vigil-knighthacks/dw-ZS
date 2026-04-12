import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) redirect("/login");

  const user = JSON.parse(session.value);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4 text-zinc-400">
        Welcome back, <span className="text-white">{user.username}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Uptime", value: "99.9%" },
          { label: "Requests Today", value: "1,204" },
          { label: "Active Users", value: "3" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <p className="text-sm text-zinc-400">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
