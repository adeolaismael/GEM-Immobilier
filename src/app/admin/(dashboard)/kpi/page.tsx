import { Suspense } from "react";
import { getAnalyticsEventLabel } from "@/lib/analytics";
import {
  getKpiDashboardData,
  parseKpiPeriod,
} from "@/lib/analytics-server";
import { KpiPeriodFilter } from "./KpiPeriodFilter";

type Props = {
  searchParams: Promise<{ period?: string }>;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {value}
        {suffix ? (
          <span className="ml-1 text-lg font-semibold text-gray-500">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

export default async function AdminKpiPage({ searchParams }: Props) {
  const params = await searchParams;
  const period = parseKpiPeriod(params.period);
  const data = await getKpiDashboardData(period);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            KPI &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivi des vues, clics contact et conversions sur les biens.
          </p>
        </div>
        <Suspense fallback={<div className="h-10 w-64 animate-pulse rounded-lg bg-gray-100" />}>
          <KpiPeriodFilter current={period} />
        </Suspense>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vues des biens" value={data.total_vues} />
        <StatCard label="Clics « Nous contacter »" value={data.total_clics_contact} />
        <StatCard label="Formulaires soumis" value={data.total_formulaires} />
        <StatCard
          label="Taux de conversion"
          value={data.taux_conversion}
          suffix="%"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Biens les plus consultés
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Titre</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Ville</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Vues</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.top_biens.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                      Aucune donnée pour cette période.
                    </td>
                  </tr>
                ) : (
                  data.top_biens.map((bien) => (
                    <tr key={bien.bien_id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-medium text-gray-900">{bien.titre}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {bien.ville ?? "—"}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">{bien.type}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {bien.vues}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {bien.clics_contact}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {data.recent_events.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-gray-500">
                Aucun événement pour cette période.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {data.recent_events.map((event) => (
                  <li key={event.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getAnalyticsEventLabel(event.type)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.bien_titre
                            ? event.bien_titre
                            : "Sans bien associé"}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-gray-400">
                        {formatDateTime(event.created_at)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
