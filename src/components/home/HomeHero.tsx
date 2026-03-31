"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: (reduceMotion: boolean) =>
    reduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: (reduceMotion: boolean) =>
    reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
};

export type HomeHeroCopy = {
  titleLine1: string;
  titleBrand: string;
  titleLine2: string;
  subtitle: string;
  ctaBiens: string;
  ctaContact: string;
  imageMainSrc: string;
  imageSideSrc: string;
};

export function HomeHero({
  titleLine1,
  titleBrand,
  titleLine2,
  subtitle,
  ctaBiens,
  ctaContact,
  imageMainSrc,
  imageSideSrc,
}: HomeHeroCopy) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-8 md:pt-20 md:pb-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={container}
          initial="hidden"
          animate="visible"
          custom={reduceMotion}
        >
          <motion.h1
            className="text-4xl font-extrabold tracking-tight text-[color:var(--foreground)] md:text-6xl"
            variants={item}
            custom={reduceMotion}
          >
            {titleLine1}{" "}
            <span className="text-[color:var(--brand)]">{titleBrand}</span>
            <br />
            <span className="font-extrabold">{titleLine2}</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-base leading-7 text-[color:var(--muted)] md:text-lg"
            variants={item}
            custom={reduceMotion}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={item}
            custom={reduceMotion}
          >
            <Link
              href="/biens"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--brand)] px-6 text-sm font-semibold text-white shadow-soft"
            >
              <span className="relative z-10">{ctaBiens}</span>
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ borderRadius: "9999px" }}
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[color:var(--brand)] bg-white px-6 text-sm font-semibold text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand)] hover:text-white"
            >
              {ctaContact}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-3xl bg-[#f3f4f6] p-3 shadow-soft">
            <div className="relative aspect-[16/7] overflow-hidden rounded-2xl">
              <Image
                src={imageMainSrc}
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="absolute right-6 bottom-[-18px] hidden w-[46%] rounded-3xl bg-[#f3f4f6] p-3 shadow-soft md:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={imageSideSrc}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
