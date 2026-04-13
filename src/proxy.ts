import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

/**
 * Proxy that captures every request and fires an Apache-format log line
 * to the Vigil SIEM backend's /api/ingest endpoint.
 *
 * Runs at the edge on Vercel — zero config needed on the website beyond
 * setting VIGIL_API_URL in the environment.
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

    // Apache Combined Log Format line
    const logLine = `${ip} - - [${ts}] "${method} ${uri} ${protocol}" 200 0`;

    // Keep the response fast, but let the logging request finish in the background.
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
