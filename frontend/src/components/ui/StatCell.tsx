export function StatCell({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 md:border-r md:border-border md:last:border-r-0">
      <span className="text-xs uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span className="text-2xl font-semibold text-text-primary">{value}</span>
    </div>
  );
}
