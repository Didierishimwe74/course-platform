import { useState, useEffect } from 'react';
export default function useLocalStorage(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch { /* ignore */ }
    return typeof init === 'function' ? init() : init;
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}
