import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/auth';
import OrbitLogo from '../components/OrbitLogo';
import ThemeToggle from '../components/ThemeToggle';

// Zod validation schema
const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
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
  // get() already decodes; decoding again would let %255C through as a backslash.
  const next = new URLSearchParams(search).get('next') ?? '';
  // One leading slash, not followed by a slash or a backslash: browsers read both as a host.
  return /^\/(?![/\\])/.test(next) ? next : '/dashboard';
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
    defaultValues: { email: '', password: '' },
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
