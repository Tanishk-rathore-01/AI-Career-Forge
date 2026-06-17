"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Loader2, MapPin, Save, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to save profile.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="grid gap-6" onSubmit={onSubmit}>
          <Section
            icon={<UserRound className="text-primary" size={20} />}
            label="Candidate profile"
            title="Who is the coach preparing?"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-foreground">
                Full name
                <Input className="mt-2" name="fullName" placeholder="Your name" required />
              </label>
              <label className="text-sm font-medium text-foreground">
                Candidate stage
                <select className="field mt-2 px-3 text-sm" name="candidateStage" required>
                  <option value="STUDENT">Student</option>
                  <option value="INTERN">Intern</option>
                  <option value="FRESHER">Fresher</option>
                  <option value="EXPERIENCED">Experienced</option>
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Target role
                <Input className="mt-2" name="targetRole" placeholder="Product Manager" required />
              </label>
              <label className="text-sm font-medium text-foreground">
                Field / domain
                <Input
                  className="mt-2"
                  name="targetField"
                  placeholder="Technology, finance, design..."
                  required
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Experience years
                <Input className="mt-2" min={0} name="experienceYears" type="number" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Market focus
                <select className="field mt-2 px-3 text-sm" name="marketFocus">
                  <option value="BOTH">India + International</option>
                  <option value="INDIA">India focused</option>
                  <option value="INTERNATIONAL">International focused</option>
                </select>
              </label>
            </div>
          </Section>

          <Section
            icon={<BriefcaseBusiness className="text-accent" size={20} />}
            label="Role signals"
            title="What should the AI score against?"
          >
            <label className="text-sm font-medium text-foreground">
              Skills
              <Input
                className="mt-2"
                name="skills"
                placeholder="React, communication, SQL, financial modelling"
              />
            </label>
            <label className="text-sm font-medium text-foreground">
              Target companies
              <Input className="mt-2" name="targetCompanies" placeholder="TCS, Google, Deloitte, Zomato" />
            </label>
            <label className="text-sm font-medium text-foreground">
              Interview goal
              <Textarea
                className="mt-2"
                name="interviewGoal"
                placeholder="Example: I want to prepare for frontend roles and improve salary negotiation confidence."
              />
            </label>
          </Section>

          <Section
            icon={<MapPin className="text-primary" size={20} />}
            label="Market context"
            title="Compensation and location preferences"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <label className="text-sm font-medium text-foreground">
                Preferred location
                <Input className="mt-2" name="preferredLocation" placeholder="Bengaluru, Remote, London" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Currency
                <Input className="mt-2" name="salaryCurrency" placeholder="INR" defaultValue="INR" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Expected salary min
                <Input className="mt-2" name="expectedSalaryMin" placeholder="600000" type="number" />
              </label>
            </div>
          </Section>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <Button className="w-full sm:w-auto" disabled={isSaving} type="submit">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Section({
  icon,
  label,
  title,
  children
}: {
  icon: ReactNode;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-background/45 p-2">{icon}</div>
        <div>
          <Badge>{label}</Badge>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}
