import Image from "next/image";
import Link from "next/link";
import {
  formatArticleDate,
  getArticleTypeLabel,
} from "@/lib/articles";
import type { Article } from "@/types";

export function ArticleCard({ article }: { article: Article }) {
  const dateLabel = formatArticleDate(article.published_at ?? article.created_at);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[color:var(--card-border)] shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/conseils/${article.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f4f6]">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.titre}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[color:var(--muted)]">
              GEM Immobilier
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="inline-flex w-fit rounded-full bg-[color:var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--brand)]">
            {getArticleTypeLabel(article.type)}
          </span>
          <h2 className="mt-3 text-lg font-semibold leading-snug">{article.titre}</h2>
          {article.resume ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[color:var(--muted)]">
              {article.resume}
            </p>
          ) : null}
          {dateLabel ? (
            <time
              dateTime={article.published_at ?? article.created_at}
              className="mt-4 text-xs font-medium text-[color:var(--muted)]"
            >
              {dateLabel}
            </time>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
