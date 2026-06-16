import { z } from "zod";

export const profileInputSchema = z.object({
  fullName: z.string().min(2).max(80),
  candidateStage: z.enum(["STUDENT", "INTERN", "FRESHER", "EXPERIENCED"]),
  targetRole: z.string().min(2).max(120),
  targetField: z.string().min(2).max(120),
  experienceYears: z.coerce.number().int().min(0).max(50).default(0),
  skills: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    )
    .or(z.array(z.string()))
    .default([]),
  preferredLocation: z.string().max(120).optional(),
  marketFocus: z.enum(["INDIA", "INTERNATIONAL", "BOTH"]).default("BOTH"),
  salaryCurrency: z.string().min(2).max(8).default("INR"),
  expectedSalaryMin: z.coerce.number().int().positive().optional().or(z.literal("")),
  expectedSalaryMax: z.coerce.number().int().positive().optional().or(z.literal("")),
  targetCompanies: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((company) => company.trim())
        .filter(Boolean)
    )
    .or(z.array(z.string()))
    .default([]),
  interviewGoal: z.string().max(400).optional()
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

