// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Declaration-merging interface. Users can augment this to get typed keys:
 *
 * ```ts
 * declare module 'global-use-state' {
 *   interface GlobalState {
 *     theme: 'light' | 'dark';
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GlobalState {}

type Listener = () => void;
type SetStateAction<T> = T | ((prev: T) => T);

// ─── Singleton store ─────────────────────────────────────────────────────────

const store = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();

// ─── Internal helpers ────────────────────────────────────────────────────────

function ensureListenerSet(key: string): Set<Listener> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set<Listener>();
    listeners.set(key, set);
  }
  return set;
}

/**
 * Subscribe a callback to a specific key. Returns an unsubscribe function.
 * Used internally by `useSyncExternalStore`.
 */
export function subscribe(key: string, callback: Listener): () => void {
  const set = ensureListenerSet(key);
  set.add(callback);
  return () => {
    set.delete(callback);
  };
}

/**
 * Read the current snapshot for a key.
 */
export function getSnapshot<T>(key: string): T {
  return store.get(key) as T;
}

/**
 * Server snapshot — returns `undefined` so SSR renders a consistent shell.
 */
export function getServerSnapshot<T>(_key: string): T | undefined {
  return undefined;
}

/**
 * Set state for a key. Supports direct values and functional updaters.
 * Only notifies listeners subscribed to this specific key.
 */
export function setState<T>(key: string, valueOrUpdater: SetStateAction<T>): void {
  const prev = store.get(key) as T;
  const next =
    typeof valueOrUpdater === 'function'
      ? (valueOrUpdater as (prev: T) => T)(prev)
      : valueOrUpdater;

  // Bail out if value hasn't changed (shallow equality)
  if (Object.is(prev, next)) return;

  store.set(key, next);

  // Notify only this key's subscribers
  const set = listeners.get(key);
  if (set) {
    set.forEach((cb) => cb());
  }
}

/**
 * Seed the store with an initial value for a key, **only if the key is not
 * already present**. First caller wins.
 */
export function initKey<T>(key: string, initialValue: T): void {
  if (!store.has(key)) {
    store.set(key, initialValue);
  }
}

// ─── Imperative public API (Phase 2 helpers) ────────────────────────────────

/**
 * Read a global state value outside of React.
 */
export function getGlobalState<K extends keyof GlobalState>(key: K): GlobalState[K];
export function getGlobalState<T>(key: string): T;
export function getGlobalState(key: string): unknown {
  return store.get(key);
}

/**
 * Write a global state value outside of React.
 */
export function setGlobalState<K extends keyof GlobalState>(
  key: K,
  value: SetStateAction<GlobalState[K]>,
): void;
export function setGlobalState<T>(key: string, value: SetStateAction<T>): void;
export function setGlobalState(key: string, value: SetStateAction<unknown>): void {
  setState(key, value);
}

// ─── Test-only: reset everything ─────────────────────────────────────────────

/** @internal — exposed for tests only */
export function __resetStore(): void {
  store.clear();
  listeners.clear();
}
