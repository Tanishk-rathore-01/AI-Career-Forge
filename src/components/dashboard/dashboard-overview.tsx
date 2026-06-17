import Link from "next/link";
import {
  Award,
  BarChart3,
  CalendarCheck,
  FileSearch,
  GraduationCap,
  Mic2,
  Trophy,
  WalletCards
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatTile } from "@/components/ui/page-header";
import type { getDashboardSummary } from "@/lib/server/dashboard-service";

type DashboardSummary = Awaited<ReturnType<typeof getDashboardSummary>>;

const quickActions = [
  {
    title: "Complete one HR round",
    description: "Sharpen self-introduction, clarity, and confidence.",
    href: "/practice",
    icon: GraduationCap
  },
  {
    title: "Run resume match",
    description: "Compare your resume against a target job description.",
    href: "/resume-match",
    icon: FileSearch
  },
  {
    title: "Practice salary answer",
    description: "Use the free limited simulator before real HR calls.",
    href: "/salary-practice",
    icon: WalletCards
  }
];

const roadmap = [
  { label: "Voice interview practice", icon: Mic2, status: "Phase 2" },
  { label: "Weekly reports", icon: BarChart3, status: "Premium-ready" },
  { label: "Readiness certificate", icon: Award, status: "Premium-ready" },
  { label: "Streak leaderboard", icon: Trophy, status: "MVP shell" }
];

export function DashboardOverview({
  name,
  summary
}: {
  name?: string | null;
  summary: DashboardSummary;
}) {
  const hasPractice = summary.evaluationCount > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command center"
        title={name ? `Welcome back, ${name}.` : "Welcome to PrepPilot."}
        description={
          hasPractice
            ? "Your dashboard is calculated from saved interview, salary, and resume practice data."
            : "Start one practice round to build a real readiness baseline. Until then, this dashboard stays intentionally quiet."
        }
        action={
          <Button asChild size="lg">
            <Link href="/practice">Start practice</Link>
          </Button>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <div className="surface-raised rounded-xl p-6">
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="rounded-xl border border-primary/25 bg-primary/[0.08] p-6 text-center">
              <p className="text-sm text-muted-foreground">Readiness</p>
              <p className="mt-2 text-7xl font-semibold text-primary">
                {summary.readinessScore || 0}
              </p>
              <p className="mt-1 text-sm font-medium text-primary">
                {hasPractice ? summary.readinessLevel : "No baseline yet"}
              </p>
            </div>
            <div>
              <p className="section-kicker">Next recommendation</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                {summary.nextRecommendation}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                PrepPilot uses stored category scores first. AI-generated weekly
                coaching can be layered on after enough practice data exists.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>{summary.evaluationCount} evaluations</Badge>
                <Badge>{summary.sessionCount} sessions</Badge>
                <Badge>{summary.streak.currentStreak} day streak</Badge>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-kicker">Consistency</p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  Practice streak
                </h2>
              </div>
              <Trophy className="text-accent" size={26} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <StatTile label="Current" value={summary.streak.currentStreak} />
              <StatTile label="Longest" value={summary.streak.longestStreak} />
              <StatTile label="Points" value={summary.streak.points} tone="accent" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Average score"
          value={summary.averageScore || "--"}
          suffix={summary.averageScore ? "/100" : ""}
          tone="primary"
        />
        <StatTile
          label="Resume match"
          value={summary.resumeMatchScore || "--"}
          suffix={summary.resumeMatchScore ? "%" : ""}
        />
        <StatTile
          label="Salary confidence"
          value={summary.salaryConfidence || "--"}
          suffix={summary.salaryConfidence ? "%" : ""}
        />
        <StatTile label="Saved sessions" value={summary.sessionCount} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Recommended actions
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Designed to move users into the next useful workflow, not make
                  them decode a dashboard.
                </p>
              </div>
              <CalendarCheck className="text-primary" size={24} />
            </div>
            <div className="mt-5 grid gap-3">
              {quickActions.map((item) => (
                <Link
                  href={item.href}
                  key={item.title}
                  className="surface flex items-center justify-between gap-4 rounded-lg p-4 transition hover:border-primary/30 hover:bg-primary/[0.04]"
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="text-primary" size={20} />
                    <span>
                      <span className="block font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-foreground">Advanced roadmap</h2>
            <div className="mt-5 space-y-3">
              {roadmap.map((item) => (
                <div
                  key={item.label}
                  className="surface flex items-center justify-between gap-3 rounded-lg p-4"
                >
                  <span className="flex items-center gap-3 text-sm text-foreground">
                    <item.icon className="text-accent" size={18} />
                    {item.label}
                  </span>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
            </div>
            <Button asChild className="mt-5 w-full" variant="secondary">
              <Link href="/settings">Review limits</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <AreaCard title="Strongest areas" rows={summary.strongestAreas} empty="No strengths yet" />
        <AreaCard title="Weakest areas" rows={summary.weakestAreas} empty="No gaps yet" />
      </section>
    </div>
  );
}

function AreaCard({
  title,
  rows,
  empty
}: {
  title: string;
  rows: Array<{ name: string; score: number }>;
  empty: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="mt-5 space-y-3">
          {rows.length ? (
            rows.map((row) => (
              <div className="surface rounded-lg p-4" key={row.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-foreground">{row.name}</span>
                  <span className="text-muted-foreground">{row.score}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-950/70">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${row.score}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-white/12 p-5 text-sm text-muted-foreground">
              {empty}. Complete a practice answer to populate this section.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
