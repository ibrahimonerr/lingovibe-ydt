import { cn } from "../../lib/utils";

export function Badge({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/10 backdrop-blur",
        className
      )}
    >
      {children}
    </span>
  );
}

