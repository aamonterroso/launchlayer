import * as React from 'react';

import { cn } from '@/lib/utils';

// Derives up to 2 uppercase initials from a display name.
// Falls back to the first character of the fallback string (e.g. email).
export function getInitials(name: string, fallback = ''): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return (fallback[0] ?? '?').toUpperCase();
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

interface AvatarProps extends React.ComponentProps<'span'> {
  initials: string;
}

function Avatar({ initials, className, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      aria-hidden="true"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium select-none',
        className,
      )}
      {...props}
    >
      {initials}
    </span>
  );
}

export { Avatar };
