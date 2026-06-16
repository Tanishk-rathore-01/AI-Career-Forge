import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { evaluateInterviewAnswer } from "@/lib/ai/interview-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const evaluation = await evaluateInterviewAnswer(body);
    return NextResponse.json(evaluation);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid answer request.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "PrepPilot could not score this answer. Please try again." },
      { status: 500 }
    );
  }
}

