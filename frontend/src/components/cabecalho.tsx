"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const CATEGORIAS = [
  { nome: "Notícias", slug: "noticias" },
  { nome: "Espiritualidade", slug: "espiritualidade" },
  { nome: "Apologética", slug: "apologetica" },
  { nome: "Entrevistas", slug: "entrevistas" },
  { nome: "Colunas", slug: "colunas" },
];

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);

  return (
    <header
      className="borda-neon-inferior relative flex flex-col items-center justify-center bg-cover bg-center px-4 py-20 text-white"
      style={{
        backgroundImage:
          "url('/background-nossa-senhora.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="texto-neon text-2xl font-display font-bold tracking-tight"
        >
          Vox Regina Caeli
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="link-neon text-sm font-ui font-medium uppercase tracking-wider text-white/90 hover:text-white"
            >
              {cat.nome}
            </Link>
          ))}
        </nav>
        <Sheet open={aberto} onOpenChange={setAberto}>
          <SheetTrigger
            aria-label="Abrir menu"
            className="flex md:hidden cursor-pointer items-center justify-center text-white"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-foreground text-white">
            <nav className="mt-8 flex flex-col gap-4">
              {CATEGORIAS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setAberto(false)}
                  className="link-neon text-lg font-medium uppercase tracking-wider text-white/80 hover:text-white"
                >
                  {cat.nome}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
