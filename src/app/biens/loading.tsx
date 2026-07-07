import { BiensSkeleton } from "@/components/BiensSkeleton";

export default function BiensLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200/50" />
          <div className="mt-2 h-10 w-full max-w-md animate-pulse rounded bg-gray-200/50" />
          <div className="mt-4 h-5 w-full max-w-lg animate-pulse rounded bg-gray-200/50" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-full bg-gray-200/50" />
      </div>

      <div className="mt-10 h-48 animate-pulse rounded-2xl bg-gray-200/50" />

      <div className="mt-6 h-4 w-32 animate-pulse rounded bg-gray-200/50" />

      <div className="mt-10">
        <BiensSkeleton />
      </div>
    </main>
  );
}
