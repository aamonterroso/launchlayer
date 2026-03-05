import type { MemberRole } from '@/lib/demo/workspace-data';

export type { MemberRole };

// Single source of truth for valid member role values.
// Typed as non-empty tuple for z.enum() compatibility.
export const MEMBER_ROLES: [MemberRole, ...MemberRole[]] = [
  'Owner',
  'Admin',
  'Developer',
  'Designer',
  'Collaborator',
  'Maintainer',
  'Contributor',
  'Viewer',
];
