import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/15 text-sm font-bold text-primary shadow-glow">
        PP
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-foreground">PrepPilot</span>
          <span className="block text-xs text-muted-foreground">Interview intelligence</span>
        </span>
      )}
    </Link>
  );
}

