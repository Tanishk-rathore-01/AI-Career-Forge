import Link from "next/link";
import {
  Award,
  BarChart3,
  CalendarCheck,
  FileSearch,
  GraduationCap,
  Mic2,
  Trophy,
  WalletCards
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats } from "@/lib/product/data";

const recommendations = [
  {
    title: "Complete one HR round",
    description: "Improve self-introduction, clarity, and confidence.",
    href: "/practice",
    icon: GraduationCap
  },
  {
    title: "Run resume match",
    description: "Compare your resume against your next target job.",
    href: "/resume-match",
    icon: FileSearch
  },
  {
    title: "Practice salary answer",
    description: "Use the free limited simulator before real HR calls.",
    href: "/salary-practice",
    icon: WalletCards
  }
];

const roadmap = [
  { label: "Voice interview practice", icon: Mic2, status: "Phase 2" },
  { label: "Weekly reports", icon: BarChart3, status: "Premium-ready" },
  { label: "Readiness certificate", icon: Award, status: "Premium-ready" },
  { label: "Streak leaderboard", icon: Trophy, status: "MVP shell" }
];

export function DashboardOverview({ name }: { name?: string | null }) {
  return (
    <div className="space-y-6">
      <section className="panel rounded-lg p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              Guided coach dashboard
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground">
              {name ? `Welcome back, ${name}.` : "Welcome to PrepPilot."}
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Your readiness score will become more accurate as you complete mock
              rounds, salary practice, resume matching, and company-specific prep.
            </p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-primary/10 p-5 text-right">
            <p className="text-sm text-muted-foreground">Current readiness</p>
            <p className="mt-2 text-6xl font-semibold text-primary">78</p>
            <p className="text-sm text-muted-foreground">Strong signal</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {stat.value}
                <span className="text-base text-muted-foreground">{stat.suffix}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recommended next steps</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The MVP uses deterministic recommendations; AI-generated weekly
                  coaching can be layered on after usage data exists.
                </p>
              </div>
              <CalendarCheck className="text-primary" size={24} />
            </div>
            <div className="mt-5 grid gap-3">
              {recommendations.map((item) => (
                <Link
                  href={item.href}
                  key={item.title}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 p-4 transition hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="text-primary" size={20} />
                    <span>
                      <span className="block font-medium text-foreground">{item.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-foreground">Advanced roadmap</h2>
            <div className="mt-5 space-y-3">
              {roadmap.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-4"
                >
                  <span className="flex items-center gap-3 text-sm text-foreground">
                    <item.icon className="text-accent" size={18} />
                    {item.label}
                  </span>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
            </div>
            <Button asChild className="mt-5 w-full" variant="secondary">
              <Link href="/practice">Start practice</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

