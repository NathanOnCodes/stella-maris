import { mockListarPublicacoes } from "@/lib/mock";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";

interface Props {
  searchParams: Promise<{ busca?: string }>;
}

export default async function BuscaPage({ searchParams }: Props) {
  const { busca } = await searchParams;
  const publicacoes = busca
    ? mockListarPublicacoes({ busca })
    : [];

  return (
    <section className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-wine-900">Busca</h1>
        <form className="flex gap-2" action="/busca" method="GET">
          <input
            name="busca"
            defaultValue={busca ?? ""}
            placeholder="Buscar publicações…"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground font-ui transition-colors hover:bg-primary/90"
          >
            Buscar
          </button>
        </form>
      </div>

      {busca && (
        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-wine-900">
            Resultados para &ldquo;{busca}&rdquo;
          </h2>
          <ListaPublicacoes
            publicacoes={publicacoes}
            vazia={`Nenhum resultado encontrado para "${busca}".`}
          />
        </section>
      )}
    </section>
  );
}
