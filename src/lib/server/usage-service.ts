import { UsageEventType } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export const FREE_DAILY_EVALUATION_LIMIT = 5;
export const FREE_DAILY_SALARY_LIMIT = 2;

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
