import { NextResponse } from "next/server";
import { adminPut } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json(await adminPut(`${ROTAS.USUARIOS_TIPO}/${id}/tipo`, await request.json()));
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ detail: err.detail }, { status: err.status });
    throw err;
  }
}
