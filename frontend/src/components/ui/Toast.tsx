"use client";

import { Check, Heart, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cn, createId } from "@/lib/utils";

export type ToastTone = "success" | "info" | "wishlist";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Optional inline link, e.g. "View cart". */
  action?: { label: string; href: string };
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <Check aria-hidden className="size-4" />,
  info: <Info aria-hidden className="size-4" />,
  wishlist: <Heart aria-hidden className="size-4 fill-current" />,
};

const toneStyles: Record<ToastTone, string> = {
  success: "bg-foreground text-background",
  info: "bg-foreground text-background",
  wishlist: "bg-burgundy text-white",
};

/**
 * Lightweight toast system.
 *
 * Feedback is announced through a polite live region rather than only being
 * shown, so cart and wishlist changes reach screen-reader users too.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = createId("toast");
      // Cap the stack so rapid add-to-cart clicks do not bury the page.
      setToasts((current) => [...current.slice(-2), { id, ...options }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-110 flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-6 md:bottom-6 md:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-card px-4 py-3 shadow-overlay",
              toneStyles[toast.tone ?? "success"],
            )}
          >
            <span className="mt-0.5 shrink-0 opacity-90">{toneIcon[toast.tone ?? "success"]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description ? <p className="mt-0.5 truncate text-xs opacity-80">{toast.description}</p> : null}
              {toast.action ? (
                <a href={toast.action.href} className="mt-1.5 inline-block text-xs font-medium underline underline-offset-4">
                  {toast.action.label}
                </a>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-mt-0.5 -mr-1 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}
