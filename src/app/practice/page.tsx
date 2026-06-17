import { AppShell } from "@/components/layout/app-shell";
import { PracticeConsole } from "@/components/practice/practice-console";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";

export default async function PracticePage() {
  await requireUser();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Interview practice"
        title="Practice with a calm, professional AI interviewer."
        description="Generate role-specific HR, technical, behavioral, and company-prep questions. Saved answers feed your dashboard, reports, streaks, and future certificate."
      />
      <PracticeConsole />
    </AppShell>
  );
}
