// ---------- Types ----------

export interface WorkspaceMetrics {
  members: number;
  projects: number;
  tasks: number;
  uptime: number;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'invited';
}

export interface WorkspaceSettings {
  plan: string;
  region: string;
  retentionDays: number;
  themePreference: 'light' | 'dark';
}

// ---------- Data ----------

export const metricsByWorkspaceId: Record<string, WorkspaceMetrics> = {
  ws_01: { members: 12, projects: 4, tasks: 89, uptime: 99.9 },
  ws_02: { members: 3, projects: 1, tasks: 17, uptime: 98.5 },
  ws_03: { members: 8, projects: 6, tasks: 143, uptime: 100 },
  default: { members: 0, projects: 0, tasks: 0, uptime: 0 },
};

export const membersByWorkspaceId: Record<string, WorkspaceMember[]> = {
  ws_01: [
    { id: 'm_01', name: 'Alice Nguyen', role: 'Owner', email: 'alice@acme.com', status: 'active' },
    { id: 'm_02', name: 'Bob Martinez', role: 'Admin', email: 'bob@acme.com', status: 'active' },
    { id: 'm_03', name: 'Carol Smith', role: 'Developer', email: 'carol@acme.com', status: 'active' },
    { id: 'm_04', name: 'David Lee', role: 'Developer', email: 'david@acme.com', status: 'active' },
    { id: 'm_05', name: 'Eva Chen', role: 'Designer', email: 'eva@acme.com', status: 'active' },
    { id: 'm_06', name: 'Frank Kim', role: 'Developer', email: 'frank@acme.com', status: 'invited' },
  ],
  ws_02: [
    { id: 'm_07', name: 'Grace Park', role: 'Owner', email: 'grace@side.dev', status: 'active' },
    { id: 'm_08', name: 'Henry Brown', role: 'Collaborator', email: 'henry@side.dev', status: 'active' },
    { id: 'm_09', name: 'Iris Wilson', role: 'Collaborator', email: 'iris@side.dev', status: 'invited' },
  ],
  ws_03: [
    { id: 'm_10', name: 'Jack Taylor', role: 'Maintainer', email: 'jack@oss.dev', status: 'active' },
    { id: 'm_11', name: 'Karen White', role: 'Contributor', email: 'karen@oss.dev', status: 'active' },
    { id: 'm_12', name: 'Leo Davis', role: 'Contributor', email: 'leo@oss.dev', status: 'active' },
    { id: 'm_13', name: 'Mia Johnson', role: 'Contributor', email: 'mia@oss.dev', status: 'invited' },
    { id: 'm_14', name: 'Noah Garcia', role: 'Contributor', email: 'noah@oss.dev', status: 'invited' },
  ],
  default: [],
};

export const settingsByWorkspaceId: Record<string, WorkspaceSettings> = {
  ws_01: { plan: 'Pro', region: 'us-east-1', retentionDays: 90, themePreference: 'light' },
  ws_02: { plan: 'Starter', region: 'eu-west-1', retentionDays: 30, themePreference: 'dark' },
  ws_03: { plan: 'Pro', region: 'us-west-2', retentionDays: 60, themePreference: 'light' },
  default: { plan: 'Free', region: 'us-east-1', retentionDays: 7, themePreference: 'light' },
};

// ---------- Activity ----------

export type ActivityVerb =
  | 'invited'
  | 'completed_task'
  | 'deployed'
  | 'updated_settings'
  | 'joined';

export interface ActivityItem {
  id: string;
  actor: string;
  verb: ActivityVerb;
  target: string;
  timestamp: string; // ISO 8601
}

const recentActivityByWorkspaceId: Record<string, ActivityItem[]> = {
  ws_01: [
    { id: 'a_01', actor: 'Alice Nguyen', verb: 'invited',          target: 'frank@acme.com',       timestamp: '2026-02-18T09:14:00Z' },
    { id: 'a_02', actor: 'Carol Smith',  verb: 'completed_task',   target: 'Auth token refresh',   timestamp: '2026-02-18T08:47:00Z' },
    { id: 'a_03', actor: 'Bob Martinez', verb: 'deployed',         target: 'v2.4.1 → production',  timestamp: '2026-02-17T22:05:00Z' },
    { id: 'a_04', actor: 'David Lee',    verb: 'completed_task',   target: 'DB migration script',  timestamp: '2026-02-17T16:30:00Z' },
    { id: 'a_05', actor: 'Alice Nguyen', verb: 'updated_settings', target: 'Data retention → 90d', timestamp: '2026-02-16T11:00:00Z' },
  ],
  ws_02: [
    { id: 'a_06', actor: 'Grace Park',  verb: 'invited',        target: 'iris@side.dev',     timestamp: '2026-02-18T10:00:00Z' },
    { id: 'a_07', actor: 'Henry Brown', verb: 'completed_task', target: 'Landing page copy', timestamp: '2026-02-17T14:20:00Z' },
    { id: 'a_08', actor: 'Grace Park',  verb: 'deployed',       target: 'v0.9.0 → staging',  timestamp: '2026-02-16T09:00:00Z' },
  ],
  ws_03: [
    { id: 'a_09', actor: 'Jack Taylor',  verb: 'deployed',       target: 'v3.1.0 → production', timestamp: '2026-02-18T07:30:00Z' },
    { id: 'a_10', actor: 'Karen White',  verb: 'completed_task', target: 'CI pipeline fix',     timestamp: '2026-02-18T06:15:00Z' },
    { id: 'a_11', actor: 'Leo Davis',    verb: 'joined',         target: 'oss-core',            timestamp: '2026-02-17T20:00:00Z' },
    { id: 'a_12', actor: 'Mia Johnson',  verb: 'invited',        target: 'noah@oss.dev',        timestamp: '2026-02-17T12:45:00Z' },
  ],
  default: [],
};

export function getRecentActivity(workspaceId: string): ActivityItem[] {
  return recentActivityByWorkspaceId[workspaceId] ?? recentActivityByWorkspaceId.default!;
}

// ---------- Usage ----------

export interface UsagePoint {
  ts: string;    // ISO date string (YYYY-MM-DD)
  value: number;
}

const usagePointsByWorkspaceId: Record<string, UsagePoint[]> = {
  ws_01: [
    { ts: '2026-02-12', value: 542 },
    { ts: '2026-02-13', value: 618 },
    { ts: '2026-02-14', value: 480 },
    { ts: '2026-02-15', value: 703 },
    { ts: '2026-02-16', value: 590 },
    { ts: '2026-02-17', value: 812 },
    { ts: '2026-02-18', value: 674 },
  ],
  ws_02: [
    { ts: '2026-02-12', value: 87  },
    { ts: '2026-02-13', value: 124 },
    { ts: '2026-02-14', value: 95  },
    { ts: '2026-02-15', value: 148 },
    { ts: '2026-02-16', value: 132 },
    { ts: '2026-02-17', value: 179 },
    { ts: '2026-02-18', value: 161 },
  ],
  ws_03: [
    { ts: '2026-02-12', value: 321 },
    { ts: '2026-02-13', value: 298 },
    { ts: '2026-02-14', value: 412 },
    { ts: '2026-02-15', value: 375 },
    { ts: '2026-02-16', value: 443 },
    { ts: '2026-02-17', value: 388 },
    { ts: '2026-02-18', value: 502 },
  ],
  default: [],
};

export function getUsagePoints(workspaceId: string): UsagePoint[] {
  return usagePointsByWorkspaceId[workspaceId] ?? usagePointsByWorkspaceId.default!;
}
