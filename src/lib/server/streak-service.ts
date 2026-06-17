import { prisma } from "@/lib/db/prisma";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function recordPracticeStreak(userId: string) {
  const existing = await prisma.userStreak.findUnique({ where: { userId } });
  const today = startOfDay(new Date());

  if (!existing?.lastPracticeDate) {
    return prisma.userStreak.upsert({
      where: { userId },
      create: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastPracticeDate: today,
        points: 20
      },
      update: {
        currentStreak: 1,
        longestStreak: Math.max(existing?.longestStreak ?? 0, 1),
        lastPracticeDate: today,
        points: { increment: 20 }
      }
    });
  }

  const last = startOfDay(existing.lastPracticeDate);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

  if (diffDays <= 0) {
    return prisma.userStreak.update({
      where: { userId },
      data: { points: { increment: 10 } }
    });
  }

  const currentStreak = diffDays === 1 ? existing.currentStreak + 1 : 1;

  return prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak: Math.max(existing.longestStreak, currentStreak),
      lastPracticeDate: today,
      points: { increment: 20 }
    }
  });
}
