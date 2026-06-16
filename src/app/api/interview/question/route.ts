import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateInterviewQuestion } from "@/lib/ai/interview-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = await generateInterviewQuestion(body);
    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid question request.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "PrepPilot could not generate a question. Please try again." },
      { status: 500 }
    );
  }
}

