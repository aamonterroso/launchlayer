'use client';

import { MEMBER_ROLES } from '@/lib/members/member-roles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InviteMemberFormProps {
  formKey: number;
  action: (payload: FormData) => void;
  pending: boolean;
  fieldErrors?: { email?: string[]; role?: string[] };
}

export function InviteMemberForm({
  formKey,
  action,
  pending,
  fieldErrors,
}: InviteMemberFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={action}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1 sm:max-w-md">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="colleague@example.com"
                disabled={pending}
                aria-invalid={!!fieldErrors?.email}
                className="mt-1"
              />
              <p className="text-destructive mt-1 min-h-[1.25rem] text-xs">
                {fieldErrors?.email?.[0] ?? ''}
              </p>
            </div>

            <div className="w-full sm:w-44">
              <Label htmlFor="invite-role">Role</Label>
              {/* name prop renders a hidden input for FormData submission */}
              <Select name="role" defaultValue="Developer" disabled={pending}>
                <SelectTrigger
                  id="invite-role"
                  className="mt-1"
                  aria-invalid={!!fieldErrors?.role}
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
                {fieldErrors?.role?.[0] ?? ''}
              </p>
            </div>

            <Button type="submit" disabled={pending} className="shrink-0 sm:mt-4.5">
              {pending ? 'Inviting…' : 'Invite'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
