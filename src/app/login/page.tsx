"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border border-[var(--border)] bg-[var(--surface)] p-6 relative"
      >
        {/* Corner accents */}
        <span className="absolute -left-px -top-px w-3 h-3 border-l-2 border-t-2 border-[var(--accent)]" />
        <span className="absolute -right-px -top-px w-3 h-3 border-r-2 border-t-2 border-[var(--accent)]" />
        <span className="absolute -left-px -bottom-px w-3 h-3 border-l-2 border-b-2 border-[var(--accent)]" />
        <span className="absolute -right-px -bottom-px w-3 h-3 border-r-2 border-b-2 border-[var(--accent)]" />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 border border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight uppercase">
            Sign In
          </h2>
        </div>

        <p className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider">
          AUTHENTICATE TO ACCESS THE DASHBOARD
        </p>

        {error && (
          <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 font-[family-name:var(--font-mono-alt)] text-[12px]">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider uppercase">
            Username
          </label>
          <input
            name="username"
            required
            className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors font-[family-name:var(--font-mono-alt)]"
          />
        </div>

        <div>
          <label className="mb-1 block font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider uppercase">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors font-[family-name:var(--font-mono-alt)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white font-[family-name:var(--font-mono-alt)] tracking-[1.5px] uppercase transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "AUTHENTICATING..." : "SIGN IN"}
        </button>

        <p className="font-[family-name:var(--font-mono-alt)] text-[10px] text-[var(--muted-foreground)] tracking-wider text-center mt-2">
          TEST ACCOUNTS: admin/admin123 · alice/alice456 · bob/bob789
        </p>
      </form>
    </div>
  );
}
