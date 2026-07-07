import { NextResponse } from "next/server";
import { uploadSiteContentImage } from "@/lib/storage";
import {
  isSitePageSlug,
  isSiteContentSingleImageField,
} from "@/lib/site-content-defaults";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const slugRaw = formData.get("slug");
  const fieldKeyRaw = formData.get("fieldKey");
  const fieldKey =
    typeof fieldKeyRaw === "string" && fieldKeyRaw.trim()
      ? fieldKeyRaw.trim()
      : undefined;

  if (!slugRaw || typeof slugRaw !== "string" || !isSitePageSlug(slugRaw)) {
    return NextResponse.json({ error: "Slug de page invalide." }, { status: 400 });
  }

  if (fieldKey && !isSiteContentSingleImageField(slugRaw, fieldKey)) {
    return NextResponse.json({ error: "Champ image inconnu pour cette page." }, { status: 400 });
  }

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  try {
    const url = await uploadSiteContentImage(file, slugRaw, fieldKey);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de l’upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
