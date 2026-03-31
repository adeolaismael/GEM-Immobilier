import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h2m-6 4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createSupabaseAdminClient();

  const [biensRes, messagesRes, unreadRes] = await Promise.all([
    supabase
      .from("biens")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase
      .from("messages_contact")
      .select("id, nom, email, sujet, lu, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("messages_contact")
      .select("id", { count: "exact", head: true })
      .eq("lu", false),
  ]);

  const biensCount = biensRes.count ?? 0;
  const unreadCount = unreadRes.count ?? 0;
  const lastMessages = messagesRes.data ?? [];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-14">
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/biens"
          className="flex items-start gap-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5c7a1f]/10 text-[#5c7a1f]">
            <IconHome className="h-6 w-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-[#5c7a1f]">{biensCount}</div>
            <div className="mt-1 text-sm font-medium text-gray-500">Biens au total</div>
          </div>
        </Link>
        <Link
          href="/admin/messages"
          className="flex items-start gap-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5c7a1f]/10 text-[#5c7a1f]">
            <IconMail className="h-6 w-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-[#5c7a1f]">{unreadCount}</div>
            <div className="mt-1 text-sm font-medium text-gray-500">Messages non lus</div>
          </div>
        </Link>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/biens"
          className="rounded-xl bg-[#5c7a1f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419]"
        >
          Gérer les biens
        </Link>
        <Link
          href="/admin/messages"
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-black/10 transition-colors hover:bg-gray-50"
        >
          Voir les messages
        </Link>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="border-b border-black/5 px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900">5 derniers messages</h2>
        </div>
        <div className="overflow-hidden">
          {lastMessages.length === 0 ? (
            <div className="px-8 py-16 text-center text-sm text-gray-500">
              Aucun message pour le moment.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-gray-50/80">
                  <th className="px-8 py-4 font-semibold text-gray-700">Nom</th>
                  <th className="px-8 py-4 font-semibold text-gray-700">Email</th>
                  <th className="px-8 py-4 font-semibold text-gray-700">Sujet</th>
                  <th className="px-8 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-8 py-4 font-semibold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {lastMessages.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`border-b border-black/5 last:border-0 transition-colors hover:bg-[#5c7a1f]/5 ${
                      i % 2 === 1 ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <td className="px-8 py-5 font-medium text-gray-900">
                      <Link href={`/admin/messages?id=${m.id}`} className="hover:text-[#5c7a1f] hover:underline">
                        {m.nom}
                      </Link>
                    </td>
                    <td className="px-8 py-5 text-gray-600">{m.email}</td>
                    <td className="px-8 py-5 text-gray-900">{m.sujet || "Sans sujet"}</td>
                    <td className="px-8 py-5 text-gray-500">{formatDate(m.created_at)}</td>
                    <td className="px-8 py-5">
                      {!m.lu ? (
                        <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                          Non lu
                        </span>
                      ) : (
                        <span className="text-gray-400">Lu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {lastMessages.length > 0 && (
          <div className="border-t border-black/5 px-8 py-5">
            <Link href="/admin/messages" className="text-sm font-medium text-[#5c7a1f] hover:underline">
              Voir tous les messages →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
