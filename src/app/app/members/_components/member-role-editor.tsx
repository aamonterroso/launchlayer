'use client';

import type { MemberRole } from '@/lib/members/members-data';
import { MEMBER_ROLES } from '@/lib/members/member-roles';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MemberRoleEditorProps {
  memberName: string;
  role: MemberRole;
  isSaving: boolean;
  onRoleChange: (role: MemberRole) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MemberRoleEditor({
  memberName,
  role,
  isSaving,
  onRoleChange,
  onSave,
  onCancel,
}: MemberRoleEditorProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Select
        value={role}
        onValueChange={(v) => onRoleChange(v as MemberRole)}
        disabled={isSaving}
      >
        <SelectTrigger
          className="h-8 w-36 text-xs"
          aria-label={`New role for ${memberName}`}
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
      <Button size="xs" onClick={onSave} disabled={isSaving} className="bg-cta hover:bg-[#2468c5] text-white">
        {isSaving ? 'Saving…' : 'Save'}
      </Button>
      <Button size="xs" variant="ghost" onClick={onCancel} disabled={isSaving}>
        Cancel
      </Button>
    </div>
  );
}
