import { NextRequest } from "next/server";
import { handleUssdSession } from "@/lib/ussd/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

type UssdPayload = {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
};

function parseFormFields(params: URLSearchParams): UssdPayload {
  return {
    sessionId: String(params.get("sessionId") ?? ""),
    serviceCode: String(params.get("serviceCode") ?? ""),
    phoneNumber: String(params.get("phoneNumber") ?? ""),
    text: String(params.get("text") ?? ""),
  };
}

async function parseUssdPayload(request: NextRequest): Promise<UssdPayload> {
  if (request.method === "GET" || request.method === "HEAD") {
    return parseFormFields(request.nextUrl.searchParams);
  }

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

  const rawBody = await request.text();
  return parseFormFields(new URLSearchParams(rawBody));
}

async function handleRequest(request: NextRequest): Promise<Response> {
  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const input = await parseUssdPayload(request);
    console.info("[USSD]", {
      method: request.method,
      sessionId: input.sessionId,
      serviceCode: input.serviceCode,
      phoneNumber: input.phoneNumber?.slice(-4),
      text: input.text,
    });
    return await handleUssdSession(input);
  } catch (error) {
    console.error("[USSD] Handler error:", error);
    return new Response(
      "END Huduma haipatikani kwa sasa. Jaribu tena baadaye.",
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function HEAD(request: NextRequest) {
  return handleRequest(request);
}
