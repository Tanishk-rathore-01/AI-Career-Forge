"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthCardProps = {
  mode: "sign-in" | "sign-up";
};

const proofPoints = [
  "One free scored demo before login",
  "Saved practice sessions and readiness history",
  "India-aware and international interview context"
];

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    try {
      if (mode === "sign-up") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Unable to create account.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push(mode === "sign-up" ? "/onboarding" : "/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden border-r border-white/10 bg-slate-950/55 px-10 py-10 lg:flex lg:flex-col lg:justify-between">
        <BrandMark />
        <div className="max-w-xl">
          <Badge>PrepPilot workspace</Badge>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-foreground">
            Serious interview preparation, saved from the first real session.
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Create an account to keep every score, resume match, salary response,
            report, streak, and readiness signal attached to your profile.
          </p>
          <div className="mt-8 grid gap-3">
            {proofPoints.map((point) => (
              <div className="flex items-center gap-3 text-sm text-foreground" key={point}>
                <CheckCircle2 className="text-primary" size={18} />
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["HR", "Mock round"],
            ["Resume", "JD match"],
            ["Salary", "Negotiation"]
          ].map(([label, value]) => (
            <div className="surface rounded-lg p-4" key={label}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <div className="mt-2 lg:mt-0">
              <Badge>{mode === "sign-in" ? "Secure sign in" : "Create workspace"}</Badge>
              <h1 className="mt-5 text-3xl font-semibold text-foreground">
                {mode === "sign-in" ? "Welcome back" : "Create your PrepPilot account"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {mode === "sign-in"
                  ? "Continue your interview preparation and readiness tracking."
                  : "Save your practice history, resume matches, reports, and salary coaching."}
              </p>
            </div>

            <Button
              className="mt-6 w-full"
              type="button"
              variant="secondary"
              onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
            >
              Continue with Google
              <ArrowRight size={16} />
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-muted-foreground">or use email</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {mode === "sign-up" && (
                <label className="block text-sm font-medium text-foreground">
                  Full name
                  <Input className="mt-2" name="name" placeholder="Your name" required />
                </label>
              )}
              <label className="block text-sm font-medium text-foreground">
                Email
                <Input
                  className="mt-2"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>
              <label className="block text-sm font-medium text-foreground">
                Password
                <Input
                  className="mt-2"
                  minLength={8}
                  name="password"
                  placeholder="Minimum 8 characters"
                  required
                  type="password"
                />
              </label>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                {mode === "sign-in" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 grid gap-3 text-center text-sm text-muted-foreground">
              <p>
                {mode === "sign-in" ? "New to PrepPilot?" : "Already have an account?"}{" "}
                <Link
                  className="font-medium text-primary hover:text-primary/80"
                  href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
                >
                  {mode === "sign-in" ? "Create one" : "Sign in"}
                </Link>
              </p>
              <Link className="font-medium text-foreground hover:text-primary" href="/demo">
                Try the free demo first
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
