import Link from "next/link";
import { ArrowRight, Clock3, MessageSquareText } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatTile } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";
import { getSessionList } from "@/lib/server/dashboard-service";

export default async function SessionsPage() {
  const user = await requireUser();
  const sessions = await getSessionList(user.id);
  const scoredSessions = sessions.filter((session) => session.evaluations[0]);
  const averageScore = scoredSessions.length
    ? Math.round(
        scoredSessions.reduce(
          (sum, session) => sum + (session.evaluations[0]?.overallScore ?? 0),
          0
        ) / scoredSessions.length
      )
    : 0;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Session history"
        title="Review your practice trail."
        description="Every saved interview, salary negotiation, and resume practice run appears here with its latest score and coaching context."
        action={
          <Button asChild>
            <Link href="/practice">
              New session
              <ArrowRight size={16} />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatTile label="Saved sessions" value={sessions.length} />
        <StatTile label="Scored sessions" value={scoredSessions.length} tone="primary" />
        <StatTile
          label="Average score"
          value={averageScore || "--"}
          suffix={averageScore ? "/100" : ""}
          tone="accent"
        />
      </section>

      <section className="mt-6 grid gap-4">
        {sessions.length ? (
          sessions.map((session) => {
            const latestEvaluation = session.evaluations[0];

            return (
              <Link href={`/sessions/${session.id}`} key={session.id}>
                <Card className="transition hover:-translate-y-0.5 hover:border-primary/35">
                  <CardContent className="flex flex-wrap items-center justify-between gap-5 p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{formatLabel(session.mode)}</Badge>
                        <Badge>{formatLabel(session.status)}</Badge>
                      </div>
                      <h2 className="mt-3 text-xl font-semibold text-foreground">
                        {session.targetRole}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={15} />
                          {formatDate(session.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MessageSquareText size={15} />
                          {latestEvaluation
                            ? latestEvaluation.nextPracticeStep
                            : "No evaluation saved yet"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-semibold text-primary">
                        {latestEvaluation?.overallScore ?? "--"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        latest score
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="section-kicker">No saved sessions</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                Your first scored practice round will appear here.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                PrepPilot keeps this page empty until there is real practice data.
                Start with an HR or technical round to create a baseline.
              </p>
              <Button asChild className="mt-6">
                <Link href="/practice">Start practice</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </AppShell>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
