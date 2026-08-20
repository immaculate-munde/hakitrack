import { NextRequest } from "next/server";
import { handleUssdSession } from "@/lib/ussd/session";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  let sessionId = "";
  let serviceCode = "";
  let phoneNumber = "";
  let text = "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    sessionId = body.sessionId ?? "";
    serviceCode = body.serviceCode ?? "";
    phoneNumber = body.phoneNumber ?? "";
    text = body.text ?? "";
  } else {
    const formData = await request.formData();
    sessionId = String(formData.get("sessionId") ?? "");
    serviceCode = String(formData.get("serviceCode") ?? "");
    phoneNumber = String(formData.get("phoneNumber") ?? "");
    text = String(formData.get("text") ?? "");
  }

  return handleUssdSession({ sessionId, serviceCode, phoneNumber, text });
}
