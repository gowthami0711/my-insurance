import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getViewUrl, deleteObject } from "@/lib/s3";
import { withRateLimit } from "@/lib/withRateLimit";

// GET /api/documents/:id — get presigned view URL
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await withRateLimit(_request, "api");
  if (limited) return limited;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const document = await db.document.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // generate fresh presigned URL (valid 1 hour)
  const viewUrl = await getViewUrl(document.key);

  return NextResponse.json({ ...document, viewUrl });
}

// DELETE /api/documents/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await withRateLimit(_request, "api");
  if (limited) return limited;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const document = await db.document.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // delete from S3 and DB
  await Promise.all([
    deleteObject(document.key),
    db.document.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}