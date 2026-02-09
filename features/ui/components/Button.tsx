import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "danger" | "ghost" | "primary" | "secondary";
};

const VARIANTS = {
  danger: "btn-soft bg-[var(--pastel-pink)] text-foreground hover:opacity-90",
  ghost: "text-foreground hover:bg-[var(--pastel-lavender)]",
  primary: "btn-soft bg-[var(--pastel-mint)] text-foreground hover:bg-[var(--pastel-sky)]",
  secondary:
    "btn-soft bg-[var(--surface)] text-foreground border border-[var(--border)] hover:bg-[var(--pastel-peach)]",
} as const;

const SIZES = {
  lg: "px-6 py-3 text-base",
  md: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-sm",
} as const;

export const Button = ({
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none";
  return (
    <button
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
