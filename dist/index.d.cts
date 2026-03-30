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
interface GlobalState {
}
type SetStateAction<T> = T | ((prev: T) => T);
/**
 * Read a global state value outside of React.
 */
declare function getGlobalState<K extends keyof GlobalState>(key: K): GlobalState[K];
declare function getGlobalState<T>(key: string): T;
/**
 * Write a global state value outside of React.
 */
declare function setGlobalState<K extends keyof GlobalState>(key: K, value: SetStateAction<GlobalState[K]>): void;
declare function setGlobalState<T>(key: string, value: SetStateAction<T>): void;

/**
 * Typed-key overload — when `GlobalState` has been augmented via declaration
 * merging, the key and value types are inferred automatically.
 */
declare function useGlobalState<K extends keyof GlobalState>(key: K, initialValue: GlobalState[K]): [GlobalState[K], (value: GlobalState[K] | ((prev: GlobalState[K]) => GlobalState[K])) => void];
/**
 * Generic overload — works for any string key with an explicit or inferred type.
 */
declare function useGlobalState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void];

export { type GlobalState, getGlobalState, setGlobalState, useGlobalState };
