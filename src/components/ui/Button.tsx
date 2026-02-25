import Link from "next/link";

import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070812] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink-500 text-white shadow-glow hover:bg-ink-400 active:bg-ink-500",
  secondary:
    "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/14 active:bg-white/10",
  ghost:
    "bg-transparent text-white/90 hover:bg-white/8 ring-1 ring-transparent hover:ring-white/10"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function Button({
  href,
  children,
  className,
  variant = "primary",
  size = "md"
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const cls = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type="button">
      {children}
    </button>
  );
}

