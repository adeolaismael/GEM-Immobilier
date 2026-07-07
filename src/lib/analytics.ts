export const ANALYTICS_EVENT_TYPES = [
  "vue_bien",
  "clic_contact",
  "formulaire_soumis",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export function isAnalyticsEventType(value: string): value is AnalyticsEventType {
  return (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value);
}

export async function trackEvent(
  type: string,
  bienId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        bien_id: bienId ?? null,
        metadata: metadata ?? null,
      }),
      keepalive: true,
    });
  } catch {
    /* tracking non bloquant */
  }
}

export function getAnalyticsEventLabel(type: string): string {
  switch (type) {
    case "vue_bien":
      return "Vue d'un bien";
    case "clic_contact":
      return "Clic « Nous contacter »";
    case "formulaire_soumis":
      return "Formulaire soumis";
    default:
      return type;
  }
}
