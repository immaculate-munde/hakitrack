import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm text-text-muted">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none ring-accent focus:ring-2",
          className,
        )}
        {...props}
      />
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm text-text-muted">
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none ring-accent focus:ring-2",
          className,
        )}
        {...props}
      />
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ value: string; label: string }>;
};

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="text-sm text-text-muted">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-text-primary outline-none ring-accent focus:ring-2",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
