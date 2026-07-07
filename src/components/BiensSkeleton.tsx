"use client";

export function BiensSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[color:var(--card)] p-6 ring-1 ring-[color:var(--card-border)]"
        >
          <div className="h-40 animate-pulse rounded-xl bg-gray-200/50" />
          <div className="mt-5 h-5 w-3/4 animate-pulse rounded bg-gray-200/50" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200/50" />
          <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-gray-200/50" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200/50" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200/50" />
          </div>
          <div className="mt-6 h-4 w-24 animate-pulse rounded bg-gray-200/50" />
        </div>
      ))}
    </div>
  );
}
