import { getSession } from '@/lib/auth/session';
import { PageTitle } from '@/components/app-shell/page-title';
import { Sidebar } from '@/components/app-shell/sidebar';
import { Topbar } from '@/components/app-shell/topbar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const activeWorkspace =
    session?.workspaces.find((w) => w.id === session.workspaceId) ?? null;

  return (
    <div className="flex h-screen">
      <Sidebar
        activeWorkspace={activeWorkspace}
        workspaces={session?.workspaces ?? []}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={<PageTitle />} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
