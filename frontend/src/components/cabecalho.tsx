"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIAS = [
  { nome: "Notícias", slug: "noticias" },
  { nome: "Espiritualidade", slug: "espiritualidade" },
  { nome: "Entrevistas", slug: "entrevistas" },
  { nome: "Colunas", slug: "colunas" },
];

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-wine-900 text-white sticky top-0 z-50 shadow-md border-b border-gold-500/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-2">
              <span className="text-gold-500 text-3xl">☩</span> Vox Regina Caeli
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <a href="#" className="text-xs uppercase tracking-widest text-gold-500 font-semibold">Entrar</a>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-white hover:text-gold-500 focus:outline-none transition-colors"
              aria-label="Abrir menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex space-x-8 items-center font-medium text-sm tracking-widest uppercase">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="hover:text-gold-500 transition-colors duration-300"
              >
                {cat.nome}
              </Link>
            ))}
            <button className="text-white hover:text-gold-500 transition-colors border-l border-wine-700 pl-6 ml-2" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </nav>
        </div>

        {menuAberto && (
          <div className="md:hidden bg-wine-950 border-t border-wine-800">
            <div className="px-4 pt-4 pb-6 space-y-2 text-left uppercase tracking-widest text-sm font-semibold">
              {CATEGORIAS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setMenuAberto(false)}
                  className="block py-3 text-gray-300 hover:text-gold-500 transition-colors border-b border-wine-800"
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
