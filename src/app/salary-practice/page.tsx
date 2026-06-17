import { AppShell } from "@/components/layout/app-shell";
import { SalarySimulator } from "@/components/salary/salary-simulator";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";

export default async function SalaryPracticePage() {
  await requireUser();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Salary simulator"
        title="Negotiate with confidence, not pressure."
        description="Practice expected salary, HR pushback, value justification, flexibility, and professional tone for India or international roles."
      />
      <SalarySimulator />
    </AppShell>
  );
}
