import { cookies } from 'next/headers';

// ---------- Types ----------

export interface DemoUser {
  id: string;
  name: string;
  email: string;
}

export interface DemoWorkspace {
  id: string;
  name: string;
  slug: string;
}

export interface DemoSession {
  user: DemoUser;
  workspaceId: string;
  workspaces: DemoWorkspace[];
}

// ---------- Constants ----------

export const COOKIE_NAME = '__ll_session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

// ---------- Helpers ----------

export async function getSession(): Promise<DemoSession | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    return JSON.parse(decoded) as DemoSession;
  } catch {
    return null;
  }
}

export async function setSession(session: DemoSession): Promise<void> {
  const jar = await cookies();
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64');
  jar.set(COOKIE_NAME, encoded, COOKIE_OPTIONS);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function updateSession(
  patch: Partial<DemoSession>,
): Promise<void> {
  const current = await getSession();
  if (!current) throw new Error('No session found');
  await setSession({ ...current, ...patch });
}
