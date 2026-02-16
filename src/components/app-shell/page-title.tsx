'use client';

import { usePathname } from 'next/navigation';
import { getRouteTitle } from '@/lib/navigation';

export function PageTitle() {
  const pathname = usePathname();
  return <>{getRouteTitle(pathname)}</>;
}
