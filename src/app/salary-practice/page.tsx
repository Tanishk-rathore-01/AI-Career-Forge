import { AppShell } from "@/components/layout/app-shell";
import { SalarySimulator } from "@/components/salary/salary-simulator";
import { requireUser } from "@/lib/auth/require-user";

export default async function SalaryPracticePage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Salary simulator</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Negotiate with confidence, not pressure.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Practice expected salary, HR pushback, value justification, flexibility,
          and professional tone for India or international roles.
        </p>
      </div>
      <SalarySimulator />
    </AppShell>
  );
}

