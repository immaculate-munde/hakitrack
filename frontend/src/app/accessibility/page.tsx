import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export default function AccessibilityPage() {
  return (
    <SiteShell darkMain>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <p className="site-mono-label text-sm">[ Legal ]</p>
        <h1 className="mt-4 text-4xl font-light text-site-on-dark">
          Accessibility Statement
        </h1>
        <p className="mt-4 text-sm text-site-on-dark-muted">
          Last updated: August 2026
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-site-on-dark-muted">
          <p>
            HakiTrack is committed to ensuring justice information is accessible
            to all Kenyans, including persons with disabilities and those using
            basic feature phones.
          </p>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">USSD access</h2>
            <p className="mt-2">
              Our primary channel is USSD (*384*XYZ#), designed for low-literacy
              and non-smartphone users. Menus use plain Swahili with English
              available via the *9 shortcut.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">Web access</h2>
            <p className="mt-2">
              The family tracking dashboard supports keyboard navigation,
              readable contrast ratios, and resizable text. We aim to conform with
              WCAG 2.1 Level AA where technically feasible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-site-on-dark">Feedback</h2>
            <p className="mt-2">
              If you encounter barriers accessing HakiTrack, contact us at{" "}
              <a
                href="mailto:accessibility@hakitrack.co.ke"
                className="text-site-mono underline"
              >
                accessibility@hakitrack.co.ke
              </a>{" "}
              or dial *384*XYZ# and request clerk assistance.
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
