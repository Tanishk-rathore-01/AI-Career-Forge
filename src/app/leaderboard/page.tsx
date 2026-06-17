import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatTile } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";
import { getDashboardSummary } from "@/lib/server/dashboard-service";

export default async function LeaderboardPage() {
  const user = await requireUser();
  const summary = await getDashboardSummary(user.id);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Streaks"
        title="Practice consistency without distraction."
        description="PrepPilot rewards repetition with streaks and points while keeping public leaderboards privacy-safe and premium-ready."
        action={
          <Button asChild>
            <Link href="/practice">
              Practice today
              <ArrowRight size={16} />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatTile label="Current streak" value={summary.streak.currentStreak} tone="primary" />
        <StatTile label="Longest streak" value={summary.streak.longestStreak} />
        <StatTile label="Points" value={summary.streak.points} tone="accent" />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge>Your position</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">
                  {user.name ?? "PrepPilot user"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Keep scoring answers to build a visible practice trail.
                </p>
              </div>
              <Trophy className="text-accent" size={34} />
            </div>
            <div className="mt-5 rounded-lg border border-primary/25 bg-primary/[0.08] p-5">
              <p className="text-sm text-muted-foreground">Current private rank</p>
              <p className="mt-2 text-4xl font-semibold text-primary">Baseline</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Team or cohort rankings should only launch after profile privacy,
                anti-gaming rules, and fair scoring windows are in place.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <ShieldCheck className="text-primary" size={26} />
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              Leaderboard shell is ready.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The MVP stores streaks and points now. Premium cohorts can later
              compare weekly effort, not sensitive interview scores.
            </p>
            <Button asChild className="mt-5 w-full" variant="secondary">
              <Link href="/reports">Review progress report</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
