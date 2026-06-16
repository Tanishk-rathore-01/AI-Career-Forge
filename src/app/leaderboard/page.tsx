import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/require-user";

const rows = [
  ["You", "6 day streak", "420 pts"],
  ["Aarav", "8 day streak", "510 pts"],
  ["Mira", "7 day streak", "470 pts"]
];

export default async function LeaderboardPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Streaks</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Practice consistency without distraction.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Streaks and leaderboard mechanics are designed to support discipline,
          not turn interview prep into a toy.
        </p>
      </div>
      <Card>
        <CardContent className="p-5">
          <div className="space-y-3">
            {rows.map(([name, streak, points], index) => (
              <div
                className="flex items-center justify-between rounded-lg border border-white/10 p-4"
                key={name}
              >
                <div className="flex items-center gap-3">
                  <Badge>#{index + 1}</Badge>
                  <div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">{streak}</p>
                  </div>
                </div>
                <p className="text-sm text-primary">{points}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

