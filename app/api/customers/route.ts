import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { customerSchema } from "@/lib/validations/customer";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const limit = 8;

  const orderBy =
    sortBy === "name"
      ? { name: "asc" as const }
      : sortBy === "company"
      ? { company: "asc" as const }
      : { createdAt: "desc" as const };

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { country: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    db.customer.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.customer.count({ where }),
  ]);

  return NextResponse.json({
    customers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}


export async function POST(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  // ← add this
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const customer = await db.customer.create({
    data: parsed.data, 
  });

  return NextResponse.json(customer, { status: 201 });
}