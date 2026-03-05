'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { EllipsisIcon } from 'lucide-react';
import type { MemberRole, WorkspaceMember } from '@/lib/members/members-data';
import { MEMBER_ROLES } from '@/lib/members/member-roles';
import { Avatar, getInitials } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  changeMemberRole,
  inviteMember,
  removeMember,
  type InviteMemberResult,
} from '../actions';
import { useToast } from '@/components/ui/toast';

function getRoleBadgeClass(role: MemberRole): string {
  if (role === 'Owner')
    return 'border border-amber-200 bg-amber-50/60 text-amber-800';
  if (role === 'Admin')
    return 'border border-violet-200 bg-violet-50/60 text-violet-800';
  return '';
}

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
      setFormKey((k) => k + 1);
      toast('success', 'Invitation sent.');
    } else if (inviteState.error) {
      toast('error', inviteState.error);
    }
  }, [inviteState]);

  // ---------- Remove ----------
  const [isRemoving, startRemoveTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = useCallback((memberId: string) => {
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
  }, []);

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

  const handleSaveRole = useCallback((memberId: string, role: MemberRole) => {
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
  }, []);

  return (
    <div className="space-y-6">
      {/* Invite form — managers only */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form key={formKey} action={inviteAction}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1 sm:max-w-md">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    name="email"
                    type="email"
                    placeholder="colleague@example.com"
                    disabled={invitePending}
                    aria-invalid={!!inviteState?.fieldErrors?.email}
                    className="mt-1"
                  />
                  <p className="text-destructive mt-1 min-h-[1.25rem] text-xs">
                    {inviteState?.fieldErrors?.email?.[0] ?? ''}
                  </p>
                </div>

                <div className="w-full sm:w-44">
                  <Label htmlFor="invite-role">Role</Label>
                  {/* name prop renders a hidden input for FormData submission */}
                  <Select
                    name="role"
                    defaultValue="Developer"
                    disabled={invitePending}
                  >
                    <SelectTrigger
                      id="invite-role"
                      className="mt-1"
                      aria-invalid={!!inviteState?.fieldErrors?.role}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEMBER_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-destructive mt-1 min-h-[1.25rem] text-xs">
                    {inviteState?.fieldErrors?.role?.[0] ?? ''}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={invitePending}
                  className="shrink-0 sm:mt-4.5"
                >
                  {invitePending ? 'Inviting…' : 'Invite'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members list */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-sm">No members yet.</p>
          ) : (
            <ul className="divide-y">
              {members.map((member) => {
                const isPendingRemove = isRemoving && removingId === member.id;
                const isEditing = editingMemberId === member.id;
                const isSavingRole =
                  isChangingRole && changingRoleId === member.id;

                return (
                  <li
                    key={member.id}
                    className={`flex items-center gap-3 py-3 transition-opacity ${isPendingRemove ? 'opacity-50' : ''}`}
                  >
                    {/* Avatar */}
                    <Avatar initials={getInitials(member.name, member.email)} />

                    {/* Identity */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {member.email}
                      </p>
                      <Badge
                        variant={
                          member.status === 'active' ? 'success' : 'warning'
                        }
                        className="mt-1"
                      >
                        {member.status === 'active' ? 'Active' : 'Invited'}
                      </Badge>
                    </div>

                    {/* Right side */}
                    {isPendingRemove ? (
                      <span className="text-muted-foreground shrink-0 text-xs">
                        Removing…
                      </span>
                    ) : isEditing ? (
                      /* Inline role editor */
                      <div className="flex shrink-0 items-center gap-2">
                        <Select
                          value={editingRole}
                          onValueChange={(v) => setEditingRole(v as MemberRole)}
                          disabled={isSavingRole}
                        >
                          <SelectTrigger
                            className="h-8 w-36 text-xs"
                            aria-label={`New role for ${member.name}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MEMBER_ROLES.map((r) => (
                              <SelectItem key={r} value={r} className="text-xs">
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="xs"
                          onClick={() => handleSaveRole(member.id, editingRole)}
                          disabled={isSavingRole}
                        >
                          {isSavingRole ? 'Saving…' : 'Save'}
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={cancelEditing}
                          disabled={isSavingRole}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      /* Default view */
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getRoleBadgeClass(member.role)}
                        >
                          {member.role}
                        </Badge>

                        {canManage && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={isPendingRemove}
                                aria-label={`Actions for ${member.name}`}
                              >
                                <EllipsisIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() => startEditing(member)}
                              >
                                Change role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => handleRemove(member.id)}
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
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
