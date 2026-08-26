import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { USSD_DIAL_CODE } from "@/lib/ussd/config";

const SERVICES = [
  {
    label: "Case Status",
    href: "/family/login",
    copy: "Look up bail, remand status, and hearing dates online or via USSD.",
  },
  {
    label: "Know Your Rights",
    href: "/rights",
    copy: "Constitutional rights if arrested, in court, or applying for bail.",
  },
  {
    label: "Legal Aid",
    href: "/legal-aid",
    copy: "Free legal help, toll-free helplines, and providers by county.",
  },
  {
    label: "SMS Alerts",
    href: "/sms-alerts",
    copy: "Hearing reminders and status updates sent to any phone.",
  },
  {
    label: "Helplines",
    href: "/helplines",
    copy: "Toll-free legal aid, family support, and emergency numbers.",
  },
];

const ADVANTAGES = [
  "Instant USSD Access",
  "Real-time Clerk Updates",
  "Swahili-first Experience",
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero — library backdrop, three-column */}
      <section className="hero-library-bg text-white">
        <div className="mx-auto grid min-h-[78vh] max-w-[1400px] items-center gap-10 px-6 py-16 md:grid-cols-[1fr_auto_1fr] md:px-10">
          <div className="max-w-md">
            <h1 className="text-3xl font-medium leading-tight md:text-4xl lg:text-5xl">
              Guiding families through Kenya&apos;s justice system
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/family/login"
                className="site-ghost-btn site-ghost-btn-on-dark px-5 py-2.5 text-xs tracking-[0.14em] uppercase"
              >
                Track Your Case
              </Link>
              <Link
                href="/admin/login"
                className="site-ghost-btn site-ghost-btn-on-dark px-5 py-2.5 text-xs tracking-[0.14em] uppercase"
              >
                Clerk Access
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[360px] w-[240px] overflow-hidden md:h-[420px] md:w-[280px]">
            <Image
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
              alt="Legal professionals reviewing case documents"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-sm justify-self-end text-sm leading-7 text-white/80 md:text-base">
            <p>
              Elite access to case status, bail amounts, and court dates — by
              phone. Precision, dignity, and unwavering commitment for every
              family navigating Kenya&apos;s courts.
            </p>
          </div>
        </div>
      </section>

      {/* Services — dark section with mono label */}
      <section id="services" className="bg-site-dark px-6 py-20 text-site-on-dark md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="site-mono-label text-sm">[ Justice Access Channels ]</p>
            <Link
              href="/admin/login"
              className="site-ghost-btn site-ghost-btn-light self-start px-5 py-2 text-xs tracking-[0.14em] uppercase"
            >
              See All Services
            </Link>
          </div>

          <h2 className="mt-10 max-w-3xl text-3xl font-light leading-tight md:text-5xl">
            Specialized guidance across critical legal journeys
          </h2>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {SERVICES.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="group border-t border-site-border pt-6 transition-opacity hover:opacity-80"
              >
                <p className="site-mono-label text-sm uppercase">{service.label}</p>
                <p className="mt-4 text-sm leading-7 text-site-on-dark-muted">
                  {service.copy}
                </p>
                <span className="mt-4 inline-block text-xs tracking-[0.14em] uppercase text-site-mono">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Split — image left, dark panel right */}
      <section className="grid min-h-[520px] md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt="Modern court registry workspace"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center bg-site-dark px-8 py-16 text-site-on-dark md:px-14">
          <p className="site-mono-label text-sm">[ The HakiTrack Advantage ]</p>
          <h2 className="mt-8 max-w-lg text-3xl font-light leading-tight md:text-4xl">
            Precision, transparency, and dignity define our practice
          </h2>

          <div className="mt-16 space-y-0">
            {ADVANTAGES.map((item, index) => (
              <div
                key={item}
                className={index > 0 ? "site-dotted-rule pt-8" : "pb-8"}
              >
                <p className="site-mono-label text-right text-sm uppercase md:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-site-dark-elevated px-6 py-20 text-site-on-dark md:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          <p className="site-mono-label text-sm">[ How It Works ]</p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Dial USSD",
                copy: "Families enter a case number from any phone — no smartphone required.",
              },
              {
                step: "02",
                title: "Clerk updates record",
                copy: "Court staff update bail, status, and hearing dates in the registry dashboard.",
              },
              {
                step: "03",
                title: "Instant visibility",
                copy: "USSD and SMS reflect the latest information immediately.",
              },
            ].map((item) => (
              <div key={item.step} className="border-t border-site-border pt-8">
                <p className="site-mono-label text-xs">{item.step}</p>
                <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-site-on-dark-muted">{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="site-panel mt-16 rounded-sm p-6 font-mono text-sm leading-7 text-site-on-dark-muted">
            <p>Karibu HakiTrack — {USSD_DIAL_CODE}</p>
            <p>1. Angalia kesi  2. Haki zako  3. Msaada wa kisheria  4. Simu za msaada</p>
            <p className="mt-2">0=Rudi  00=Menyu  (*9=English)</p>
            <p className="mt-2 text-site-mono">CR2026089 → Bail Set · KES 50,000</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
