"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { modeOptions, regionOptions } from "@/lib/product/data";

type Evaluation = {
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  readinessLevel: string;
  estimatedSelectionChance: number;
  nextPracticeStep: string;
  sessionId?: string;
  savedEvaluationId?: string;
};

type Question = {
  question: string;
  intent: string;
  evaluationFocus: string[];
};

const initialQuestion: Question = {
  question:
    "Tell me about yourself and why this role is the right next step for your career.",
  intent: "Evaluate confidence, role alignment, and clarity of career direction.",
  evaluationFocus: [
    "Clear self-introduction",
    "Role alignment",
    "Specific evidence"
  ]
};

type PracticeConsoleProps = {
  demo?: boolean;
};

export function PracticeConsole({ demo = false }: PracticeConsoleProps) {
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [marketFocus, setMarketFocus] = useState("both");
  const [mode, setMode] = useState("hr");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState<Question | null>(initialQuestion);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRegion = useMemo(
    () => regionOptions.find((region) => region.value === marketFocus),
    [marketFocus]
  );

  async function loadQuestion() {
    setIsLoadingQuestion(true);
    setError(null);
    setEvaluation(null);
    setAnswer("");

    try {
      const response = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          experienceLevel,
          skills: ["communication", "problem solving"],
          mode,
          difficulty: "beginner",
          marketFocus,
          previousQuestions: question ? [question.question] : []
        })
      });

      if (!response.ok) {
        throw new Error("Unable to generate question.");
      }

      setQuestion((await response.json()) as Question);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate question.");
    } finally {
      setIsLoadingQuestion(false);
    }
  }

  async function submitAnswer() {
    if (!question) return;
    setIsEvaluating(true);
    setError(null);

    try {
      const response = await fetch(demo ? "/api/demo/evaluate" : "/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          experienceLevel,
          mode,
          marketFocus,
          question: question.question,
          answer,
          sessionId: demo ? undefined : sessionId ?? undefined
        })
      });

      const payload = (await response.json()) as Evaluation & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to evaluate answer.");
      }

      setEvaluation(payload);

      if (!demo && payload.sessionId) {
        setSessionId(payload.sessionId);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to evaluate answer.");
    } finally {
      setIsEvaluating(false);
    }
  }

  function startNewSession() {
    setSessionId(null);
    setEvaluation(null);
    setAnswer("");
    setQuestion(initialQuestion);
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge>{demo ? "Free demo" : "Practice room"}</Badge>
            {selectedRegion && <Badge>{selectedRegion.label}</Badge>}
            <Badge>Text-first MVP</Badge>
            {sessionId && !demo && <Badge className="border-primary/30 text-primary">Saved</Badge>}
          </div>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-medium text-foreground">
              Target role
              <input
                className="field mt-2 px-3 text-sm"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-foreground">
              Experience level
              <select
                className="field mt-2 px-3 text-sm"
                value={experienceLevel}
                onChange={(event) => setExperienceLevel(event.target.value)}
              >
                <option>Student</option>
                <option>Intern</option>
                <option>Fresher</option>
                <option>Experienced</option>
              </select>
            </label>
            <label className="text-sm font-medium text-foreground">
              Interview mode
              <select
                className="field mt-2 px-3 text-sm"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {modeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-foreground">
              Region context
              <select
                className="field mt-2 px-3 text-sm"
                value={marketFocus}
                onChange={(event) => setMarketFocus(event.target.value)}
              >
                {regionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button onClick={loadQuestion} variant="secondary">
              {isLoadingQuestion ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <RotateCcw size={16} />
              )}
              Generate question
            </Button>
            {!demo && (
              <Button onClick={startNewSession} type="button" variant="ghost">
                New session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="min-h-[126px] rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              PrepPilot asks
            </p>
            {isLoadingQuestion ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Preparing a focused question...
              </p>
            ) : (
              <h2 className="mt-4 text-xl font-semibold leading-8 text-foreground">
                {question?.question ?? "Generate a question to begin."}
              </h2>
            )}
            {question && (
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="text-sm leading-6 text-muted-foreground">{question.intent}</p>
                <div className="flex flex-wrap gap-2">
                  {question.evaluationFocus.slice(0, 3).map((focus) => (
                    <Badge key={focus}>{focus}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="mt-5 block text-sm font-medium text-foreground">
            Your answer
            <Textarea
              className="mt-2 min-h-44"
              placeholder="Answer like you would in a real interview. PrepPilot will score clarity, relevance, confidence, structure, and depth."
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>

          {error && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={!question || answer.trim().length < 20 || isEvaluating}
              onClick={submitAnswer}
            >
              {isEvaluating ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Score answer
            </Button>
            {demo && evaluation && (
              <Button asChild variant="secondary">
                <Link href="/sign-up">
                  Save progress
                  <ArrowRight size={16} />
                </Link>
              </Button>
            )}
            {!demo && sessionId && (
              <Button asChild variant="secondary">
                <Link href={`/sessions/${sessionId}`}>
                  View saved session
                  <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </div>

          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg border border-primary/25 bg-primary/[0.08] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Readiness feedback</p>
                  <h3 className="mt-1 text-2xl font-semibold text-foreground">
                    {evaluation.readinessLevel}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-semibold text-primary">
                    {evaluation.overallScore}
                  </p>
                  <p className="text-xs text-muted-foreground">overall score</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <FeedbackList title="Strengths" items={evaluation.strengths} />
                <FeedbackList title="Improve" items={evaluation.weaknesses} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {Object.entries(evaluation.categoryScores).map(([name, score]) => (
                  <div className="rounded-md border border-white/10 bg-background/35 p-3" key={name}>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {formatCategory(name)}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{score}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-md border border-white/10 bg-background/50 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="text-primary" size={17} />
                  Improved answer direction
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {evaluation.improvedAnswer}
                </p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Practice-based selection signal: {evaluation.estimatedSelectionChance}%.
                This is coaching guidance, not a hiring guarantee.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
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

function formatCategory(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
