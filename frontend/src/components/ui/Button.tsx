import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" &&
          "bg-accent text-white hover:bg-accent-hover",
        variant === "ghost" &&
          "border border-border bg-surface-elevated text-text-primary hover:bg-surface",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
