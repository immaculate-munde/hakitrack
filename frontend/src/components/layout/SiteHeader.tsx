"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const LANDING_NAV = [
  { href: "/", label: "HOME" },
  { href: "/#how-it-works", label: "HOW IT WORKS" },
  { href: "/#services", label: "SERVICES" },
  { href: "/#contact", label: "CONTACT" },
];

type NavLink = { href: string; label: string; active?: boolean };

function NavLinks({
  links,
  className,
  onNavigate,
}: {
  links: NavLink[];
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {links.map((item) => (
        <Link
          key={item.href + item.label}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "text-xs tracking-[0.18em] transition-colors hover:opacity-70",
            item.active && "border-b border-current pb-1",
            className,
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  const isFamilyRoute = pathname.startsWith("/family");
  const isAdminLogin = pathname === "/admin/login";
  const isFamilyLogin = pathname === "/family/login";
  const isClerkAuthed = isAdminRoute && !isAdminLogin;
  const isFamilyAuthed = isFamilyRoute && !isFamilyLogin;
  const isAppView = isClerkAuthed || isFamilyAuthed;

  const homeHref = isClerkAuthed ? "/admin" : isFamilyAuthed ? "/family" : "/";

  const navLinks: NavLink[] = [];

  if (!isAppView) {
    navLinks.push(
      ...LANDING_NAV.map((item) => ({
        ...item,
        active: pathname === "/" && item.href === "/",
      })),
    );
  }

  if (isClerkAuthed) {
    navLinks.push(
      { href: "/admin", label: "REGISTRY", active: pathname === "/admin" },
      {
        href: "/admin/cases/new",
        label: "NEW CASE",
        active: pathname === "/admin/cases/new",
      },
    );
  }

  if (isFamilyAuthed) {
    navLinks.push({
      href: "/family",
      label: "MY DASHBOARD",
      active: pathname === "/family",
    });
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 8);

      if (y <= 0) {
        setVisible(true);
      } else if (y < lastScrollY.current - 4) {
        setVisible(true);
      } else if (y > lastScrollY.current + 8) {
        setVisible(false);
        setMobileOpen(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleClerkLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  async function handleFamilyLogout() {
    await fetch("/api/family/logout", { method: "DELETE" });
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "site-header fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-out",
          visible ? "translate-y-0" : "-translate-y-full",
          scrolled && "site-header-scrolled",
          mobileOpen && "site-header-menu-open",
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 md:px-10 md:py-5">
          <Link
            href={homeHref}
            className="relative z-10 text-xs font-medium tracking-[0.22em] md:text-sm"
            onClick={closeMobile}
          >
            HAKITRACK
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 xl:flex">
            <NavLinks links={navLinks} />
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle variant="header" />

            <div className="hidden items-center gap-2 sm:flex md:gap-3">
              {!isAppView ? (
                <>
                  <Link
                    href="/family/login"
                    className="site-ghost-btn site-ghost-btn-header hidden px-3 py-2 text-xs tracking-[0.12em] uppercase sm:inline-block"
                  >
                    Track Case
                  </Link>
                  <Link
                    href="/admin/login"
                    className="site-ghost-btn site-ghost-btn-header px-3 py-2 text-xs tracking-[0.12em] uppercase"
                  >
                    Clerk
                  </Link>
                </>
              ) : null}
              {isClerkAuthed ? (
                <button
                  type="button"
                  onClick={handleClerkLogout}
                  className="site-ghost-btn site-ghost-btn-header px-3 py-2 text-xs tracking-[0.12em] uppercase"
                >
                  Sign Out
                </button>
              ) : null}
              {isFamilyAuthed ? (
                <button
                  type="button"
                  onClick={handleFamilyLogout}
                  className="site-ghost-btn site-ghost-btn-header px-3 py-2 text-xs tracking-[0.12em] uppercase"
                >
                  Sign Out
                </button>
              ) : null}
            </div>

            <button
              type="button"
              className="site-ghost-btn site-ghost-btn-header flex h-10 w-10 items-center justify-center xl:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className={cn(
            "site-mobile-nav overflow-hidden border-t border-site-border/40 xl:hidden",
            mobileOpen ? "site-mobile-nav-open" : "max-h-0 border-t-transparent",
          )}
        >
          <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4 md:px-10">
            <NavLinks
              links={navLinks}
              className="py-3 text-sm"
              onNavigate={closeMobile}
            />

            <div className="mt-4 flex flex-col gap-2 border-t border-site-border/40 pt-4 sm:hidden">
              {!isAppView ? (
                <>
                  <Link
                    href="/family/login"
                    onClick={closeMobile}
                    className="site-ghost-btn site-ghost-btn-header py-3 text-center text-xs tracking-[0.12em] uppercase"
                  >
                    Track Case
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={closeMobile}
                    className="site-ghost-btn site-ghost-btn-header py-3 text-center text-xs tracking-[0.12em] uppercase"
                  >
                    Clerk
                  </Link>
                </>
              ) : null}
              {isClerkAuthed ? (
                <button
                  type="button"
                  onClick={handleClerkLogout}
                  className="site-ghost-btn site-ghost-btn-header py-3 text-xs tracking-[0.12em] uppercase"
                >
                  Sign Out
                </button>
              ) : null}
              {isFamilyAuthed ? (
                <button
                  type="button"
                  onClick={handleFamilyLogout}
                  className="site-ghost-btn site-ghost-btn-header py-3 text-xs tracking-[0.12em] uppercase"
                >
                  Sign Out
                </button>
              ) : null}
            </div>
          </nav>
        </div>

        <div className="site-header-rule" />
      </header>

      <div aria-hidden className="site-header-spacer" />
    </>
  );
}
