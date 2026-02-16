import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Build better products,
          <br />
          <span className="text-primary">ship faster.</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
          LaunchLayer gives your team the tools to collaborate, iterate, and
          launch with confidence.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 border-t py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">
            Everything you need
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            A complete platform for teams of all sizes.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-lg border p-6"
              >
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground mt-4">
            Start your free trial today. No credit card required.
          </p>
          <Link href="/register" className="mt-8 inline-block">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: 'Workspace Management',
    description:
      'Organize your projects into workspaces with fine-grained access controls.',
  },
  {
    title: 'Team Collaboration',
    description:
      'Invite team members, assign roles, and collaborate in real time.',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Get actionable insights with built-in analytics and reporting.',
  },
];
