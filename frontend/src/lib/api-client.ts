import { API_BASE_URL } from "./constantes";

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export async function apiGet<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Erro inesperado" }));
    throw new ApiError(res.status, body.detail ?? "Erro inesperado");
  }
  return res.json();
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const bodyErr = await res.json().catch(() => ({ detail: "Erro inesperado" }));
    throw new ApiError(res.status, bodyErr.detail ?? "Erro inesperado");
  }
  return res.json();
}

export async function apiDelete(
  path: string,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Erro inesperado" }));
    throw new ApiError(res.status, body.detail ?? "Erro inesperado");
  }
}
