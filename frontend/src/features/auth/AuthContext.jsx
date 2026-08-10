import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, logoutRequest, meRequest } from '../../api/auth.api';
import { setStoredTokens, clearStoredTokens, getStoredTokens } from '../../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const { accessToken } = getStoredTokens();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await meRequest();
        setUser(me);
      } catch {
        clearStoredTokens();
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login({ email, password, tenantSlug }) {
    const result = await loginRequest({ email, password, tenantSlug });
    setStoredTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch {
      // even if the server call fails, clear the local session
    }
    clearStoredTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}