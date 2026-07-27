import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockObterPublicacaoPorSlug } from "@/lib/mock";
import { LeitorArtigo } from "@/features/publicacoes/components/leitor-artigo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = mockObterPublicacaoPorSlug(slug);
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
  const pub = mockObterPublicacaoPorSlug(slug);
  if (!pub) notFound();

  return <LeitorArtigo publicacao={pub} />;
}
