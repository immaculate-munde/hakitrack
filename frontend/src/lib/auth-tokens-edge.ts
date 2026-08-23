function authSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret";
}

async function hmacSha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(authSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlDecode(value: string): string {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

let clerkTokenCache: string | null = null;

async function getClerkToken(): Promise<string> {
  if (clerkTokenCache) return clerkTokenCache;
  clerkTokenCache = await hmacSha256Hex("clerk-authenticated");
  return clerkTokenCache;
}

export async function parseFamilyToken(
  token: string | undefined,
): Promise<{ caseId: string; phone: string } | null> {
  if (!token) return null;

  try {
    const decoded = base64UrlDecode(token);
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const payload = decoded.slice(0, lastColon);
    const signature = decoded.slice(lastColon + 1);
    const payloadColon = payload.indexOf(":");
    if (payloadColon === -1) return null;

    const caseId = payload.slice(0, payloadColon);
    const phone = payload.slice(payloadColon + 1);
    const expected = await hmacSha256Hex(`family:${payload}`);

    if (signature !== expected) return null;
    return { caseId, phone };
  } catch {
    return null;
  }
}

export async function isValidClerkToken(
  value: string | undefined,
): Promise<boolean> {
  return Boolean(value && value === (await getClerkToken()));
}

export async function isValidFamilyToken(
  value: string | undefined,
): Promise<boolean> {
  return (await parseFamilyToken(value)) !== null;
}
