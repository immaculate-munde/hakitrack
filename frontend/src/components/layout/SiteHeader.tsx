"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/#how-it-works", label: "HOW IT WORKS" },
  { href: "/#services", label: "SERVICES" },
  { href: "/#contact", label: "CONTACT" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isFamily = pathname.startsWith("/family");

  return (
    <header className="bg-site-header text-site-header-fg">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-10">
        <Link
          href="/"
          className="text-xs font-medium tracking-[0.22em] md:text-sm"
        >
          HAKITRACK
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 xl:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === "/" && item.href === "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs tracking-[0.18em] transition-colors hover:text-black/70",
                  active && "border-b border-black pb-1",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className="border-b border-black pb-1 text-xs tracking-[0.18em]"
            >
              REGISTRY
            </Link>
          ) : null}
          {isFamily ? (
            <Link
              href="/family"
              className="border-b border-black pb-1 text-xs tracking-[0.18em]"
            >
              MY CASE
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link
            href="/family/login"
            className="site-ghost-btn site-ghost-btn-dark hidden px-3 py-2 text-xs tracking-[0.12em] uppercase sm:inline-block"
          >
            Track Case
          </Link>
          <Link
            href="/admin/login"
            className="site-ghost-btn site-ghost-btn-dark px-3 py-2 text-xs tracking-[0.12em] uppercase"
          >
            Clerk
          </Link>
        </div>
      </div>
      <div className="site-header-rule" />
    </header>
  );
}
