import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getUploadUrl } from "@/lib/s3";
import { randomUUID } from "crypto";
import { documentSchema } from "@/lib/validations/customer";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customerId = request.nextUrl.searchParams.get("customerId");
  if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });

  const documents = await db.document.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      size: true,
      pages: true,
      key: true,
      createdAt: true,
      _count: {
        select: { annotations: true, comments: true },
      },
    },
  });

  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;
  
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { fileName, fileType, fileSize, customerId, pages } = parsed.data;

  const key = `documents/${customerId}/${randomUUID()}-${fileName}`;
  const uploadUrl = await getUploadUrl(key, fileType);

  const document = await db.document.create({
    data: {
      name: fileName,
      size: fileSize,
      pages: pages ?? 1,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
      customerId,
    },
  });

  return NextResponse.json({ document, uploadUrl });
}