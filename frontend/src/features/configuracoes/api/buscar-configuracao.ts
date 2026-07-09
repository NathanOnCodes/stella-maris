import { apiGet } from "@/lib/api-client";
import { ROTAS, CACHE_TAGS } from "@/lib/constantes";
import type { ConfiguracaoSite } from "@/features/configuracoes/types";

export async function obterConfiguracao(): Promise<ConfiguracaoSite | null> {
  return apiGet<ConfiguracaoSite>(ROTAS.CONFIGURACOES, {
    next: {
      revalidate: 300,
      tags: [CACHE_TAGS.CONFIGURACOES],
    },
  }).catch(() => null);
}
