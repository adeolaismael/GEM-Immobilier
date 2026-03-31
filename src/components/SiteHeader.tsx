"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { createBrowserSupabaseClient } from "@/lib/supabase";

/** Actif seulement après « Voir le site » depuis l’admin (même onglet). */
const ADMIN_SITE_PREVIEW_KEY = "gem_admin_site_preview";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/biens", label: "Nos offres" },
  { href: "/services", label: "Services" },
  { href: "/a-propos", label: "À propos" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Espace connecté (dashboard) : pas la page de connexion. */
function isAdminAppShell(path: string | null): boolean {
  if (!path) return false;
  return path.startsWith("/admin") && !path.startsWith("/admin/login");
}

export function SiteHeader() {
  const pathname = usePathname();
  const adminShell = isAdminAppShell(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [adminSitePreview, setAdminSitePreview] = useState(false);
  const reduceMotion = useReducedMotion();
  const showAdminReturn = hasAdminSession && adminSitePreview;

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const applySession = (session: unknown) => {
      setHasAdminSession(!!session);
      if (!session) {
        try {
          sessionStorage.removeItem(ADMIN_SITE_PREVIEW_KEY);
        } catch {
          /* ignore */
        }
        setAdminSitePreview(false);
      }
    };
    supabase.auth.getSession().then(({ data }) => applySession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => applySession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdminAppShell(pathname)) {
      try {
        sessionStorage.removeItem(ADMIN_SITE_PREVIEW_KEY);
      } catch {
        /* ignore */
      }
      setAdminSitePreview(false);
      return;
    }
    try {
      setAdminSitePreview(sessionStorage.getItem(ADMIN_SITE_PREVIEW_KEY) === "1");
    } catch {
      setAdminSitePreview(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-black/5 backdrop-blur"
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
        boxShadow: scrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.08)" : "none",
      }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href={adminShell ? "/admin/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="text-sm font-semibold leading-tight tracking-wide text-[color:var(--brand)]">
            GEM
            <br />
            IMMOBILIER
          </span>
        </Link>

        {adminShell ? (
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-[color:var(--foreground)] shadow-sm transition-colors hover:bg-black/[0.04]"
            onClick={() => {
              try {
                sessionStorage.setItem(ADMIN_SITE_PREVIEW_KEY, "1");
              } catch {
                /* ignore */
              }
            }}
          >
            Voir le site
          </Link>
        ) : null}

        {!adminShell ? (
        <nav className="hidden items-center gap-8 text-sm text-[color:var(--foreground)] md:flex">
          {nav.map((item) => {
            const active = isActive(item.href, pathname);
            return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative py-1 transition-colors duration-200 hover:text-[color:var(--brand)] ${
                active ? "font-semibold text-[color:var(--brand)]" : ""
              }`}
            >
              <span className="inline-flex items-center gap-1">
                {item.label}
                {item.label === "Nos offres" ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-[color:var(--brand)]"
                initial={{ width: active ? "100%" : 0 }}
                animate={{ width: active ? "100%" : 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          );
          })}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            aria-label="Rechercher"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <Link
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--brand)] px-5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98]"
            href="/contact"
          >
            <span className="relative z-10">Nous-contactez</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0.5 }}
              whileHover={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ borderRadius: "9999px" }}
            />
          </Link>

          {showAdminReturn ? (
            <Link
              href="/admin/dashboard"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-[color:var(--foreground)] shadow-sm transition-colors hover:bg-black/[0.04]"
            >
              Espace admin
            </Link>
          ) : null}
        </nav>
        ) : null}

        {!adminShell ? (
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-[color:var(--foreground)] transition-colors hover:bg-black/[0.04]"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {showAdminReturn ? (
            <Link
              href="/admin/dashboard"
              className="inline-flex h-10 max-w-[7.5rem] shrink-0 items-center justify-center truncate rounded-lg border border-black/15 bg-white px-2 text-xs font-medium text-[color:var(--foreground)] shadow-sm transition-colors hover:bg-black/[0.04] sm:max-w-none sm:px-3 sm:text-sm"
              title="Retour au tableau de bord"
            >
              Espace admin
            </Link>
          ) : null}
          <Link
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand)] px-4 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98]"
            href="/contact"
          >
            Contact
          </Link>
        </div>
        ) : null}
      </div>

      {!adminShell && mounted && menuOpen
        ? createPortal(
            <div
              id="site-mobile-menu"
              className="fixed inset-0 z-[200] md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
              />
              <nav
                className="absolute top-0 right-0 flex h-full min-h-0 w-[min(100%,20rem)] flex-col gap-1 overflow-y-auto border-l border-black/10 bg-white px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
                  Menu
                </p>
                {showAdminReturn ? (
                  <Link
                    href="/admin/dashboard"
                    className="mb-2 rounded-lg border border-[color:var(--brand)]/35 bg-[color:var(--brand)]/10 px-3 py-3 text-base font-semibold text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand)]/15"
                    onClick={() => setMenuOpen(false)}
                  >
                    Espace admin
                  </Link>
                ) : null}
                {nav.map((item) => {
                  const active = isActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-lg px-3 py-3 text-base transition-colors hover:bg-black/[0.04] ${
                        active ? "font-semibold text-[color:var(--brand)]" : "text-[color:var(--foreground)]"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/biens"
                  className="mt-1 rounded-lg px-3 py-3 text-base text-[color:var(--foreground)] transition-colors hover:bg-black/[0.04]"
                  onClick={() => setMenuOpen(false)}
                >
                  Rechercher une offre
                </Link>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand)] px-4 text-sm font-medium text-white shadow-soft"
                  onClick={() => setMenuOpen(false)}
                >
                  Nous-contactez
                </Link>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </motion.header>
  );
}
