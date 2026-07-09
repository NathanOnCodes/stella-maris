import { listarPublicacoes } from "@/features/publicacoes/api/buscar-publicacoes";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destaques = await listarPublicacoes().catch(() => []);
  const formacao = await listarPublicacoes({
    categoria_slug: "espiritualidade",
  }).catch(() => []);

  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-bold md:text-4xl">
          Vox Regina Caeli
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground font-leitura leading-relaxed">
          Revista digital católica independente. Notícias da Igreja,
          espiritualidade, apologética e entrevistas.
        </p>
      </div>

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
