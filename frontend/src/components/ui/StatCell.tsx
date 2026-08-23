export function StatCell({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 border-site-border px-4 py-4 md:border-r md:last:border-r-0">
      <span className="text-xs uppercase tracking-wider text-site-on-dark-muted">
        {label}
      </span>
      <span className="text-2xl font-semibold text-site-on-dark">{value}</span>
    </div>
  );
}
