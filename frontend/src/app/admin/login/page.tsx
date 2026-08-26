"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClerkDemoCard } from "@/components/auth/DemoAccountCard";
import { SiteShell } from "@/components/layout/SiteShell";
import { DEMO_CLERK } from "@/lib/demo-accounts";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        throw new Error("Invalid PIN");
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Invalid PIN. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell darkMain>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="site-panel w-full max-w-md px-8 py-10 backdrop-blur-sm">
          <p className="site-mono-label text-sm">[ Clerk Registry Access ]</p>
          <h1 className="mt-6 text-3xl font-light text-site-on-dark">Clerk Access</h1>
          <p className="mt-2 text-sm text-site-on-dark-muted">
            Enter PIN to manage case records
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="clerk-pin" className="text-sm text-site-on-dark-muted">
                Clerk PIN
              </label>
              <input
                id="clerk-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter PIN"
                required
                className="w-full border-b border-site-border bg-transparent py-2 text-site-on-dark outline-none focus:border-site-mono"
              />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="site-ghost-btn site-ghost-btn-light mt-4 w-full py-3 text-xs tracking-[0.14em] uppercase disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <ClerkDemoCard onUseDemo={() => setPin(DEMO_CLERK.pin)} />
        </div>
      </div>
    </SiteShell>
  );
}
