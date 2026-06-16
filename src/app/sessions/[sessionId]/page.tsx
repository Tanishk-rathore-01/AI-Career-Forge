import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/require-user";

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireUser();
  const { sessionId } = await params;

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <Badge>Session detail</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-foreground">
          {sessionId.replaceAll("-", " ")}
        </h1>
        <p className="mt-4 text-muted-foreground">
          This route is ready for persisted questions, answers, scores, and
          rubric versions once live sessions are connected to the database.
        </p>
      </div>
      <Card>
        <CardContent className="p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Sample review
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Tell me about yourself and why this role is right for you.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            PrepPilot will store each answer, AI feedback, improved answer,
            readiness label, model, prompt version, and rubric version.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}

