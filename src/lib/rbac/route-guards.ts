import 'server-only';

import type { PermissionKey } from './rbac-types';
import { requirePermission } from './authorize';

export async function guardPage(
  permission: PermissionKey,
  opts?: { redirectTo?: string },
): Promise<void> {
  await requirePermission(permission, opts);
}
