'use client';

import { useActionState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/auth/actions';
import type { LoginResult } from '@/lib/auth/actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginResult | null, FormData>(
    loginAction,
    null,
  );

  return (
    <Card>
      <form action={action}>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" type="button" disabled>
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            {state?.fieldErrors?.email && (
              <p className="text-destructive text-xs">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-muted-foreground text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" />
            {state?.fieldErrors?.password && (
              <p className="text-destructive text-xs">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
