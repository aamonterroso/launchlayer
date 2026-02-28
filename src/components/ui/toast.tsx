'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

// ---------- Types ----------

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ---------- Tiny global store ----------

const AUTO_DISMISS_MS = 4500;

let state: Toast[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function remove(id: string) {
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);

  state = state.filter((t) => t.id !== id);
  emit();
}

export function toast(type: ToastType, message: string) {
  const id =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : String(Date.now());

  state = [...state.slice(-4), { id, type, message }];
  emit();

  const timer = setTimeout(() => remove(id), AUTO_DISMISS_MS);
  timers.set(id, timer);
}

export function useToast() {
  return { toast };
}

// ---------- Viewport (mount once in layout) ----------

export function Toaster() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Safety: clear timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => remove(id), []);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed top-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}

// ---------- Item ----------

const ICON: Record<ToastType, string> = { success: '✓', error: '✗', info: 'i' };

const ITEM_CLASS: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className={`pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm shadow-sm ${ITEM_CLASS[toast.type]}`}
    >
      <span className="mt-0.5 shrink-0 font-bold" aria-hidden>
        {ICON[toast.type]}
      </span>
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="mt-0.5 shrink-0 opacity-50 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
