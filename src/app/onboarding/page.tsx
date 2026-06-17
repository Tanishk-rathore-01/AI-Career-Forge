import { AppShell } from "@/components/layout/app-shell";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Candidate setup"
        title="Personalize your PrepPilot coach."
        description="This context powers role-specific questions, salary guidance, company prep, resume matching, and India or international interview examples."
        className="max-w-5xl"
      />
      <div className="max-w-5xl">
        <OnboardingForm />
      </div>
    </AppShell>
  );
}
