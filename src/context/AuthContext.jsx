import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Mock authentication only: there is no backend, so accounts live in localStorage.
const sha256 = async text => {
  if (!globalThis.crypto?.subtle) return btoa(text);
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
};

export const DEMO_ACCOUNT = { email: 'demo@rpkarongi.ac.rw', password: 'Demo@1234' };
const demoUser = () => ({
  id: 'u-demo', fullName: 'Demo Student', email: DEMO_ACCOUNT.email, phone: '+250780000000', demo: true,
  passwordHash: '2ac4757802ddfa9540f285b04d7ba282b55f206b9a4700c11010ebc410cdb4ab',
});

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('ocmp_users', () => [demoUser()]);
  const [sessionId, setSessionId] = useLocalStorage('ocmp_session', null);

  const user = useMemo(() => {
    const u = users.find(x => x.id === sessionId);
    if (!u) return null;
    const { passwordHash, ...safe } = u; // never expose the hash to the UI
    return safe;
  }, [users, sessionId]);

  const login = async (email, password) => {
    const u = users.find(x => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u || u.passwordHash !== (await sha256(password))) return { ok: false, error: 'Incorrect email or password' };
    setSessionId(u.id);
    return { ok: true };
  };

  const signup = async ({ fullName, email, phone, password }) => {
    if (users.some(x => x.email.toLowerCase() === email.trim().toLowerCase()))
      return { ok: false, error: 'An account with this email already exists. Log in instead.' };
    const id = `u-${Date.now()}`;
    const passwordHash = await sha256(password);
    setUsers(p => [...p, { id, fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), passwordHash }]);
    setSessionId(id);
    return { ok: true };
  };

  const logout = () => setSessionId(null);

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>;
}
