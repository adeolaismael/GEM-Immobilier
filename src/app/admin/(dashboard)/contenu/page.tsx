import Link from "next/link";
import {
  SITE_PAGE_SLUGS,
  SITE_CONTENT_PAGE_LABELS,
} from "@/lib/site-content-defaults";

export default function AdminContenuIndexPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Textes du site
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Modifiez les textes affichés sur chaque page publique. Les changements
          sont visibles après enregistrement (rechargement de la page concernée).
        </p>
      </div>

      <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {SITE_PAGE_SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={`/admin/contenu/${slug}`}
              className="flex items-center justify-between gap-4 px-6 py-4 text-sm font-medium text-gray-800 transition-colors hover:bg-[#5c7a1f]/5"
            >
              <span>{SITE_CONTENT_PAGE_LABELS[slug]}</span>
              <span className="shrink-0 text-xs font-normal text-gray-400">
                {slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
