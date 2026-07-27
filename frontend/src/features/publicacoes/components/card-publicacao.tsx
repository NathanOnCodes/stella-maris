import Link from "next/link";
import type { PublicacaoResumo } from "@/features/publicacoes/types";
import { ImagemPublicacao } from "@/features/publicacoes/components/imagem-publicacao";

interface Props {
  publicacao: PublicacaoResumo;
  index?: number;
}

export function CardPublicacao({ publicacao, index = 0 }: Props) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-wine-900/10 bg-white transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold-500 hover:shadow-neon-gold"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/artigo/${publicacao.slug}`} className="flex flex-col h-full">
        <div className="relative h-52 overflow-hidden bg-wine-950">
          <ImagemPublicacao src={publicacao.imagem_capa} alt={publicacao.titulo} categoria={publicacao.categoria_nome} className="transition-transform duration-1000 ease-in-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-wine-900/0 group-hover:bg-wine-900/10 transition-colors duration-500" />
        </div>
        <div className="flex flex-grow flex-col p-6">
          {publicacao.categoria_nome && (
            <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-wine-700">
              {publicacao.categoria_nome}
            </span>
          )}
            <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-wine-950 transition-colors group-hover:text-wine-700">
            {publicacao.titulo}
          </h3>
          {publicacao.subtitulo && (
            <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
              {publicacao.subtitulo}
            </p>
          )}
          <span className="inline-flex items-center text-wine-900 font-semibold text-sm transition-colors group-hover:text-gold-600">
            Ler artigo <span className="ml-2 font-serif text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
