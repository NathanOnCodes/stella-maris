"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { PublicacaoResumo } from "@/features/publicacoes/types";
import { CardPublicacao } from "@/features/publicacoes/components/card-publicacao";

interface Props {
  publicacoes: PublicacaoResumo[];
  vazia?: string;
}

export function ListaPublicacoes({
  publicacoes,
  vazia = "Nenhuma publicação encontrada.",
}: Props) {
  const reduzirMovimento = useReducedMotion();

  const container: Variants = {
    escondido: {},
    visivel: {
      transition: { staggerChildren: reduzirMovimento ? 0 : 0.1 },
    },
  };

  if (publicacoes.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground font-leitura">
        {vazia}
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="escondido"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.15 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {publicacoes.map((p) => (
        <CardPublicacao key={p.id} publicacao={p} />
      ))}
    </motion.div>
  );
}
