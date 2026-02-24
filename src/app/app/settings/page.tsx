import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/session';
import { settingsByWorkspaceId } from '@/lib/demo/workspace-data';
import { guardPage } from '@/lib/rbac/route-guards';

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default async function SettingsPage() {
  await guardPage('CanViewSettings');
  const session = await getSession();
  const workspaceId = session?.workspaceId ?? 'default';
  // noUncheckedIndexedAccess: assert .default exists since we own the data
  const settings =
    settingsByWorkspaceId[workspaceId] ?? settingsByWorkspaceId.default!;
  const workspaceName =
    session?.workspaces.find((w) => w.id === workspaceId)?.name ?? 'Unknown';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace settings here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Read-only demo values for this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Workspace Name" value={workspaceName} />
          <SettingRow label="Plan" value={settings.plan} />
          <SettingRow label="Region" value={settings.region} />
          <SettingRow
            label="Data Retention"
            value={`${settings.retentionDays} days`}
          />
          <SettingRow
            label="Theme Preference"
            value={
              settings.themePreference.charAt(0).toUpperCase() +
              settings.themePreference.slice(1)
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
