"use client";

import { DEMO_FAMILY } from "@/lib/demo-accounts";
import { USSD_DIAL_CODE } from "@/lib/ussd/config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";

export function FamilyHome({ memberName }: { memberName: string }) {
  const router = useRouter();
  const [caseNumber, setCaseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/family/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_number: caseNumber }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not find case");
      }

      router.push(`/family/case/${data.caseId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find case");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell darkMain>
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <PageHeader
          title="My Dashboard"
          subtitle={`Welcome, ${memberName}. Enter a case number to track progress.`}
        />

        <div className="site-panel px-8 py-10">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-site-mono" />
            <h2 className="text-lg font-medium text-site-on-dark">
              Track a case
            </h2>
          </div>
          <p className="mt-2 text-sm text-site-on-dark-muted">
            Your registered phone must be linked to the case by the court clerk
            or via USSD subscription. SMS alerts are sent when status changes.
          </p>

          <form onSubmit={handleLookup} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="case-number"
                className="text-sm text-site-on-dark-muted"
              >
                Case Number
              </label>
              <input
                id="case-number"
                value={caseNumber}
                onChange={(event) => setCaseNumber(event.target.value)}
                placeholder={DEMO_FAMILY.caseNumber}
                required
                className="w-full border-b border-site-border bg-transparent py-2 text-site-on-dark outline-none focus:border-site-mono"
              />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="site-ghost-btn site-ghost-btn-light px-5 py-3 text-xs tracking-[0.14em] uppercase disabled:opacity-50"
            >
              {loading ? "Looking up..." : "View Case Status"}
            </button>
          </form>
        </div>

        <div className="site-panel mt-6 flex items-start gap-3 px-6 py-5">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-site-mono" />
          <div>
            <p className="text-sm font-medium text-site-on-dark">
              Also track via USSD
            </p>
            <p className="mt-1 text-sm text-site-on-dark-muted">
              Dial {USSD_DIAL_CODE} → option 1 → enter your case number without dashes.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
