import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "btn-soft bg-[var(--pastel-mint)] text-foreground hover:bg-[var(--pastel-sky)]",
    secondary: "btn-soft bg-[var(--surface)] text-foreground border border-[var(--border)] hover:bg-[var(--pastel-peach)]",
    ghost: "text-foreground hover:bg-[var(--pastel-lavender)]",
    danger: "btn-soft bg-[var(--pastel-pink)] text-foreground hover:opacity-90",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
