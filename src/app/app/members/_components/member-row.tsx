'use client';

import { EllipsisIcon } from 'lucide-react';
import type { MemberRole, WorkspaceMember } from '@/lib/members/members-data';
import { Avatar, getInitials } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberRoleEditor } from './member-role-editor';

function getRoleBadgeClass(role: MemberRole): string {
  if (role === 'Owner')
    return 'border border-amber-200 bg-amber-50/60 text-amber-800';
  if (role === 'Admin')
    return 'border border-violet-200 bg-violet-50/60 text-violet-800';
  return 'border border-border/70 text-foreground/60';
}

interface MemberRowProps {
  member: WorkspaceMember;
  canManage: boolean;
  isPendingRemove: boolean;
  isEditing: boolean;
  editingRole: MemberRole;
  isSavingRole: boolean;
  onRemove: (memberId: string) => void;
  onStartEditing: (member: WorkspaceMember) => void;
  onCancelEditing: () => void;
  onSaveRole: (memberId: string, role: MemberRole) => void;
  onEditingRoleChange: (role: MemberRole) => void;
}

export function MemberRow({
  member,
  canManage,
  isPendingRemove,
  isEditing,
  editingRole,
  isSavingRole,
  onRemove,
  onStartEditing,
  onCancelEditing,
  onSaveRole,
  onEditingRoleChange,
}: MemberRowProps) {
  const hasName = member.name.trim() !== '';

  return (
    <li
      className={`flex items-center gap-4 py-3 transition-opacity ${isPendingRemove ? 'opacity-50' : ''}`}
    >
      {/* Avatar */}
      <Avatar initials={getInitials(member.name, member.email)} />

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{hasName ? member.name : member.email}</p>
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="text-muted-foreground truncate text-xs">
            {hasName ? member.email : 'Pending invitation'}
          </p>
          <Badge
            variant={member.status === 'active' ? 'success' : 'warning'}
            className="shrink-0"
          >
            {member.status === 'active' ? 'Active' : 'Invited'}
          </Badge>
        </div>
      </div>

      {/* Right side */}
      {isPendingRemove ? (
        <span className="text-muted-foreground shrink-0 text-xs">Removing…</span>
      ) : isEditing ? (
        <MemberRoleEditor
          memberName={hasName ? member.name : member.email}
          role={editingRole}
          isSaving={isSavingRole}
          onRoleChange={onEditingRoleChange}
          onSave={() => onSaveRole(member.id, editingRole)}
          onCancel={onCancelEditing}
        />
      ) : (
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary" className={getRoleBadgeClass(member.role)}>
            {member.role}
          </Badge>

          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPendingRemove}
                  aria-label={`Actions for ${hasName ? member.name : member.email}`}
                >
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onStartEditing(member)}>
                  Change role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onRemove(member.id)}
                >
                  Remove member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </li>
  );
}
