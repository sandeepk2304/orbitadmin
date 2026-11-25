import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/theme';
import type { ThemeChoice } from '../context/theme';

const OPTIONS: Array<{ value: ThemeChoice; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

/**
 * Three-state segmented control. 'system' is shown rather than hidden, because
 * a user who never picks a side still deserves to see which side they are on.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-0.5 dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`cursor-pointer rounded-full p-1.5 transition-colors ${
              active
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-[#242435] dark:text-white'
                : 'text-gray-400 hover:text-gray-700 dark:text-[#8a8a9e] dark:hover:text-white'
            }`}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}

/** Compact single-button variant for dense headers. */
export function ThemeToggleButton({ className = '' }: { className?: string }) {
  const { resolved, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:text-[#11191f] dark:text-[#8a8a9e] dark:hover:text-white ${className}`}
    >
      {resolved === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
