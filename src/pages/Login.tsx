import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
});

type FormData = z.infer<typeof schema>;

// Decorative blob shape for the background
function Blob({ className }: { className: string }) {
  return (
    <div className={`absolute rounded-[60%_40%_50%_60%/50%_60%_40%_50%] opacity-30 ${className}`} />
  );
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center relative overflow-hidden px-4">

      {/* Background decorative blobs */}
      <Blob className="w-64 h-64 bg-indigo-300 -top-10 -left-10" />
      <Blob className="w-48 h-48 bg-purple-300 top-1/4 -left-8" />
      <Blob className="w-32 h-32 bg-blue-200 bottom-20 left-16" />
      <Blob className="w-56 h-56 bg-pink-200 -top-8 -right-10" />
      <Blob className="w-40 h-40 bg-indigo-200 top-1/3 -right-6" />
      <Blob className="w-24 h-24 bg-purple-300 bottom-16 right-20" />
      <div className="absolute bottom-8 right-48 w-16 h-16 rounded-full bg-blue-300 opacity-40" />
      <div className="absolute top-12 right-1/3 w-10 h-10 rounded-full bg-indigo-400 opacity-20" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl px-10 py-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
            M
          </div>
          <span className="text-xl font-black text-[#11191f] tracking-tight">MetoAdmin</span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-xl font-bold text-[#11191f]">Great to see you here 👋</h1>
        <p className="text-center text-sm text-gray-400 mt-1 mb-6">
          Let's get you signed in. Enter your email and password to continue.
        </p>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with Github
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">Continue with Email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-indigo-300 focus:border-indigo-400'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-indigo-300 focus:border-indigo-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('remember')} className="w-4 h-4 rounded accent-indigo-500" />
              <span className="text-sm text-gray-600 font-medium">Keep me signed in</span>
            </label>
            <button type="button" className="text-sm text-gray-400 hover:text-indigo-500 font-medium transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-4 px-3 py-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
          <p className="text-xs text-indigo-600 font-semibold text-center">
            Demo: <span className="font-bold">admin@metoadmin.com</span> / <span className="font-bold">admin123</span>
          </p>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          New here?{' '}
          <button type="button" className="text-indigo-600 font-semibold hover:underline">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
