import {
  answerEvaluationRequestSchema,
  answerEvaluationSchema,
  generatedQuestionSchema,
  questionRequestSchema,
  resumeMatchRequestSchema,
  resumeMatchSchema,
  salaryEvaluationRequestSchema,
  salaryEvaluationSchema
} from "@/lib/ai/schemas";
import {
  fallbackEvaluation,
  fallbackQuestion,
  fallbackResumeMatch,
  fallbackSalaryEvaluation
} from "@/lib/ai/fallbacks";
import {
  generateJsonCompletion,
  parseJsonObject
} from "@/lib/ai/providers";

const QUESTION_PROMPT_VERSION = "interview-question-v2";
const EVALUATION_PROMPT_VERSION = "interview-evaluation-v2";
const SALARY_PROMPT_VERSION = "salary-evaluation-v2";
const RESUME_PROMPT_VERSION = "resume-match-v2";

export async function generateInterviewQuestion(rawInput: unknown) {
  const input = questionRequestSchema.parse(rawInput);
  return (
    (await runQuestionProvider(input)) ?? {
      ...fallbackQuestion(input),
      promptVersion: QUESTION_PROMPT_VERSION,
      model: "fallback"
    }
  );
}

export async function evaluateInterviewAnswer(rawInput: unknown) {
  const input = answerEvaluationRequestSchema.parse(rawInput);
  return (
    (await runAnswerProvider(input)) ?? {
      ...fallbackEvaluation(input),
      rubricVersion: "readiness-rubric-v2",
      promptVersion: EVALUATION_PROMPT_VERSION,
      model: "fallback"
    }
  );
}

export async function evaluateSalaryResponse(rawInput: unknown) {
  const input = salaryEvaluationRequestSchema.parse(rawInput);
  return (
    (await runSalaryProvider(input)) ?? {
      ...fallbackSalaryEvaluation(input),
      promptVersion: SALARY_PROMPT_VERSION,
      model: "fallback"
    }
  );
}

export async function evaluateResumeMatch(rawInput: unknown) {
  const input = resumeMatchRequestSchema.parse(rawInput);
  return (
    (await runResumeProvider(input)) ?? {
      ...fallbackResumeMatch(input),
      promptVersion: RESUME_PROMPT_VERSION,
      model: "fallback"
    }
  );
}

async function runQuestionProvider(input: ReturnType<typeof questionRequestSchema.parse>) {
  const completion = await generateJsonCompletion({
    temperature: 0.3,
    system:
      "You are PrepPilot, a professional AI interview coach for students, interns, freshers, and experienced candidates. Generate exactly one realistic interview question. Adapt to HR, technical, behavioral, salary, resume-match, or company-prep mode. Use India-aware context when marketFocus is india or both, and international context when marketFocus is international or both. Be calm, specific, and career-serious. Return strict JSON only.",
    user: JSON.stringify({
      task: "Generate one interview question that is answerable in 90-150 seconds.",
      candidate: input,
      constraints: [
        "Do not repeat previousQuestions.",
        "For technical mode, ask for decisions, tradeoffs, correctness, and debugging thinking.",
        "For HR or behavioral mode, ask for evidence, ownership, communication, and self-awareness.",
        "For company prep, reference the company context only if supplied.",
        "Avoid generic motivational wording."
      ],
      outputSchema: {
        question: "string",
        intent: "string",
        difficulty: "beginner | intermediate | advanced",
        evaluationFocus: ["2-5 short strings"]
      }
    })
  });

  return parseCompletion(completion, generatedQuestionSchema, {
    promptVersion: QUESTION_PROMPT_VERSION
  });
}

