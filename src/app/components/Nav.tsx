"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
];

export function Nav() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 h-[70px] bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)] ${
        isDashboard ? "hidden lg:flex" : ""
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 md:gap-3 group">
        <div className="w-6 h-6 rounded border border-[var(--accent)] bg-[var(--accent)]/10 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span className="font-[family-name:var(--font-display)] font-extrabold text-lg md:text-xl tracking-tight text-[var(--foreground)]">
          DW-ZS
        </span>
      </Link>

      {/* Links */}
      <div className="hidden sm:flex">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`font-[family-name:var(--font-mono-alt)] text-[12px] md:text-[13px] tracking-wide uppercase px-3 md:px-6 py-2.5 border transition-all duration-200 ${
                isActive
                  ? "text-[var(--accent-light)] border-[var(--accent)]"
                  : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)] hover:border-[var(--border)]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Auth CTA */}
      <Link
        href="/login"
        className="font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[13px] bg-[var(--accent)] text-white px-4 md:px-6 py-2 md:py-2.5 font-medium tracking-widest uppercase hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-200"
      >
        LOGIN →
      </Link>
    </nav>
  );
}
