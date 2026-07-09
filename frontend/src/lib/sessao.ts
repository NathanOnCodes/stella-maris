import { cookies } from "next/headers";
import { apiGet } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";
import type { Perfil } from "@/features/autenticacao/types";

export async function obterSessao(): Promise<Perfil | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    return await apiGet<Perfil>(ROTAS.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}
