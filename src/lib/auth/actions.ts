'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { setSession } from './session';
import type { DemoSession } from './session';

// ---------- Validation ----------

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// ---------- Mock allowlist ----------

const ALLOWED_CREDENTIALS = {
  email: 'demo@launchlayer.dev',
  password: 'password123',
} as const;

// ---------- Demo session ----------

const DEMO_SESSION: DemoSession = {
  user: {
    id: 'usr_demo_01',
    name: 'Demo User',
    email: 'demo@launchlayer.dev',
  },
  workspace: {
    id: 'ws_01',
    name: 'Acme Corp',
    slug: 'acme-corp',
  },
  workspaces: [
    { id: 'ws_01', name: 'Acme Corp', slug: 'acme-corp' },
    { id: 'ws_02', name: 'Side Project', slug: 'side-project' },
  ],
};

// ---------- Action ----------

export interface LoginResult {
  fieldErrors?: Record<string, string[]>;
  error?: string;
}

export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (
    parsed.data.email !== ALLOWED_CREDENTIALS.email ||
    parsed.data.password !== ALLOWED_CREDENTIALS.password
  ) {
    return { error: 'Invalid credentials' };
  }

  await setSession(DEMO_SESSION);
  redirect('/app');
}
