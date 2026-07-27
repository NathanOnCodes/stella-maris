"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIAS = [
  { nome: "Notícias", slug: "noticias" },
  { nome: "Entrevistas", slug: "entrevistas" },
  { nome: "Colunas", slug: "colunas" },
];

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-full border border-white/10 bg-wine-950/85 shadow-2xl shadow-wine-950/20 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-2 font-serif text-sm font-bold tracking-[0.14em] text-white sm:text-base">
              <span className="text-xl text-gold-500 transition-transform duration-500 group-hover:rotate-12 sm:text-2xl">☩</span>
              <span>VOX REGINA CAELI</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Link href="/busca" className="text-white transition-colors hover:text-gold-400" aria-label="Buscar">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-white transition-colors hover:text-gold-500 focus:outline-none"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuAberto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <nav className="hidden items-center space-x-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 md:flex">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="transition-colors duration-300 hover:text-gold-400"
              >
                {cat.nome}
              </Link>
            ))}
            <Link href="/busca" className="ml-1 border-l border-white/15 pl-5 text-white transition-colors hover:text-gold-400" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </nav>
        </div>

        {menuAberto && (
          <div className="rounded-b-3xl border-t border-white/10 bg-wine-950/95 md:hidden">
            <div className="space-y-2 px-5 pb-5 pt-4 text-left text-xs font-semibold uppercase tracking-widest">
              {CATEGORIAS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setMenuAberto(false)}
                  className="block border-b border-white/10 py-3 text-white/75 transition-colors hover:text-gold-400"
                >
                  {cat.nome}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
