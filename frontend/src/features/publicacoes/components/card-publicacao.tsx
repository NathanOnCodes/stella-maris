import Link from "next/link";
import Image from "next/image";
import type { PublicacaoResumo } from "@/features/publicacoes/types";

interface Props {
  publicacao: PublicacaoResumo;
  index?: number;
}

export function CardPublicacao({ publicacao, index = 0 }: Props) {
  return (
    <article
      className="group flex flex-col bg-white rounded-sm overflow-hidden border border-gray-100 hover:border-gold-500 transition-all duration-700 ease-out hover:-translate-y-3 cursor-pointer hover:shadow-neon-gold"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/artigo/${publicacao.slug}`} className="flex flex-col h-full">
        <div className="relative h-56 overflow-hidden">
          {publicacao.imagem_capa ? (
            <Image
              src={publicacao.imagem_capa}
              alt={publicacao.titulo}
              width={600}
              height={300}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out"
            />
          ) : (
            <div className="w-full h-full bg-wine-900 flex items-center justify-center">
              <span className="text-gold-500 text-4xl font-serif">☩</span>
            </div>
          )}
          <div className="absolute inset-0 bg-wine-900/0 group-hover:bg-wine-900/10 transition-colors duration-500" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          {publicacao.categoria_nome && (
            <span className="text-wine-700 text-xs font-bold uppercase tracking-widest mb-2">
              {publicacao.categoria_nome}
            </span>
          )}
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-wine-700 transition-colors">
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
