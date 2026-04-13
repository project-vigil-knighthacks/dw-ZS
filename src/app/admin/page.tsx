import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const USERS = [
  { name: "admin", role: "admin", status: "active" },
  { name: "alice", role: "user", status: "active" },
  { name: "bob", role: "user", status: "active" },
];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) redirect("/login");

  const user = JSON.parse(session.value);
  if (user.username !== "admin") {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24 min-h-screen">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-6xl font-extrabold text-[var(--accent)]">
            403
          </h1>
          <p className="mt-2 font-[family-name:var(--font-mono-alt)] text-[var(--muted-foreground)] tracking-wider">
            ADMIN ACCESS ONLY
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 md:px-10 py-4">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight uppercase">
          Admin Panel
        </h1>
        <p className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider mt-0.5">
          SYSTEM MANAGEMENT · <span className="text-[var(--accent-light)]">ADMIN</span>
        </p>
      </div>

      <div className="px-6 md:px-10 py-6 space-y-6 max-w-4xl">
        {/* Users table */}
        <div className="border border-[var(--border)] bg-[var(--surface)] relative">
          <span className="absolute -left-px -top-px w-2 h-2 border-l-2 border-t-2 border-[var(--accent)]" />
          <span className="absolute -right-px -top-px w-2 h-2 border-r-2 border-t-2 border-[var(--accent)]" />
          <span className="absolute -left-px -bottom-px w-2 h-2 border-l-2 border-b-2 border-[var(--accent)]" />
          <span className="absolute -right-px -bottom-px w-2 h-2 border-r-2 border-b-2 border-[var(--accent)]" />

          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
            <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
              Registered Users
            </span>
            <span className="font-[family-name:var(--font-mono-alt)] text-[10px] text-[var(--muted-foreground)] ml-auto">
              {USERS.length}
            </span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {USERS.map((u) => (
              <div
                key={u.name}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-raised)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 border border-[var(--border)] bg-[var(--background)] flex items-center justify-center font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--accent-light)] uppercase">
                    {u.name[0]}
                  </div>
                  <span className="font-[family-name:var(--font-mono-alt)] text-[13px]">
                    {u.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono-alt)] text-[10px] text-emerald-400 tracking-wider">
                    {u.status.toUpperCase()}
                  </span>
                  <span
                    className={`font-[family-name:var(--font-mono-alt)] text-[10px] px-2 py-0.5 border tracking-wider ${
                      u.role === "admin"
                        ? "text-[var(--accent-light)] border-[var(--accent)]/30 bg-[var(--accent)]/10"
                        : "text-[var(--muted-foreground)] border-[var(--border)] bg-[var(--muted)]"
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
            <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
              System Configuration
            </span>
          </div>
          <div className="p-4 space-y-2">
            {[
              ["Environment", "Production"],
              ["Region", "US East"],
              ["Framework", "Next.js 16"],
              ["SIEM Backend", "Vigil"],
              ["Log Format", "Apache Combined"],
              ["Proxy", "Edge Middleware"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-b-0"
              >
                <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider">
                  {k}
                </span>
                <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--foreground)]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
