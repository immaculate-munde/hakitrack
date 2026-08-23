import crypto from "crypto";

function authSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret";
}

export function getClerkToken(): string {
  return crypto
    .createHmac("sha256", authSecret())
    .update("clerk-authenticated")
    .digest("hex");
}

export function createFamilyToken(caseId: string, phone: string): string {
  const payload = `${caseId}:${phone}`;
  const signature = crypto
    .createHmac("sha256", authSecret())
    .update(`family:${payload}`)
    .digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function parseFamilyToken(
  token: string | undefined,
): { caseId: string; phone: string } | null {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const payload = decoded.slice(0, lastColon);
    const signature = decoded.slice(lastColon + 1);
    const payloadColon = payload.indexOf(":");
    if (payloadColon === -1) return null;

    const caseId = payload.slice(0, payloadColon);
    const phone = payload.slice(payloadColon + 1);

    const expected = crypto
      .createHmac("sha256", authSecret())
      .update(`family:${payload}`)
      .digest("hex");

    if (signature !== expected) return null;
    return { caseId, phone };
  } catch {
    return null;
  }
}

export function isValidClerkToken(value: string | undefined): boolean {
  return Boolean(value && value === getClerkToken());
}

export function isValidFamilyToken(value: string | undefined): boolean {
  return parseFamilyToken(value) !== null;
}
