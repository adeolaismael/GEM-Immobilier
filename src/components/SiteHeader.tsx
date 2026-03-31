"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

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

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold leading-tight tracking-wide text-[color:var(--brand)]">
            GEM
            <br />
            IMMOBILIER
          </span>
        </Link>

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
        </nav>

        <Link
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--brand)] px-5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98] md:hidden"
          href="/contact"
        >
          Nous-contactez
        </Link>
      </div>
    </motion.header>
  );
}
