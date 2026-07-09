import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { obterPublicacaoPorSlug } from "@/features/publicacoes/api/buscar-publicacoes";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = await obterPublicacaoPorSlug(slug).catch(() => null);
  if (!pub) return {};
  return {
    title: pub.titulo,
    description: pub.subtitulo || `Artigo de ${pub.autor_nome} na Vox Regina Caeli`,
    openGraph: {
      title: pub.titulo,
      description: pub.subtitulo || undefined,
      type: "article",
      publishedTime: pub.data_publicacao ?? undefined,
      authors: [pub.autor_nome],
    },
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const pub = await obterPublicacaoPorSlug(slug).catch(() => null);
  if (!pub) notFound();

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        {pub.categoria_nome && (
          <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider">
            {pub.categoria_nome}
          </Badge>
        )}
        <h1 className="text-3xl font-display font-bold leading-tight md:text-4xl">
          {pub.titulo}
        </h1>
        {pub.subtitulo && (
          <p className="text-lg text-muted-foreground font-leitura">
            {pub.subtitulo}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-ui">
          <span>{pub.autor_nome}</span>
          {pub.data_publicacao && (
            <>
              <span>·</span>
              <time dateTime={pub.data_publicacao}>
                {new Date(pub.data_publicacao).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none font-leitura leading-relaxed [&_em]:italic"
        dangerouslySetInnerHTML={{ __html: pub.conteudo }}
      />

      {pub.tags.length > 0 && (
        <footer className="flex flex-wrap gap-2 border-t border-border pt-4">
          {pub.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.nome}
            </Badge>
          ))}
        </footer>
      )}
    </article>
  );
}
