import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { getUser, createUser, updateUser } from '../api/users';
import { SkeletonBox, ErrorBanner } from '../components/SkeletonCard';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone is required'),
  website: z.string().url('Must be a valid URL').or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

function FormSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBox className="h-3 w-20 rounded-full" />
          <SkeletonBox className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <SkeletonBox className="h-10 w-32 rounded-lg mt-2" />
    </div>
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id;

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id!),
    enabled: !isNew,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isNew ? createUser(data) : updateUser(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/data');
    },
  });

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/data')}
        className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-semibold"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Orders
      </button>

      {isError && (
        <div className="mb-4">
          <ErrorBanner message="Failed to load user data. Please try again." />
        </div>
      )}

      {mutation.isError && (
        <div className="mb-4">
          <ErrorBanner message="Failed to save changes. Please try again." />
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a27] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-8">
        <h1 className="text-2xl font-bold mb-8 text-[#11191f] dark:text-white">
          {isNew ? 'Add User' : 'Edit User'}
        </h1>

        {isLoading && !isNew ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            {(
              [
                { field: 'name' as const, label: 'Name', type: 'text' },
                { field: 'username' as const, label: 'Username', type: 'text' },
                { field: 'email' as const, label: 'Email', type: 'email' },
                { field: 'phone' as const, label: 'Phone', type: 'text' },
                { field: 'website' as const, label: 'Website', type: 'text' },
              ]
            ).map(({ field, label, type }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e] mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  {...register(field)}
                  className={`w-full px-3 py-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none text-[#11191f] dark:text-white transition-colors ${
                    errors[field]
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-gray-300 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{errors[field]?.message}</p>
                )}
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving…' : 'Save User'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
