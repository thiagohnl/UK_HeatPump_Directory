import { InstallerCardSkeleton } from '@/components/search/InstallerCardSkeleton';

export default function InstallersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 h-12 w-full max-w-md animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <InstallerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
