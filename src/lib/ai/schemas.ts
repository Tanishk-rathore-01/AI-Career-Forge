import { z } from "zod";

export const interviewModeSchema = z.enum([
  "hr",
  "technical",
  "behavioral",
  "salary",
  "resume_match",
  "company_prep"
]);

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

export const readinessLevelSchema = z.enum([
  "Needs Foundation",
  "Developing",
  "Moderate",
  "Strong",
  "Interview Ready"
]);

export const questionRequestSchema = z.object({
  targetRole: z.string().min(2),
  targetField: z.string().optional(),
  experienceLevel: z.string().min(2),
  skills: z.array(z.string()).default([]),
  mode: interviewModeSchema,
  difficulty: difficultySchema,
  marketFocus: z.enum(["india", "international", "both"]).default("both"),
  company: z.string().optional(),
  previousQuestions: z.array(z.string()).default([])
});

export const generatedQuestionSchema = z.object({
  question: z.string().min(10),
  intent: z.string().min(10),
  difficulty: difficultySchema,
  evaluationFocus: z.array(z.string().min(3)).min(2)
});

export const answerEvaluationRequestSchema = z.object({
  targetRole: z.string().min(2),
  targetField: z.string().optional(),
  experienceLevel: z.string().min(2),
  mode: interviewModeSchema,
  marketFocus: z.enum(["india", "international", "both"]).default("both"),
  question: z.string().min(10),
  answer: z.string().min(20).max(4000)
});

export const answerEvaluationSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  categoryScores: z.object({
    clarity: z.number().int().min(0).max(100),
    relevance: z.number().int().min(0).max(100),
    confidence: z.number().int().min(0).max(100),
    structure: z.number().int().min(0).max(100),
    technicalDepth: z.number().int().min(0).max(100)
  }),
  strengths: z.array(z.string().min(3)).min(1),
  weaknesses: z.array(z.string().min(3)).min(1),
  improvedAnswer: z.string().min(20),
  readinessLevel: readinessLevelSchema,
  estimatedSelectionChance: z.number().int().min(0).max(100),
  nextPracticeStep: z.string().min(10)
});

export const salaryEvaluationRequestSchema = z.object({
  targetRole: z.string().min(2),
  experienceLevel: z.string().min(2),
  marketFocus: z.enum(["india", "international", "both"]).default("both"),
  salaryCurrency: z.string().default("INR"),
  expectedSalaryMin: z.number().int().positive().optional(),
  expectedSalaryMax: z.number().int().positive().optional(),
  recruiterMessage: z.string().min(10),
  response: z.string().min(20).max(4000)
});

export const salaryEvaluationSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  categoryScores: z.object({
    confidence: z.number().int().min(0).max(100),
    professionalTone: z.number().int().min(0).max(100),
    marketReasoning: z.number().int().min(0).max(100),
    flexibility: z.number().int().min(0).max(100),
    clarity: z.number().int().min(0).max(100),
    valueJustification: z.number().int().min(0).max(100)
  }),
  strengths: z.array(z.string().min(3)).min(1),
  weaknesses: z.array(z.string().min(3)).min(1),
  improvedResponse: z.string().min(20),
  nextRecruiterMessage: z.string().min(10)
});

export const resumeMatchRequestSchema = z.object({
  targetRole: z.string().min(2),
  resumeText: z.string().min(50).max(12000),
  jobDescriptionText: z.string().min(50).max(12000)
});

export const resumeMatchSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  recommendations: z.array(z.string().min(5)).min(1),
  summary: z.string().min(20)
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type AnswerEvaluation = z.infer<typeof answerEvaluationSchema>;
export type SalaryEvaluation = z.infer<typeof salaryEvaluationSchema>;
export type ResumeMatch = z.infer<typeof resumeMatchSchema>;

