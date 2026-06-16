import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { evaluateResumeMatch } from "@/lib/ai/interview-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const evaluation = await evaluateResumeMatch(body);
    return NextResponse.json(evaluation);
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

