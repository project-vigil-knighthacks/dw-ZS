"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Fake data generators ────────────────────────────────── */
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fakeSparkline(len = 24) {
  const arr: number[] = [];
  let v = randomBetween(30, 70);
  for (let i = 0; i < len; i++) {
    v += randomBetween(-8, 8);
    v = Math.max(5, Math.min(95, v));
    arr.push(v);
  }
  return arr;
}

function sparklinePath(data: number[], w: number, h: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

interface LogEntry {
  id: number;
  time: string;
  method: string;
  path: string;
  status: number;
  ip: string;
  action?: string;
}

const DEMO_IPS = [
  "192.168.1.42",
  "10.0.0.15",
  "172.16.0.88",
  "35.145.13.142",
  "203.0.113.50",
  "198.51.100.22",
];

const DEMO_PATHS = [
  { method: "GET", path: "/", status: 200 },
  { method: "GET", path: "/dashboard", status: 200 },
  { method: "GET", path: "/admin", status: 200 },
  { method: "GET", path: "/api/status", status: 200 },
  { method: "POST", path: "/api/auth/login", status: 200 },
  { method: "GET", path: "/settings", status: 404 },
  { method: "POST", path: "/api/data/export", status: 200 },
];

function generateLogEntry(id: number, action?: string): LogEntry {
  const now = new Date();
  const time = now.toISOString();
  const route = action
    ? { method: "POST", path: `/api/demo/${action}`, status: action === "failed-auth" ? 401 : action === "not-found" ? 404 : action === "server-error" ? 500 : 200 }
    : DEMO_PATHS[randomBetween(0, DEMO_PATHS.length - 1)];
  return {
    id,
    time,
    method: route.method,
    path: route.path,
    status: route.status,
    ip: DEMO_IPS[randomBetween(0, DEMO_IPS.length - 1)],
    action,
  };
}

function statusColor(code: number) {
  if (code < 300) return "text-emerald-400";
  if (code < 400) return "text-yellow-400";
  if (code < 500) return "text-orange-400";
  return "text-red-400";
}

function statusBg(code: number) {
  if (code < 300) return "bg-emerald-400/10 border-emerald-400/20";
  if (code < 400) return "bg-yellow-400/10 border-yellow-400/20";
  if (code < 500) return "bg-orange-400/10 border-orange-400/20";
  return "bg-red-400/10 border-red-400/20";
}

/* ── Stats cards ─────────────────────────────────────────── */
interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline: number[];
}

