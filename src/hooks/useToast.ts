import { useEffect, useState } from 'react';

import { TOAST_DURATION_MS } from '@/lib/constants';

export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
  variant: ToastVariant;
  durationMs: number;
}

type Listener = (toasts: ToastItem[]) => void;

const listeners = new Set<Listener>();
let toasts: ToastItem[] = [];

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function toast(input: ToastInput): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const item: ToastItem = {
    id,
    title: input.title,
    description: input.description,
    variant: input.variant ?? 'default',
    durationMs: input.durationMs ?? TOAST_DURATION_MS,
  };
  toasts = [...toasts, item];
  emit();
  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function useToast(): { toasts: ToastItem[]; toast: typeof toast; dismiss: typeof dismissToast } {
  const [snapshot, setSnapshot] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.add(setSnapshot);
    return () => {
      listeners.delete(setSnapshot);
    };
  }, []);

  return { toasts: snapshot, toast, dismiss: dismissToast };
}
