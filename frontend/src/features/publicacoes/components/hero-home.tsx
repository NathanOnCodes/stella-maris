"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

interface Props {
  titulo: string;
  descricao: string;
}

export function HeroHome({ titulo, descricao }: Props) {
  const reduzirMovimento = useReducedMotion();

  const container = {
    escondido: {},
    visivel: {
      transition: { staggerChildren: reduzirMovimento ? 0 : 0.15 },
    },
  };

  const item = {
    escondido: { opacity: 0, y: reduzirMovimento ? 0 : 24 },
    visivel: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="hero-aurora rounded-2xl px-6 py-16 text-center text-white md:px-12 md:py-24">
      <motion.div
        variants={container}
        initial="escondido"
        animate="visivel"
        className="mx-auto flex max-w-2xl flex-col items-center gap-5"
      >
        <motion.h1
          variants={item}
          className="texto-neon text-4xl font-display font-bold leading-tight md:text-6xl"
        >
          {titulo}
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-xl text-lg text-white/85 font-leitura leading-relaxed"
        >
          {descricao}
        </motion.p>
        <motion.div variants={item}>
          <Link
            href="/noticias"
            className="link-neon inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-ui font-medium uppercase tracking-wider backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Explorar publicações
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
