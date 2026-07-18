import Link from "next/link";
import { HeroBanner } from "@/features/publicacoes/components/hero-banner";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";
import { QuoteSection } from "@/components/quote-section";
import { Reveal } from "@/components/anim/reveal";
import type { PublicacaoResumo } from "@/features/publicacoes/types";

const MOCK_PUBLICACOES: PublicacaoResumo[] = [
  {
    id: 1,
    titulo: "A importância da Oração Mental segundo Santa Teresa D'Ávila",
    subtitulo: "A oração não é outra coisa senão um trato de amizade com Aquele que sabemos que nos ama. Descubra os passos para a vida interior através dos ensinamentos da Doutora da Igreja.",
    slug: "oracao-mental-santa-teresa",
    imagem_capa: "https://images.unsplash.com/photo-1607584102179-8809f6e6ccf4?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-15T10:00:00Z",
    autor_nome: "Pe. João Paulo",
    categoria_nome: "Santos & Mártires",
    tags: [],
  },
  {
    id: 2,
    titulo: "Compreendendo o Catecismo da Igreja Católica",
    subtitulo: "Uma análise estrutural sobre o documento promulgado por São João Paulo II e sua importância indispensável para a formação do cristão contra as heresias modernas.",
    slug: "compreendendo-catecismo",
    imagem_capa: "https://images.unsplash.com/photo-1572007797825-780996f8c857?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-12T08:30:00Z",
    autor_nome: "Prof. Marcelo Ribeiro",
    categoria_nome: "Magistério",
    tags: [],
  },
  {
    id: 3,
    titulo: "A historicidade da Ressurreição de Cristo",
    subtitulo: "Argumentos fundamentados nas evidências históricas e nos escritos dos Padres Apostólicos para defender o núcleo da fé cristã frente ao ceticismo contemporâneo.",
    slug: "historicidade-ressurreicao",
    imagem_capa: "https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-10T14:00:00Z",
    autor_nome: "Dr. Antônio Campos",
    categoria_nome: "Apologética",
    tags: [],
  },
  {
    id: 4,
    titulo: "A Virgem Maria e os tempos finais",
    subtitulo: "O papel da Mãe de Deus no plano da salvação e sua presença materna nos momentos decisivos da história da Igreja.",
    slug: "virgem-maria-tempos-finais",
    imagem_capa: "https://images.unsplash.com/photo-1548625361-26c6ce7a2015?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-08T09:00:00Z",
    autor_nome: "Ir. Maria Clara",
    categoria_nome: "Mariologia",
    tags: [],
  },
];

export default function HomePage() {
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
              publicacoes={MOCK_PUBLICACOES}
              vazia="Nenhuma publicação encontrada."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
