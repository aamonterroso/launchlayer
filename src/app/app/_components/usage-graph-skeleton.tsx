import 'server-only';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function UsageGraphSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="space-y-2">
          <div className="bg-muted-foreground/15 h-5 w-24 animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-52 animate-pulse rounded" />
        </div>
        <div className="space-y-1 text-right">
          <div className="bg-muted-foreground/15 ml-auto h-7 w-16 animate-pulse rounded" />
          <div className="bg-muted-foreground/15 ml-auto h-3 w-14 animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="bg-muted-foreground/15 h-3 w-14 animate-pulse rounded" />
            <div className="bg-muted-foreground/15 h-2 flex-1 animate-pulse rounded-full" />
            <div className="bg-muted-foreground/15 h-3 w-10 animate-pulse rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
