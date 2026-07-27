import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AcoesArtigo } from "@/features/publicacoes/components/acoes-artigo";
import { ProgressoLeitura } from "@/features/publicacoes/components/progresso-leitura";
import type { Publicacao } from "@/features/publicacoes/types";
import { ImagemPublicacao } from "@/features/publicacoes/components/imagem-publicacao";

function formatarData(data: string | null) {
  if (!data) return null;
  return new Date(data).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

export function LeitorArtigo({ publicacao }: { publicacao: Publicacao }) {
  const data = formatarData(publicacao.data_publicacao);
  const tempoLeitura = Math.max(2, Math.ceil(publicacao.conteudo.replace(/<[^>]+>/g, " ").split(/\s+/).length / 180));

  return (
    <>
      <ProgressoLeitura />
      <main className="min-h-screen bg-canvas px-4 pb-20 pt-28 text-wine-950 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between gap-4 border-b border-wine-900/10 pb-5 print:hidden">
            <Link href={publicacao.categoria_nome ? `/${publicacao.categoria_nome.toLowerCase()}` : "/"} className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-wine-700 transition hover:text-gold-600">
              <span className="text-lg transition-transform group-hover:-translate-x-1">←</span> Voltar à revista
            </Link>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:block">{tempoLeitura} min de leitura</span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,760px)_220px] lg:justify-center lg:gap-20">
            <article>
              <header className="mb-12">
                {publicacao.categoria_nome && <Badge variant="secondary" className="mb-6 rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-wine-700">{publicacao.categoria_nome}</Badge>}
                <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-wine-950 sm:text-5xl lg:text-7xl">{publicacao.titulo}</h1>
                {publicacao.subtitulo && <p className="mt-7 max-w-3xl font-leitura text-lg leading-8 text-wine-800/70 sm:text-xl">{publicacao.subtitulo}</p>}
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500">
                  <span className="font-semibold text-wine-900">{publicacao.autor_nome}</span>
                  {data && <><span aria-hidden="true">·</span><time dateTime={publicacao.data_publicacao ?? undefined}>{data}</time></>}
                </div>
              </header>

              <div className="relative mb-14 h-[280px] overflow-hidden rounded-[2rem] bg-wine-950 shadow-2xl shadow-wine-950/10 sm:h-[420px] lg:h-[560px]"><ImagemPublicacao src={publicacao.imagem_capa} alt={publicacao.titulo} categoria={publicacao.categoria_nome} /></div>

              <div className="article-content font-leitura text-[1.08rem] leading-[1.9] text-wine-950/90 [&_a]:text-wine-700 [&_a]:underline [&_blockquote]:my-10 [&_blockquote]:border-l-2 [&_blockquote]:border-gold-500 [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:text-2xl [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-2xl [&_li]:my-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:font-bold [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: publicacao.conteudo }} />

              <footer className="mt-16 border-t border-wine-900/10 pt-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">{publicacao.tags.map((tag) => <Badge key={tag.id} variant="outline" className="rounded-full border-wine-900/15 px-3 py-1 text-xs text-wine-700">#{tag.nome}</Badge>)}</div>
                  <AcoesArtigo titulo={publicacao.titulo} />
                </div>
              </footer>
            </article>

            <aside className="hidden lg:block print:hidden">
              <div className="sticky top-32 space-y-8 border-l border-wine-900/10 pl-6 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                <span className="block text-gold-600">Agora lendo</span>
                <p className="font-serif text-sm normal-case leading-relaxed tracking-normal text-wine-900">{publicacao.titulo}</p>
                <div className="h-px bg-wine-900/10" />
                <span>{tempoLeitura} minutos</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
