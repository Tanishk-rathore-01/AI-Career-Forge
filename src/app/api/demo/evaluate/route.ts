import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { evaluateInterviewAnswer } from "@/lib/ai/interview-service";
import { assertDemoUsageAllowed } from "@/lib/server/usage-service";
import { prisma } from "@/lib/db/prisma";

const DEMO_COOKIE = "preppilot_demo_used";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const hasDemoCookie = request.headers.get("cookie")?.includes(`${DEMO_COOKIE}=true`);

  // Check if demo has been used (IP-based limiting)
  const { isDemoUsed, demoId } = await assertDemoUsageAllowed(clientIp);

  if (isDemoUsed && hasDemoCookie) {
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

    // Create a demo session if one doesn't exist
    const demoDemoId = demoId || `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!demoId) {
      await prisma.interviewSession.create({
        data: {
          demoId: demoDemoId,
          mode: body.mode || "HR",
          difficulty: body.difficulty || "BEGINNER",
          targetRole: body.targetRole || "General",
          targetField: body.targetField
        }
      });
    }

    // Log usage event with IP address
    await prisma.usageEvent.create({
      data: {
        demoId: demoDemoId,
        eventType: "DEMO_EVALUATION",
        metadata: {
          ipAddress: clientIp,
          userAgent: request.headers.get("user-agent")
        }
      }
    });

    const response = NextResponse.json(evaluation);

    // Set cookie to persist demo usage on this device
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

