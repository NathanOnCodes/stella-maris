import { NextResponse } from "next/server";
import { adminGet, adminPost } from "@/lib/fetch-admin";
import { ApiError } from "@/lib/api-client";
import { ROTAS } from "@/lib/constantes";

export async function GET() {
  try {
    const data = await adminGet(ROTAS.COLUNISTAS);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await adminPost(ROTAS.COLUNISTAS, body);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ detail: err.detail }, { status: err.status });
    }
    throw err;
  }
}
