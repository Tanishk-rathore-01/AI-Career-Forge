import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatTile } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";
import { getSessionDetail } from "@/lib/server/dashboard-service";
import { readinessLabel } from "@/lib/server/mappers";

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await requireUser();
  const { sessionId } = await params;
  const session = await getSessionDetail(user.id, sessionId);

  if (!session) {
    notFound();
  }

  const latestEvaluation = session.evaluations[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Session detail"
        title={`${formatLabel(session.mode)} for ${session.targetRole}`}
        description="Review the saved question, your answer, evaluator feedback, category scores, and the next practice step."
        action={
          <Button asChild variant="secondary">
            <Link href="/sessions">
              <ArrowLeft size={16} />
              All sessions
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatTile label="Status" value={formatLabel(session.status)} />
        <StatTile
          label="Latest score"
          value={latestEvaluation?.overallScore ?? "--"}
          suffix={latestEvaluation ? "/100" : ""}
          tone="primary"
        />
        <StatTile
          label="Readiness"
          value={latestEvaluation ? readinessLabel(latestEvaluation.readinessLevel) : "--"}
          tone="accent"
        />
        <StatTile label="Saved answers" value={session.evaluations.length} />
      </section>

      <section className="mt-6 grid gap-5">
        {session.evaluations.length ? (
          session.evaluations.map((evaluation, index) => (
            <Card key={evaluation.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge>Answer {session.evaluations.length - index}</Badge>
                    <h2 className="mt-4 text-2xl font-semibold leading-8 text-foreground">
                      {evaluation.question}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Rubric {evaluation.rubricVersion} · Prompt {evaluation.promptVersion}
                    </p>
                  </div>
                  <div className="rounded-lg border border-primary/25 bg-primary/[0.08] px-5 py-4 text-right">
                    <p className="text-4xl font-semibold text-primary">
                      {evaluation.overallScore}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      score
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                  <div className="surface rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">Your answer</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {evaluation.answer}
                    </p>
                  </div>
                  <div className="surface rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">Next step</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {evaluation.nextPracticeStep}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <List title="Strengths" items={evaluation.strengths} />
                  <List title="Improve" items={evaluation.weaknesses} />
                </div>

                <div className="mt-5 rounded-lg border border-white/10 bg-background/45 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="text-primary" size={17} />
                    Improved answer direction
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {evaluation.improvedAnswer}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {scoreEntries(evaluation.categoryScores).map((entry) => (
                    <div className="surface rounded-lg p-3" key={entry.name}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {formatCategory(entry.name)}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {entry.score}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="section-kicker">No answers saved</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                This session has no evaluation yet.
              </h2>
              <Button asChild className="mt-6">
                <Link href="/practice">Continue practice</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </AppShell>
  );
}

function scoreEntries(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([, score]) => typeof score === "number")
    .map(([name, score]) => ({ name, score: Number(score) }));
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCategory(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface rounded-lg p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
