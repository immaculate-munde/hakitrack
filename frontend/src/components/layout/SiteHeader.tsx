"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const LANDING_NAV = [
  { href: "/", label: "HOME" },
  { href: "/#how-it-works", label: "HOW IT WORKS" },
  { href: "/#services", label: "SERVICES" },
  { href: "/#contact", label: "CONTACT" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/admin");
  const isFamilyRoute = pathname.startsWith("/family");
  const isAdminLogin = pathname === "/admin/login";
  const isFamilyLogin = pathname === "/family/login";
  const isClerkAuthed = isAdminRoute && !isAdminLogin;
  const isFamilyAuthed = isFamilyRoute && !isFamilyLogin;
  const isAppView = isClerkAuthed || isFamilyAuthed;

  async function handleClerkLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  async function handleFamilyLogout() {
    await fetch("/api/family/logout", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-site-header text-site-header-fg">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-10">
        <Link
          href={isClerkAuthed ? "/admin" : isFamilyAuthed ? "/family" : "/"}
          className="text-xs font-medium tracking-[0.22em] md:text-sm"
        >
          HAKITRACK
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 xl:flex">
          {!isAppView
            ? LANDING_NAV.map((item) => {
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
              })
            : null}
          {isClerkAuthed ? (
            <>
              <Link
                href="/admin"
                className={cn(
                  "text-xs tracking-[0.18em]",
                  pathname === "/admin" && "border-b border-black pb-1",
                )}
              >
                REGISTRY
              </Link>
              <Link
                href="/admin/cases/new"
                className={cn(
                  "text-xs tracking-[0.18em]",
                  pathname === "/admin/cases/new" &&
                    "border-b border-black pb-1",
                )}
              >
                NEW CASE
              </Link>
            </>
          ) : null}
          {isFamilyAuthed ? (
            <>
              <Link
                href="/family"
                className={cn(
                  "text-xs tracking-[0.18em]",
                  pathname === "/family" && "border-b border-black pb-1",
                )}
              >
                MY DASHBOARD
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {!isAppView ? (
            <>
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
            </>
          ) : null}
          {isClerkAuthed ? (
            <button
              type="button"
              onClick={handleClerkLogout}
              className="site-ghost-btn site-ghost-btn-dark px-3 py-2 text-xs tracking-[0.12em] uppercase"
            >
              Sign Out
            </button>
          ) : null}
          {isFamilyAuthed ? (
            <button
              type="button"
              onClick={handleFamilyLogout}
              className="site-ghost-btn site-ghost-btn-dark px-3 py-2 text-xs tracking-[0.12em] uppercase"
            >
              Sign Out
            </button>
          ) : null}
        </div>
      </div>
      <div className="site-header-rule" />
    </header>
  );
}
