"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe2, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  audiences,
  dashboardStats,
  featureCards,
  premiumCards
} from "@/lib/product/data";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <section className="relative subtle-grid">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <Badge className="mb-6 border-primary/30 bg-primary/10 text-primary">
                <Sparkles size={14} />
                Professional AI career coach
              </Badge>
              <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                PrepPilot makes interview practice feel serious, calm, and measurable.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Prepare for HR rounds, technical interviews, salary negotiation, resume
                matching, and company-specific practice with a soft, professional AI
                coach built for India and international roles.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/demo">
                    Start free demo
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <Badge key={audience}>{audience}</Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="panel rounded-lg p-4 shadow-panel">
                <div className="rounded-md border border-white/10 bg-background/60 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Live readiness</p>
                      <p className="mt-1 text-3xl font-semibold text-foreground">
                        Interview Ready Signal
                      </p>
                    </div>
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-right">
                      <p className="text-4xl font-semibold text-primary drop-shadow-[0_0_18px_rgba(42,157,143,0.45)]">
                        78
                      </p>
                      <p className="text-xs text-muted-foreground">Strong</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {dashboardStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-md border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                          {stat.value}
                          <span className="text-sm text-muted-foreground">
                            {stat.suffix}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-md border border-accent/25 bg-accent/10 p-4">
                    <div className="flex items-start gap-3">
                      <Globe2 className="mt-0.5 text-accent" size={18} />
                      <p className="text-sm leading-6 text-muted-foreground">
                        Region-aware coaching adapts examples for India-focused
                        placements or international client interviews.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4">MVP capabilities</Badge>
            <h2 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              Built around the complete preparation loop.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              PrepPilot is designed as a focused career cockpit: practice, score,
              improve, repeat, and track progress without distracting clutter.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card key={feature.title} className="transition hover:-translate-y-1">
                <CardContent className="p-5">
                  <feature.icon className="text-primary" size={24} />
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
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Badge className="mb-4">Premium-ready roadmap</Badge>
                <h2 className="text-3xl font-semibold tracking-normal text-foreground">
                  Serious growth features, without making the MVP messy.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {premiumCards.map((item) => (
                  <div key={item.title} className="rounded-lg border border-white/10 p-5">
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
          <div className="panel rounded-lg p-6 sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Start with one free scored interview answer.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  The demo is intentionally limited to protect AI cost. Create an
                  account to save history, unlock dashboards, and continue practice.
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

