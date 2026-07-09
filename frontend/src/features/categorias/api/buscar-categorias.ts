import { apiGet } from "@/lib/api-client";
import { ROTAS, CACHE_TAGS } from "@/lib/constantes";
import type { Categoria } from "@/features/categorias/types";

export async function listarCategorias(): Promise<Categoria[]> {
  return apiGet<Categoria[]>(ROTAS.CATEGORIAS, {
    next: {
      revalidate: 300,
      tags: [CACHE_TAGS.CATEGORIAS],
    },
  });
}
