import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/require-user";

const sessions = [
  { id: "hr-round", title: "HR Round", score: 78, mode: "HR", date: "Today" },
  { id: "technical-round", title: "Technical Round", score: 72, mode: "Technical", date: "Yesterday" },
  { id: "salary-practice", title: "Salary Negotiation", score: 74, mode: "Salary", date: "This week" }
];

export default async function SessionsPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Session history</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Review your practice trail.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Database-backed session details are scaffolded; this screen is ready to
          swap sample rows for saved evaluations as practice data grows.
        </p>
      </div>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <Link href={`/sessions/${session.id}`} key={session.id}>
            <Card className="transition hover:-translate-y-0.5">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <Badge>{session.mode}</Badge>
                  <h2 className="mt-3 text-xl font-semibold text-foreground">
                    {session.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{session.date}</p>
                </div>
                <p className="text-4xl font-semibold text-primary">{session.score}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

