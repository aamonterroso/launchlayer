export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export type PermissionKey =
  | 'CanViewMembers'
  | 'CanManageMembers'
  | 'CanViewSettings'
  | 'CanManageSettings'
  | 'CanViewBilling'
  | 'CanManageBilling'
  | 'CanViewAuditLog';

export type PermissionSet = Record<PermissionKey, boolean>;
