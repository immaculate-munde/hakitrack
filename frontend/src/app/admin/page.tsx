export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { CaseListRow } from "@/components/admin/CaseListRow";
import { AdminShell } from "@/components/layout/AdminShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isAuthenticated } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { q } = await searchParams;
  const supabase = createServiceClient();

  let query = supabase.from("cases").select("*").order("last_updated", {
    ascending: false,
  });

  if (q?.trim()) {
    query = query.or(
      `case_number.ilike.%${q.trim()}%,defendant_name.ilike.%${q.trim()}%,court_station.ilike.%${q.trim()}%`,
    );
  }

  const { data: cases, error } = await query;

  return (
    <AdminShell>
      <PageHeader
        title="Case Registry"
        subtitle="Search and manage active cases"
        action={
          <Link href="/admin/cases/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </Link>
        }
      />

      <form className="mb-6 flex gap-3">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by case number, defendant, or court..."
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      {error ? (
        <p className="text-red-400">
          Could not load cases. Check Supabase configuration.
        </p>
      ) : null}

      <div className="space-y-4">
        {(cases ?? []).length === 0 ? (
          <p className="text-text-muted">
            No cases found. Run the seed script or create a new case.
          </p>
        ) : (
          cases?.map((caseRecord) => (
            <CaseListRow key={caseRecord.id} caseRecord={caseRecord} />
          ))
        )}
      </div>
    </AdminShell>
  );
}
