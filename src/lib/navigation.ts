import { LayoutDashboard, Settings, Users } from 'lucide-react';

export const appNavItems = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Members', href: '/app/members', icon: Users },
  { label: 'Settings', href: '/app/settings', icon: Settings },
] as const;

export const routeTitles: Record<string, string> = Object.fromEntries(
  appNavItems.map((item) => [item.href, item.label]),
);

export function getRouteTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];

  for (const item of appNavItems) {
    if (item.href !== '/app' && pathname.startsWith(item.href + '/')) {
      return item.label;
    }
  }

  return 'Dashboard';
}

export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/app') return pathname === '/app';
  return pathname === href || pathname.startsWith(href + '/');
}
