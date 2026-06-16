"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthCardProps = {
  mode: "sign-in" | "sign-up";
};

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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <BrandMark />
          <div className="mt-8">
            <h1 className="text-3xl font-semibold text-foreground">
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "sign-in" ? "New to PrepPilot?" : "Already have an account?"}{" "}
            <Link
              className="font-medium text-primary hover:text-primary/80"
              href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {mode === "sign-in" ? "Create one" : "Sign in"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

