"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row gap-4 justify-between items-center font-[family-name:var(--font-mono-alt)] text-[10px] text-[var(--muted-foreground)] tracking-wider">
      <span>2026 DW-ZS · VIGIL SIEM</span>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          HOME
        </Link>
        <Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">
          DASHBOARD
        </Link>
        <Link href="/admin" className="hidden md:inline hover:text-[var(--foreground)] transition-colors">
          ADMIN
        </Link>
      </div>
      <span className="hidden md:inline">NEXT.JS · VIGIL · APACHE LOG FORMAT</span>
    </footer>
  );
}
