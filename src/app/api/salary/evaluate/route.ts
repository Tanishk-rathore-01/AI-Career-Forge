import { UsageEventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { evaluateSalaryResponse } from "@/lib/ai/interview-service";
import { persistSalaryEvaluation } from "@/lib/server/practice-service";
import { assertFreeUsageAllowed } from "@/lib/server/usage-service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    await assertFreeUsageAllowed(session.user.id, UsageEventType.SALARY_EVALUATION);
    const evaluation = await evaluateSalaryResponse(body);
    const saved = await persistSalaryEvaluation({
      userId: session.user.id,
      request: body,
      evaluation
    });

    return NextResponse.json({
      ...evaluation,
      sessionId: saved.session.id,
      savedEvaluationId: saved.evaluation.id
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid salary practice request.", details: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("limit")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { error: "PrepPilot could not score this negotiation. Please try again." },
      { status: 500 }
    );
  }
}
