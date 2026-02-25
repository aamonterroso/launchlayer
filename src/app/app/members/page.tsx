import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/session';
import { membersByWorkspaceId } from '@/lib/demo/workspace-data';
import { guardPage } from '@/lib/rbac/route-guards';

export default async function MembersPage() {
  await guardPage('CanViewMembers');
  const session = await getSession();
  const workspaceId = session?.workspaceId ?? 'default';
  // noUncheckedIndexedAccess: assert .default exists since we own the data
  const members =
    membersByWorkspaceId[workspaceId] ?? membersByWorkspaceId.default!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Manage your workspace members here.
        </p>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">No members yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-muted-foreground text-sm">{member.email}</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {member.status === 'active' ? 'Active' : 'Invited'}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
