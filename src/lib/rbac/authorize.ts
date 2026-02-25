import 'server-only';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import type { DemoSession } from '@/lib/auth/session';
import { UNAUTH_REDIRECT_PATH } from '@/lib/auth/routes';
import { getWorkspaceRole } from '@/lib/demo/workspace-data';
import { PERMISSIONS_BY_ROLE } from './permission-matrix';
import { ACCESS_DENIED_PATH } from './rbac-routes';
import type { PermissionKey, PermissionSet, Role } from './rbac-types';

export interface AuthzContext {
  userId: string | null;
  workspaceId: string | null;
  role: Role | null;
  permissions: PermissionSet | null;
}

export async function getAuthzContext(
  session?: DemoSession | null,
): Promise<AuthzContext> {
  const resolvedSession = session !== undefined ? session : await getSession();
  if (!resolvedSession) {
    return { userId: null, workspaceId: null, role: null, permissions: null };
  }
  const { user, workspaceId } = resolvedSession;
  const role = await getWorkspaceRole({ workspaceId, userId: user.id });
  const permissions = role !== null ? PERMISSIONS_BY_ROLE[role] : null;
  return { userId: user.id, workspaceId, role, permissions };
}

export function hasPermission(ctx: AuthzContext, key: PermissionKey): boolean {
  return ctx.permissions?.[key] ?? false;
}

export async function requirePermission(
  key: PermissionKey,
  opts?: { redirectTo?: string },
): Promise<AuthzContext> {
  const ctx = await getAuthzContext();
  if (ctx.userId === null) {
    redirect(UNAUTH_REDIRECT_PATH);
  }
  if (!hasPermission(ctx, key)) {
    redirect(opts?.redirectTo ?? ACCESS_DENIED_PATH);
  }
  return ctx;
}
