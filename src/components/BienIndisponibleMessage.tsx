import Link from "next/link";

export function BienIndisponibleMessage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
      <Link
        href="/biens"
        className="mb-8 inline-block text-sm text-[color:var(--muted)] transition-colors hover:text-foreground"
      >
        ← Retour aux biens
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Ce bien n&apos;est plus disponible.
      </h1>
      <p className="mt-4 text-sm leading-6 text-[color:var(--muted)] md:text-base">
        Ce bien a déjà été vendu ou loué. Découvrez nos autres offres disponibles.
      </p>
      <Link
        href="/biens"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--brand)] px-6 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-95"
      >
        Voir nos autres biens
      </Link>
    </main>
  );
}
