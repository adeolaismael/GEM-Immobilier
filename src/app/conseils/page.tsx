import type { Metadata } from "next";
import { Suspense } from "react";
import { getArticles } from "@/lib/articles";
import { SEO_PAGES } from "@/lib/seo";
import { ArticleCard } from "@/components/conseils/ArticleCard";
import { ConseilsTabs } from "@/components/conseils/ConseilsTabs";
import type { ArticleType } from "@/types";

export const metadata: Metadata = {
  title: { absolute: SEO_PAGES.conseils.title },
  description: SEO_PAGES.conseils.description,
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

function parseType(raw: string | undefined): ArticleType {
  return raw === "expertise" ? "expertise" : "article";
}

export default async function ConseilsPage({ searchParams }: Props) {
  const params = await searchParams;
  const type = parseType(params.type);
  const articles = await getArticles(type);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="text-sm text-[color:var(--muted)]">Blog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Conseils &amp; Expertise
        </h1>
        <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
          Retrouvez nos articles et cas d&apos;expertise pour mieux comprendre
          le marché immobilier à Abidjan et en Côte d&apos;Ivoire.
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 h-11" />}>
        <div className="mt-8">
          <ConseilsTabs />
        </div>
      </Suspense>

      {articles.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white/50 p-8 text-center text-sm text-[color:var(--muted)] ring-1 ring-[color:var(--card-border)]">
          Aucun article disponible pour le moment
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
