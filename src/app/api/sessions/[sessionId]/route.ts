import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSessionDetail } from "@/lib/server/dashboard-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { sessionId } = await params;
  const detail = await getSessionDetail(session.user.id, sessionId);

  if (!detail) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  return NextResponse.json({ session: detail });
}
