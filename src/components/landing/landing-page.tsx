"use client";

import Link from "next/link";
import type React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Globe2,
  Mic2,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { audiences, featureCards, premiumCards } from "@/lib/product/data";

const workflowSteps = [
  "Choose role, field, company, region",
  "Practice HR, technical, salary, resume match",
  "Get scored feedback and next actions"
];

const scoreRows = [
  ["Clarity", 84],
  ["Role fit", 78],
  ["Confidence", 72],
  ["Technical depth", 76]
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 subtle-grid opacity-70" />
          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <Badge className="mb-6 border-primary/25 bg-primary/[0.08] text-primary">
                <Sparkles size={14} />
                AI interview intelligence
              </Badge>
              <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                A serious AI coach for interview readiness.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                PrepPilot helps students, interns, freshers, and experienced
                professionals prepare for India-focused and international roles
                with measured practice, salary coaching, and resume matching.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/demo">
                    Start scored demo
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/resume-match">Match resume</Link>
                </Button>
              </div>
              <div className="mt-8 grid max-w-xl gap-2">
                {workflowSteps.map((step, index) => (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground" key={step}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.08] text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="surface-raised rounded-xl p-4"
            >
              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="surface rounded-lg p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="section-kicker">Live practice room</p>
                      <h2 className="mt-3 text-2xl font-semibold text-foreground">
                        HR Round: Tell me about yourself.
                      </h2>
                    </div>
                    <Badge>India + Global</Badge>
                  </div>
                  <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                      “I am a frontend developer focused on React, performance,
                      and user-centered product interfaces. I want this role
                      because it aligns with my portfolio and growth path...”
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["STAR structure", "Role fit", "Confidence", "Salary-ready"].map(
                      (item) => (
                        <Badge key={item}>{item}</Badge>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/[0.06] p-5">
                  <p className="text-sm text-muted-foreground">Readiness signal</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-6xl font-semibold text-primary">82</p>
                    <p className="pb-2 text-sm font-medium text-primary">Strong</p>
                  </div>
                  <div className="mt-5 space-y-3">
                    {scoreRows.map(([label, value]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-950/60">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <MiniPanel icon={FileSearch} label="Resume/JD" value="Match gaps" />
                <MiniPanel icon={Globe2} label="Region" value="India + intl" />
                <MiniPanel icon={Mic2} label="Voice" value="Phase 2 ready" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="section-kicker">Capability map</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
                Built for the full interview preparation cycle.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                The product combines coaching, scoring, resume alignment,
                negotiation, and progress tracking without turning the interface
                into a noisy analytics board.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <Badge key={audience}>{audience}</Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="transition hover:-translate-y-1">
                  <CardContent className="p-5">
                    <feature.icon className="text-primary" size={22} />
                    <h3 className="mt-5 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-950/44">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="surface rounded-xl p-6">
                <ShieldCheck className="text-primary" size={28} />
                <h2 className="mt-5 text-3xl font-semibold tracking-normal text-foreground">
                  Serious coaching, responsible estimates.
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  PrepPilot frames selection chance as a practice-based signal,
                  not a guarantee. Feedback stays professional, friendly, and
                  specific enough to act on.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {premiumCards.map((item) => (
                  <div key={item.title} className="surface rounded-lg p-5">
                    <item.icon className="text-accent" size={22} />
                    <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="surface-raised rounded-xl p-6 sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="section-kicker">Start now</p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground">
                  Try one scored answer before signup.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  The demo is limited for cost control. Create an account to save
                  history, unlock dashboards, and continue practice.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/demo">
                  Try PrepPilot
                  <CheckCircle2 size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniPanel({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="surface rounded-lg p-4">
      <Icon className="text-primary" size={18} />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
