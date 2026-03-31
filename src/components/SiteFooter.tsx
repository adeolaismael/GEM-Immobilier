import Link from "next/link";
import { Facebook, Linkedin, Instagram, Phone, Mail } from "lucide-react";
import { getAgencyContact } from "@/lib/agence-contact";

const services = [
  "Administration de biens",
  "Suivi juridique et fiscal",
  "Recherche de biens",
  "Conciergerie et travaux",
  "Estimation immobilière",
  "Vente de biens immobiliers",
];

export async function SiteFooter() {
  const agency = await getAgencyContact();

  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Colonne 1 — Logo & Description */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-wide text-[color:var(--brand)]">
                GEM IMMOBILIER
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              Le partenaire qui sécurise vos biens
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-[color:var(--brand)] hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-[color:var(--brand)] hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-[color:var(--brand)] hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@gemimmobilier"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-[color:var(--brand)] hover:text-white"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.41 6.41 0 00-1-.08A6.34 6.34 0 005 20.66a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/", label: "Accueil" },
                { href: "/biens", label: "Nos offres" },
                { href: "/services", label: "Services" },
                { href: "/a-propos", label: "À propos" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Nos services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">
              Nos services
            </h3>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">
              Contact
            </h3>
            <address className="mt-4 not-italic">
              <p className="text-sm text-gray-400">
                {agency.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <div className="mt-4 space-y-2">
                {agency.phones.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {p.display}
                  </a>
                ))}
                <a
                  href={`mailto:${agency.email}`}
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {agency.email}
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Lundi - Vendredi 8h - 18h
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GEM Immobilier. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition-colors hover:text-white"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
