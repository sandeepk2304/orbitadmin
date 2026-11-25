import { createContext, useContext } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export interface ThemeValue {
  /** What the user picked. */
  theme: ThemeChoice;
  /** What is on screen once 'system' is resolved. */
  resolved: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
  /** Flip between light and dark; from 'system' it flips away from what is shown. */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
