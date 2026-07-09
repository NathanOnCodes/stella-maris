import { apiGet } from "@/lib/api-client";
import { ROTAS, CACHE_TAGS } from "@/lib/constantes";
import type { Publicacao, PublicacaoResumo } from "@/features/publicacoes/types";

interface Filtros {
  categoria_slug?: string;
  tag_slug?: string;
  busca?: string;
}

export async function listarPublicacoes(
  filtros?: Filtros,
): Promise<PublicacaoResumo[]> {
  const params = new URLSearchParams();
  if (filtros?.categoria_slug) params.set("categoria_slug", filtros.categoria_slug);
  if (filtros?.tag_slug) params.set("tag_slug", filtros.tag_slug);
  if (filtros?.busca) params.set("busca", filtros.busca);
  const qs = params.toString();
  const path = `${ROTAS.PUBLICACOES}${qs ? `?${qs}` : ""}`;
  return apiGet<PublicacaoResumo[]>(path, {
    next: {
      revalidate: 60,
      tags: [CACHE_TAGS.PUBLICACOES],
    },
  });
}

export async function obterPublicacaoPorSlug(
  slug: string,
): Promise<Publicacao> {
  return apiGet<Publicacao>(`${ROTAS.PUBLICACOES}/${slug}`, {
    next: {
      revalidate: 60,
      tags: [CACHE_TAGS.PUBLICACOES, `publicacao:${slug}`],
    },
  });
}
