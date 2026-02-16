'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { appNavItems, isActiveRoute } from '@/lib/navigation';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
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

          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={`block rounded-md px-3 py-2 text-sm ${
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {collapsed ? item.label[0] : item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        {!collapsed && (
          <p className="text-muted-foreground text-xs">Workspace Switcher</p>
        )}
      </div>
    </aside>
  );
}
