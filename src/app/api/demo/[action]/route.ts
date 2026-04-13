import { NextRequest, NextResponse } from "next/server";

const RESPONSES: Record<string, { status: number; body: Record<string, unknown> }> = {
  "page-view":     { status: 200, body: { action: "page-view", page: "/dashboard" } },
  "login-success": { status: 200, body: { action: "login-success", user_id: "demo_user" } },
  "failed-auth":   { status: 401, body: { action: "failed-auth", user_id: "unknown" } },
  "api-call":      { status: 200, body: { action: "api-call", endpoint: "/api/data" } },
  "not-found":     { status: 404, body: { action: "not-found", resource: "/missing" } },
  "server-error":  { status: 500, body: { action: "server-error", detail: "simulated" } },
  "file-upload":   { status: 200, body: { action: "file-upload", size: "1.2MB" } },
  "data-export":   { status: 200, body: { action: "data-export", format: "csv" } },
};

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  const def = RESPONSES[action] ?? { status: 200, body: { action } };
  return NextResponse.json(def.body, { status: def.status });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  const def = RESPONSES[action] ?? { status: 200, body: { action } };
  return NextResponse.json(def.body, { status: def.status });
}
