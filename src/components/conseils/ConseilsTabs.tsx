"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { value: "article", label: "Articles" },
  { value: "expertise", label: "Cas d'expertise" },
] as const;

export function ConseilsTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("type") === "expertise" ? "expertise" : "article";

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", tab.value);
        const href = `${pathname}?${params.toString()}`;
        const isActive = active === tab.value;

        return (
          <Link
            key={tab.value}
            href={href}
            className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[color:var(--brand)] text-white shadow-soft"
                : "bg-white text-[color:var(--muted)] ring-1 ring-[color:var(--card-border)] hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
