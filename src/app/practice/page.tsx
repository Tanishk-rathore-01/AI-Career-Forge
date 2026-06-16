import { AppShell } from "@/components/layout/app-shell";
import { PracticeConsole } from "@/components/practice/practice-console";
import { requireUser } from "@/lib/auth/require-user";

export default async function PracticePage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Interview practice</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Practice with a calm, professional AI interviewer.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Generate role-specific HR, technical, behavioral, and company-prep
          questions. Voice analytics are architected for Phase 2.
        </p>
      </div>
      <PracticeConsole />
    </AppShell>
  );
}

