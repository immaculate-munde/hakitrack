import Link from "next/link";
import type { GuideSection } from "@/lib/justice-content";
import { RESOURCE_LINK_ITEMS, TOLL_FREE_PROVIDERS } from "@/lib/justice-content";
import { USSD_DIAL_CODE } from "@/lib/ussd/config";

export function JusticeGuidePage({
  label,
  title,
  intro,
  sections,
  showProviders = false,
  showUssd = true,
  cta,
}: {
  label: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  showProviders?: boolean;
  showUssd?: boolean;
  cta?: { href: string; label: string };
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <p className="site-mono-label text-sm">[ {label} ]</p>
      <h1 className="mt-4 text-4xl font-light text-site-on-dark">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-site-on-dark-muted">{intro}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-lg font-medium text-site-on-dark">{section.title}</h2>
            {section.articleRef ? (
              <p className="mt-1 text-xs tracking-wide text-site-mono uppercase">
                {section.articleRef}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-7 text-site-on-dark-muted">
              {section.summary}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-site-on-dark-muted">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {showProviders ? (
        <section className="site-panel mt-10 rounded-sm p-6">
          <h2 className="text-lg font-medium text-site-on-dark">Toll-free helplines</h2>
          <ul className="mt-4 space-y-3 text-sm text-site-on-dark-muted">
            {TOLL_FREE_PROVIDERS.map((provider) => (
              <li key={provider.phone} className="flex flex-wrap justify-between gap-2">
                <span>{provider.name}</span>
                <a href={`tel:${provider.phone}`} className="text-site-mono underline">
                  {provider.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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

      {showUssd ? (
        <section className="mt-10 border-t border-site-border pt-10">
          <h2 className="text-lg font-medium text-site-on-dark">Access via USSD</h2>
          <p className="mt-3 text-sm leading-7 text-site-on-dark-muted">
            Dial{" "}
            <span className="font-mono text-site-on-dark">{USSD_DIAL_CODE}</span> from any
            phone. Choose the relevant menu option for a summary on screen and detailed
            links sent to your phone by SMS.
          </p>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap gap-3">
        {cta ? (
          <Link
            href={cta.href}
            className="site-ghost-btn site-ghost-btn-light inline-block px-5 py-2 text-xs tracking-[0.14em] uppercase"
          >
            {cta.label}
          </Link>
        ) : null}
        <Link
          href="/"
          className="site-ghost-btn site-ghost-btn-light inline-block px-5 py-2 text-xs tracking-[0.14em] uppercase"
        >
          Back to Home
        </Link>
      </div>
    </article>
  );
}
