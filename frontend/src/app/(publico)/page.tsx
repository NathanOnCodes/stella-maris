import Link from "next/link";
import { listarPublicacoes } from "@/features/publicacoes/api/buscar-publicacoes";
import { HeroBanner } from "@/features/publicacoes/components/hero-banner";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";
import { QuoteSection } from "@/components/quote-section";
import { Reveal } from "@/components/anim/reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destaques = await listarPublicacoes().catch(() => []);

  return (
    <>
      <Reveal>
        <HeroBanner
          titulo="A centralidade da Eucaristia na vida da Igreja"
          descricao={'\u201CO sacrifício eucarístico é a fonte e o cume de toda a vida cristã\u201D (Lumen Gentium, 11). Uma reflexão teológica sobre o sacramento do amor e a presença real de Cristo.'}
          categoriaLabel="Formação Contínua"
        />
      </Reveal>

      <Reveal>
        <QuoteSection
          citacao="A cruz é a escola do amor. Nela, Jesus Cristo nos ensina que não há verdadeiro amor sem sacrifício."
          autor="São Maximiliano Kolbe"
        />
      </Reveal>

      <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-wine-900">
              Artigos, Notícias e Entrevistas
            </h2>
            <Link
              href="/noticias"
              className="hidden md:flex text-sm font-semibold text-wine-700 hover:text-gold-600 uppercase tracking-widest transition-colors items-center"
            >
              Ver todos <span className="ml-2 font-serif text-lg leading-none">&rarr;</span>
            </Link>
          </div>

          <Reveal>
            <ListaPublicacoes
              publicacoes={destaques}
              vazia="Nenhuma publicação encontrada."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
