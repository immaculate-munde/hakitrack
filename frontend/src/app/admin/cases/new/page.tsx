"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import {
  CASE_STATUSES,
  CaseStatus,
  STATUS_LABELS,
} from "@/lib/case-status";

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    case_number: "",
    defendant_name: "",
    court_station: "",
    current_status: "REMANDED" as CaseStatus,
    bail_amount: "",
    holding_location: "",
    judge_name: "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bail_amount: form.bail_amount ? Number(form.bail_amount) : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create case");
      }

      router.push(`/admin/cases/${data.case.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create case");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <PageHeader
        title="New Case"
        subtitle="Add a case to the mock registry"
        backHref="/admin"
        backLabel="Back to Registry"
      />

      <Card className="site-panel max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Case Number"
            value={form.case_number}
            onChange={(event) =>
              setForm({ ...form, case_number: event.target.value })
            }
            placeholder="CR-2026-089"
            required
          />
          <Input
            label="Defendant Name"
            value={form.defendant_name}
            onChange={(event) =>
              setForm({ ...form, defendant_name: event.target.value })
            }
            required
          />
          <Input
            label="Court Station"
            value={form.court_station}
            onChange={(event) =>
              setForm({ ...form, court_station: event.target.value })
            }
            placeholder="Milimani Law Courts"
            required
          />
          <Select
            label="Status"
            value={form.current_status}
            onChange={(event) =>
              setForm({
                ...form,
                current_status: event.target.value as CaseStatus,
              })
            }
            options={CASE_STATUSES.map((value) => ({
              value,
              label: STATUS_LABELS[value],
            }))}
          />
          <Input
            label="Bail Amount (KES)"
            type="number"
            value={form.bail_amount}
            onChange={(event) =>
              setForm({ ...form, bail_amount: event.target.value })
            }
          />
          <Input
            label="Holding Location"
            value={form.holding_location}
            onChange={(event) =>
              setForm({ ...form, holding_location: event.target.value })
            }
          />
          <Input
            label="Judge Name"
            value={form.judge_name}
            onChange={(event) =>
              setForm({ ...form, judge_name: event.target.value })
            }
          />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Case"}
          </Button>
        </form>
      </Card>
    </AdminShell>
  );
}
