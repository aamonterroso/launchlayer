'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { appNavItems, isActiveRoute } from '@/lib/navigation';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={`bg-sidebar flex flex-col border-r transition-all ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <span className="text-sm font-semibold">LaunchLayer</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {appNavItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

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
        <div className="border-t p-4">
          {!collapsed && (
            <p className="text-muted-foreground text-xs">Workspace Switcher</p>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
