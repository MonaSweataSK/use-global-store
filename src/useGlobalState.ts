import { useSyncExternalStore, useCallback, useRef } from 'react';
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setState,
  initKey,
  type GlobalState,
} from './store';

// ─── Overloads ───────────────────────────────────────────────────────────────

/**
 * Typed-key overload — when `GlobalState` has been augmented via declaration
 * merging, the key and value types are inferred automatically.
 */
export function useGlobalState<K extends keyof GlobalState>(
  key: K,
  initialValue: GlobalState[K],
): [GlobalState[K], (value: GlobalState[K] | ((prev: GlobalState[K]) => GlobalState[K])) => void];

/**
 * Generic overload — works for any string key with an explicit or inferred type.
 */
export function useGlobalState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void];

// ─── Implementation ─────────────────────────────────────────────────────────

export function useGlobalState(
  key: string,
  initialValue: unknown,
): [unknown, (value: unknown) => void] {
  // Seed on first call — subsequent calls with different initialValue are no-ops
  initKey(key, initialValue);

  // Stable subscribe function scoped to this key
  const subscribeFn = useCallback(
    (cb: () => void) => subscribe(key, cb),
    [key],
  );

  // Stable snapshot getters scoped to this key
  const getSnapshotFn = useCallback(() => getSnapshot(key), [key]);
  const getServerSnapshotFn = useCallback(() => getServerSnapshot(key) ?? initialValue, [key, initialValue]);

  const value = useSyncExternalStore(subscribeFn, getSnapshotFn, getServerSnapshotFn);

  // Keep key in a ref so the setter identity is stable across renders
  const keyRef = useRef(key);
  keyRef.current = key;

  const setter = useCallback(
    (valueOrUpdater: unknown) => {
      setState(keyRef.current, valueOrUpdater);
    },
    [],
  );

  return [value, setter];
}
