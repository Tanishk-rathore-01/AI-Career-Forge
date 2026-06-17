"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileSearch, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ResumeMatch = {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
  resumeMatchId?: string;
};

export function ResumeMatchWorkspace() {
  const [match, setMatch] = useState<ResumeMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/resume-match/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: form.get("targetRole"),
          resumeText: form.get("resumeText"),
          jobDescriptionText: form.get("jobDescriptionText")
        })
      });

      const payload = (await response.json()) as ResumeMatch & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to match resume.");
      }

      setMatch(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to match resume.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge>Resume + JD matching</Badge>
            <Badge>Saved to profile</Badge>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
            <label className="text-sm font-medium text-foreground">
              Target role
              <Input className="mt-2" name="targetRole" defaultValue="Data Analyst" required />
            </label>
            <label className="text-sm font-medium text-foreground">
              Resume text
              <Textarea
                className="mt-2 min-h-48"
                name="resumeText"
                placeholder="Paste your resume content here. File upload parsing can be added after MVP foundation."
                required
              />
            </label>
            <label className="text-sm font-medium text-foreground">
              Job description
              <Textarea
                className="mt-2 min-h-48"
                name="jobDescriptionText"
                placeholder="Paste the target job description here."
                required
              />
            </label>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-200">
                {error}
              </p>
            )}
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <FileSearch size={16} />}
              Match resume
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          {!match ? (
            <div className="flex min-h-[420px] flex-col justify-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
              <FileSearch className="mx-auto text-primary" size={38} />
              <h2 className="mt-5 text-2xl font-semibold text-foreground">
                Match signal will appear here.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                PrepPilot will identify matching skills, missing signals, and
                practical edits for the target role.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-lg border border-primary/25 bg-primary/[0.08] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Match score</p>
                    <p className="mt-2 text-6xl font-semibold text-primary">
                      {match.matchScore}%
                    </p>
                  </div>
                  {match.resumeMatchId && (
                    <Badge className="border-primary/30 text-primary">
                      <CheckCircle2 size={14} />
                      Saved
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{match.summary}</p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Pills title="Matched skills" items={match.matchedSkills} tone="primary" />
                <Pills title="Missing signals" items={match.missingSkills} tone="accent" />
              </div>
              <div className="mt-4 rounded-lg border border-white/10 p-5">
                <p className="font-medium text-foreground">Recommendations</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {match.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Pills({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "primary" | "accent";
}) {
  const badgeClass = tone === "primary" ? "border-primary/30 text-primary" : "border-accent/30 text-accent";

  return (
    <div className="rounded-lg border border-white/10 p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(items.length ? items : ["No strong signal yet"]).map((item) => (
          <Badge className={badgeClass} key={item}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
