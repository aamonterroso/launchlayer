import { RecentActivitySkeleton } from './_components/recent-activity-skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-muted-foreground/15 h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-4 w-64 animate-pulse rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted-foreground/15 h-32 animate-pulse rounded-xl" />
        ))}
      </div>
      <RecentActivitySkeleton />
    </div>
  );
}
