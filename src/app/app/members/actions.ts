'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/authorize';
import {
  type WorkspaceMember,
  type MemberRole,
  getMembers,
  addMember,
  removeMemberById,
  updateMemberRole,
} from '@/lib/members/members-data';
import { MEMBER_ROLES } from '@/lib/members/member-roles';

// ---------- Validation ----------

const inviteMemberSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  role: z.enum(MEMBER_ROLES, { message: 'Select a valid role' }),
});

// ---------- Result types ----------

export interface InviteMemberResult {
  fieldErrors?: Record<string, string[]>;
  error?: string;
}

export interface MemberActionResult {
  error?: string;
}

// ---------- Actions ----------

export async function inviteMember(
  _prev: InviteMemberResult | null,
  formData: FormData,
): Promise<InviteMemberResult> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const ctx = await requirePermission('CanManageMembers');
  const workspaceId = ctx.workspaceId!;

  const parsed = inviteMemberSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getMembers({ workspaceId });
  if (existing.some((m) => m.email === parsed.data.email)) {
    return {
      fieldErrors: { email: ['A member with this email already exists'] },
    };
  }

  // Assumes Node.js runtime (not Edge). crypto.randomUUID() available in Node 18+.
  const newMember: WorkspaceMember = {
    id: `m_${crypto.randomUUID()}`,
    name: parsed.data.email.split('@')[0] ?? parsed.data.email,
    email: parsed.data.email,
    role: parsed.data.role,
    status: 'invited',
  };

  await addMember(workspaceId, newMember);
  revalidatePath('/app/members');

  return {};
}

export async function removeMember(
  memberId: string,
): Promise<MemberActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const ctx = await requirePermission('CanManageMembers');
  const workspaceId = ctx.workspaceId!;

  const existing = await getMembers({ workspaceId });
  const member = existing.find((m) => m.id === memberId);
  if (!member) return { error: 'Member not found' };

  // Demo-level safety: prevents orphaned workspace. A real DB constraint would enforce this.
  if (member.role === 'Owner') {
    const ownerCount = existing.filter((m) => m.role === 'Owner').length;
    if (ownerCount <= 1) return { error: 'Cannot remove the last owner' };
  }

  await removeMemberById(workspaceId, memberId);
  revalidatePath('/app/members');

  return {};
}

export async function changeMemberRole(
  memberId: string,
  role: MemberRole,
): Promise<MemberActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const ctx = await requirePermission('CanManageMembers');
  const workspaceId = ctx.workspaceId!;

  const existing = await getMembers({ workspaceId });
  const member = existing.find((m) => m.id === memberId);
  if (!member) return { error: 'Member not found' };

  // Demo-level safety: prevents orphaned workspace. A real DB constraint would enforce this.
  if (member.role === 'Owner' && role !== 'Owner') {
    const ownerCount = existing.filter((m) => m.role === 'Owner').length;
    if (ownerCount <= 1)
      return { error: 'Cannot change role of the last owner' };
  }

  await updateMemberRole(workspaceId, memberId, role);
  revalidatePath('/app/members');

  return {};
}
