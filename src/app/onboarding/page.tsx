import { AppShell } from "@/components/layout/app-shell";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { requireUser } from "@/lib/auth/require-user";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Candidate setup</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Personalize your PrepPilot coach.
        </h1>
        <p className="mt-4 text-muted-foreground">
          This context powers role-specific questions, salary guidance, company prep,
          resume matching, and international or India-focused interview examples.
        </p>
      </div>
      <div className="mt-8 max-w-4xl">
        <OnboardingForm />
      </div>
    </AppShell>
  );
}

