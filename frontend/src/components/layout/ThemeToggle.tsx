"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ variant = "default" }: { variant?: "default" | "header" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const buttonClass =
    variant === "header"
      ? "site-ghost-btn site-ghost-btn-header flex h-10 w-10 items-center justify-center rounded-full"
      : "site-ghost-btn site-ghost-btn-dark flex h-10 w-10 items-center justify-center rounded-full";

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
