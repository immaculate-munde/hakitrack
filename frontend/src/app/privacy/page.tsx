import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export default function PrivacyPage() {
  return (
    <SiteShell darkMain>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <p className="site-mono-label text-sm">[ Legal ]</p>
        <h1 className="mt-4 text-4xl font-light text-site-on-dark">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-site-on-dark-muted">
          Last updated: August 2026
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-site-on-dark-muted">
          <p>
            HakiTrack helps families track case status through USSD, SMS, and a
            web dashboard. We handle personal data carefully and only collect
            what is necessary to provide this service.
          </p>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">Data we collect</h2>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Case numbers and court status information (from clerk records)</li>
              <li>Phone numbers when you subscribe to SMS reminders or family tracking</li>
              <li>USSD session metadata (session ID, timestamps) for service delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">How we use data</h2>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Display case status to authorized family members</li>
              <li>Send hearing reminders to opted-in phone numbers</li>
              <li>Improve service reliability and security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">Data sharing</h2>
            <p className="mt-2">
              We do not sell personal data. SMS and USSD services are delivered
              through Africa&apos;s Talking. Case data is stored in encrypted
              Supabase databases accessible only to authorized clerks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">Your rights</h2>
            <p className="mt-2">
              You may request correction of linked phone numbers through the court
              clerk or by emailing{" "}
              <a
                href="mailto:privacy@hakitrack.co.ke"
                className="text-site-mono underline"
              >
                privacy@hakitrack.co.ke
              </a>
              . Unsubscribe from SMS by contacting the clerk to remove your number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">
              Kenya Data Protection Act
            </h2>
            <p className="mt-2">
              HakiTrack processes personal data in accordance with the Data
              Protection Act, 2019 of Kenya. For complaints, contact the Office
              of the Data Protection Commissioner.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="site-ghost-btn site-ghost-btn-light mt-12 inline-block px-5 py-2 text-xs tracking-[0.14em] uppercase"
        >
          Back to Home
        </Link>
      </article>
    </SiteShell>
  );
}
