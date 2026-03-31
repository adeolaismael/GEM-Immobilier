"use client";

import { usePathname } from "next/navigation";

function hidePublicChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

export function PublicSiteFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (hidePublicChrome(pathname)) return null;
  return <>{children}</>;
}
