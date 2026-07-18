import type { Metadata } from "next";
import { mockListarPublicacoes } from "@/lib/mock";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";

interface Props {
  params: Promise<{ categoria: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const nome = categoria.charAt(0).toUpperCase() + categoria.slice(1);
  return {
    title: nome,
    description: `Publicações na categoria ${nome}`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const publicacoes = mockListarPublicacoes({ categoria_slug: categoria });
  const nome = categoria.charAt(0).toUpperCase() + categoria.slice(1);

  return (
    <section className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-wine-900">{nome}</h1>
        <p className="text-muted-foreground font-leitura">
          Publicações na categoria {nome.toLowerCase()}.
        </p>
      </div>
      <ListaPublicacoes
        publicacoes={publicacoes}
        vazia={`Nenhuma publicação na categoria "${nome}".`}
      />
    </section>
  );
}
