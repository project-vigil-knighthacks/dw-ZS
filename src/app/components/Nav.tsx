"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const path = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="flex items-center gap-6 border-b border-zinc-800 bg-zinc-900 px-6 py-3 text-sm">
      <span className="mr-4 font-semibold tracking-tight text-white">DW-ZS</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`transition-colors hover:text-white ${
            path === l.href ? "text-white" : "text-zinc-400"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
