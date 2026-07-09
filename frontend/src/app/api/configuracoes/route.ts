import { NextResponse } from "next/server";
import { adminPut } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { API_BASE_URL, ROTAS } from "@/lib/constantes";

export async function GET() {
  const res = await fetch(`${API_BASE_URL}${ROTAS.CONFIGURACOES}`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await adminPut(ROTAS.CONFIGURACOES, body);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}
