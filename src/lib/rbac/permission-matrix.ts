import type { PermissionSet, Role } from './rbac-types';

export const PERMISSIONS_BY_ROLE: Record<Role, PermissionSet> = {
  owner: {
    CanViewMembers: true,  CanManageMembers: true,
    CanViewSettings: true, CanManageSettings: true,
    CanViewBilling: true,  CanManageBilling: true,
    CanViewAuditLog: true,
  },
  admin: {
    CanViewMembers: true,  CanManageMembers: true,
    CanViewSettings: true, CanManageSettings: true,
    CanViewBilling: true,  CanManageBilling: false,
    CanViewAuditLog: true,
  },
  member: {
    CanViewMembers: true,  CanManageMembers: false,
    CanViewSettings: true, CanManageSettings: false,
    CanViewBilling: false, CanManageBilling: false,
    CanViewAuditLog: false,
  },
  viewer: {
    CanViewMembers: false, CanManageMembers: false,
    CanViewSettings: false, CanManageSettings: false,
    CanViewBilling: false, CanManageBilling: false,
    CanViewAuditLog: false,
  },
};
