import { createServerSupabaseClient } from "@/lib/supabase";
import type { Article, ArticleType } from "@/types";

export async function getArticles(type?: ArticleType): Promise<Article[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("articles")
    .select("*")
    .eq("publie", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getArticles] error", error);
    return [];
  }

  return (data ?? []) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("publie", true)
    .maybeSingle();

  if (error) {
    console.error("[getArticleBySlug] error", error);
    return null;
  }

  return (data as Article | null) ?? null;
}

export async function getArticlesRecents(limit: number): Promise<Article[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("publie", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getArticlesRecents] error", error);
    return [];
  }

  return (data ?? []) as Article[];
}

export function formatArticleDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getArticleTypeLabel(type: ArticleType): string {
  return type === "expertise" ? "Cas d'expertise" : "Article";
}

export function slugifyArticleTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
