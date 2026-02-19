import 'server-only';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/session';
import {
  getUsageSeries,
  normalizeDashboardRange,
} from '@/lib/dashboard/dashboard-data';
import { sleep } from '@/lib/utils/sleep';

export async function UsageGraph() {
  await sleep(800);

  const session = await getSession();
  const workspaceId = session?.workspaceId ?? 'default';
  const range = normalizeDashboardRange();
  const series = await getUsageSeries(workspaceId, range);
  const { label, unit, points } = series;

  const max = Math.max(...points.map((p) => p.value), 1);
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const avg = points.length > 0 ? Math.round(total / points.length) : 0;
  const description = unit
    ? `${label} (${unit}) · last 7 days`
    : `${label} · last 7 days`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div>
          <CardTitle>Usage</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {points.length > 0 && (
          <div className="text-right">
            <p className="text-foreground tabular-nums text-2xl font-bold leading-none">
              {avg.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">avg / day</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {points.length === 0 ? (
          <p className="text-muted-foreground text-sm">No usage data yet.</p>
        ) : (
          <div className="space-y-2.5">
            {points.map((point) => {
              const barWidth = Math.round((point.value / max) * 100);
              const dateLabel = new Date(point.ts).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div key={point.ts} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-14 shrink-0 text-xs">
                    {dateLabel}
                  </span>
                  <div className="bg-muted flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-primary/60 h-2 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-12 shrink-0 text-right text-xs tabular-nums">
                    {point.value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
