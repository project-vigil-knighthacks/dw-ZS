import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

/**
 * Proxy that captures every request and fires an Apache-format log line
 * to the Vigil SIEM backend's /api/ingest endpoint.
 *
 * Runs at the edge on Vercel — zero config needed on the website beyond
 * setting VIGIL_API_URL in the environment.
 *
 * Demo routes (/api/demo/*) get extra key=value attributes appended
 * so Vigil can detect and display them (http_method, action, user_id, etc.)
 */
export function proxy(req: NextRequest, event: NextFetchEvent) {
  const res = NextResponse.next();

  const vigilUrl = process.env.VIGIL_API_URL;
  if (vigilUrl) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
    const now = new Date();
    const ts = formatHttpDate(now);
    const method = req.method;
    const uri = req.nextUrl.pathname;
    const protocol = "HTTP/1.1";

    // Determine status and extra attributes for demo routes
    const demoAction = uri.startsWith("/api/demo/")
      ? uri.replace("/api/demo/", "")
      : null;

    let status = "200";
    let extras = "";

    if (demoAction) {
      const demoMeta = DEMO_META[demoAction];
      if (demoMeta) {
        status = String(demoMeta.status);
        extras = ` ${demoMeta.extras}`;
      }
    }

    // Try to get session user
    const sessionCookie = req.cookies.get("session");
    let userId = "-";
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value);
        userId = session.username ?? "-";
      } catch {
        // ignore
      }
    }

    // Apache Combined Log Format + extra attributes
    const logLine = `${ip} - ${userId} [${ts}] "${method} ${uri} ${protocol}" ${status} 0${extras}`;

    event.waitUntil(
      fetch(`${vigilUrl}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: logLine }),
      }).catch(() => {
        // Silently ignore — SIEM being down shouldn't affect the site
      })
    );
  }

  return res;
}

/** Extra attributes for demo log-producing routes */
const DEMO_META: Record<string, { status: number; extras: string }> = {
  "page-view":     { status: 200, extras: "action=page-view route_group=demo" },
  "login-success": { status: 200, extras: "action=login-success user_id=demo_user login_status=success route_group=demo" },
  "failed-auth":   { status: 401, extras: "action=failed-auth user_id=unknown login_status=failed route_group=demo" },
  "api-call":      { status: 200, extras: "action=api-call endpoint=/api/data route_group=demo" },
  "not-found":     { status: 404, extras: "action=not-found resource=/missing route_group=demo" },
  "server-error":  { status: 500, extras: "action=server-error detail=simulated route_group=demo" },
  "file-upload":   { status: 200, extras: "action=file-upload size=1.2MB route_group=demo" },
  "data-export":   { status: 200, extras: "action=data-export format=csv route_group=demo" },
};

/** Format a Date as an Apache HTTPDATE: 06/Apr/2026:09:15:23 +0000 */
function formatHttpDate(d: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getUTCDate())}/${months[d.getUTCMonth()]}/${d.getUTCFullYear()}:${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} +0000`;
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
