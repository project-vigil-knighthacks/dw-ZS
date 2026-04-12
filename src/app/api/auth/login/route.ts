import { NextResponse } from "next/server";

const USERS: Record<string, string> = {
  admin: "admin123",
  alice: "alice456",
  bob: "bob789",
};

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password || USERS[username] !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", JSON.stringify({ username }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return res;
}
