import type React from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="max-w-3xl">
        <p className="section-kicker">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

type StatTileProps = {
  label: string;
  value: string | number;
  suffix?: string;
  tone?: "primary" | "accent" | "neutral";
};

export function StatTile({
  label,
  value,
  suffix,
  tone = "neutral"
}: StatTileProps) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "accent"
        ? "text-accent"
        : "text-foreground";

  return (
    <div className="surface rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${valueClass}`}>
        {value}
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </p>
    </div>
  );
}
