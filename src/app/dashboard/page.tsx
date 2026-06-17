import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/require-user";
import { getDashboardSummary } from "@/lib/server/dashboard-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const summary = await getDashboardSummary(user.id);

  return (
    <AppShell>
      <DashboardOverview name={user.name} summary={summary} />
    </AppShell>
  );
}
