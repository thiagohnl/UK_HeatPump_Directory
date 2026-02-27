export function InstallerCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
      <div className="h-5 w-48 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-200" />
        <div className="h-6 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-5 w-16 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded bg-gray-200" />
      </div>
    </div>
  );
}
