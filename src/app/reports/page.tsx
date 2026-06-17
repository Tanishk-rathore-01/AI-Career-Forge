import Link from "next/link";
import { ArrowRight, BarChart3, Lock } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatTile } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";
import { getDashboardSummary } from "@/lib/server/dashboard-service";

export default async function ReportsPage() {
  const user = await requireUser();
  const summary = await getDashboardSummary(user.id);
  const hasPractice = summary.evaluationCount > 0;
  const focusAreas = summary.weakestAreas.length
    ? summary.weakestAreas
    : [{ name: "baseline", score: 0 }];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Weekly reports"
        title="Improvement reports without the noise."
        description="This premium-ready report view is calculated from saved evaluations today, then can be upgraded into scheduled AI-written weekly coaching."
        action={
          <Button asChild>
            <Link href="/practice">
              Add practice data
              <ArrowRight size={16} />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="Readiness"
          value={hasPractice ? summary.readinessScore : "--"}
          suffix={hasPractice ? "/100" : ""}
          tone="primary"
        />
        <StatTile
          label="Average"
          value={summary.averageScore || "--"}
          suffix={summary.averageScore ? "/100" : ""}
        />
        <StatTile label="Practice points" value={summary.streak.points} tone="accent" />
        <StatTile label="Sessions" value={summary.sessionCount} />
      </section>

      <Card>
        <CardContent className="mt-6 p-5">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Badge>Current report</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">
                {hasPractice
                  ? `You are at ${summary.readinessLevel} readiness.`
                  : "Complete a practice round to generate your first report."}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {hasPractice
                  ? summary.nextRecommendation
                  : "Reports stay empty until there is real evaluation data. This keeps the product serious and avoids fake insight."}
              </p>
            </div>
            <div className="rounded-lg border border-accent/25 bg-accent/[0.08] p-4">
              <Lock className="text-accent" size={22} />
              <p className="mt-3 text-sm font-medium text-foreground">
                Scheduled weekly AI narrative is premium-ready.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.name} className="surface rounded-lg p-5">
                <BarChart3 className="text-primary" size={22} />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {formatCategory(area.name)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {area.score
                    ? `${area.score}/100. Use one focused practice session to improve this category.`
                    : "No category data yet. Start with HR practice to establish a baseline."}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function formatCategory(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
