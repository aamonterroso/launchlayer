'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession, setSession, updateSession } from './session';
import { sleep } from '@/lib/utils/sleep';
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
  workspaceId: 'ws_01',
  workspaces: [
    { id: 'ws_01', name: 'Acme Corp', slug: 'acme-corp' },
    { id: 'ws_02', name: 'Side Project', slug: 'side-project' },
    { id: 'ws_03', name: 'Open Source', slug: 'open-source' },
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

// ---------- Switch workspace ----------

const switchWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

export interface SwitchWorkspaceResult {
  error?: string;
}

export async function switchWorkspace(
  workspaceId: string,
): Promise<SwitchWorkspaceResult> {
  const parsed = switchWorkspaceSchema.safeParse({ workspaceId });
  if (!parsed.success) return { error: 'Invalid workspace ID' };

  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const exists = session.workspaces.some(
    (ws) => ws.id === parsed.data.workspaceId,
  );
  if (!exists) return { error: 'Workspace not found' };
  await updateSession({ workspaceId: parsed.data.workspaceId });
  // Only for demo purposes: simulate a delay to show loading state in UI
  // remove when real API calls are implemented
  if (process.env.NODE_ENV === 'development') await sleep(600);
  // revalidatePath busts RSC cache; router.refresh() (client-side) triggers re-fetch
  revalidatePath('/app', 'layout');
  return {};
}
