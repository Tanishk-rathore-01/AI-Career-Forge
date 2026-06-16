import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/require-user";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
          Account and plan controls.
        </h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <Badge>Account</Badge>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              {user.name ?? "PrepPilot user"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge>Free plan</Badge>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              Limited practice, premium-ready upgrade path.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Premium will unlock unlimited interviews, advanced salary insights,
              weekly reports, voice analytics, and certificates.
            </p>
            <Button className="mt-5" variant="secondary">
              Premium coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

