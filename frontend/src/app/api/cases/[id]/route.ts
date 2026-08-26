import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest, unauthorizedResponse } from "@/lib/auth";
import {
  CASE_STATUSES,
  type CaseStatus,
  normalizePhoneForDb,
} from "@/lib/case-status";
import { formatCaseContextSms, formatStatusChangeSms } from "@/lib/case-sms";
import { sendSMS } from "@/lib/sms";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAuthenticatedRequest(request)) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const [{ count: subscriberCount }, { data: auditLogs }] = await Promise.all([
      supabase
        .from("case_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("case_id", id),
      supabase
        .from("case_audit_log")
        .select("*")
        .eq("case_id", id)
        .order("changed_at", { ascending: false }),
    ]);

    return NextResponse.json({
      case: data,
      subscriberCount: subscriberCount ?? 0,
      auditLogs: auditLogs ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAuthenticatedRequest(request)) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data: existing, error: existingError } = await supabase
      .from("cases")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    if (body.current_status !== undefined) {
      if (!CASE_STATUSES.includes(body.current_status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.current_status = body.current_status;
    }
    if (body.bail_amount !== undefined) updates.bail_amount = body.bail_amount;
    if (body.next_hearing_date !== undefined) {
      updates.next_hearing_date = body.next_hearing_date;
    }
    if (body.holding_location !== undefined) {
      updates.holding_location = body.holding_location;
    }
    if (body.judge_name !== undefined) updates.judge_name = body.judge_name;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.defendant_name !== undefined) {
      updates.defendant_name = body.defendant_name;
    }
    if (body.court_station !== undefined) {
      updates.court_station = body.court_station;
    }
    if (body.family_contact_phone !== undefined) {
      updates.family_contact_phone = body.family_contact_phone
        ? normalizePhoneForDb(String(body.family_contact_phone))
        : null;
    }
    if (body.proceedings_summary !== undefined) {
      updates.proceedings_summary = body.proceedings_summary;
    }
    if (body.last_ruling_summary !== undefined) {
      updates.last_ruling_summary = body.last_ruling_summary;
    }
    if (body.sentence_outcome !== undefined) {
      updates.sentence_outcome = body.sentence_outcome;
    }
    if (body.petition_guidance !== undefined) {
      updates.petition_guidance = body.petition_guidance;
    }
    if (body.kenya_law_url !== undefined) {
      updates.kenya_law_url = body.kenya_law_url;
    }

    const contextFields = [
      "proceedings_summary",
      "last_ruling_summary",
      "sentence_outcome",
      "petition_guidance",
    ] as const;
    const contextUpdated = contextFields.some(
      (field) =>
        body[field] !== undefined && body[field] !== existing[field],
    );

    const { data, error } = await supabase
      .from("cases")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (
      updates.current_status &&
      updates.current_status !== existing.current_status
    ) {
      await supabase.from("case_audit_log").insert({
        case_id: id,
        old_status: existing.current_status,
        new_status: updates.current_status,
        note: body.note ?? "Status updated via clerk dashboard",
      });

      const message = formatStatusChangeSms(
        data,
        updates.current_status as CaseStatus,
      );

      const { data: subscribers } = await supabase
        .from("case_subscribers")
        .select("phone_number")
        .eq("case_id", id);

      const notified = new Set<string>();

      for (const subscriber of subscribers ?? []) {
        notified.add(subscriber.phone_number);
        await sendSMS(subscriber.phone_number, message);
      }

      if (
        data.family_contact_phone &&
        !notified.has(data.family_contact_phone)
      ) {
        await sendSMS(data.family_contact_phone, message);
      }
    } else if (contextUpdated) {
      const message = formatCaseContextSms(data, "Case information updated.");

      const { data: subscribers } = await supabase
        .from("case_subscribers")
        .select("phone_number")
        .eq("case_id", id);

      const notified = new Set<string>();

      for (const subscriber of subscribers ?? []) {
        notified.add(subscriber.phone_number);
        await sendSMS(subscriber.phone_number, message);
      }

      if (
        data.family_contact_phone &&
        !notified.has(data.family_contact_phone)
      ) {
        await sendSMS(data.family_contact_phone, message);
      }
    }

    return NextResponse.json({ case: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthenticatedRequest(request)) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("cases").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
