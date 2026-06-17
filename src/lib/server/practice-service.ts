import {
  MessageRole,
  Prisma,
  SessionStatus,
  UsageEventType
} from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type {
  AnswerEvaluation,
  SalaryEvaluation,
  ResumeMatch
} from "@/lib/ai/schemas";
import {
  readinessFromScore,
  toDifficulty,
  toInterviewMode,
  toMarketFocus,
  toReadinessLevel
} from "@/lib/server/mappers";
import { recordPracticeStreak } from "@/lib/server/streak-service";

type InterviewPersistenceInput = {
  userId: string;
  sessionId?: string;
  request: {
    targetRole: string;
    targetField?: string;
    experienceLevel: string;
    mode: string;
    marketFocus?: string;
    question: string;
    answer: string;
  };
  evaluation: AnswerEvaluation & {
    rubricVersion: string;
    promptVersion: string;
    model?: string;
  };
};

export async function persistInterviewEvaluation({
  userId,
  sessionId,
  request,
  evaluation
}: InterviewPersistenceInput) {
  const session = sessionId
    ? await prisma.interviewSession.findFirst({
        where: { id: sessionId, userId }
      })
    : null;

  const saved = await prisma.$transaction(async (tx) => {
    const activeSession =
      session ??
      (await tx.interviewSession.create({
        data: {
          userId,
          mode: toInterviewMode(request.mode),
          difficulty: toDifficulty("beginner"),
          targetRole: request.targetRole,
          targetField: request.targetField,
          marketFocus: toMarketFocus(request.marketFocus),
          status: SessionStatus.ACTIVE
        }
      }));

    await tx.interviewMessage.createMany({
      data: [
        {
          sessionId: activeSession.id,
          role: MessageRole.AI,
          content: request.question
        },
        {
          sessionId: activeSession.id,
          role: MessageRole.USER,
          content: request.answer
        }
      ]
    });

    const savedEvaluation = await tx.answerEvaluation.create({
      data: {
        userId,
        sessionId: activeSession.id,
        question: request.question,
        answer: request.answer,
        overallScore: evaluation.overallScore,
        categoryScores: evaluation.categoryScores as Prisma.InputJsonValue,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        improvedAnswer: evaluation.improvedAnswer,
        readinessLevel: toReadinessLevel(evaluation.readinessLevel),
        estimatedSelectionChance: evaluation.estimatedSelectionChance,
        nextPracticeStep: evaluation.nextPracticeStep,
        rubricVersion: evaluation.rubricVersion,
        promptVersion: evaluation.promptVersion,
        model: evaluation.model,
        metadata: {
          experienceLevel: request.experienceLevel
        }
      }
    });

    await tx.usageEvent.create({
      data: {
        userId,
        eventType: UsageEventType.INTERVIEW_EVALUATION,
        model: evaluation.model,
        metadata: {
          mode: request.mode,
          promptVersion: evaluation.promptVersion
        }
      }
    });

    return { session: activeSession, evaluation: savedEvaluation };
  });

  await recordPracticeStreak(userId);

  return saved;
}

export async function persistSalaryEvaluation({
  userId,
  request,
  evaluation
}: {
  userId: string;
  request: {
    targetRole: string;
    experienceLevel: string;
    marketFocus?: string;
    recruiterMessage: string;
    response: string;
  };
  evaluation: SalaryEvaluation & {
    promptVersion: string;
    model?: string;
  };
}) {
  const saved = await prisma.$transaction(async (tx) => {
    const session = await tx.interviewSession.create({
      data: {
        userId,
        mode: "SALARY",
        difficulty: "INTERMEDIATE",
        targetRole: request.targetRole,
        marketFocus: toMarketFocus(request.marketFocus),
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    await tx.interviewMessage.createMany({
      data: [
        {
          sessionId: session.id,
          role: "AI",
          content: request.recruiterMessage
        },
        {
          sessionId: session.id,
          role: "USER",
          content: request.response
        }
      ]
    });

    const savedEvaluation = await tx.answerEvaluation.create({
      data: {
        userId,
        sessionId: session.id,
        question: request.recruiterMessage,
        answer: request.response,
        overallScore: evaluation.overallScore,
        categoryScores: evaluation.categoryScores as Prisma.InputJsonValue,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        improvedAnswer: evaluation.improvedResponse,
        readinessLevel: readinessFromScore(evaluation.overallScore),
        estimatedSelectionChance: Math.max(20, evaluation.overallScore - 8),
        nextPracticeStep: evaluation.nextRecruiterMessage,
        rubricVersion: "salary-rubric-v1",
        promptVersion: evaluation.promptVersion,
        model: evaluation.model,
        metadata: {
          kind: "salary",
          experienceLevel: request.experienceLevel
        }
      }
    });

    await tx.usageEvent.create({
      data: {
        userId,
        eventType: UsageEventType.SALARY_EVALUATION,
        model: evaluation.model,
        metadata: {
          promptVersion: evaluation.promptVersion
        }
      }
    });

    return { session, evaluation: savedEvaluation };
  });

  await recordPracticeStreak(userId);

  return saved;
}

export async function persistResumeMatch({
  userId,
  targetRole,
  resumeText,
  jobDescriptionText,
  match
}: {
  userId: string;
  targetRole: string;
  resumeText: string;
  jobDescriptionText: string;
  match: ResumeMatch & {
    promptVersion: string;
    model?: string;
  };
}) {
  const saved = await prisma.$transaction(async (tx) => {
    const resumeMatch = await tx.resumeMatch.create({
      data: {
        userId,
        targetRole,
        resumeText,
        jobDescriptionText,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        recommendations: match.recommendations,
        rawFeedback: {
          summary: match.summary,
          promptVersion: match.promptVersion,
          model: match.model
        }
      }
    });

    await tx.usageEvent.create({
      data: {
        userId,
        eventType: UsageEventType.RESUME_MATCH,
        model: match.model,
        metadata: {
          promptVersion: match.promptVersion,
          targetRole
        }
      }
    });

    return resumeMatch;
  });

  await recordPracticeStreak(userId);

  return saved;
}
