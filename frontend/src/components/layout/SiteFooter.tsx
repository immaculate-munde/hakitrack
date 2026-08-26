"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { USSD_DIAL_CODE } from "@/lib/ussd/config";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setEmail("");
  }

  return (
    <footer id="contact" className="bg-site-dark text-site-on-dark">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs tracking-[0.22em]">HAKITRACK</p>
          </div>
          <div className="text-sm leading-7 text-site-on-dark-muted">
            <p>Dial {USSD_DIAL_CODE}</p>
            <p>info@hakitrack.co.ke</p>
          </div>
          <div className="text-sm leading-7 text-site-on-dark-muted md:text-right">
            <p>Nairobi Law Courts</p>
            <p>Nairobi, Kenya</p>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-xl bg-site-newsletter px-8 py-10 text-black">
          <h3 className="text-center text-lg font-medium tracking-wide">
            Stay Informed on Justice Access
          </h3>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="text-sm">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full border-b border-black/30 bg-transparent py-2 text-sm outline-none"
                placeholder="you@example.com"
              />
            </div>
            <label className="flex items-start gap-2 text-xs leading-5">
              <input type="checkbox" required className="mt-1" />
              I want updates on HakiTrack and justice access in Kenya. *
            </label>
            <button
              type="submit"
              className="w-full bg-site-on-dark py-3 text-sm tracking-[0.12em] text-site-dark uppercase"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-14 grid gap-4 text-xs tracking-[0.12em] text-site-on-dark-muted sm:grid-cols-2 lg:grid-cols-7">
          <Link href="/rights" className="underline underline-offset-4">
            Know Your Rights
          </Link>
          <Link href="/legal-aid" className="underline underline-offset-4">
            Legal Aid
          </Link>
          <Link href="/helplines" className="underline underline-offset-4">
            Helplines
          </Link>
          <Link href="/sms-alerts" className="underline underline-offset-4">
            SMS Alerts
          </Link>
          <Link href="/accessibility" className="underline underline-offset-4">
            Accessibility
          </Link>
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          <p className="lg:text-right">
            © 2026 HakiTrack. Justice access for every family.
          </p>
        </div>
      </div>
    </footer>
  );
}
