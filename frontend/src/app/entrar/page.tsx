"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const body = {
      username: form.get("username"),
      password: form.get("password"),
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.detail ?? "Erro ao fazer login.");
      setCarregando(false);
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/painel";
    router.push(redirect);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium font-ui">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium font-ui">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-ui ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {erro && <p className="text-sm text-destructive font-ui">{erro}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground font-ui transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {carregando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-display font-bold">Entrar</h1>
          <p className="text-sm text-muted-foreground font-leitura">
            Acesso restrito à equipe editorial.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground font-ui">Carregando…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
