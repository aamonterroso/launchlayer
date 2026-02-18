import { getSession } from '@/lib/auth/session';
import { UserMenu } from './user-menu';

interface TopbarProps {
  title: React.ReactNode;
}

export async function Topbar({ title }: TopbarProps) {
  const session = await getSession();

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-muted-foreground text-sm">
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        {session ? (
          <UserMenu user={session.user} />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
            ?
          </div>
        )}
      </div>
    </header>
  );
}
