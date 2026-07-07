"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { KpiPeriod } from "@/types";

const PERIODS: { value: KpiPeriod; label: string }[] = [
  { value: "7", label: "7 derniers jours" },
  { value: "30", label: "30 jours" },
  { value: "90", label: "90 jours" },
  { value: "all", label: "Tout" },
];

export function KpiPeriodFilter({ current }: { current: KpiPeriod }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map((period) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("period", period.value);
        const href = `${pathname}?${params.toString()}`;
        const isActive = current === period.value;

        return (
          <Link
            key={period.value}
            href={href}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#5c7a1f] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {period.label}
          </Link>
        );
      })}
    </div>
  );
}
