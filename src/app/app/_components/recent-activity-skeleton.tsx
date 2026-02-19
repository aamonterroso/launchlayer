import 'server-only';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-4">
        <div className="bg-muted-foreground/15 h-5 w-36 animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-4 w-52 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="divide-y">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="bg-muted-foreground/15 h-4 w-2/3 animate-pulse rounded" />
            <div className="bg-muted-foreground/15 h-3 w-16 animate-pulse rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
