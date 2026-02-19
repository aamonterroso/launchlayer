import 'server-only';

import {
  type ActivityItem,
  type UsagePoint,
  getRecentActivity as _getRecentActivity,
  getUsagePoints,
  metricsByWorkspaceId,
} from '@/lib/demo/workspace-data';

// Re-export activity type so consumers never touch workspace-data
export type { ActivityItem };

// ---------- Types ----------

export type DashboardRange = '7d' | '30d' | '90d';

export interface DashboardMetrics {
  members: number;
  projects: number;
  tasks: number;
  uptime: number;
}

export interface UsageSeries {
  label: string;
  unit?: string; // e.g. 'requests', 'ms', '%'
  period?: DashboardRange;
  points: Array<{ ts: string; value: number }>; // ts = ISO date string
}

// ---------- Helpers ----------

export function normalizeDashboardRange(input?: string): DashboardRange {
  if (input === '7d' || input === '30d' || input === '90d') return input;
  return '30d';
}

// ---------- Accessors ----------
// To swap mock → real API, replace only the body of each function.

export async function getDashboardMetrics(
  workspaceId: string,
  _range: DashboardRange,
): Promise<DashboardMetrics> {
  return metricsByWorkspaceId[workspaceId] ?? metricsByWorkspaceId.default!;
}

export async function getRecentActivity(
  workspaceId: string,
): Promise<ActivityItem[]> {
  return _getRecentActivity(workspaceId);
}

export async function getUsageSeries(
  workspaceId: string,
  range: DashboardRange,
): Promise<UsageSeries> {
  const points: UsagePoint[] = getUsagePoints(workspaceId);
  return { label: 'Requests', unit: 'requests', period: range, points };
}
