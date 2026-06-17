import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { readinessFromScore, readinessLabel } from "@/lib/server/mappers";

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function scoreEntries(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value)
    .filter(([, score]) => typeof score === "number")
    .map(([name, score]) => ({ name, score: Number(score) }));
}

export async function getDashboardSummary(userId: string) {
  const [profile, evaluations, resumeMatches, sessions, streak] =
    await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.answerEvaluation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.resumeMatch.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.interviewSession.findMany({
        where: { userId },
        include: {
          evaluations: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.userStreak.findUnique({ where: { userId } })
    ]);

  const recentScores = evaluations.slice(0, 5).map((item) => item.overallScore);
  const readinessScore = average(recentScores);
  const categoryTotals = new Map<string, number[]>();

  for (const evaluation of evaluations) {
    for (const entry of scoreEntries(evaluation.categoryScores)) {
      const values = categoryTotals.get(entry.name) ?? [];
      values.push(entry.score);
      categoryTotals.set(entry.name, values);
    }
  }

  const categoryAverages = [...categoryTotals.entries()]
    .map(([name, values]) => ({ name, score: average(values) }))
    .sort((a, b) => a.score - b.score);

  const readinessLevel = readinessLabel(readinessFromScore(readinessScore));
  const latestResumeMatch = resumeMatches[0];

  return {
    profile,
    readinessScore,
    readinessLevel,
    averageScore: average(evaluations.map((item) => item.overallScore)),
    salaryConfidence:
      evaluations.find((item) => item.metadata && typeof item.metadata === "object")?.overallScore ??
      0,
    resumeMatchScore: latestResumeMatch?.matchScore ?? 0,
    strongestAreas: categoryAverages.slice(-3).reverse(),
    weakestAreas: categoryAverages.slice(0, 3),
    sessionCount: sessions.length,
    evaluationCount: evaluations.length,
    streak: streak ?? {
      currentStreak: 0,
      longestStreak: 0,
      points: 0
    },
    recentSessions: sessions.map((session) => ({
      id: session.id,
      mode: session.mode,
      targetRole: session.targetRole,
      createdAt: session.createdAt,
      score: session.evaluations[0]?.overallScore ?? null
    })),
    nextRecommendation:
      categoryAverages[0]?.name === "technicalDepth"
        ? "Run a technical round and explain tradeoffs before code."
        : categoryAverages[0]?.name
          ? `Improve ${categoryAverages[0].name} with one focused practice session.`
          : "Complete one HR round to establish your baseline."
  };
}

export async function getSessionList(userId: string) {
  return prisma.interviewSession.findMany({
    where: { userId },
    include: {
      evaluations: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getSessionDetail(userId: string, sessionId: string) {
  return prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      },
      evaluations: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
}
