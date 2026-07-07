import Link from "next/link";
import { ArticleForm } from "../ArticleForm";

export default function AdminArticleNouveauPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/articles"
        className="inline-block text-sm font-medium text-gray-600 hover:text-[#5c7a1f]"
      >
        ← Retour aux articles
      </Link>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Nouvel article</h1>
        <div className="mt-6">
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
