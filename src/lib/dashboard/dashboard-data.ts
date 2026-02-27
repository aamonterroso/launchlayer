import 'server-only';

import {
  type ActivityItem,
  type UsagePoint,
  getRecentActivity as _getRecentActivity,
  getUsagePoints,
  metricsByWorkspaceId,
} from '@/lib/demo/workspace-data';
import {
  type TimeRange,
  type TimeRangePreset,
} from '@/lib/time-range/time-range';

// Re-export activity type so consumers never touch workspace-data
export type { ActivityItem };

// ---------- Types ----------

/** @deprecated Use TimeRangePreset from @/lib/time-range/time-range */
export type DashboardRange = TimeRangePreset;

export interface DashboardMetrics {
  members: number;
  projects: number;
  tasks: number;
  uptime: number;
}

export interface UsageSeries {
  label: string;
  unit?: string;
  period?: TimeRangePreset;
  points: Array<{ ts: string; value: number }>;
}

// ---------- Accessors ----------
// To swap mock → real API, replace only the body of each function.

export async function getDashboardMetrics({
  workspaceId,
  timeRange: _timeRange,
}: {
  workspaceId: string;
  timeRange: TimeRange;
}): Promise<DashboardMetrics> {
  return metricsByWorkspaceId[workspaceId] ?? metricsByWorkspaceId.default!;
}

export async function getRecentActivity({
  workspaceId,
  timeRange: _timeRange,
}: {
  workspaceId: string;
  timeRange: TimeRange;
}): Promise<ActivityItem[]> {
  return _getRecentActivity(workspaceId);
}

export async function getUsageSeries({
  workspaceId,
  timeRange,
}: {
  workspaceId: string;
  timeRange: TimeRange;
}): Promise<UsageSeries> {
  const points: UsagePoint[] = getUsagePoints(workspaceId);
  return { label: 'Requests', unit: 'requests', period: timeRange.preset, points };
}
