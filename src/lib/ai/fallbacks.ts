import type {
  AnswerEvaluation,
  GeneratedQuestion,
  ResumeMatch,
  SalaryEvaluation
} from "@/lib/ai/schemas";

function readinessFromScore(score: number): AnswerEvaluation["readinessLevel"] {
  if (score >= 89) return "Interview Ready";
  if (score >= 76) return "Strong";
  if (score >= 61) return "Moderate";
  if (score >= 41) return "Developing";
  return "Needs Foundation";
}

export function fallbackQuestion(input: {
  targetRole: string;
  mode: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  company?: string;
}): GeneratedQuestion {
  const companyContext = input.company ? ` for ${input.company}` : "";

  if (input.mode === "salary") {
    return {
      question: `What salary range are you expecting${companyContext}, and how would you justify it based on your skills and role responsibilities?`,
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
      question: `Walk me through a real ${input.targetRole} problem you solved or would solve, including your technical decisions and tradeoffs.`,
      intent: "Evaluate practical technical thinking, communication, and decision quality.",
      difficulty: input.difficulty,
      evaluationFocus: [
        "Problem decomposition",
        "Technical correctness",
        "Tradeoff awareness"
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

export function fallbackEvaluation(answer: string): AnswerEvaluation {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const base = Math.max(35, Math.min(86, 42 + wordCount * 2));
  const structure = answer.match(/first|then|finally|because|example/i)
    ? Math.min(92, base + 8)
    : Math.max(30, base - 8);

  const score = Math.round((base + structure) / 2);

  return {
    overallScore: score,
    categoryScores: {
      clarity: Math.min(95, base + 4),
      relevance: Math.min(92, base + 2),
      confidence: Math.max(30, base - 3),
      structure,
      technicalDepth: Math.max(30, base - 6)
    },
    strengths: [
      "The answer gives the interviewer usable context.",
      "The tone is direct and professional."
    ],
    weaknesses: [
      "Add a sharper structure with situation, action, and result.",
      "Use measurable outcomes or concrete project evidence."
    ],
    improvedAnswer:
      "A stronger response would open with the direct answer, add a specific example, explain your personal contribution, and close with a measurable result or lesson learned. Keep the tone calm, specific, and aligned to the role.",
    readinessLevel: readinessFromScore(score),
    estimatedSelectionChance: Math.max(25, Math.min(82, score - 6)),
    nextPracticeStep:
      "Practice answering with one clear example and one measurable outcome in under two minutes."
  };
}

export function fallbackSalaryEvaluation(response: string): SalaryEvaluation {
  const hasRange = /\d/.test(response);
  const hasReason = /because|based on|market|skills|experience|projects|value/i.test(response);
  const score = 58 + (hasRange ? 12 : 0) + (hasReason ? 14 : 0);

  return {
    overallScore: Math.min(88, score),
    categoryScores: {
      confidence: hasRange ? 76 : 58,
      professionalTone: 82,
      marketReasoning: hasReason ? 78 : 52,
      flexibility: 70,
      clarity: hasRange ? 80 : 62,
      valueJustification: hasReason ? 76 : 54
    },
    strengths: [
      "The response stays professional.",
      hasRange ? "You provided a concrete compensation anchor." : "You kept the answer open for discussion."
    ],
    weaknesses: [
      "Support the expectation with role value, projects, skills, and market context.",
      "Mention openness to the full compensation structure without weakening your anchor."
    ],
    improvedResponse:
      "Based on the responsibilities of this role, my current skill set, and the value I can contribute, I am targeting a fair range aligned with the market. I am open to discussing the full compensation structure, but I would like the offer to reflect the role expectations and my contribution.",
    nextRecruiterMessage:
      "That is slightly above our current range. What makes you confident this compensation is justified?"
  };
}

export function fallbackResumeMatch(input: {
  resumeText: string;
  jobDescriptionText: string;
}): ResumeMatch {
  const resumeWords = new Set(input.resumeText.toLowerCase().match(/[a-z+#.]{3,}/g) ?? []);
  const jdWords = new Set(input.jobDescriptionText.toLowerCase().match(/[a-z+#.]{3,}/g) ?? []);
  const overlap = [...jdWords].filter((word) => resumeWords.has(word)).slice(0, 12);
  const missing = [...jdWords].filter((word) => !resumeWords.has(word)).slice(0, 8);
  const score = Math.min(88, Math.max(42, 40 + overlap.length * 4));

  return {
    matchScore: score,
    matchedSkills: overlap,
    missingSkills: missing,
    recommendations: [
      "Mirror the job description language where it truthfully matches your experience.",
      "Add measurable outcomes to your strongest projects.",
      "Close the top missing skill gaps with focused practice or a small portfolio project."
    ],
    summary:
      "PrepPilot found a reasonable early match signal. Strengthen the resume by making relevant skills more explicit and tying them to measurable project outcomes."
  };
}

