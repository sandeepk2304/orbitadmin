import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * AuthContextType Definition
 */
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials updated for OrbitAdmin
const DEMO_EMAIL    = 'admin@orbitadmin.com';
const DEMO_PASSWORD = 'admin123';

/**
 * AuthProvider Component
 * 
 * Provides session management, authentication status, login/logout handlers.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const login = async (email: string, password: string) => {
    // Simulate network delay for premium visual responsiveness
    await new Promise(r => setTimeout(r, 600));
    
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('auth', 'true');
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook: useAuth
 * 
 * Hook to easily access authentication functions.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
