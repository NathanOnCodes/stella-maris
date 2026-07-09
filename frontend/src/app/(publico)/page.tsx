import { listarPublicacoes } from "@/features/publicacoes/api/buscar-publicacoes";
import { listarCategorias } from "@/features/categorias/api/buscar-categorias";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";
import { HeroHome } from "@/features/publicacoes/components/hero-home";
import { Contadores } from "@/features/publicacoes/components/contadores";
import { Reveal } from "@/components/anim/reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destaques = await listarPublicacoes().catch(() => []);
  const formacao = await listarPublicacoes({
    categoria_slug: "espiritualidade",
  }).catch(() => []);
  const categorias = await listarCategorias().catch(() => []);

  const estatisticas = [
    { valor: destaques.length, rotulo: "Publicações" },
    { valor: categorias.length, rotulo: "Categorias" },
    {
      valor: new Set(destaques.map((p) => p.autor_nome)).size,
      rotulo: "Autores",
    },
    {
      valor: destaques.filter((p) => p.categoria_nome === "Espiritualidade")
        .length,
      rotulo: "Formação",
    },
  ];

  return (
    <section className="space-y-16">
      <HeroHome
        titulo="Vox Regina Caeli"
        descricao="Revista digital católica independente. Notícias da Igreja, espiritualidade, apologética e entrevistas."
      />

      <Reveal>
        <Contadores estatisticas={estatisticas} />
      </Reveal>

      <Reveal className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Destaques</h2>
        <ListaPublicacoes publicacoes={destaques} />
      </Reveal>

      <Reveal className="space-y-4 rounded-2xl bg-gradient-to-br from-muted to-muted/40 p-6 md:p-8">
        <h2 className="text-2xl font-display font-semibold">Formação</h2>
        <p className="text-sm text-muted-foreground font-leitura">
          Tutoriais e guias de espiritualidade para o crescimento na fé.
        </p>
        <ListaPublicacoes
          publicacoes={formacao}
          vazia="Nenhum conteúdo de formação disponível."
        />
      </Reveal>
    </section>
  );
}
