import { useForm } from 'react-hook-form';
import type { DefaultValues, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

/**
 * FormBuilder Component
 * 
 * Reusable dynamic form renderer that binds React Hook Form with Zod validation.
 * 
 * Purpose:
 * standardizes styling, inputs, error states, and submission states.
 * 
 * Props:
 * @param fields Schema list defining inputs to render
 * @param validationSchema Zod schema object to validate input values
 * @param defaultValues Default values for form inputs
 * @param onSubmit Submission handler triggered if validation passes
 * @param submitText Label for primary action button (e.g. 'Save changes')
 * @param cancelText Label for secondary action button
 * @param onCancel Optional cancel callback
 * 
 * Usage Example:
 * ```tsx
 * const schema = z.object({ name: z.string().min(2) });
 * const fields = [{ name: 'name', label: 'Full Name', type: 'text' }];
 * <FormBuilder
 *   fields={fields}
 *   validationSchema={schema}
 *   defaultValues={{ name: '' }}
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select type
  description?: string; // Hint text
}

export interface FormBuilderProps<T extends FieldValues> {
  fields: FormFieldConfig[];
  validationSchema: z.ZodType<T, T>;
  defaultValues: T;
  onSubmit: (data: T) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

export default function FormBuilder<T extends FieldValues>({
  fields,
  validationSchema,
  defaultValues,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<T, unknown, T>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        {fields.map((field) => {
          const name = field.name as Path<T>;
          const hasError = !!errors[name];
          const errorMsg = errors[name]?.message as string | undefined;

          return (
            <div key={field.name} className="space-y-1">
              {field.type !== 'checkbox' && (
                <label className="block text-sm font-semibold text-gray-600 dark:text-[#8a8a9e]">
                  {field.label}
                </label>
              )}

              {/* Text / Email / Password / Number Input */}
              {(field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'password' ||
                field.type === 'number') && (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(name, { valueAsNumber: field.type === 'number' })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white transition-colors ${
                    hasError
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-400'
                  }`}
                />
              )}

              {/* Textarea Input */}
              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  rows={4}
                  {...register(name)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-transparent text-[#11191f] dark:text-white resize-none transition-colors ${
                    hasError
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-400'
                  }`}
                />
              )}

              {/* Select Options Input */}
              {field.type === 'select' && (
                <div className="relative">
                  <select
                    {...register(name)}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1a1a27] text-[#11191f] dark:text-white transition-colors appearance-none ${
                      hasError
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500/30 focus:border-indigo-400'
                    }`}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Checkbox Toggle Input */}
              {field.type === 'checkbox' && (
                <label className="flex items-center justify-between py-2 cursor-pointer group">
                  <div>
                    <p className="font-semibold text-[#11191f] dark:text-white text-sm">
                      {field.label}
                    </p>
                    {field.description && (
                      <p className="text-xs text-gray-500 dark:text-[#8a8a9e] mt-0.5">
                        {field.description}
                      </p>
                    )}
                  </div>
                  <div className="relative ml-4 shrink-0">
                    <input
                      type="checkbox"
                      {...register(name)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer-checked:bg-indigo-500 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              )}

              {/* Display hint if not checkbox (checkbox has descriptions next to toggle) */}
              {field.description && field.type !== 'checkbox' && (
                <p className="text-xs text-gray-400 dark:text-[#8a8a9e]">{field.description}</p>
              )}

              {/* Display Validation Error */}
              {hasError && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : submitText}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-semibold text-[#11191f] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
        )}
      </div>
    </form>
  );
}
