"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/biens": "Gestion des biens",
  "/admin/biens/nouveau": "Ajouter un bien",
  "/admin/messages": "Messages",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.match(/^\/admin\/biens\/[^/]+\/modifier$/)) return "Modifier un bien";
  return "Admin";
}

export function AdminHeader({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-8">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h1>
      {userEmail && (
        <span className="text-sm text-gray-500">{userEmail}</span>
      )}
    </header>
  );
}
