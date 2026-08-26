import { JusticeGuidePage } from "@/components/content/JusticeGuidePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { RIGHTS_SECTIONS } from "@/lib/justice-content";

export default function RightsPage() {
  return (
    <SiteShell darkMain>
      <JusticeGuidePage
        label="Know Your Rights"
        title="Know Your Rights"
        intro="Understanding your constitutional protections helps you and your family navigate arrest, court, and bail. This guide mirrors the HakiTrack USSD option 2 content."
        sections={RIGHTS_SECTIONS}
      />
    </SiteShell>
  );
}
