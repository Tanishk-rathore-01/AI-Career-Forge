import { AppShell } from "@/components/layout/app-shell";
import { ResumeMatchWorkspace } from "@/components/resume/resume-match-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";

export default async function ResumeMatchPage() {
  await requireUser();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Resume intelligence"
        title="Match your resume to the role before you apply."
        description="Start with paste-based matching in MVP. Saved matches feed your readiness picture; file parsing and pgvector semantic matching can follow after the core loop is stable."
      />
      <ResumeMatchWorkspace />
    </AppShell>
  );
}
