export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import { withRateLimit } from "@/lib/withRateLimit";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const [totalCustomers, members, activeNow, inactive] = await Promise.all([
    db.customer.count(),
    db.customer.count({ where: { status: "Active" } }),
    db.customer.count({ where: { status: "Active" } }),
    db.customer.count({ where: { status: "Inactive" } }),
  ]);

  return NextResponse.json({
    totalCustomers,
    members,
    activeNow,
    inactive,
  });
}