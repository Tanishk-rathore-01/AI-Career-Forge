import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { evaluateInterviewAnswer } from "@/lib/ai/interview-service";

const DEMO_COOKIE = "preppilot_demo_used";

export async function POST(request: Request) {
  if (request.headers.get("cookie")?.includes(`${DEMO_COOKIE}=true`)) {
    return NextResponse.json(
      {
        error:
          "Your free demo has been used. Create a free account to continue practicing."
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const evaluation = await evaluateInterviewAnswer(body);
    const response = NextResponse.json(evaluation);

    response.cookies.set(DEMO_COOKIE, "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid demo answer.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "PrepPilot could not score this demo. Please try again." },
      { status: 500 }
    );
  }
}

