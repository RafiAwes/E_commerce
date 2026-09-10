import { readJson, writeJson } from "@/lib/storage";

/**
 * A tiny external store backed by localStorage.
 *
 * React's supported way to read browser-only state is `useSyncExternalStore`
 * rather than "set state inside an effect": the server snapshot is always the
 * fallback, so server HTML and the first client render agree, and hydration
 * happens the moment the first component subscribes.
 *
 * It also gives us cross-tab synchronisation for free — add something to your
 * bag in one tab and the other tab updates.
 */

export interface StoreSnapshot<T> {
  readonly value: T;
  /** False until localStorage has been read on the client. */
  readonly isHydrated: boolean;
}

export interface PersistentStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => StoreSnapshot<T>;
  getServerSnapshot: () => StoreSnapshot<T>;
  set: (updater: T | ((current: T) => T)) => void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
): PersistentStore<T> {
  // Identity matters: `getSnapshot` must return the same object until
  // something actually changes, or React will loop.
  const serverSnapshot: StoreSnapshot<T> = { value: fallback, isHydrated: false };
  let snapshot: StoreSnapshot<T> = serverSnapshot;
  const listeners = new Set<() => void>();

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function readFromStorage(): void {
    const stored = readJson(key, isValid);
    snapshot = { value: stored ?? fallback, isHydrated: true };
  }

  function handleStorageEvent(event: StorageEvent): void {
    if (event.key !== key) return;
    readFromStorage();
    emit();
  }

  return {
    subscribe(listener) {
      if (!snapshot.isHydrated) {
        readFromStorage();
        emit();
      }
      listeners.add(listener);
      window.addEventListener("storage", handleStorageEvent);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorageEvent);
      };
    },

    getSnapshot: () => snapshot,

    getServerSnapshot: () => serverSnapshot,

    set(updater) {
      const next = typeof updater === "function" ? (updater as (current: T) => T)(snapshot.value) : updater;
      snapshot = { value: next, isHydrated: true };
      writeJson(key, next);
      emit();
    },
  };
}
