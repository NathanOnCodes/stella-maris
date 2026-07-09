import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/fetch-admin";
import { ROTAS } from "@/lib/constantes";
import type { Publicacao, PublicacaoResumo } from "@/features/publicacoes/types";

export async function listarPublicacoesAdmin(): Promise<PublicacaoResumo[]> {
  return adminGet<PublicacaoResumo[]>(ROTAS.PUBLICACOES_ADMIN);
}

export async function listarCategorias(): Promise<{ id: number; nome: string }[]> {
  return adminGet(`${ROTAS.CATEGORIAS}`);
}

export async function listarTags(): Promise<{ id: number; nome: string }[]> {
  return adminGet(`${ROTAS.TAGS}`);
}
