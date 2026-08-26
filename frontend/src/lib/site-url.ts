export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  }

  return "https://hakitrack.vercel.app";
}

export function familyCaseUrl(caseId: string): string {
  return `${getSiteUrl()}/family/case/${caseId}`;
}
