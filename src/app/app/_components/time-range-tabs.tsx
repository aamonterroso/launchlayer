'use client';

import { useCallback, useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type TimeRangePreset } from '@/lib/time-range/time-range';

const PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
];

interface TimeRangeTabsProps {
  activePreset: TimeRangePreset;
}

export function TimeRangeTabs({ activePreset }: TimeRangeTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleValueChange = useCallback(
    (value: string) => {
      const preset = PRESETS.find((p) => p.value === value)?.value;
      if (!preset || preset === activePreset) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set('range', preset);
      const qs = params.toString();

      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [activePreset, pathname, router, searchParams],
  );

  return (
    <Tabs value={activePreset} onValueChange={handleValueChange}>
      <TabsList className={isPending ? 'opacity-60 transition-opacity' : undefined}>
        {PRESETS.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
