"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface Estatistica {
  valor: number;
  rotulo: string;
}

interface Props {
  estatisticas: Estatistica[];
}

function Contador({ valor, rotulo }: Estatistica) {
  const ref = useRef<HTMLSpanElement>(null);
  const emVista = useInView(ref, { once: true, amount: 0.5 });
  const reduzirMovimento = useReducedMotion();
  const [exibido, setExibido] = useState(0);

  useEffect(() => {
    if (!emVista) return;
    const controls = animate(0, valor, {
      duration: reduzirMovimento ? 0 : 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setExibido(Math.round(v)),
    });
    return () => controls.stop();
  }, [emVista, valor, reduzirMovimento]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        ref={ref}
        className="text-4xl font-display font-bold text-primary md:text-5xl"
      >
        {exibido}
      </span>
      <span className="text-sm font-ui uppercase tracking-wider text-muted-foreground">
        {rotulo}
      </span>
    </div>
  );
}

export function Contadores({ estatisticas }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border/60 bg-gradient-to-br from-muted/60 to-background p-8 sm:grid-cols-4">
      {estatisticas.map((e) => (
        <Contador key={e.rotulo} valor={e.valor} rotulo={e.rotulo} />
      ))}
    </div>
  );
}
