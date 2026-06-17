import type {
  AnswerEvaluation,
  GeneratedQuestion,
  ResumeMatch,
  SalaryEvaluation
} from "@/lib/ai/schemas";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function readinessFromScore(score: number): AnswerEvaluation["readinessLevel"] {
  if (score >= 89) return "Interview Ready";
  if (score >= 76) return "Strong";
  if (score >= 61) return "Moderate";
  if (score >= 41) return "Developing";
  return "Needs Foundation";
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function has(text: string, pattern: RegExp) {
  return pattern.test(text);
}

export function fallbackQuestion(input: {
  targetRole: string;
  mode: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  marketFocus?: "india" | "international" | "both";
  company?: string;
}): GeneratedQuestion {
  const companyContext = input.company ? ` for ${input.company}` : "";
  const marketContext =
    input.marketFocus === "india"
      ? " in the Indian hiring context"
      : input.marketFocus === "international"
        ? " for an international hiring context"
        : "";

  if (input.mode === "salary") {
    return {
      question: `What salary range are you expecting${companyContext}${marketContext}, and how would you justify it based on your skills and role responsibilities?`,
      intent: "Assess whether the candidate can communicate salary expectations with confidence and evidence.",
      difficulty: input.difficulty,
      evaluationFocus: [
        "Clear salary range",
        "Professional tone",
        "Value-based justification"
      ]
    };
  }

  if (input.mode === "technical") {
    return {
      question: `Walk me through a real ${input.targetRole} problem you solved or would solve, including your technical decisions, tradeoffs, and how you verified correctness.`,
      intent: "Evaluate practical technical thinking, communication, correctness, and decision quality.",
      difficulty: input.difficulty,
      evaluationFocus: [
        "Problem decomposition",
        "Technical correctness",
        "Tradeoff awareness"
      ]
    };
  }

  if (input.mode === "company_prep") {
    return {
      question: `Why are you interested in this company${companyContext}, and what makes your background relevant to the role?`,
      intent: "Evaluate company-specific motivation, role alignment, and evidence.",
      difficulty: input.difficulty,
      evaluationFocus: [
        "Company motivation",
        "Role alignment",
        "Specific evidence"
      ]
    };
  }

  return {
    question: `Tell me about yourself as a ${input.targetRole} candidate and why this role is the right next step for you.`,
    intent: "Evaluate confidence, relevance, positioning, and career clarity.",
    difficulty: input.difficulty,
    evaluationFocus: [
      "Clear self-introduction",
      "Role alignment",
      "Specific evidence"
    ]
  };
}

export function fallbackEvaluation(input: {
  targetRole: string;
  targetField?: string;
  experienceLevel: string;
  mode: string;
  question: string;
  answer: string;
}): AnswerEvaluation {
  const answer = input.answer;
  const answerWords = words(answer);
  const wordCount = answerWords.length;
  const lower = answer.toLowerCase();
  const roleTerms = input.targetRole.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
  const roleSignal = roleTerms.some((term) => lower.includes(term));
  const hasStructure = has(lower, /first|second|then|finally|situation|task|action|result|because|for example/);
  const hasEvidence = has(lower, /built|created|led|owned|improved|reduced|increased|shipped|implemented|designed|analyzed|resolved/);
  const hasMetric = has(answer, /(\d+%|\d+x|₹|\$|\b\d{2,}\b)/);
  const hasTradeoff = has(lower, /tradeoff|trade-off|because|constraint|latency|cost|scalable|secure|maintainable|risk/);
  const fillerPenalty = has(lower, /\b(maybe|basically|sort of|kind of|i guess|like)\b/) ? 7 : 0;

  const lengthScore = clamp(34 + wordCount * 1.4, 34, 82);
  const clarity = clamp(lengthScore + (hasStructure ? 8 : -5) - fillerPenalty);
  const relevance = clamp(lengthScore + (roleSignal ? 8 : -3) + (hasEvidence ? 4 : 0));
  const confidence = clamp(58 + (hasEvidence ? 8 : 0) + (hasMetric ? 7 : 0) - fillerPenalty);
  const structure = clamp(54 + (hasStructure ? 22 : -8) + (hasMetric ? 6 : 0));
  const technicalDepth = clamp(
    input.mode === "technical"
      ? 48 + (hasTradeoff ? 18 : -6) + (hasEvidence ? 10 : 0) + (hasMetric ? 6 : 0)
      : 52 + (hasEvidence ? 10 : 0) + (hasMetric ? 8 : 0)
  );
  const score = clamp(
    clarity * 0.22 +
      relevance * 0.24 +
      confidence * 0.18 +
      structure * 0.2 +
      technicalDepth * 0.16
  );

  const strengths = [
    hasStructure
      ? "The answer has a visible structure that an interviewer can follow."
      : "The answer gives the interviewer usable context.",
    hasEvidence
      ? "You included action-oriented evidence instead of staying fully generic."
      : "The tone is direct and professional."
  ];

  const weaknesses = [
    hasMetric
      ? "Make the measurable result more clearly tied to your personal contribution."
      : "Add measurable outcomes, scale, ranking, time saved, revenue, quality, or user impact.",
    roleSignal
      ? "Close by connecting the example more directly to the target role."
      : `Use more ${input.targetRole}-specific language so the answer feels tailored.`
  ];

  return {
    overallScore: score,
    categoryScores: {
      clarity,
      relevance,
      confidence,
      structure,
      technicalDepth
    },
    strengths,
    weaknesses,
    improvedAnswer:
      "A stronger response would open with the direct answer, add one specific example, explain your personal action, quantify the result where possible, and close by connecting the evidence to the target role. Keep it calm, specific, and under two minutes.",
    readinessLevel: readinessFromScore(score),
    estimatedSelectionChance: clamp(score - 6, 22, 86),
    nextPracticeStep:
      "Practice one STAR-style answer with a measurable outcome and a final sentence that ties the evidence to the role."
  };
}

export function fallbackSalaryEvaluation(input: {
  salaryCurrency?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  marketFocus?: "india" | "international" | "both";
  response: string;
}): SalaryEvaluation {
  const response = input.response;
  const lower = response.toLowerCase();
  const hasRange = /\d/.test(response) || Boolean(input.expectedSalaryMin || input.expectedSalaryMax);
  const hasCurrency =
    Boolean(input.salaryCurrency) || has(response, /₹|rs\.?|inr|\$|usd|eur|gbp|lpa|lakhs?/i);
  const hasReason = has(lower, /because|based on|market|skills|experience|projects|value|responsibilities|scope/);
  const hasFlexibility = has(lower, /open|flexible|discuss|total compensation|benefits|structure|growth/);
  const hasValue = has(lower, /built|led|improved|delivered|managed|owned|impact|contribute|results/);
  const apologetic = has(lower, /sorry|anything is fine|whatever|no issue|as you wish/);

  const confidence = clamp(58 + (hasRange ? 14 : -5) + (hasCurrency ? 5 : 0) - (apologetic ? 12 : 0));
  const professionalTone = clamp(78 + (hasFlexibility ? 6 : 0) - (apologetic ? 8 : 0));
  const marketReasoning = clamp(50 + (hasReason ? 18 : 0) + (hasCurrency ? 5 : 0));
  const flexibility = clamp(58 + (hasFlexibility ? 20 : 0));
  const clarity = clamp(58 + (hasRange ? 12 : 0) + (hasReason ? 8 : 0));
  const valueJustification = clamp(50 + (hasValue ? 18 : 0) + (hasReason ? 10 : 0));
  const overallScore = clamp(
    confidence * 0.2 +
      professionalTone * 0.16 +
      marketReasoning * 0.18 +
      flexibility * 0.14 +
      clarity * 0.14 +
      valueJustification * 0.18
  );

  return {
    overallScore,
    categoryScores: {
      confidence,
      professionalTone,
      marketReasoning,
      flexibility,
      clarity,
      valueJustification
    },
    strengths: [
      hasRange
        ? "You provided a concrete compensation anchor."
        : "You kept the answer open for discussion.",
      professionalTone >= 75
        ? "The response stays professional and collaborative."
        : "The response can become more polished with a calmer close."
    ],
    weaknesses: [
      hasReason
        ? "Support the expectation with one sharper role-specific outcome."
        : "Support the expectation with role scope, skills, projects, and market context.",
      hasFlexibility
        ? "Keep flexibility tied to total compensation so it does not weaken your anchor."
        : "Mention openness to the full compensation structure without surrendering your value."
    ],
    improvedResponse:
      "Based on the responsibilities of this role, my current skill set, and the value I can contribute, I am targeting a fair range aligned with the market. I am open to discussing the full compensation structure, but I would like the offer to reflect the role expectations and my contribution.",
    nextRecruiterMessage:
      "That is slightly above our current range. What makes you confident this compensation is justified?"
  };
}

export function fallbackResumeMatch(input: {
  targetRole?: string;
  resumeText: string;
  jobDescriptionText: string;
}): ResumeMatch {
  const stopWords = new Set([
    "and",
    "the",
    "with",
    "for",
    "you",
    "our",
    "will",
    "are",
    "this",
    "that",
    "from",
    "have",
    "your",
    "role",
    "work",
    "team",
    "using",
    "experience"
  ]);
  const resumeWords = new Set(
    (input.resumeText.toLowerCase().match(/[a-z+#.]{3,}/g) ?? []).filter(
      (word) => !stopWords.has(word)
    )
  );
  const jdWords = new Set(
    (input.jobDescriptionText.toLowerCase().match(/[a-z+#.]{3,}/g) ?? []).filter(
      (word) => !stopWords.has(word)
    )
  );
  const overlap = [...jdWords].filter((word) => resumeWords.has(word)).slice(0, 14);
  const missing = [...jdWords].filter((word) => !resumeWords.has(word)).slice(0, 10);
  const overlapRatio = jdWords.size ? overlap.length / Math.min(jdWords.size, 40) : 0;
  const hasMetrics = /(\d+%|\d+x|₹|\$|\b\d{2,}\b)/.test(input.resumeText);
  const hasProjects = /project|portfolio|internship|case study|built|implemented|deployed/i.test(
    input.resumeText
  );
  const score = clamp(42 + overlapRatio * 42 + (hasMetrics ? 6 : 0) + (hasProjects ? 5 : 0), 36, 88);

  return {
    matchScore: score,
    matchedSkills: overlap,
    missingSkills: missing,
    recommendations: [
      "Mirror the job description language where it truthfully matches your experience.",
      hasMetrics
        ? "Move your strongest quantified outcomes closer to the top of the resume."
        : "Add measurable outcomes to your strongest projects or internships.",
      "Close the top missing skill gaps with focused practice, a small portfolio project, or clearer bullet wording."
    ],
    summary:
      input.targetRole
        ? `PrepPilot found an early match signal for ${input.targetRole}. Improve the score by making relevant skills, responsibilities, and measured outcomes more explicit.`
        : "PrepPilot found an early match signal. Improve the score by making relevant skills, responsibilities, and measured outcomes more explicit."
  };
}
