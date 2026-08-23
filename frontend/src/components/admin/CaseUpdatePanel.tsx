"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import {
  CASE_STATUSES,
  CaseRecord,
  CaseStatus,
  STATUS_LABELS,
} from "@/lib/case-status";

export function CaseUpdatePanel({ caseRecord }: { caseRecord: CaseRecord }) {
  const router = useRouter();
  const [status, setStatus] = useState<CaseStatus>(caseRecord.current_status);
  const [bailAmount, setBailAmount] = useState(
    caseRecord.bail_amount?.toString() ?? "",
  );
  const [hearingDate, setHearingDate] = useState(
    caseRecord.next_hearing_date
      ? new Date(caseRecord.next_hearing_date).toISOString().slice(0, 16)
      : "",
  );
  const [holdingLocation, setHoldingLocation] = useState(
    caseRecord.holding_location ?? "",
  );
  const [notes, setNotes] = useState(caseRecord.notes ?? "");
  const [familyPhone, setFamilyPhone] = useState(
    caseRecord.family_contact_phone ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/cases/${caseRecord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_status: status,
          bail_amount: bailAmount ? Number(bailAmount) : null,
          next_hearing_date: hearingDate
            ? new Date(hearingDate).toISOString()
            : null,
          holding_location: holdingLocation || null,
          notes: notes || null,
          family_contact_phone: familyPhone || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Update failed");
      }

      setMessage("Case updated — USSD will reflect immediately.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="site-panel p-6">
      <div className="space-y-1">
        <p className="site-mono-label text-xs">[ Update Case ]</p>
        <h2 className="text-xl font-light text-site-on-dark">
          Update Case Status
        </h2>
        <p className="text-sm text-site-on-dark-muted">
          Changes reflect instantly on USSD
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as CaseStatus)}
          options={CASE_STATUSES.map((value) => ({
            value,
            label: STATUS_LABELS[value],
          }))}
        />
        <Input
          label="Bail Amount (KES)"
          type="number"
          min="0"
          value={bailAmount}
          onChange={(event) => setBailAmount(event.target.value)}
          placeholder="50000"
        />
        <Input
          label="Next Hearing"
          type="datetime-local"
          value={hearingDate}
          onChange={(event) => setHearingDate(event.target.value)}
        />
        <Input
          label="Holding Location"
          value={holdingLocation}
          onChange={(event) => setHoldingLocation(event.target.value)}
          placeholder="Industrial Area Remand"
        />
        <Input
          label="Family Contact Phone"
          value={familyPhone}
          onChange={(event) => setFamilyPhone(event.target.value)}
          placeholder="254712345678"
        />
        <Input
          label="Internal Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Clerk notes"
        />

        {message ? (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          <CheckCircle2 className="h-4 w-4" />
          {loading ? "Updating..." : "Confirm Update"}
        </Button>
      </form>
    </Card>
  );
}
