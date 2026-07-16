import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant. Configure .env.local.",
  );
}

export function createBrowserSupabaseClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

type ServerClientOptions = {
  /** Pour sitemap / robots : génération ISR, pas de no-store. */
  revalidateSeconds?: number;
};

/** Client serveur pour données publiques (biens, agents) sans session. */
export function createServerSupabaseClient(
  options?: ServerClientOptions,
): SupabaseClient {
  const revalidateSeconds = options?.revalidateSeconds;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, init = {}) => {
        if (typeof revalidateSeconds === "number") {
          return fetch(url, {
            ...init,
            next: { revalidate: revalidateSeconds },
          });
        }
        // Pages CMS : toujours à jour après une modification admin.
        return fetch(url, { ...init, cache: "no-store" });
      },
    },
  });
}

