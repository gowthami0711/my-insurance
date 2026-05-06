export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { annotationSchema } from "@/lib/validations/customer";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const annotations = await db.annotation.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(annotations);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const parsed = annotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const annotation = await db.annotation.create({
    data: {
      documentId: id,
      ...parsed.data,
    },
  });

  return NextResponse.json(annotation, { status: 201 });
}