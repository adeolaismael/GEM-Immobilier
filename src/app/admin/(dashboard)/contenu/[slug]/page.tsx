import { notFound } from "next/navigation";
import {
  isSitePageSlug,
  SITE_CONTENT_PAGE_LABELS,
} from "@/lib/site-content-defaults";
import { SiteContentEditor } from "../SiteContentEditor";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminContenuPage({ params }: Props) {
  const { slug: raw } = await params;
  if (!isSitePageSlug(raw)) notFound();

  const slug = raw;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {SITE_CONTENT_PAGE_LABELS[slug]}
        </h1>
        <p className="mt-2 font-mono text-xs text-gray-500">{slug}</p>
      </div>
      <SiteContentEditor slug={slug} />
    </div>
  );
}
