import { getSession } from '@/lib/auth/session';
import { PageTitle } from '@/components/app-shell/page-title';
import { Sidebar } from '@/components/app-shell/sidebar';
import { Topbar } from '@/components/app-shell/topbar';
import { getAuthzContext, hasPermission } from '@/lib/rbac/authorize';
import { appNavItems } from '@/lib/navigation';
import { Toaster } from '@/components/ui/toast';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const ctx = await getAuthzContext(session);
  const allowedNavItems = appNavItems
    .filter((item) => !item.permission || hasPermission(ctx, item.permission))
    .map(({ label, href }) => ({ label, href }));
  const activeWorkspace =
    session?.workspaces.find((w) => w.id === session.workspaceId) ?? null;

  return (
    <div className="flex h-screen">
      <Sidebar
        activeWorkspace={activeWorkspace}
        workspaces={session?.workspaces ?? []}
        navItems={allowedNavItems}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={<PageTitle />} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
}
