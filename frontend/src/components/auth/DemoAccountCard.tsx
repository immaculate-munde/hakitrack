"use client";

import { DEMO_CLERK } from "@/lib/demo-accounts";

export function DemoAccountCard({
  title,
  rows,
  onUseDemo,
}: {
  title: string;
  rows: { label: string; value: string }[];
  onUseDemo?: () => void;
}) {
  return (
    <div className="mt-8 rounded border border-site-border bg-site-panel/60 px-4 py-4">
      <p className="site-mono-label text-xs">[ {title} ]</p>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-site-on-dark-muted">{row.label}</dt>
            <dd className="font-mono text-site-on-dark">{row.value}</dd>
          </div>
        ))}
      </dl>
      {onUseDemo ? (
        <button
          type="button"
          onClick={onUseDemo}
          className="site-ghost-btn site-ghost-btn-light mt-4 w-full py-2 text-xs tracking-[0.12em] uppercase"
        >
          Use Demo Account
        </button>
      ) : null}
    </div>
  );
}

export function ClerkDemoCard({ onUseDemo }: { onUseDemo: () => void }) {
  return (
    <DemoAccountCard
      title="Demo Clerk"
      rows={[{ label: "PIN", value: DEMO_CLERK.pin }]}
      onUseDemo={onUseDemo}
    />
  );
}
