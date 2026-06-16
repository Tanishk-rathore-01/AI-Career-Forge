import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { profileInputSchema } from "@/lib/validation/profile";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id }
  });

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileInputSchema.parse(body);

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...parsed,
        expectedSalaryMin:
          parsed.expectedSalaryMin === "" ? undefined : parsed.expectedSalaryMin,
        expectedSalaryMax:
          parsed.expectedSalaryMax === "" ? undefined : parsed.expectedSalaryMax
      },
      update: {
        ...parsed,
        expectedSalaryMin:
          parsed.expectedSalaryMin === "" ? null : parsed.expectedSalaryMin,
        expectedSalaryMax:
          parsed.expectedSalaryMax === "" ? null : parsed.expectedSalaryMax
      }
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid profile details.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to save profile right now." },
      { status: 500 }
    );
  }
}

