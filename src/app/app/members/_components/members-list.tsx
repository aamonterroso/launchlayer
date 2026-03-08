'use client';

import type { MemberRole, WorkspaceMember } from '@/lib/members/members-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberRow } from './member-row';

interface MembersListProps {
  members: WorkspaceMember[];
  canManage: boolean;
  removingId: string | null;
  isRemoving: boolean;
  editingMemberId: string | null;
  editingRole: MemberRole;
  isChangingRole: boolean;
  changingRoleId: string | null;
  onRemove: (memberId: string) => void;
  onStartEditing: (member: WorkspaceMember) => void;
  onCancelEditing: () => void;
  onSaveRole: (memberId: string, role: MemberRole) => void;
  onEditingRoleChange: (role: MemberRole) => void;
}

export function MembersList({
  members,
  canManage,
  removingId,
  isRemoving,
  editingMemberId,
  editingRole,
  isChangingRole,
  changingRoleId,
  onRemove,
  onStartEditing,
  onCancelEditing,
  onSaveRole,
  onEditingRoleChange,
}: MembersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-muted-foreground text-sm">No members yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {members.map((member) => {
              const isPendingRemove = isRemoving && removingId === member.id;
              const isEditing = editingMemberId === member.id;
              const isSavingRole = isChangingRole && changingRoleId === member.id;

              return (
                <MemberRow
                  key={member.id}
                  member={member}
                  canManage={canManage}
                  isPendingRemove={isPendingRemove}
                  isEditing={isEditing}
                  editingRole={editingRole}
                  isSavingRole={isSavingRole}
                  onRemove={onRemove}
                  onStartEditing={onStartEditing}
                  onCancelEditing={onCancelEditing}
                  onSaveRole={onSaveRole}
                  onEditingRoleChange={onEditingRoleChange}
                />
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
