import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Unknown URLs used to `<Navigate to="/" replace />`, which dropped the
 * visitor on the marketing landing page with no indication that anything had
 * gone wrong — a mistyped admin URL looked exactly like a successful visit to
 * the homepage, and the broken link was lost.
 */
export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50/50 dark:bg-[#0d0d14] px-4 font-sans transition-colors">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-[#11191f] dark:text-white">
          That page does not exist
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-[#8a8a9e]">
          Nothing is served at{' '}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[13px] text-indigo-600 dark:bg-white/5 dark:text-indigo-300">
            {pathname}
          </code>
          . It may have been renamed, or the link may be wrong.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            {isAuthenticated ? 'Back to dashboard' : 'Sign in'}
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-white dark:border-white/10 dark:text-[#8a8a9e] dark:hover:bg-white/5"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
