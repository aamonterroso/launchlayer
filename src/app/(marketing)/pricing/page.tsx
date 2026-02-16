import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Choose the plan that fits your team.
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.featured ? 'border-primary' : ''}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {plan.price}
                <span className="text-muted-foreground text-base font-normal">
                  /mo
                </span>
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button
                  className="w-full"
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const plans = [
  {
    name: 'Starter',
    description: 'For small teams getting started.',
    price: '$0',
    featured: false,
  },
  {
    name: 'Pro',
    description: 'For growing teams that need more.',
    price: '$29',
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations.',
    price: '$99',
    featured: false,
  },
];
