import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { ArticleForm } from "../../ArticleForm";
import type { Article } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminArticleModifierPage({ params }: Props) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/articles"
        className="inline-block text-sm font-medium text-gray-600 hover:text-[#5c7a1f]"
      >
        ← Retour aux articles
      </Link>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Modifier l&apos;article</h1>
        <div className="mt-6">
          <ArticleForm article={data as Article} />
        </div>
      </div>
    </div>
  );
}
