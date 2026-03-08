import { hasPermission, requirePermission } from '@/lib/rbac/authorize';
import { getMembers } from '@/lib/members/members-data';
import { MembersClient } from './_components/members-client';

export default async function MembersPage() {
  const ctx = await requirePermission('CanViewMembers');
  const canManage = hasPermission(ctx, 'CanManageMembers');
  const workspaceId = ctx.workspaceId!; // non-null: requirePermission guarantees authenticated

  const members = await getMembers({ workspaceId });

  return <MembersClient members={members} canManage={canManage} />;
}
