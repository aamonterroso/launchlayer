import { Suspense } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, CheckCircle2, FolderKanban, Users } from 'lucide-react';

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
import { TimeRangeTabs } from './_components/time-range-tabs';
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

  type StatAccent = { Icon: LucideIcon; iconColor: string; iconBg: string };

  const stats: Array<{ title: string; value: string; change: string } & StatAccent> = [
    {
      title: 'Total Members',
      value: String(metrics.members),
      change: '+2 this month',
      Icon: Users,
      iconColor: 'text-indigo-500/60',
      iconBg: 'bg-indigo-500/10',
    },
    {
      title: 'Active Projects',
      value: String(metrics.projects),
      change: '+1 this week',
      Icon: FolderKanban,
      iconColor: 'text-violet-600/60',
      iconBg: 'bg-violet-600/10',
    },
    {
      title: 'Tasks Completed',
      value: String(metrics.tasks),
      change: '+12 today',
      Icon: CheckCircle2,
      iconColor: 'text-emerald-600/60',
      iconBg: 'bg-emerald-600/10',
    },
    {
      title: 'Uptime',
      value: `${metrics.uptime}%`,
      change: rangeLabel,
      Icon: Activity,
      iconColor: 'text-amber-600/60',
      iconBg: 'bg-amber-600/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your workspace</p>
        </div>
        <Suspense fallback={<div className="bg-muted h-9 w-[130px] animate-pulse rounded-lg" />}>
          <TimeRangeTabs activePreset={timeRange.preset} />
        </Suspense>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="gap-4 border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                <div className={`rounded-md p-1.5 ${stat.iconBg}`}>
                  <stat.Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
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
