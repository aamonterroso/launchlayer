'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '' },
  { label: 'Members', href: '/members' },
  { label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;

  return (
    <aside
      className={`bg-sidebar flex flex-col border-r transition-all ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <span className="text-sm font-semibold">
            {workspaceId ?? 'Workspace'}
          </span>
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
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={`/${workspaceId}${item.href}`}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-sm"
          >
            {collapsed ? item.label[0] : item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        {!collapsed && (
          <p className="text-muted-foreground text-xs">Workspace Switcher</p>
        )}
      </div>
    </aside>
  );
}
