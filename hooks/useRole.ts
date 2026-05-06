"use client";

import { useSession } from "next-auth/react";
import { permissions } from "@/app/types/roles";
import type { Role } from "@/app/types/roles";

export function useRole() {
  const { data: session } = useSession();
  const role = (session?.user?.role ?? "viewer") as Role;
  return { role, ...permissions[role] };
}