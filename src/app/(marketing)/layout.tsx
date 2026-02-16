import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            LaunchLayer
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} LaunchLayer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
