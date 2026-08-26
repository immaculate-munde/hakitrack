"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Input";
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
  const [proceedingsSummary, setProceedingsSummary] = useState(
    caseRecord.proceedings_summary ?? "",
  );
  const [lastRulingSummary, setLastRulingSummary] = useState(
    caseRecord.last_ruling_summary ?? "",
  );
  const [sentenceOutcome, setSentenceOutcome] = useState(
    caseRecord.sentence_outcome ?? "",
  );
  const [petitionGuidance, setPetitionGuidance] = useState(
    caseRecord.petition_guidance ?? "",
  );
  const [kenyaLawUrl, setKenyaLawUrl] = useState(
    caseRecord.kenya_law_url ?? "",
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
          proceedings_summary: proceedingsSummary || null,
          last_ruling_summary: lastRulingSummary || null,
          sentence_outcome: sentenceOutcome || null,
          petition_guidance: petitionGuidance || null,
          kenya_law_url: kenyaLawUrl || null,
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

        <div className="border-t border-site-border pt-4">
          <p className="site-mono-label text-xs">[ Family-facing context ]</p>
          <p className="mt-2 text-xs leading-5 text-site-on-dark-muted">
            Shown on the family website and included in SMS when provided.
          </p>
        </div>

        <Textarea
          label="Recent proceedings (plain language)"
          value={proceedingsSummary}
          onChange={(event) => setProceedingsSummary(event.target.value)}
          placeholder="e.g. Accused pleaded not guilty. Matter adjourned for prosecution witnesses."
        />
        <Textarea
          label="Last ruling / court direction"
          value={lastRulingSummary}
          onChange={(event) => setLastRulingSummary(event.target.value)}
          placeholder="e.g. Bail set at KES 50,000 with two sureties."
        />
        <Textarea
          label="Sentence or outcome (if any)"
          value={sentenceOutcome}
          onChange={(event) => setSentenceOutcome(event.target.value)}
          placeholder="Leave blank if case is ongoing."
        />
        <Textarea
          label="Petition / appeal guidance"
          value={petitionGuidance}
          onChange={(event) => setPetitionGuidance(event.target.value)}
          placeholder="How the family can petition, appeal, or apply for review."
        />
        <Input
          label="Kenya Law judgment URL (optional)"
          value={kenyaLawUrl}
          onChange={(event) => setKenyaLawUrl(event.target.value)}
          placeholder="https://kenyalaw.org/..."
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
