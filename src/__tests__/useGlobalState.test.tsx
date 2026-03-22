import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGlobalState } from '../useGlobalState';
import { __resetStore, getGlobalState, setGlobalState } from '../store';

beforeEach(() => {
  __resetStore();
});

describe('useGlobalState', () => {
  it('returns the initial value', () => {
    const { result } = renderHook(() => useGlobalState('count', 0));
    expect(result.current[0]).toBe(0);
  });

  it('updates value via setter', () => {
    const { result } = renderHook(() => useGlobalState('count', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useGlobalState('count', 10));

    act(() => {
      result.current[1]((prev: number) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('shares state across components using the same key', () => {
    const { result: hookA } = renderHook(() => useGlobalState('shared', 'hello'));
    const { result: hookB } = renderHook(() => useGlobalState('shared', 'ignored'));

    // Both see the initial value set by the first caller
    expect(hookA.current[0]).toBe('hello');
    expect(hookB.current[0]).toBe('hello');

    // Update from one is visible to both
    act(() => {
      hookA.current[1]('world');
    });

    expect(hookA.current[0]).toBe('world');
    expect(hookB.current[0]).toBe('world');
  });

  it('isolates different keys', () => {
    const { result: countHook } = renderHook(() => useGlobalState('count', 0));
    const { result: nameHook } = renderHook(() => useGlobalState('name', 'Alice'));

    act(() => {
      countHook.current[1](99);
    });

    expect(countHook.current[0]).toBe(99);
    expect(nameHook.current[0]).toBe('Alice'); // unaffected
  });

  it('first caller wins — subsequent initialValue is ignored', () => {
    const { result: first } = renderHook(() => useGlobalState('key', 'first'));
    const { result: second } = renderHook(() => useGlobalState('key', 'second'));

    expect(first.current[0]).toBe('first');
    expect(second.current[0]).toBe('first'); // "second" is ignored
  });

  it('bails out on same-value set (no re-render)', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useGlobalState('stable', 'value');
    });

    const countAfterMount = renderCount;

    act(() => {
      result.current[1]('value'); // same value
    });

    expect(renderCount).toBe(countAfterMount); // no extra render
  });
});

describe('imperative API', () => {
  it('getGlobalState reads the current value', () => {
    renderHook(() => useGlobalState('token', 'abc'));
    expect(getGlobalState('token')).toBe('abc');
  });

  it('setGlobalState writes and notifies subscribers', () => {
    const { result } = renderHook(() => useGlobalState('token', 'abc'));

    act(() => {
      setGlobalState('token', 'xyz');
    });

    expect(result.current[0]).toBe('xyz');
    expect(getGlobalState('token')).toBe('xyz');
  });
});
