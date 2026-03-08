'use client';

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { MemberRole, WorkspaceMember } from '@/lib/members/members-data';
import {
  changeMemberRole,
  inviteMember,
  removeMember,
  type InviteMemberResult,
} from '../actions';
import { useToast } from '@/components/ui/toast';
import { InviteMemberForm } from './invite-member-form';
import { MembersList } from './members-list';

interface MembersClientProps {
  members: WorkspaceMember[];
  canManage: boolean;
}

export function MembersClient({ members, canManage }: MembersClientProps) {
  const { toast } = useToast();

  // ---------- Invite ----------
  const [inviteState, inviteAction, invitePending] = useActionState<
    InviteMemberResult | null,
    FormData
  >(inviteMember, null);

  const [formKey, setFormKey] = useState(0);
  // Guard against double-firing in Strict Mode or re-renders with the same state object
  const lastInviteStateRef = useRef<InviteMemberResult | null>(null);
  useEffect(() => {
    if (!inviteState || inviteState === lastInviteStateRef.current) return;
    lastInviteStateRef.current = inviteState;
    if (!inviteState.error && !inviteState.fieldErrors) {
      startTransition(() => setFormKey((k) => k + 1));
      toast('success', 'Invitation sent.');
    } else if (inviteState.error) {
      toast('error', inviteState.error);
    }
  }, [inviteState, toast]);

  // ---------- Remove ----------
  const [isRemoving, startRemoveTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = useCallback(
    (memberId: string) => {
      setRemovingId(memberId);
      startRemoveTransition(async () => {
        const result = await removeMember(memberId);
        if (result.error) {
          toast('error', result.error);
        } else {
          toast('success', 'Member removed.');
        }
        setRemovingId(null);
      });
    },
    [toast],
  );

  // ---------- Inline role edit ----------
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<MemberRole>('Developer');

  const [isChangingRole, startRoleTransition] = useTransition();
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

  const startEditing = useCallback((member: WorkspaceMember) => {
    setEditingMemberId(member.id);
    setEditingRole(member.role);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingMemberId(null);
  }, []);

  const handleSaveRole = useCallback(
    (memberId: string, role: MemberRole) => {
      setChangingRoleId(memberId);
      startRoleTransition(async () => {
        const result = await changeMemberRole(memberId, role);
        if (result.error) {
          toast('error', result.error);
        } else {
          setEditingMemberId(null);
          toast('success', 'Role updated.');
        }
        setChangingRoleId(null);
      });
    },
    [toast],
  );

  return (
    <div className="space-y-6">
      {canManage && (
        <InviteMemberForm
          formKey={formKey}
          action={inviteAction}
          pending={invitePending}
          fieldErrors={inviteState?.fieldErrors}
        />
      )}

      <MembersList
        members={members}
        canManage={canManage}
        removingId={removingId}
        isRemoving={isRemoving}
        editingMemberId={editingMemberId}
        editingRole={editingRole}
        isChangingRole={isChangingRole}
        changingRoleId={changingRoleId}
        onRemove={handleRemove}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
        onSaveRole={handleSaveRole}
        onEditingRoleChange={setEditingRole}
      />
    </div>
  );
}
