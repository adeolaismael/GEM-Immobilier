import { createSupabaseAdminClient } from "./supabase-admin";

const BUCKET = "bien-photos";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mime] ?? "jpg";
}

/**
 * Extrait le chemin du fichier depuis l'URL publique Supabase Storage.
 * Format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path
 */
function extractPathFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export async function uploadPhoto(
  file: Blob | File,
  bienId: string
): Promise<string> {
  const mime = file.type;
  if (!ALLOWED_TYPES.includes(mime)) {
    throw new Error("Format non accepté. Utilisez jpg, png ou webp.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Fichier trop volumineux. Maximum 5 Mo.");
  }

  const supabase = createSupabaseAdminClient();
  const ext = getExtension(mime);
  const path = `${bienId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: mime,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

export async function deletePhoto(url: string): Promise<void> {
  const path = extractPathFromUrl(url);
  if (!path) {
    throw new Error("URL invalide.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

/** Images des pages (même bucket, préfixe site-content). */
export async function uploadSiteContentImage(
  file: Blob | File,
  pageSlug: string,
): Promise<string> {
  const mime = file.type;
  if (!ALLOWED_TYPES.includes(mime)) {
    throw new Error("Format non accepté. Utilisez jpg, png ou webp.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Fichier trop volumineux. Maximum 5 Mo.");
  }

  const safeSlug = String(pageSlug).replace(/[^a-z0-9-]/gi, "-").slice(0, 64);
  const supabase = createSupabaseAdminClient();
  const ext = getExtension(mime);
  const path = `site-content/${safeSlug}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: mime,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
