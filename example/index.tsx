import React from 'react';
import { createRoot } from 'react-dom/client';
import { useGlobalState } from '../src/index';

function Counter() {
  const [count, setCount] = useGlobalState('count', 0);
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
      <h3>Counter Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => (c as number) + 1)}>Increment</button>
      <button onClick={() => setCount((c) => (c as number) - 1)}>Decrement</button>
    </div>
  );
}

function Display() {
  const [count] = useGlobalState('count', 0);
  return (
    <div style={{ padding: '1rem', border: '1px solid #eee', margin: '1rem' }}>
      <h3>Display Component</h3>
      <p>The global count is: <strong>{count}</strong></p>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>global-use-state Demo</h1>
      <p>These components share the same state without a Provider.</p>
      <Counter />
      <Display />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
