import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, Permissions } from "@/app/types/roles";
import { permissions } from "@/app/types/roles";

type AuthStore = {
  role: Role;
  setRole: (role: Role) => void;
  permissions: Permissions;
};

export const useAuthStore = create<AuthStore>()(
  persist( 
    (set) => ({
      role: "viewer", 
      permissions: permissions["viewer"],
      setRole: (role) =>
        set({
          role,
          permissions: permissions[role],
        }),
    }),
    { name: "auth-store" } 
  )
);