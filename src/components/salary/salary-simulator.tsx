"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SalaryEvaluation = {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  improvedResponse: string;
  nextRecruiterMessage: string;
};

const starterPrompt =
  "What salary range are you expecting for this role, and how would you justify it?";

export function SalarySimulator() {
  const [evaluation, setEvaluation] = useState<SalaryEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/salary/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: form.get("targetRole"),
          experienceLevel: form.get("experienceLevel"),
          marketFocus: form.get("marketFocus"),
          salaryCurrency: form.get("salaryCurrency"),
          expectedSalaryMin: Number(form.get("expectedSalaryMin") || 0) || undefined,
          expectedSalaryMax: Number(form.get("expectedSalaryMax") || 0) || undefined,
          recruiterMessage: starterPrompt,
          response: form.get("response")
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to score negotiation.");
      }

      setEvaluation(payload as SalaryEvaluation);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to score negotiation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <Card>
        <CardContent className="p-5">
          <Badge className="mb-5">Free limited simulator</Badge>
          <h2 className="text-2xl font-semibold text-foreground">
            Practice respectful salary confidence.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            PrepPilot coaches firm, professional negotiation. Premium can later
            unlock deeper market benchmarking and unlimited practice.
          </p>
          <div className="mt-6 rounded-lg border border-accent/25 bg-accent/10 p-4">
            <p className="text-sm font-medium text-foreground">Recruiter asks</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{starterPrompt}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-foreground">
                Target role
                <Input className="mt-2" name="targetRole" defaultValue="Business Analyst" required />
              </label>
              <label className="text-sm font-medium text-foreground">
                Experience level
                <Input className="mt-2" name="experienceLevel" defaultValue="Fresher" required />
              </label>
              <label className="text-sm font-medium text-foreground">
                Market focus
                <select
                  className="mt-2 h-11 w-full rounded-md border border-white/12 bg-white/8 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  name="marketFocus"
                >
                  <option value="both">India + International</option>
                  <option value="india">India</option>
                  <option value="international">International</option>
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Currency
                <Input className="mt-2" name="salaryCurrency" defaultValue="INR" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Expected min
                <Input className="mt-2" name="expectedSalaryMin" placeholder="600000" type="number" />
              </label>
              <label className="text-sm font-medium text-foreground">
                Expected max
                <Input className="mt-2" name="expectedSalaryMax" placeholder="800000" type="number" />
              </label>
            </div>
            <label className="text-sm font-medium text-foreground">
              Your response
              <Textarea
                className="mt-2"
                name="response"
                placeholder="Based on my skills and the responsibilities of the role, I am looking for..."
                required
              />
            </label>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-200">
                {error}
              </p>
            )}
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Score negotiation
            </Button>
          </form>

          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg border border-primary/25 bg-primary/10 p-5"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Negotiation score</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    Professional and coachable
                  </p>
                </div>
                <p className="text-5xl font-semibold text-primary">{evaluation.overallScore}</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <List title="Strengths" items={evaluation.strengths} />
                <List title="Improve" items={evaluation.weaknesses} />
              </div>
              <div className="mt-4 rounded-md border border-white/10 bg-background/50 p-4">
                <p className="text-sm font-medium text-foreground">Improved response</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {evaluation.improvedResponse}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-background/40 p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

