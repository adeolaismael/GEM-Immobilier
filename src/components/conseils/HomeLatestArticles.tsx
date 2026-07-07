import Image from "next/image";
import Link from "next/link";
import {
  formatArticleDate,
  getArticleTypeLabel,
} from "@/lib/articles";
import type { Article } from "@/types";

export function HomeLatestArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Nos derniers conseils
        </h2>
        <Link
          href="/conseils"
          className="hidden h-11 items-center justify-center rounded-lg border border-[color:var(--brand)] bg-white px-5 text-sm font-semibold text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand)] hover:text-white md:inline-flex"
        >
          Tous les conseils
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {articles.map((article) => {
          const dateLabel = formatArticleDate(
            article.published_at ?? article.created_at
          );

          return (
            <article
              key={article.id}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-[color:var(--card-border)] shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link
                href={`/conseils/${article.slug}`}
                className="flex flex-col sm:flex-row"
              >
                <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-auto sm:w-56 md:w-64">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.titre}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 256px"
                    />
                  ) : (
                    <div className="flex h-full min-h-[11rem] items-center justify-center text-xs text-[color:var(--muted)]">
                      GEM Immobilier
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
                  <span className="inline-flex w-fit rounded-full bg-[color:var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--brand)]">
                    {getArticleTypeLabel(article.type)}
                  </span>
                  <h3 className="mt-3 text-base font-bold md:text-lg">{article.titre}</h3>
                  {article.resume ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                      {article.resume}
                    </p>
                  ) : null}
                  {dateLabel ? (
                    <time
                      dateTime={article.published_at ?? article.created_at}
                      className="mt-3 text-xs font-medium text-[color:var(--muted)]"
                    >
                      {dateLabel}
                    </time>
                  ) : null}
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <Link
        href="/conseils"
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.02] md:hidden"
      >
        Tous les conseils
      </Link>
    </section>
  );
}