function generateStats(): StatCard[] {
  return [
    {
      label: "Requests Today",
      value: randomBetween(800, 2400).toLocaleString(),
      change: `+${randomBetween(5, 25)}%`,
      positive: true,
      sparkline: fakeSparkline(),
    },
    {
      label: "Unique Visitors",
      value: randomBetween(50, 300).toLocaleString(),
      change: `+${randomBetween(2, 18)}%`,
      positive: true,
      sparkline: fakeSparkline(),
    },
    {
      label: "Threats Blocked",
      value: randomBetween(3, 45).toLocaleString(),
      change: `-${randomBetween(5, 30)}%`,
      positive: false,
      sparkline: fakeSparkline(),
    },
    {
      label: "Avg Response",
      value: `${randomBetween(80, 250)}ms`,
      change: `-${randomBetween(1, 12)}%`,
      positive: true,
      sparkline: fakeSparkline(),
    },
    {
      label: "Uptime",
      value: "99.97%",
      change: "+0.02%",
      positive: true,
      sparkline: fakeSparkline(),
    },
    {
      label: "Error Rate",
      value: `${(Math.random() * 2.5).toFixed(2)}%`,
      change: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 0.8).toFixed(2)}%`,
      positive: Math.random() > 0.5,
      sparkline: fakeSparkline(),
    },
  ];
}

/* ── Server health ───────────────────────────────────────── */
interface HealthMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
}

function generateHealth(): HealthMetric[] {
  return [
    { label: "CPU", value: randomBetween(12, 68), max: 100, unit: "%" },
    { label: "Memory", value: randomBetween(40, 80), max: 100, unit: "%" },
    { label: "Disk", value: randomBetween(20, 55), max: 100, unit: "%" },
    { label: "Network", value: randomBetween(5, 45), max: 100, unit: "Mbps" },
  ];
}

/* ── Log action buttons ──────────────────────────────────── */
const LOG_ACTIONS = [
  { action: "page-view", label: "Page View", icon: "👁", desc: "Simulate a page visit" },
  { action: "login-success", label: "Login", icon: "✅", desc: "Successful auth" },
  { action: "failed-auth", label: "Failed Auth", icon: "🚫", desc: "401 Unauthorized" },
  { action: "api-call", label: "API Call", icon: "⚡", desc: "REST endpoint hit" },
  { action: "not-found", label: "404 Error", icon: "❓", desc: "Missing resource" },
  { action: "server-error", label: "500 Error", icon: "💥", desc: "Internal failure" },
  { action: "file-upload", label: "File Upload", icon: "📤", desc: "Upload request" },
  { action: "data-export", label: "Data Export", icon: "📊", desc: "Export request" },
];

/* ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [health, setHealth] = useState<HealthMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const logIdRef = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  // Generate initial fake data
  useEffect(() => {
    setStats(generateStats());
    setHealth(generateHealth());

    // Seed some initial logs
    const initial: LogEntry[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateLogEntry(logIdRef.current++));
    }
    setLogs(initial);
  }, []);

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateStats());
      setHealth(generateHealth());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [logs]);

  const fireLog = useCallback(
    async (action: string) => {
      setSending(action);
      try {
        // Hit the demo API route — the proxy middleware captures this as a real log
        await fetch(`/api/demo/${action}`, { method: "POST" });
      } catch {
        // silently ignore
      }
      // Add to local feed
      const entry = generateLogEntry(logIdRef.current++, action);
      setLogs((prev) => [entry, ...prev].slice(0, 50));
      setSending(null);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--muted-foreground)] font-[family-name:var(--font-mono-alt)] text-sm tracking-wider">
          LOADING...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-[70px] min-h-screen">
      {/* ── Header bar ─── */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-6 md:px-10 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight uppercase">
            Dashboard
          </h1>
          <p className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider mt-0.5">
            WELCOME BACK, <span className="text-[var(--accent-light)]">{user.username.toUpperCase()}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--accent-light)] tracking-wider flex items-center gap-1.5">
            <span className="animate-blink">●</span> LIVE
          </span>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/");
              router.refresh();
            }}
            className="font-[family-name:var(--font-mono-alt)] text-[11px] border border-[var(--border)] text-[var(--muted-foreground)] px-3 py-1.5 tracking-wider uppercase hover:border-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6 space-y-6">
        {/* ── Stats grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[var(--border)]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`relative p-4 bg-[var(--surface)] ${
                i < stats.length - 1 ? "border-r border-b md:border-b border-[var(--border)]" : "border-b md:border-b-0"
              } lg:border-b-0`}
            >
              <div className="font-[family-name:var(--font-mono-alt)] text-[10px] text-[var(--muted-foreground)] tracking-wider uppercase mb-2">
                {s.label}
              </div>
              <div className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                {s.value}
              </div>
              <div
                className={`font-[family-name:var(--font-mono-alt)] text-[11px] mt-1 ${
                  s.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {s.change}
              </div>
              {/* Mini sparkline */}
              <svg
                viewBox="0 0 100 30"
                className="w-full h-6 mt-2 opacity-40"
                preserveAspectRatio="none"
              >
                <path
                  d={sparklinePath(s.sparkline, 100, 30)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Server Health ─── */}
          <div className="border border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
                Server Health
              </span>
            </div>
            <div className="p-4 space-y-4">
              {health.map((h) => (
                <div key={h.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider">
                      {h.label}
                    </span>
                    <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--foreground)]">
                      {h.value}{h.unit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(h.value / h.max) * 100}%`,
                        background:
                          h.value / h.max > 0.8
                            ? "#ef4444"
                            : h.value / h.max > 0.6
                            ? "#f59e0b"
                            : "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Log Actions ─── */}
          <div className="border border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
                Generate Logs
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {LOG_ACTIONS.map((la) => (
                <button
                  key={la.action}
                  onClick={() => fireLog(la.action)}
                  disabled={sending === la.action}
                  className={`group relative text-left p-3 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200 ${
                    sending === la.action ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{la.icon}</span>
                    <span className="font-[family-name:var(--font-mono-alt)] text-[11px] font-medium text-[var(--foreground)] tracking-wider uppercase group-hover:text-[var(--accent-light)] transition-colors">
                      {la.label}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-mono-alt)] text-[9px] text-[var(--muted-foreground)] tracking-wider">
                    {la.desc}
                  </span>
                  {/* Corner accents on hover */}
                  <span className="absolute -left-px -top-px w-2 h-2 border-l border-t border-transparent group-hover:border-[var(--accent)] transition-colors" />
                  <span className="absolute -right-px -bottom-px w-2 h-2 border-r border-b border-transparent group-hover:border-[var(--accent)] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Security Overview ─── */}
          <div className="border border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
                Security Overview
              </span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "FIREWALL", status: "ACTIVE", ok: true },
                { label: "SSL CERT", status: "VALID", ok: true },
                { label: "DDoS PROTECTION", status: "ENABLED", ok: true },
                { label: "RATE LIMITING", status: "250 req/min", ok: true },
                { label: "LAST SCAN", status: "2min AGO", ok: true },
                { label: "VULNERABILITIES", status: "0 FOUND", ok: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-b-0"
                >
                  <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-wider">
                    {item.label}
                  </span>
                  <span
                    className={`font-[family-name:var(--font-mono-alt)] text-[11px] tracking-wider ${
                      item.ok ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Live Activity Feed ─── */}
        <div className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
              <span className="font-[family-name:var(--font-mono-alt)] text-[11px] text-[var(--muted-foreground)] tracking-[1.5px] uppercase">
                Live Activity Feed
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono-alt)] text-[10px] text-[var(--muted-foreground)] tracking-wider">
              {logs.length} ENTRIES
            </span>
          </div>
          <div
            ref={feedRef}
            className="max-h-[320px] overflow-y-auto divide-y divide-[var(--border)]"
          >
            {logs.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-2.5 flex items-center gap-4 hover:bg-[var(--surface-raised)] transition-colors text-[12px] font-[family-name:var(--font-mono-alt)]"
              >
                <span className="text-[var(--muted-foreground)] w-[140px] flex-shrink-0 text-[10px]">
                  {new Date(entry.time).toLocaleTimeString()}
                </span>
                <span
                  className={`w-[50px] flex-shrink-0 font-medium ${
                    entry.method === "POST"
                      ? "text-[var(--accent-light)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {entry.method}
                </span>
                <span className="flex-1 text-[var(--foreground)] truncate">
                  {entry.path}
                </span>
                <span
                  className={`px-2 py-0.5 border text-[10px] ${statusBg(
                    entry.status
                  )} ${statusColor(entry.status)}`}
                >
                  {entry.status}
                </span>
                <span className="text-[var(--muted-foreground)] w-[110px] flex-shrink-0 text-right text-[10px]">
                  {entry.ip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
