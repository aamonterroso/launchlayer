'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
  const [isPending, startTransition] = useTransition();

  async function doSwitch(id: string) {
    const result = await switchWorkspace(id);
    if (result.error) {
      console.error('[WorkspaceSwitcher] switch failed:', result.error);
      return;
    }
    router.refresh();
  }

  function handleSwitch(id: string) {
    if (id === activeWorkspace?.id) return;
    startTransition(() => {
      void doSwitch(id);
    });
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
            disabled={isPending}
            className="bg-muted/40 hover:bg-accent h-9 w-9 justify-center rounded-md border shadow-sm"
            aria-label="Switch workspace"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="text-xs font-semibold uppercase">
                {activeWorkspace?.name?.[0] ?? '?'}
              </span>
            )}
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
          {isPending ? (
            <span className="text-muted-foreground ml-2 flex shrink-0 items-center gap-1 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating…
            </span>
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 border shadow-md">
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
