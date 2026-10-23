import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * ThemeContext
 *
 * One owner for the theme. Previously two components each kept their own
 * `useState` copy and wrote `localStorage` independently, so they could
 * disagree, and the toggle only existed inside the admin shell — the landing
 * page and login screen had no way to switch and no way to read the choice.
 *
 * 'system' is a real third state, not a default that collapses to light: it
 * follows the OS and keeps following it when the OS flips mid-session.
 */
export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_KEY = 'theme';

interface ThemeValue {
  /** What the user picked. */
  theme: ThemeChoice;
  /** What is actually on screen once 'system' is resolved. */
  resolved: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
  /** Flip between light and dark; from 'system' it flips away from what is shown. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function readStored(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* private mode / storage disabled */
  }
  return 'system';
}

function systemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function apply(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  // Lets the browser paint form controls, scrollbars and the canvas to match.
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(readStored);
  const [system, setSystem] = useState<ResolvedTheme>(systemTheme);

  // Keep following the OS while the choice is 'system'.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = theme === 'system' ? system : theme;

  useEffect(() => {
    apply(resolved);
  }, [resolved]);

  const setTheme = useCallback((t: ThemeChoice) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* the class is still applied; only the memory is lost */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setTheme]);

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggleTheme }),
    [theme, resolved, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
