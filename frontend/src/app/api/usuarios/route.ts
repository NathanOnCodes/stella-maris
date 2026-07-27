import { NextResponse } from "next/server";
import { adminGet } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function GET() {
  try {
    return NextResponse.json(await adminGet(ROTAS.USUARIOS_TIPO.replace("/tipo", "")));
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ detail: err.detail }, { status: err.status });
    throw err;
  }
}
