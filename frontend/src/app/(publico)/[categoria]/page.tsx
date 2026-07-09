import type { Metadata } from "next";
import { listarPublicacoes } from "@/features/publicacoes/api/buscar-publicacoes";
import { ListaPublicacoes } from "@/features/publicacoes/components/lista-publicacoes";

export const dynamic = "force-dynamic";

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
  const publicacoes = await listarPublicacoes({
    categoria_slug: categoria,
  }).catch(() => []);
  const nome = categoria.charAt(0).toUpperCase() + categoria.slice(1);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">{nome}</h1>
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
