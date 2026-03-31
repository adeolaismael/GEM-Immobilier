"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { MessageContact } from "@/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

function AdminMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [messages, setMessages] = useState<MessageContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const selectedMessage = selectedId ? messages.find((m) => m.id === selectedId) : null;

  async function handleSelectMessage(msg: MessageContact) {
    router.push(`/admin/messages?id=${msg.id}`);
    if (!msg.lu) {
      await fetch(`/api/admin/messages/${msg.id}`, { method: "PATCH" });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, lu: true } : m)));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 shadow-sm ring-1 ring-black/5">
        <p className="text-gray-500">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages reçus</h2>
        </div>
        <div className="max-h-[600px] flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <p>Aucun message.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {messages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMessage(m)}
                  className={`w-full px-6 py-4 text-left transition-colors hover:bg-gray-50 ${selectedId === m.id ? "bg-[#5c7a1f]/10" : ""} ${!m.lu ? "bg-amber-50/80" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`truncate font-medium ${!m.lu ? "text-gray-900" : "text-gray-700"}`}>
                          {m.nom}
                        </span>
                        {!m.lu && (
                          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                            Non lu
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-sm text-gray-500">{m.email}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {m.sujet || "Sans sujet"}
                        {m.message && <span className="text-gray-400">{" — "}{truncate(m.message, 60)}</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">{formatDate(m.created_at)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="border-b border-black/5 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Détail du message</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedMessage ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.sujet || "Sans sujet"}</h3>
                <span className="shrink-0 text-xs text-gray-500">{formatDate(selectedMessage.created_at)}</span>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">Nom</dt>
                  <dd className="mt-0.5 text-gray-900">{selectedMessage.nom}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${selectedMessage.email}`} className="text-[#5c7a1f] hover:underline">
                      {selectedMessage.email}
                    </a>
                  </dd>
                </div>
                {selectedMessage.telephone && (
                  <div>
                    <dt className="font-medium text-gray-500">Téléphone</dt>
                    <dd className="mt-0.5 text-gray-900">{selectedMessage.telephone}</dd>
                  </div>
                )}
              </dl>
              <div>
                <dt className="font-medium text-gray-500">Message</dt>
                <dd className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-900 ring-1 ring-black/5">
                  {selectedMessage.message}
                </dd>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center text-gray-500">
              <p className="text-sm">Sélectionnez un message</p>
              <p className="mt-1 text-xs">Cliquez sur un message dans la liste pour afficher son contenu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center rounded-2xl bg-white p-12 shadow-sm ring-1 ring-black/5">
          <p className="text-gray-500">Chargement…</p>
        </div>
      }
    >
      <AdminMessagesContent />
    </Suspense>
  );
}
