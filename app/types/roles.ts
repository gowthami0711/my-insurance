export type Role = "admin" | "manager" | "viewer";

export const permissions = {
  admin: {
    canEdit: true,
    canDelete: true,
    canAssign: true,
    canExport: true,
    canViewStats: true,
  },
  manager: {
    canEdit: true,
    canDelete: false,
    canAssign: true,
    canExport: true,
    canViewStats: true,
  },
  viewer: {
    canEdit: false,
    canDelete: false,
    canAssign: false,
    canExport: false,
    canViewStats: true,
  },
} as const satisfies Record<Role, Permissions>;

export type Permissions = {
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canExport: boolean;
  canViewStats: boolean;
};