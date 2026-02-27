import { InstallerCardSkeleton } from '@/components/search/InstallerCardSkeleton';

export default function CityLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mb-4 h-10 w-80 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 h-5 w-96 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 h-12 w-full max-w-md animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <InstallerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
