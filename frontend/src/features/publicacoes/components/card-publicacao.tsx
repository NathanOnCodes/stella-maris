"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicacaoResumo } from "@/features/publicacoes/types";

interface Props {
  publicacao: PublicacaoResumo;
}

export function CardPublicacao({ publicacao }: Props) {
  const reduzirMovimento = useReducedMotion();

  const variants: Variants = {
    escondido: { opacity: 0, y: reduzirMovimento ? 0 : 20 },
    visivel: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={variants}
      whileHover={
        reduzirMovimento ? undefined : { y: -6, transition: { duration: 0.25 } }
      }
      className="group h-full"
    >
      <Link href={`/artigo/${publicacao.slug}`} className="block h-full">
        <Card className="h-full border-border/70 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_8px_30px_-8px_color-mix(in_oklch,var(--neon-vinho)_35%,transparent)]">
          <CardContent className="flex h-full flex-col gap-2 p-5">
            {publicacao.categoria_nome && (
              <Badge
                variant="secondary"
                className="w-fit text-xs uppercase tracking-wider"
              >
                {publicacao.categoria_nome}
              </Badge>
            )}
            <h2 className="text-xl font-display font-semibold leading-tight transition-colors group-hover:text-primary">
              {publicacao.titulo}
            </h2>
            {publicacao.subtitulo && (
              <p className="text-sm text-muted-foreground font-leitura">
                {publicacao.subtitulo}
              </p>
            )}
            <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground font-ui">
              <span>{publicacao.autor_nome}</span>
              {publicacao.data_publicacao && (
                <>
                  <span>·</span>
                  <time>
                    {new Date(publicacao.data_publicacao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </time>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
