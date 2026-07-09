import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, ROTAS } from "@/lib/constantes";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { detail: "Refresh token ausente." },
      { status: 401 },
    );
  }

  const res = await fetch(`${API_BASE_URL}${ROTAS.REFRESH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const body = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { detail: body.detail ?? "Sessão expirada." },
      { status: 401 },
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

  return response;
}
