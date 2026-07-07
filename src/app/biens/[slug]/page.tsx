import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBienBySlug } from "@/lib/biens";
import { BienDetailContent } from "@/components/BienDetailContent";
import { BienIndisponibleMessage } from "@/components/BienIndisponibleMessage";
import { BienDetailTracker } from "@/components/analytics/BienDetailTracker";
import { isBienIndisponible } from "@/lib/bien-statut";
import {
  buildBienSeoDescription,
  buildBienSeoTitle,
  getBienPrincipalePhotoUrl,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bien = await getBienBySlug(slug);
  if (!bien) {
    return { title: "Bien introuvable" };
  }

  const title = buildBienSeoTitle(bien.titre);
  const description = buildBienSeoDescription(bien);
  const image = getBienPrincipalePhotoUrl(bien);
  const images = image ? [image] : undefined;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function BienDetailPage({ params }: Props) {
  const { slug } = await params;
  const bien = await getBienBySlug(slug);

  if (!bien) {
    notFound();
  }

  if (isBienIndisponible(bien.statut)) {
    return <BienIndisponibleMessage />;
  }

  return (
    <>
      <BienDetailTracker bienId={bien.id} />
      <BienDetailContent bien={bien} />
    </>
  );
}
