import { AppShell } from "@/components/layout/app-shell";
import { ResumeMatchWorkspace } from "@/components/resume/resume-match-workspace";
import { requireUser } from "@/lib/auth/require-user";

export default async function ResumeMatchPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Resume intelligence</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Match your resume to the role before you apply.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start with paste-based matching in MVP. File upload parsing and pgvector
          semantic matching can be added after the core loop is stable.
        </p>
      </div>
      <ResumeMatchWorkspace />
    </AppShell>
  );
}

