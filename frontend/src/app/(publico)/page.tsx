import Link from "next/link";
import { mockListarPublicacoes } from "@/lib/mock";
import { HeroBanner } from "@/features/publicacoes/components/hero-banner";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";
import { QuoteSection } from "@/components/quote-section";
import { Reveal } from "@/components/anim/reveal";
import { InscricaoEditorial } from "@/components/inscricao-editorial";

export default function HomePage() {
  const destaques = mockListarPublicacoes();

  return (
    <div className="fundo-degrade-pagina">
      <Reveal>
        <HeroBanner
          titulo="A beleza que salva o mundo através da Liturgia"
          descricao="Explore uma perspetiva teológica inovadora sobre a herança litúrgica da Igreja, unindo o rigor intelectual dos Padres à sofisticação do design contemporâneo."
          categoriaLabel="Edição especial de verão"
        />
      </Reveal>

      <section className="bg-canvas py-24 lg:py-36">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 flex items-end justify-between border-b border-wine-900/10 pb-5">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-wine-700">Estudos críticos</p>
              <h2 className="font-serif text-3xl font-semibold text-wine-950 md:text-4xl">Grandes temas</h2>
            </div>
            <Link
              href="/noticias"
              className="hidden md:flex text-sm font-semibold text-wine-700 hover:text-gold-600 uppercase tracking-widest transition-colors items-center"
            >
              Ver todos <span className="ml-2 font-serif text-lg leading-none">→</span>
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

      <Reveal>
        <QuoteSection
          citacao="A cruz é a escola do amor. Nela, Jesus Cristo nos ensina que não há verdadeiro amor sem sacrifício."
          autor="São Maximiliano Kolbe"
        />
      </Reveal>

      <InscricaoEditorial />
    </div>
  );
}
