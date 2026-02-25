import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to view this page.
      </p>
      <Link
        href="/app"
        className="text-sm text-primary underline underline-offset-4 hover:opacity-80"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
