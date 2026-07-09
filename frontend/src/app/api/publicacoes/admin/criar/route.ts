import { NextResponse } from "next/server";
import { adminPost } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await adminPost<unknown>(ROTAS.PUBLICACOES_ADMIN, body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { detail: err.detail },
        { status: err.status },
      );
    }
    throw err;
  }
}
