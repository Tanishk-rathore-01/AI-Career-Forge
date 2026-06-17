import { NextResponse } from "next/server";

import { getEnvironmentStatus } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    service: "PrepPilot",
    environment: getEnvironmentStatus()
  });
}
