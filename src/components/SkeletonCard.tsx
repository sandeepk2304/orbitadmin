// Reusable skeleton shimmer primitives

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`}
    />
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-[#1a1a27] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4">
      <SkeletonBox className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-3 w-24 rounded-full" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  const widths = ['60%', '80%', '70%', '50%', '65%', '75%', '55%'];
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div
            className="animate-pulse bg-gray-200 dark:bg-white/10 rounded-full h-4"
            style={{ width: widths[i % widths.length] }}
          />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTableRows({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold">
      <span className="shrink-0">⚠</span>
      <span>{message}</span>
    </div>
  );
}
