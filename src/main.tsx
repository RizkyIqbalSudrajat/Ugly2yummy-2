// Ensure window.fetch has both getter and setter across all iframe environments
(() => {
  try {
    let currentFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => currentFetch,
      set: (fn) => {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  } catch {
    // Ignore if not patchable
  }
})();

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
