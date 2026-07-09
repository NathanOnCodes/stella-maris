export const API_BASE_URL = process.env.API_URL ?? "http://localhost:8000/api";

export const ROTAS = {
  STATUS: "/status",
  LOGIN: "/token/pair",
  REFRESH: "/token/refresh",
  ME: "/autenticacao/me",
  ALTERAR_SENHA: "/autenticacao/me/alterar-senha",
  COLUNISTAS: "/autenticacao/colunistas",
  CATEGORIAS: "/categorias",
  TAGS: "/tags",
  PUBLICACOES: "/publicacoes",
  PUBLICACOES_ADMIN: "/publicacoes/admin",
  CONFIGURACOES: "/configuracoes",
  METRICAS_DASHBOARD: "/metricas/dashboard",
  METRICAS_ACESSOS: "/metricas/acessos",
} as const;

export const STATUS_PUBLICACAO = {
  RASCUNHO: "rascunho",
  PUBLICADO: "publicado",
  ARQUIVADO: "arquivado",
} as const;

export const CACHE_TAGS = {
  PUBLICACOES: "publicacoes",
  CATEGORIAS: "categorias",
  TAGS: "tags",
  CONFIGURACOES: "configuracoes",
} as const;
