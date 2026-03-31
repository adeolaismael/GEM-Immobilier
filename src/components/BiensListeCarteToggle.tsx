"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarteMapbox } from "./CarteMapbox";
import { BiensGridAnimated } from "./BiensGridAnimated";
import type { Bien } from "@/types";

type Props = {
  biens: Bien[];
  resultsKey?: string;
};

export function BiensListeCarteToggle({ biens, resultsKey }: Props) {
  const [mode, setMode] = useState<"liste" | "carte">("liste");

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("liste")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "liste"
              ? "bg-[color:var(--brand)] text-white"
              : "bg-gray-100 text-[color:var(--muted)] hover:bg-gray-200"
          }`}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={() => setMode("carte")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "carte"
              ? "bg-[color:var(--brand)] text-white"
              : "bg-gray-100 text-[color:var(--muted)] hover:bg-gray-200"
          }`}
        >
          Carte
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "liste" ? (
          <motion.div
            key={`liste-${resultsKey ?? ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <BiensGridAnimated biens={biens} key={resultsKey} />
          </motion.div>
        ) : (
          <motion.div
            key="carte"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CarteMapbox biens={biens} height={500} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
