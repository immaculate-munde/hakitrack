"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

export default function FamilyLoginPage() {
  const router = useRouter();
  const [caseNumber, setCaseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/family/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_number: caseNumber, phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not sign in");
      }

      router.push("/family");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell darkMain>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="site-panel w-full max-w-md px-8 py-10">
          <p className="site-mono-label text-sm">[ Family Case Tracking ]</p>
          <h1 className="mt-6 text-3xl font-light text-site-on-dark">
            Track Your Case
          </h1>
          <p className="mt-2 text-sm text-site-on-dark-muted">
            Enter your case number and registered phone to view status online.
            You can also track via USSD at *384*XYZ#.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="case-number" className="text-sm text-site-on-dark-muted">
                Case Number
              </label>
              <input
                id="case-number"
                value={caseNumber}
                onChange={(event) => setCaseNumber(event.target.value)}
                placeholder="CR-2026-089"
                required
                className="w-full border-b border-site-border bg-transparent py-2 text-site-on-dark outline-none focus:border-site-mono"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-site-on-dark-muted">
                Registered Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0712345678"
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
              {loading ? "Signing in..." : "View Case Status"}
            </button>
          </form>

          <p className="mt-6 text-xs leading-5 text-site-on-dark-muted">
            Demo: use case <strong>CR-2026-089</strong> with phone{" "}
            <strong>254711111111</strong> after running the seed script.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
