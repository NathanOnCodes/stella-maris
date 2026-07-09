import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, ROTAS } from "@/lib/constantes";
import { ApiError } from "@/lib/api-client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData();
  const res = await fetch(
    `${API_BASE_URL}${ROTAS.PUBLICACOES_ADMIN}/${id}/imagem`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Erro no upload." }));
    return NextResponse.json(body, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Não autenticado." }, { status: 401 });
  }

  const res = await fetch(
    `${API_BASE_URL}${ROTAS.PUBLICACOES_ADMIN}/${id}/imagem`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
