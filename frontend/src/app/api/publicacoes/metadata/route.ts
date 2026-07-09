import { NextResponse } from "next/server";
import { API_BASE_URL, ROTAS } from "@/lib/constantes";

export async function GET() {
  const [cats, tags] = await Promise.all([
    fetch(`${API_BASE_URL}${ROTAS.CATEGORIAS}`).then((r) => r.json()),
    fetch(`${API_BASE_URL}${ROTAS.TAGS}`).then((r) => r.json()),
  ]);
  return NextResponse.json({ categorias: cats, tags });
}
