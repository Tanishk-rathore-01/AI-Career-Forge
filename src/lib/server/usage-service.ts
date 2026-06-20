import { UsageEventType } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const FREE_DAILY_EVALUATION_LIMIT = 5;
export const FREE_DAILY_SALARY_LIMIT = 2;
export const FREE_DEMO_LIMIT = 1;
export const FREE_DEMO_LIMIT_PER_IP = 3; // Allow a few per IP in case of legitimate cases

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function assertFreeUsageAllowed(
  userId: string,
  eventType: UsageEventType
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true }
  });

  if (user?.planTier === "PREMIUM") {
    return;
  }

  const limit =
    eventType === UsageEventType.SALARY_EVALUATION
      ? FREE_DAILY_SALARY_LIMIT
      : FREE_DAILY_EVALUATION_LIMIT;

  const count = await prisma.usageEvent.count({
    where: {
      userId,
      eventType,
      createdAt: {
        gte: startOfToday()
      }
    }
  });

  if (count >= limit) {
    throw new Error(
      eventType === UsageEventType.SALARY_EVALUATION
        ? "You have reached today's free salary practice limit."
        : "You have reached today's free interview practice limit."
    );
  }
}

/**
 * Check if a demo has been used, protecting against:
 * - Cookie clearing attacks (tracks by IP)
 * - Incognito browsing (tracks by IP)
 */
export async function assertDemoUsageAllowed(
  ipAddress: string
): Promise<{ isDemoUsed: boolean; demoId?: string }> {
  // Check IP-based usage first - strict limit
  const ipUsageCount = await prisma.usageEvent.count({
    where: {
      eventType: UsageEventType.DEMO_EVALUATION,
      metadata: {
        path: ["ipAddress"],
        equals: ipAddress
      },
      createdAt: {
        gte: startOfToday()
      }
    }
  });

  if (ipUsageCount >= FREE_DEMO_LIMIT_PER_IP) {
    // This IP has maxed out free demos for the day
    return { isDemoUsed: true };
  }

  // Check if they have a valid demo session ID
  const recentDemoSession = await prisma.interviewSession.findFirst({
    where: {
      demoId: { not: null },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    select: { demoId: true },
    orderBy: { createdAt: "desc" },
    take: 1
  });

  return {
    isDemoUsed: ipUsageCount > 0,
    demoId: recentDemoSession?.demoId || undefined
  };
}
