import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { formatDate } from "@/lib/case-status";
import { sendSMS } from "@/lib/sms";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().slice(0, 10);

    const start = `${tomorrowDate}T00:00:00.000Z`;
    const end = `${tomorrowDate}T23:59:59.999Z`;

    const { data: cases, error } = await supabase
      .from("cases")
      .select("id, case_number, court_station, next_hearing_date")
      .gte("next_hearing_date", start)
      .lte("next_hearing_date", end);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let sent = 0;

    for (const caseRecord of cases ?? []) {
      const { data: subscribers } = await supabase
        .from("case_subscribers")
        .select("phone_number")
        .eq("case_id", caseRecord.id);

      for (const subscriber of subscribers ?? []) {
        const { data: existing } = await supabase
          .from("sms_reminders")
          .select("id")
          .eq("case_id", caseRecord.id)
          .eq("phone_number", subscriber.phone_number)
          .eq("hearing_date", tomorrowDate)
          .maybeSingle();

        if (existing) continue;

        const message = `HakiTrack: Reminder — Case ${caseRecord.case_number} has a hearing tomorrow (${formatDate(caseRecord.next_hearing_date)}) at ${caseRecord.court_station}.`;

        await sendSMS(subscriber.phone_number, message);

        await supabase.from("sms_reminders").insert({
          case_id: caseRecord.id,
          phone_number: subscriber.phone_number,
          hearing_date: tomorrowDate,
        });

        sent += 1;
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
