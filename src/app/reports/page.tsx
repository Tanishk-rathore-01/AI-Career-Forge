import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/require-user";

export default async function ReportsPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Weekly reports</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Weekly improvement reports are premium-ready.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Reports will summarize average score, weak areas, strongest skills,
          practice consistency, and next actions.
        </p>
      </div>
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
          {["Average score", "Weakest category", "Recommended focus"].map((label, index) => (
            <div key={label} className="rounded-lg border border-white/10 p-5">
              <Badge>Week {index + 1}</Badge>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This block will be generated from stored evaluations, not live AI calls.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

