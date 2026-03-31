import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBienBySlug } from "@/lib/biens";
import { BienDetailContent } from "@/components/BienDetailContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bien = await getBienBySlug(slug);
  if (!bien) {
    return { title: "Bien introuvable" };
  }
  return {
    title: bien.titre,
    description:
      bien.description ??
      `Bien immobilier - ${bien.type === "location" ? "Location" : "Vente"} - ${bien.ville ?? ""}`,
  };
}

export default async function BienDetailPage({ params }: Props) {
  const { slug } = await params;
  const bien = await getBienBySlug(slug);

  if (!bien) {
    notFound();
  }

  return <BienDetailContent bien={bien} />;
}
