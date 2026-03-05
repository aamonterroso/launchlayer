import 'server-only';

import {
  type WorkspaceMember,
  type MemberRole,
  getWorkspaceMembers,
  addWorkspaceMember,
  removeWorkspaceMember,
  changeWorkspaceMemberRole,
} from '@/lib/demo/workspace-data';

export type { WorkspaceMember, MemberRole };

// ---------- Read ----------

export async function getMembers({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<WorkspaceMember[]> {
  return getWorkspaceMembers(workspaceId);
}

// ---------- Mutations ----------
// Async wrappers — swap bodies for real API calls when backend lands.

export async function addMember(
  workspaceId: string,
  member: WorkspaceMember,
): Promise<void> {
  addWorkspaceMember(workspaceId, member);
}

export async function removeMemberById(
  workspaceId: string,
  memberId: string,
): Promise<void> {
  removeWorkspaceMember(workspaceId, memberId);
}

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: MemberRole,
): Promise<void> {
  changeWorkspaceMemberRole(workspaceId, memberId, role);
}
