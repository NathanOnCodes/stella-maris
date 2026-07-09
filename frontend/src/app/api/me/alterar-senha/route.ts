import { NextResponse } from "next/server";
import { adminPost } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await adminPost(ROTAS.ALTERAR_SENHA, body);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}
