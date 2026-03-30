# global-use-state

A drop-in global `useState`. No Provider. No store file. No config.

```ts
const [user, setUser] = useGlobalState('user', null);
```

[![npm](https://img.shields.io/npm/v/global-use-state)](https://www.npmjs.com/package/global-use-state)
[![bundle size](https://img.shields.io/bundlephobia/minzip/global-use-state)](https://bundlephobia.com/package/global-use-state)

---

## Install

```bash
npm install global-use-state
```

> **Peer dependency:** React 18+ (uses `useSyncExternalStore` under the hood)

## Usage

### Basic

```tsx
import { useGlobalState } from 'global-use-state';

function Counter() {
  const [count, setCount] = useGlobalState('count', 0);
  return <button onClick={() => setCount(prev => prev + 1)}>{count}</button>;
}

function Display() {
  const [count] = useGlobalState('count', 0);
  return <p>Count is {count}</p>;
}
```

Both components share the same `count`. No Context Provider needed.

### Typed Keys (optional)

Augment the `GlobalState` interface once and get full type inference everywhere:

```ts
// global.d.ts
declare module 'global-use-state' {
  interface GlobalState {
    user: User | null;
    theme: 'light' | 'dark';
    count: number;
  }
}
```

```tsx
// ✅ key is autocompleted, value is inferred — no annotation needed
const [theme, setTheme] = useGlobalState('theme', 'light');
```

### Outside React

Read/write state from non-component code (event handlers, utils, etc.):

```ts
import { getGlobalState, setGlobalState } from 'global-use-state';

setGlobalState('theme', 'dark');
console.log(getGlobalState('theme')); // 'dark'
```

## Comparison

| Feature | Context API | Zustand | global-use-state |
|---|---|---|---|
| **Boilerplate** | High (Providers) | Medium (Store files) | **Zero** |
| **Learning Curve** | Low | Medium | **Zero** (just `useState`) |
| **Re-renders** | Global (unless optimized) | Selective (Selectors) | **Selective** (per key) |
| **Bundle Size** | 0 (Built-in) | ~1.2KB | **< 500B** |
| **Usage** | Hooks | Hooks | **Hooks** |

## Demo

- [CodeSandbox Demo](https://codesandbox.io/s/global-use-state-demo-forked-8z9z8z) (Coming soon)
- [Example Repository](https://github.com/MonaSweataSK/use-global-store/tree/main/example)

## How It Works

| Concept | Detail |
|---|---|
| **Store** | Module-level `Map` — singleton per bundle |
| **Subscriptions** | Per-key `Set<Listener>` — updating key `A` never re-renders subscribers of key `B` |
| **Concurrent safety** | `useSyncExternalStore` prevents tearing under React 18 concurrent mode |
| **SSR** | Server snapshot returns `undefined` — hydrates correctly on the client |
| **Initial value** | First caller for a key sets the value. Subsequent `initialValue` args are ignored |

## API

### `useGlobalState(key, initialValue)`

```ts
const [value, setValue] = useGlobalState(key, initialValue);
```

Behaves identically to `useState`. The setter accepts a value or a functional updater (`prev => next`).

### `getGlobalState(key)`

Read a value outside React.

### `setGlobalState(key, value)`

Write a value outside React. Triggers re-renders in all subscribed components.

## Bundle Size

**< 500 bytes** gzipped. Zero dependencies beyond React.

## License

MIT
