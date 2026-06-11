import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional(),
  notifications: z.boolean(),
  darkMode: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Kristina Evans',
      email: 'kristina@novashop.com',
      bio: '',
      notifications: true,
      darkMode: false,
    },
  });

  const onSubmit = (_data: FormData) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[#11191f] dark:text-white">Settings</h1>

      {saved && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-semibold">
          <CheckCircle2 size={16} className="shrink-0" />
          Changes saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile */}
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8">
          <h2 className="text-lg font-bold text-[#11191f] dark:text-white mb-6">Profile Information</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                {...register('name')}
                className={`w-full px-3 py-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none text-[#11191f] dark:text-white transition-colors ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-gray-300 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none text-[#11191f] dark:text-white transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-gray-300 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1.5">
                Bio <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Tell us a little about yourself…"
                className={`w-full px-3 py-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none text-[#11191f] dark:text-white resize-none transition-colors ${
                  errors.bio
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-gray-300 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.bio.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8">
          <h2 className="text-lg font-bold text-[#11191f] dark:text-white mb-6">Preferences</h2>
          <div className="space-y-4">
            {(
              [
                { field: 'notifications' as const, label: 'Email Notifications', desc: 'Receive order and activity updates by email' },
                { field: 'darkMode' as const, label: 'Dark Mode', desc: 'Override system preference for this session' },
              ]
            ).map(({ field, label, desc }) => (
              <label key={field} className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-semibold text-[#11191f] dark:text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-[#8a8a9e] mt-0.5">{desc}</p>
                </div>
                <div className="relative ml-4 shrink-0">
                  <input type="checkbox" {...register(field)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer-checked:bg-indigo-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isDirty}
          className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
