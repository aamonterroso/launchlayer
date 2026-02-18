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
