import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { generateInterviewQuestion } from "@/lib/ai/interview-service";
import { assertFreeUsageAllowed } from "@/lib/server/usage-service";
import { UsageEventType } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    await assertFreeUsageAllowed(session.user.id, UsageEventType.INTERVIEW_QUESTION);
    const question = await generateInterviewQuestion(body);
    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid question request.", details: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("limit")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { error: "PrepPilot could not generate a question. Please try again." },
      { status: 500 }
    );
  }
}

