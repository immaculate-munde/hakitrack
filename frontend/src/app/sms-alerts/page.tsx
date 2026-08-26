import { JusticeGuidePage } from "@/components/content/JusticeGuidePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { SMS_ALERT_SECTIONS } from "@/lib/justice-content";

export default function SmsAlertsPage() {
  return (
    <SiteShell darkMain>
      <JusticeGuidePage
        label="SMS Alerts"
        title="SMS Case Alerts"
        intro="Stay informed about hearings and case updates by text message — no smartphone required. Subscribe through USSD or the family web portal."
        sections={SMS_ALERT_SECTIONS}
        cta={{ href: "/family/login", label: "Track a Case Online" }}
      />
    </SiteShell>
  );
}
