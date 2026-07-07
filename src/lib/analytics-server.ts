import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { isAnalyticsEventType } from "@/lib/analytics";
import type {
  AnalyticsEventType,
  KpiDashboardData,
  KpiPeriod,
  KpiRecentEvent,
  KpiTopBienRow,
} from "@/types";

export function parseKpiPeriod(raw: string | undefined): KpiPeriod {
  if (raw === "7" || raw === "30" || raw === "90" || raw === "all") {
    return raw;
  }
  return "30";
}

function getPeriodStartDate(period: KpiPeriod): string | null {
  if (period === "all") return null;
  const days = Number(period);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export async function insertAnalyticsEvent(input: {
  type: AnalyticsEventType;
  bien_id?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("analytics_events").insert({
    type: input.type,
    bien_id: input.bien_id ?? null,
    metadata: input.metadata ?? null,
  });

  if (error) {
    console.error("[analytics-server] insert error", error);
  }
}

async function countEventsByType(
  type: AnalyticsEventType,
  since: string | null
): Promise<number> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("type", type);

  if (since) {
    query = query.gte("created_at", since);
  }

  const { count, error } = await query;
  if (error) {
    console.error(`[analytics-server] count ${type} error`, error);
    return 0;
  }
  return count ?? 0;
}

export async function getKpiDashboardData(
  period: KpiPeriod
): Promise<KpiDashboardData> {
  const since = getPeriodStartDate(period);
  const supabase = createSupabaseAdminClient();

  const [total_vues, total_clics_contact, total_formulaires] = await Promise.all([
    countEventsByType("vue_bien", since),
    countEventsByType("clic_contact", since),
    countEventsByType("formulaire_soumis", since),
  ]);

  const taux_conversion =
    total_vues > 0
      ? Math.round((total_formulaires / total_vues) * 1000) / 10
      : 0;

  let eventsQuery = supabase
    .from("analytics_events")
    .select("bien_id, type")
    .not("bien_id", "is", null);

  if (since) {
    eventsQuery = eventsQuery.gte("created_at", since);
  }

  const { data: bienEvents, error: bienEventsError } = await eventsQuery;
  if (bienEventsError) {
    console.error("[analytics-server] bien events error", bienEventsError);
  }

  const aggregates = new Map<string, { vues: number; clics_contact: number }>();
  for (const row of bienEvents ?? []) {
    if (!row.bien_id) continue;
    const current = aggregates.get(row.bien_id) ?? {
      vues: 0,
      clics_contact: 0,
    };
    if (row.type === "vue_bien") current.vues += 1;
    if (row.type === "clic_contact") current.clics_contact += 1;
    aggregates.set(row.bien_id, current);
  }

  const sortedBienIds = [...aggregates.entries()]
    .sort((a, b) => b[1].vues - a[1].vues)
    .slice(0, 10)
    .map(([bienId]) => bienId);

  let top_biens: KpiTopBienRow[] = [];
  if (sortedBienIds.length > 0) {
    const { data: biens, error: biensError } = await supabase
      .from("biens")
      .select("id, titre, ville, type")
      .in("id", sortedBienIds);

    if (biensError) {
      console.error("[analytics-server] biens fetch error", biensError);
    } else {
      const biensMap = new Map((biens ?? []).map((b) => [b.id, b]));
      top_biens = sortedBienIds
        .map((bienId) => {
          const bien = biensMap.get(bienId);
          const stats = aggregates.get(bienId);
          if (!bien || !stats) return null;
          return {
            bien_id: bienId,
            titre: bien.titre,
            ville: bien.ville,
            type: bien.type,
            vues: stats.vues,
            clics_contact: stats.clics_contact,
          };
        })
        .filter((row): row is KpiTopBienRow => row !== null);
    }
  }

  let recentQuery = supabase
    .from("analytics_events")
    .select("id, type, bien_id, created_at, biens(titre)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (since) {
    recentQuery = recentQuery.gte("created_at", since);
  }

  const { data: recentRows, error: recentError } = await recentQuery;
  if (recentError) {
    console.error("[analytics-server] recent events error", recentError);
  }

  const recent_events: KpiRecentEvent[] = (recentRows ?? []).map((row) => {
    const bienJoin = row.biens as { titre: string } | { titre: string }[] | null;
    const bienTitre = Array.isArray(bienJoin)
      ? bienJoin[0]?.titre ?? null
      : bienJoin?.titre ?? null;

    return {
      id: row.id,
      type: row.type,
      bien_id: row.bien_id,
      bien_titre: bienTitre,
      created_at: row.created_at,
    };
  });

  return {
    total_vues,
    total_clics_contact,
    total_formulaires,
    taux_conversion,
    top_biens,
    recent_events,
  };
}

export function validateAnalyticsPayload(body: {
  type?: unknown;
  bien_id?: unknown;
  metadata?: unknown;
}):
  | { ok: true; type: AnalyticsEventType; bien_id: string | null; metadata: Record<string, unknown> | null }
  | { ok: false; error: string } {
  const type = typeof body.type === "string" ? body.type : "";
  if (!isAnalyticsEventType(type)) {
    return { ok: false, error: "Type d'événement invalide." };
  }

  const bien_id =
    body.bien_id && typeof body.bien_id === "string" ? body.bien_id : null;

  let metadata: Record<string, unknown> | null = null;
  if (body.metadata != null) {
    if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
      return { ok: false, error: "Metadata invalide." };
    }
    metadata = body.metadata as Record<string, unknown>;
  }

  return { ok: true, type, bien_id, metadata };
}
