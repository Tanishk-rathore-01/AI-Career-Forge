import { CheckCircle2, KeyRound, ShieldCheck, XCircle } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/require-user";
import { getEnvironmentStatus } from "@/lib/env";
import {
  FREE_DAILY_EVALUATION_LIMIT,
  FREE_DAILY_SALARY_LIMIT
} from "@/lib/server/usage-service";

export default async function SettingsPage() {
  const user = await requireUser();
  const environment = getEnvironmentStatus();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="Account, plan, and system readiness."
        description="Keep the MVP honest: account data, free limits, premium gates, and server-side AI key status are visible without exposing secrets."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge>Account</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">
                  {user.name ?? "PrepPilot user"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              </div>
              <ShieldCheck className="text-primary" size={30} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="surface rounded-lg p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Data ownership
                </p>
                <p className="mt-2 text-sm text-foreground">Private records only</p>
              </div>
              <div className="surface rounded-lg p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Auth
                </p>
                <p className="mt-2 text-sm text-foreground">NextAuth/Auth.js</p>
              </div>
            </div>
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Limit label="Daily scored answers" value={FREE_DAILY_EVALUATION_LIMIT} />
              <Limit label="Daily salary rounds" value={FREE_DAILY_SALARY_LIMIT} />
            </div>
            <Button className="mt-5" variant="secondary">
              Premium coming soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <KeyRound className="text-accent" size={24} />
            <div>
              <Badge>Environment</Badge>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                Server configuration status
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {environment.map((item) => (
              <div className="surface rounded-lg p-4" key={item.key}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{item.key}</p>
                  {item.configured ? (
                    <CheckCircle2 className="text-primary" size={18} />
                  ) : (
                    <XCircle className="text-destructive" size={18} />
                  )}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {item.configured
                    ? "Configured"
                    : item.required
                      ? "Missing"
                      : "Optional"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Limit({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface rounded-lg p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
