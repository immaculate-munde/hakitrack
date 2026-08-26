import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  HELPLINE_CATEGORIES,
  HELPLINES,
  type HelplineCategory,
} from "@/lib/helplines";
import { RESOURCE_LINK_ITEMS } from "@/lib/justice-content";
import { USSD_DIAL_CODE } from "@/lib/ussd/config";

const CATEGORY_ORDER: HelplineCategory[] = ["legal", "family", "emergency"];

export default function HelplinesPage() {
  return (
    <SiteShell darkMain>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <p className="site-mono-label text-sm">[ Helplines ]</p>
        <h1 className="mt-4 text-4xl font-light text-site-on-dark">
          Justice Helplines
        </h1>
        <p className="mt-4 text-sm leading-7 text-site-on-dark-muted">
          Toll-free and emergency numbers for legal aid, family support, and
          urgent help in Kenya. Also available via USSD option 4 on{" "}
          <span className="font-mono text-site-on-dark">{USSD_DIAL_CODE}</span>.
        </p>

        <div className="mt-10 space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const meta = HELPLINE_CATEGORIES[category];
            const lines = HELPLINES.filter((line) => line.category === category);

            return (
              <section key={category} id={category}>
                <h2 className="text-lg font-medium text-site-on-dark">
                  {meta.title.en}
                </h2>
                <p className="mt-2 text-sm leading-7 text-site-on-dark-muted">
                  {meta.description.en}
                </p>
                <ul className="mt-4 space-y-4">
                  {lines.map((line) => (
                    <li
                      key={line.id}
                      className="site-panel rounded-sm p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-site-on-dark">
                            {line.name.en}
                          </p>
                          <p className="mt-1 text-sm text-site-on-dark-muted">
                            {line.notes.en}
                          </p>
                        </div>
                        <a
                          href={`tel:${line.phone}`}
                          className="site-mono-label shrink-0 text-sm underline underline-offset-4"
                        >
                          {line.phone}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section className="site-panel mt-10 rounded-sm p-6">
          <h2 className="text-lg font-medium text-site-on-dark">Learn more</h2>
          <ul className="mt-4 space-y-4">
            {RESOURCE_LINK_ITEMS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-site-on-dark underline underline-offset-4"
                >
                  {link.name}
                </a>
                <p className="mt-1 text-sm leading-6 text-site-on-dark-muted">
                  {link.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-site-border pt-10">
          <h2 className="text-lg font-medium text-site-on-dark">Access via USSD</h2>
          <p className="mt-3 text-sm leading-7 text-site-on-dark-muted">
            Dial {USSD_DIAL_CODE}, choose option 4, and pick a category. Full
            helpline lists can be sent to your phone by SMS.
          </p>
        </section>

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
