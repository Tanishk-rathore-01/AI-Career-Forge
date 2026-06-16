import { AppShell } from "@/components/layout/app-shell";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <AppShell>
      <DashboardOverview name={user.name} />
    </AppShell>
  );
}

