import { NextRequest, NextResponse } from "next/server";
import {
  isAuthenticatedRequest,
  unauthorizedResponse,
} from "@/lib/auth";
import { CASE_STATUSES } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return unauthorizedResponse();
  }

  const search = request.nextUrl.searchParams.get("q")?.trim();

  try {
    const supabase = createServiceClient();
    let query = supabase.from("cases").select("*").order("last_updated", {
      ascending: false,
    });

    if (search) {
      query = query.or(
        `case_number.ilike.%${search}%,defendant_name.ilike.%${search}%,court_station.ilike.%${search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ cases: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const supabase = createServiceClient();

    if (!body.case_number || !body.defendant_name || !body.court_station) {
      return NextResponse.json(
        { error: "case_number, defendant_name, and court_station are required" },
        { status: 400 },
      );
    }

    const status = body.current_status ?? "REMANDED";
    if (!CASE_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cases")
      .insert({
        case_number: body.case_number,
        defendant_name: body.defendant_name,
        court_station: body.court_station,
        current_status: status,
        bail_amount: body.bail_amount ?? null,
        next_hearing_date: body.next_hearing_date ?? null,
        holding_location: body.holding_location ?? null,
        judge_name: body.judge_name ?? null,
        notes: body.notes ?? null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("case_audit_log").insert({
      case_id: data.id,
      old_status: null,
      new_status: data.current_status,
      note: "Case created",
    });

    return NextResponse.json({ case: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
