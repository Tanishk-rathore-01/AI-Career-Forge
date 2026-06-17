import {
  Difficulty,
  InterviewMode,
  MarketFocus,
  ReadinessLevel
} from "@prisma/client";

export function toInterviewMode(mode: string): InterviewMode {
  const normalized = mode.toUpperCase();
  if (normalized === "RESUME_MATCH") return InterviewMode.RESUME_MATCH;
  if (normalized === "COMPANY_PREP") return InterviewMode.COMPANY_PREP;
  if (normalized in InterviewMode) {
    return InterviewMode[normalized as keyof typeof InterviewMode];
  }
  return InterviewMode.HR;
}

export function toDifficulty(difficulty?: string): Difficulty {
  const normalized = difficulty?.toUpperCase();
  if (normalized && normalized in Difficulty) {
    return Difficulty[normalized as keyof typeof Difficulty];
  }
  return Difficulty.BEGINNER;
}

export function toMarketFocus(market?: string): MarketFocus {
  const normalized = market?.toUpperCase();
  if (normalized && normalized in MarketFocus) {
    return MarketFocus[normalized as keyof typeof MarketFocus];
  }
  return MarketFocus.BOTH;
}

export function toReadinessLevel(label: string): ReadinessLevel {
  const normalized = label.toUpperCase().replaceAll(" ", "_");
  if (normalized in ReadinessLevel) {
    return ReadinessLevel[normalized as keyof typeof ReadinessLevel];
  }
  return ReadinessLevel.DEVELOPING;
}

export function readinessLabel(level: ReadinessLevel) {
  switch (level) {
    case ReadinessLevel.NEEDS_FOUNDATION:
      return "Needs Foundation";
    case ReadinessLevel.DEVELOPING:
      return "Developing";
    case ReadinessLevel.MODERATE:
      return "Moderate";
    case ReadinessLevel.STRONG:
      return "Strong";
    case ReadinessLevel.INTERVIEW_READY:
      return "Interview Ready";
  }
}

export function readinessFromScore(score: number): ReadinessLevel {
  if (score >= 89) return ReadinessLevel.INTERVIEW_READY;
  if (score >= 76) return ReadinessLevel.STRONG;
  if (score >= 61) return ReadinessLevel.MODERATE;
  if (score >= 41) return ReadinessLevel.DEVELOPING;
  return ReadinessLevel.NEEDS_FOUNDATION;
}
