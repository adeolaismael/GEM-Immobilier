import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatArticleDate,
  getArticleBySlug,
  getArticleTypeLabel,
} from "@/lib/articles";
import { truncateText } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable" };
  }

  const title = `${article.titre} | GEM Immobilier Abidjan`;
  const description = article.resume?.trim()
    ? truncateText(article.resume, 155)
    : truncateText(article.contenu, 155);
  const image = article.image_url
    ? article.image_url.startsWith("http")
      ? article.image_url
      : new URL(article.image_url, getSiteUrl()).toString()
    : undefined;
  const images = image ? [image] : undefined;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

function renderArticleContent(contenu: string) {
  const blocks = contenu.split(/\n\n+/).filter((block) => block.trim());

  if (blocks.length === 0) {
    return <p>{contenu}</p>;
  }

  return blocks.map((block, index) => <p key={index}>{block.trim()}</p>);
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const dateLabel = formatArticleDate(article.published_at ?? article.created_at);

  return (
    <main>
      <div className="relative h-56 w-full overflow-hidden bg-[#f3f4f6] md:h-80 lg:h-96">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.titre}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[color:var(--muted)]">
            GEM Immobilier
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <Link
          href="/conseils"
          className="inline-block text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
        >
          ← Retour aux conseils
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-[color:var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--brand)]">
          {getArticleTypeLabel(article.type)}
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {article.titre}
        </h1>

        {dateLabel ? (
          <time
            dateTime={article.published_at ?? article.created_at}
            className="mt-4 block text-sm text-[color:var(--muted)]"
          >
            Publié le {dateLabel}
          </time>
        ) : null}

        <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-a:text-[color:var(--brand)]">
          {renderArticleContent(article.contenu)}
        </div>
      </article>
    </main>
  );
}
