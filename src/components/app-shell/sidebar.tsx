'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { appNavItems, isActiveRoute } from '@/lib/navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import type { DemoWorkspace } from '@/lib/auth/session';

type SidebarNavItem = { label: string; href: string };

const iconMap = appNavItems.reduce<Record<string, LucideIcon>>(
  (acc, n) => { acc[n.href] = n.icon; return acc; },
  {},
);

export interface SidebarProps {
  activeWorkspace: DemoWorkspace | null;
  workspaces: DemoWorkspace[];
  navItems: SidebarNavItem[];
}

export function Sidebar({ activeWorkspace, workspaces, navItems }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={`bg-sidebar flex flex-col border-r transition-all ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header: clean 2-row layout */}
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            {!collapsed && (
              <span className="text-sm font-semibold">LaunchLayer</span>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="shrink-0"
            >
              {collapsed ? '→' : '←'}
            </Button>
          </div>

          {/* Workspace row (aligned with nav padding) */}
          <div className={`${collapsed ? 'px-2 pb-3' : 'px-4 pb-3'}`}>
            <div className={`${collapsed ? 'flex justify-center' : ''}`}>
              <WorkspaceSwitcher
                activeWorkspace={activeWorkspace}
                workspaces={workspaces}
                collapsed={collapsed}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = iconMap[item.href] ?? LayoutDashboard;

            const link = (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  active
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
