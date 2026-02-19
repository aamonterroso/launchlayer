import 'server-only';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/session';
import { getRecentActivity } from '@/lib/demo/workspace-data';
import { sleep } from '@/lib/utils/sleep';

const verbLabel: Record<string, string> = {
  invited:          'invited',
  completed_task:   'completed task',
  deployed:         'deployed',
  updated_settings: 'updated settings',
  joined:           'joined',
};

export async function RecentActivity() {
  await sleep(1500);

  const session = await getSession();
  const workspaceId = session?.workspaceId ?? 'default';
  const items = getRecentActivity(workspaceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No activity yet.</p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <span className="text-sm">
                  <span className="font-medium">{item.actor}</span>
                  {' '}{verbLabel[item.verb] ?? item.verb}{' '}
                  <span className="text-muted-foreground">{item.target}</span>
                </span>
                <time
                  dateTime={item.timestamp}
                  className="text-muted-foreground shrink-0 pl-4 text-xs"
                >
                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
