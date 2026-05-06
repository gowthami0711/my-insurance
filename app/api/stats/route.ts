import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET(request: NextRequest) {
  const limited = await withRateLimit(request, "api");
  if (limited) return limited;
  
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