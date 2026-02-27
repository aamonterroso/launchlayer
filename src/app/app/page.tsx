import { Suspense } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSession } from '@/lib/auth/session';
import { getDashboardMetrics } from '@/lib/dashboard/dashboard-data';
import { parseTimeRange, type SearchParams } from '@/lib/time-range/time-range';
import { RecentActivity } from './_components/recent-activity';
import { RecentActivitySkeleton } from './_components/recent-activity-skeleton';
import { UsageGraph } from './_components/usage-graph';
import { UsageGraphSkeleton } from './_components/usage-graph-skeleton';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const session = await getSession();
  const workspaceId = session?.workspaceId ?? 'default';
  const timeRange = parseTimeRange(resolvedSearchParams);
  const metrics = await getDashboardMetrics({ workspaceId, timeRange });

  const rangeLabel = (
    {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
    } as const
  )[timeRange.preset];

  const stats = [
    {
      title: 'Total Members',
      value: String(metrics.members),
      change: '+2 this month',
    },
    {
      title: 'Active Projects',
      value: String(metrics.projects),
      change: '+1 this week',
    },
    {
      title: 'Tasks Completed',
      value: String(metrics.tasks),
      change: '+12 today',
    },
    { title: 'Uptime', value: `${metrics.uptime}%`, change: rangeLabel },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your workspace</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Suspense fallback={<UsageGraphSkeleton />}>
        <UsageGraph timeRange={timeRange} />
      </Suspense>

      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivity timeRange={timeRange} />
      </Suspense>
    </div>
  );
}