async function runAnswerProvider(
  input: ReturnType<typeof answerEvaluationRequestSchema.parse>
) {
  const completion = await generateJsonCompletion({
    temperature: 0.12,
    system:
      "You are PrepPilot, a strict but kind AI interview evaluator. Score only the submitted answer against the question and role context. Never guarantee hiring outcomes. Penalize vague, inflated, memorized, or unsupported answers. Reward structure, specific evidence, measured impact, role relevance, calm confidence, and technical tradeoff quality when applicable. Return strict JSON only.",
    user: JSON.stringify({
      task: "Evaluate this interview answer.",
      input,
      scoringRules: {
        overallScore:
          "0-100, not a percentile. 50 is early but usable, 70 is credible, 85+ needs strong role-specific evidence.",
        estimatedSelectionChance:
          "0-100 practice signal based on answer quality only; never imply a hiring guarantee.",
        categoryScores: {
          clarity: "Direct answer, concise language, interviewer can follow it.",
          relevance: "Answer addresses the exact question, role, field, and market context.",
          confidence: "Professional tone without arrogance, hedging, or filler-heavy language.",
          structure: "Uses a clear opening, evidence, action, result, and close.",
          technicalDepth:
            "For technical answers, checks correctness, tradeoffs, implementation details, and debugging; for non-technical answers, score practical depth."
        }
      },
      outputSchema: "answerEvaluationSchema"
    })
  });

  return parseCompletion(completion, answerEvaluationSchema, {
    rubricVersion: "readiness-rubric-v2",
    promptVersion: EVALUATION_PROMPT_VERSION
  });
}

async function runSalaryProvider(
  input: ReturnType<typeof salaryEvaluationRequestSchema.parse>
) {
  const completion = await generateJsonCompletion({
    temperature: 0.15,
    system:
      "You are PrepPilot acting as a professional salary negotiation coach. Evaluate firmness, fairness, evidence, market reasoning, flexibility, and tone. Use India-aware salary context for INR or India market focus and international phrasing for global roles. Do not invent market numbers. Return strict JSON only.",
    user: JSON.stringify({
      task: "Evaluate salary negotiation response.",
      input,
      scoringRules: {
        confidence: "Clear anchor or range without sounding defensive.",
        professionalTone: "Respectful, firm, and collaborative.",
        marketReasoning:
          "References role scope, market, location, experience, or compensation structure.",
        flexibility:
          "Signals openness to benefits, learning, growth, or total compensation without surrendering value.",
        clarity: "Easy for HR to respond to.",
        valueJustification:
          "Connects salary expectation to skills, outcomes, ownership, or role responsibilities."
      },
      outputSchema: "salaryEvaluationSchema"
    })
  });

  return parseCompletion(completion, salaryEvaluationSchema, {
    promptVersion: SALARY_PROMPT_VERSION
  });
}

async function runResumeProvider(input: ReturnType<typeof resumeMatchRequestSchema.parse>) {
  const completion = await generateJsonCompletion({
    temperature: 0.12,
    system:
      "You are PrepPilot, a professional resume and job description matching coach. Compare truthful resume evidence against the job description. Reward explicit skills, matching responsibilities, measurable outcomes, tools, domain context, and seniority fit. Do not advise fabricating experience. Return strict JSON only.",
    user: JSON.stringify({
      task: "Match resume against job description.",
      input,
      scoringRules: {
        matchScore:
          "0-100. 80+ requires explicit matching evidence, not just keyword overlap.",
        matchedSkills: "Concrete skills or responsibilities found in both texts.",
        missingSkills: "Important JD signals missing or weak in the resume.",
        recommendations:
          "Actionable resume edits, truthful portfolio/project improvements, and role-specific wording."
      },
      outputSchema: "resumeMatchSchema"
    })
  });

  return parseCompletion(completion, resumeMatchSchema, {
    promptVersion: RESUME_PROMPT_VERSION
  });
}

function parseCompletion<T extends object, M extends object>(
  completion: Awaited<ReturnType<typeof generateJsonCompletion>>,
  schema: { parse: (value: unknown) => T },
  metadata: M
): (T & M & { model: string }) | null {
  if (!completion) {
    return null;
  }

  try {
    return {
      ...schema.parse(parseJsonObject(completion.content)),
      ...metadata,
      model: completion.model
    };
  } catch (error) {
    console.warn(
      `PrepPilot AI provider ${completion.provider} returned invalid JSON; falling back.`,
      error instanceof Error ? error.message : "Unknown validation error."
    );
    return null;
  }
}
