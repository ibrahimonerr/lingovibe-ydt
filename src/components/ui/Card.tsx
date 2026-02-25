import { cn } from "../../lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur shadow-glow",
        className
      )}
    >
      {children}
    </div>
  );
}

