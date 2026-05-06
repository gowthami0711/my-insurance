// app/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";
import type { Role } from "./roles";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}