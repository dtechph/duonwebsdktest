"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SDK_VERSION } from "@dtechph/wayfinding-web";

const links = [
  { href: "/", label: "Full page" },
  { href: "/embedded", label: "Embedded card" },
];

export function SampleNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
            Duon Wayfinding
          </h1>
          <p className="text-sm text-zinc-500">
            Web SDK sample · @dtechph/wayfinding-web@{SDK_VERSION}
          </p>
        </div>
        <nav className="flex gap-1 rounded-lg bg-zinc-100 p-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
