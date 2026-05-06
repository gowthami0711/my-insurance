import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getViewUrl } from "@/lib/s3";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);

  const document = await db.document.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // get fresh presigned URL
  const viewUrl = await getViewUrl(document.key);

  // fetch only the requested page range from S3 using Range header
  // each PDF page ~100KB on average, so fetch in 500KB chunks
  const CHUNK_SIZE = 500 * 1024;
  const start = (page - 1) * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const s3Response = await fetch(viewUrl, {
    headers: { Range: `bytes=${start}-${end}` },
  });

  return new NextResponse(s3Response.body, {
    status: 206,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Range": s3Response.headers.get("Content-Range") ?? "",
      "Accept-Ranges": "bytes",
    },
  });
}