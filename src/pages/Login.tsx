import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrbitLogo from '../components/OrbitLogo';
import ThemeToggle from '../components/ThemeToggle';

// Zod validation schema
const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
});

type FormData = z.infer<typeof schema>;

/**
 * Blob Decorative Sub-component
 */
function Blob({ className }: { className: string }) {
  return (
    <div className={`absolute rounded-[60%_40%_50%_60%/50%_60%_40%_50%] opacity-20 dark:opacity-10 ${className}`} />
  );
}

/**
 * Login Component
 * 
 * Purpose:
 * Renders the credentials validation page.
 * Authenticates sandbox login via AuthContext.
 */
/**
 * Where to go after signing in.
 *
 * Only ever an in-app path: a `next` of `https://evil.example` would make the
 * login form an open redirect, which is a phishing primitive — the victim
 * really did land on this site, then got bounced somewhere that looks like it.
 */
function safeNext(search: string): string {
  const raw = new URLSearchParams(search).get('next');
  if (!raw) return '/dashboard';
  const decoded = decodeURIComponent(raw);
  return decoded.startsWith('/') && !decoded.startsWith('//') ? decoded : '/dashboard';
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const next = safeNext(search);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  // Redirect if already logged in
  if (isAuthenticated) return <Navigate to={next} replace />;

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate(next, { replace: true });
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 dark:bg-[#0d0d14] flex items-center justify-center relative overflow-hidden px-4 transition-colors duration-200 font-sans">
      {/* The login screen is a full page in its own right: someone who lands
          here first should be able to set the theme without signing in. */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background decorative blobs */}
      <Blob className="w-80 h-80 bg-indigo-300 -top-10 -left-10 blur-xl" />
      <Blob className="w-64 h-64 bg-purple-300 top-1/4 -left-8 blur-lg" />
      <Blob className="w-48 h-48 bg-blue-200 bottom-20 left-16 blur-md" />
      <Blob className="w-72 h-72 bg-pink-200 -top-8 -right-10 blur-xl" />
      <Blob className="w-56 h-56 bg-indigo-200 top-1/3 -right-6 blur-lg" />

      {/* Card Wrapper */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a1a27] rounded-3xl shadow-xl px-10 py-10 border border-slate-100 dark:border-white/5 transition-colors">

        {/* Logo and branding */}
        <div className="flex items-center justify-center mb-6">
          <OrbitLogo showText />
        </div>

        {/* Heading */}
        <h1 className="text-center text-xl font-bold text-[#11191f] dark:text-white">
          Great to see you here 👋
        </h1>
        <p className="text-center text-sm text-slate-400 dark:text-slate-400 mt-1 mb-6 font-semibold">
          Enter sandbox credentials to view the dashboard portal.
        </p>

        {/* Third-party social button alternatives */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Login
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Login
          </button>
        </div>

        {/* Separator line */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Continue with Email</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
        </div>

        {/* Display service verification errors */}
        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="admin@orbitadmin.com"
              {...register('email')}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-slate-200 dark:border-white/10 focus:ring-indigo-300 focus:border-indigo-400'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-slate-200 dark:border-white/10 focus:ring-indigo-300 focus:border-indigo-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('remember')} className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Keep me signed in</span>
            </label>
            <button type="button" className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-bold transition-colors cursor-pointer">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer mt-2"
          >
            {isSubmitting ? 'Verifying Sandbox Session…' : 'Sign In'}
          </button>
        </form>

        {/* Demo Hint Credential Box — clickable, because asking someone to
            retype a password that is printed two lines above the field is a
            transcription exercise, not a login. */}
        <button
          type="button"
          onClick={() => {
            setValue('email', 'admin@orbitadmin.com', { shouldValidate: true });
            setValue('password', 'admin123', { shouldValidate: true });
          }}
          className="w-full mt-5 px-3 py-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/[0.04] border border-indigo-100/50 dark:border-indigo-500/10 cursor-pointer transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
        >
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold text-center">
            Demo credentials — tap to fill
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold text-center mt-0.5">
            Email: <span className="text-[#11191f] dark:text-white font-bold">admin@orbitadmin.com</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold text-center mt-0.5">
            Password: <span className="text-[#11191f] dark:text-white font-bold">admin123</span>
          </p>
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5 font-bold">
          New here?{' '}
          <button type="button" onClick={() => navigate('/')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
            Explore public tour
          </button>
        </p>
      </div>
    </div>
  );
}
