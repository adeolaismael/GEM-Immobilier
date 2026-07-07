import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { ArticlesListClient } from "./ArticlesListClient";

export default async function AdminArticlesPage() {
  const supabase = createSupabaseAdminClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, titre, type, publie, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Link
          href="/admin/articles/nouveau"
          className="rounded-xl bg-[#5c7a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419]"
        >
          Nouvel article
        </Link>
      </div>
      <ArticlesListClient articles={articles ?? []} />
    </div>
  );
}
