import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { evaluateResumeMatch } from "@/lib/ai/interview-service";
import { persistResumeMatch } from "@/lib/server/practice-service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const evaluation = await evaluateResumeMatch(body);
    const saved = await persistResumeMatch({
      userId: session.user.id,
      targetRole: body.targetRole,
      resumeText: body.resumeText,
      jobDescriptionText: body.jobDescriptionText,
      match: evaluation
    });

    return NextResponse.json({
      ...evaluation,
      resumeMatchId: saved.id
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid resume match request.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "PrepPilot could not match this resume yet. Please try again." },
      { status: 500 }
    );
  }
}
