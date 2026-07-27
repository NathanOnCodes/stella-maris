"use client";

import { useState } from "react";

export function AcoesArtigo({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: titulo, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2200);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={compartilhar}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-wine-900/10 bg-white px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-wine-900 transition hover:border-gold-500 hover:bg-gold-500 hover:text-wine-950"
        aria-label="Compartilhar artigo"
      >
        <span aria-hidden="true">↗</span> {copiado ? "Link copiado" : "Compartilhar"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="hidden min-h-10 items-center rounded-full border border-wine-900/10 bg-white px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-wine-900 transition hover:border-gold-500 hover:bg-gold-500 hover:text-wine-950 sm:inline-flex"
        aria-label="Imprimir artigo"
      >
        Imprimir
      </button>
    </div>
  );
}
