"use client";

import Link from "next/link";
import { ArrowRight, Phone, Scale, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold text-text-primary">HakiTrack</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <section className="py-10 md:py-16">
          <p className="text-sm uppercase tracking-wider text-accent">
            Justice access for every family
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-text-primary md:text-5xl">
            Check bail status, court dates, and holding locations by phone.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-muted">
            HakiTrack gives families instant case updates through USSD and SMS
            reminders — no long trips to the court registry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin/login">
              <Button>
                Clerk Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" type="button">
              Dial *384*XYZ#
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden">
            <div className="hero-gradient hero-grid h-48 border-b border-border" />
            <div className="-mt-20 px-6 pb-6">
              <div className="rounded-2xl border border-border bg-surface/95 p-6 backdrop-blur">
                <h2 className="text-2xl font-bold text-text-primary">
                  Public USSD Lookup
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  Relatives dial in, enter a case number like CR-2026-089, and
                  instantly receive bail amount, next hearing date, court station,
                  and holding location.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill>Case lookup</Pill>
                  <Pill>SMS reminders</Pill>
                  <Pill>Works on any phone</Pill>
                </div>
                <div className="mt-5 rounded-xl border border-border bg-surface-elevated p-4 font-mono text-sm text-text-primary">
                  <p>Karibu HakiTrack.</p>
                  <p>Enter case number:</p>
                  <p className="text-accent">CR2026089</p>
                  <p className="mt-2 text-text-muted">
                    Status: Bail Set · KES 50,000 · 15 Sep 2026
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold text-text-primary">
                Clerk Dashboard
              </h2>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Court clerks update case records in real time. Changes appear
              immediately on USSD.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Demo case
                </p>
                <p className="mt-1 font-medium text-text-primary">CR-2026-089</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Update flow
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Remanded → Bail Set → USSD refresh
                </p>
              </div>
            </div>
            <Link href="/admin/login" className="mt-6 block">
              <Button className="w-full">
                <Phone className="h-4 w-4" />
                Open Clerk Portal
              </Button>
            </Link>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-accent-muted px-6 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                How it works
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                ["1", "Family dials USSD", "Enter a case number from anywhere."],
                ["2", "Clerk updates record", "Dashboard changes status, bail, or hearing."],
                ["3", "Instant visibility", "USSD and SMS reflect the latest information."],
              ].map(([step, title, copy]) => (
                <div
                  key={step}
                  className="border-b border-border px-6 py-6 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <p className="text-2xl font-semibold text-accent">{step}</p>
                  <p className="mt-2 font-medium text-text-primary">{title}</p>
                  <p className="mt-1 text-sm text-text-muted">{copy}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
