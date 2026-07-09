import { listarPublicacoes } from "@/features/publicacoes/api/buscar-publicacoes";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";
import { HeroHome } from "@/features/publicacoes/components/hero-home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destaques = await listarPublicacoes().catch(() => []);
  const formacao = await listarPublicacoes({
    categoria_slug: "espiritualidade",
  }).catch(() => []);

  return (
    <section className="space-y-12">
      <HeroHome
        titulo="Vox Regina Caeli"
        descricao="Revista digital católica independente. Notícias da Igreja, espiritualidade, apologética e entrevistas."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Destaques</h2>
        <ListaPublicacoes publicacoes={destaques} />
      </section>

      <section className="space-y-4 rounded-lg bg-muted p-6">
        <h2 className="text-2xl font-display font-semibold">Formação</h2>
        <p className="text-sm text-muted-foreground font-leitura">
          Tutoriais e guias de espiritualidade para o crescimento na fé.
        </p>
        <ListaPublicacoes
          publicacoes={formacao}
          vazia="Nenhum conteúdo de formação disponível."
        />
      </section>
    </section>
  );
}
