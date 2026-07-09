import { NextResponse } from "next/server";
import { adminDelete, adminPut } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await adminPut(`${ROTAS.COLUNISTAS}/${id}`, body);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await adminDelete(`${ROTAS.COLUNISTAS}/${id}`);
    return NextResponse.json({ detail: "Colunista excluído." });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}
