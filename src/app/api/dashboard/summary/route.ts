import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDashboardSummary } from "@/lib/server/dashboard-service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const summary = await getDashboardSummary(session.user.id);
  return NextResponse.json(summary);
}
