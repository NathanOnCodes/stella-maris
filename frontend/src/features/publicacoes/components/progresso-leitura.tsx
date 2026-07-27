"use client";

import { useEffect, useState } from "react";

export function ProgressoLeitura() {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    function atualizar() {
      const altura = document.documentElement.scrollHeight - window.innerHeight;
      setProgresso(altura > 0 ? Math.min(100, Math.max(0, (window.scrollY / altura) * 100)) : 0);
    }
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent print:hidden" aria-hidden="true">
      <div className="h-full bg-gold-500 transition-[width] duration-150" style={{ width: `${progresso}%` }} />
    </div>
  );
}
