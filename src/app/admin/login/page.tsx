"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-xl font-bold tracking-tight text-[#5c7a1f]">
          GEM Admin
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Connectez-vous pour accéder au back-office.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]"
              placeholder="admin@example.com"
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">
              Mot de passe
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-[#5c7a1f] focus:outline-none focus:ring-1 focus:ring-[#5c7a1f]"
              required
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#5c7a1f] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a6419] disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
