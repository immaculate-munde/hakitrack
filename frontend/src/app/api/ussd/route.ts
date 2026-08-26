import { NextRequest } from "next/server";
import { handleUssdSession } from "@/lib/ussd/session";

export const runtime = "nodejs";

async function parseUssdPayload(request: NextRequest): Promise<{
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return {
      sessionId: String(body.sessionId ?? ""),
      serviceCode: String(body.serviceCode ?? ""),
      phoneNumber: String(body.phoneNumber ?? ""),
      text: String(body.text ?? ""),
    };
  }

  // Africa's Talking sends application/x-www-form-urlencoded
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);

  return {
    sessionId: String(params.get("sessionId") ?? ""),
    serviceCode: String(params.get("serviceCode") ?? ""),
    phoneNumber: String(params.get("phoneNumber") ?? ""),
    text: String(params.get("text") ?? ""),
  };
}

export async function POST(request: NextRequest) {
  try {
    const input = await parseUssdPayload(request);
    return await handleUssdSession(input);
  } catch (error) {
    console.error("[USSD] Handler error:", error);
    return new Response(
      "END Huduma haipatikani kwa sasa. Jaribu tena baadaye.",
      { headers: { "Content-Type": "text/plain" } },
    );
  }
}
