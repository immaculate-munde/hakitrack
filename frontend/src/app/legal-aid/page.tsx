import { JusticeGuidePage } from "@/components/content/JusticeGuidePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { LEGAL_AID_SECTIONS } from "@/lib/justice-content";

export default function LegalAidPage() {
  return (
    <SiteShell darkMain>
      <JusticeGuidePage
        label="Legal Aid"
        title="Legal Aid Directory"
        intro="Free and low-cost legal help is available across Kenya. Use this guide to understand who qualifies, where to call, and how to find providers near you — online or via USSD option 3."
        sections={LEGAL_AID_SECTIONS}
        showProviders
      />
    </SiteShell>
  );
}
