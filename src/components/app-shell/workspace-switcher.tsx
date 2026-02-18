'use client';

import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { switchWorkspace } from '@/lib/auth/actions';
import type { DemoWorkspace } from '@/lib/auth/session';

export interface WorkspaceSwitcherProps {
  activeWorkspace: DemoWorkspace | null;
  workspaces: DemoWorkspace[];
  collapsed: boolean;
}

export function WorkspaceSwitcher({
  activeWorkspace,
  workspaces,
  collapsed,
}: WorkspaceSwitcherProps) {
  const router = useRouter();

  async function handleSwitch(id: string) {
    if (id === activeWorkspace?.id) return;
    await switchWorkspace(id);
    router.refresh();
  }

  const menuItems = (
    <>
      <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {workspaces.map((ws) => (
        <DropdownMenuItem
          key={ws.id}
          onSelect={() => handleSwitch(ws.id)}
          className="flex items-center justify-between"
        >
          <span className="truncate">{ws.name}</span>
          {ws.id === activeWorkspace?.id && (
            <Check className="ml-2 h-4 w-4 shrink-0" />
          )}
        </DropdownMenuItem>
      ))}
    </>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-muted/40 hover:bg-accent h-9 w-9 justify-center rounded-md border shadow-sm"
            aria-label="Switch workspace"
          >
            <span className="text-xs font-semibold uppercase">
              {activeWorkspace?.name?.[0] ?? '?'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-56 border shadow-md"
        >
          {menuItems}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-muted/40 hover:bg-accent h-9 w-full justify-between rounded-md border px-3 shadow-sm"
          aria-label="Switch workspace"
        >
          <span className="truncate text-sm font-medium">
            {activeWorkspace?.name ?? 'No workspace'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 border shadow-md">
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
