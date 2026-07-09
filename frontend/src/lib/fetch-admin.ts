import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constantes";
import { ApiError } from "@/lib/api-client";

async function fetchComToken(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const cookieStore = await cookies();
  let token = cookieStore.get("access_token")?.value;

  const fazerRequisicao = (tk: string | undefined) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        Authorization: `Bearer ${tk}`,
      },
    });

  if (!token) throw new ApiError(401, "Não autenticado.");

  let res = await fazerRequisicao(token);

  if (res.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/refresh`,
      { method: "POST" },
    );
    if (!refreshRes.ok) throw new ApiError(401, "Sessão expirada.");

    const refreshed = await refreshRes.json();
    token = refreshed.access ?? "";
    if (!token) throw new ApiError(401, "Sessão expirada.");
    res = await fazerRequisicao(token);
  }

  return res;
}

export async function adminGet<T>(path: string): Promise<T> {
  const res = await fetchComToken(path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Erro inesperado." }));
    throw new ApiError(res.status, body.detail ?? "Erro inesperado.");
  }
  return res.json();
}

export async function adminPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetchComToken(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const bodyErr = await res.json().catch(() => ({ detail: "Erro inesperado." }));
    throw new ApiError(res.status, bodyErr.detail ?? "Erro inesperado.");
  }
  return res.json();
}

export async function adminPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchComToken(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const bodyErr = await res.json().catch(() => ({ detail: "Erro inesperado." }));
    throw new ApiError(res.status, bodyErr.detail ?? "Erro inesperado.");
  }
  return res.json();
}

export async function adminDelete(path: string): Promise<void> {
  const res = await fetchComToken(path, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Erro inesperado." }));
    throw new ApiError(res.status, body.detail ?? "Erro inesperado.");
  }
}
