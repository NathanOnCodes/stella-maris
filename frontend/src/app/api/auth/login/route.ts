import { NextResponse } from "next/server";
import { API_BASE_URL, ROTAS } from "@/lib/constantes";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const res = await fetch(`${API_BASE_URL}${ROTAS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const body = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { detail: body.detail ?? "Credenciais inválidas." },
      { status: res.status },
    );
  }

  const response = NextResponse.json(body, { status: 200 });

  const isSecure = process.env.NODE_ENV === "production";

  response.cookies.set("access_token", body.access, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  response.cookies.set("refresh_token", body.refresh, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
