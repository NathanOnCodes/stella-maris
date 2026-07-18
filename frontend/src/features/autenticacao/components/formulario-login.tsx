"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function FormularioLogin() {
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
    <div className="w-full max-w-md entrar-reveal">
      <div className="flex lg:hidden justify-center mb-8">
        <div className="relative w-24 h-24 rounded-full p-0.5 bg-gradient-to-br from-gold-400 via-gold-600 to-yellow-900 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Image
            src="/logo_monograma_maria_santissima.jpeg"
            alt="Logo Vox Regina Caeli"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full border-2 border-white"
          />
        </div>
      </div>

      <div className="text-center lg:text-left mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-wine-900 mb-3">Entrar</h1>
        <p className="text-gray-500 text-sm">Acesso restrito à equipe editorial.</p>
        <div className="w-12 h-1 bg-gold-500 mt-6 mx-auto lg:mx-0" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label htmlFor="username" className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 group-focus-within:text-wine-900 transition-colors">
            Usuário
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              name="username"
              id="username"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all bg-gray-50 focus:bg-white"
              placeholder="Digite seu usuário"
            />
          </div>
        </div>

        <div className="group">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-widest group-focus-within:text-wine-900 transition-colors">
              Senha
            </label>
            <a href="#" className="text-xs font-semibold text-wine-700 hover:text-gold-600 transition-colors">Esqueceu a senha?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            id="lembrar-me"
            name="lembrar-me"
            type="checkbox"
            className="h-4 w-4 text-wine-900 focus:ring-gold-500 border-gray-300 rounded cursor-pointer accent-wine-900"
          />
          <label htmlFor="lembrar-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
            Manter conectado
          </label>
        </div>

        {erro && <p className="text-sm text-destructive font-ui">{erro}</p>}

        <div className="pt-4">
          <button
            type="submit"
            disabled={carregando}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-wine-900 hover:bg-wine-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-900 hover:shadow-neon-gold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {carregando ? "Entrando…" : "Entrar na Plataforma"}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      <div className="mt-8 text-center lg:text-left hidden lg:block">
        <Link href="/" className="text-sm text-gray-500 hover:text-wine-900 font-semibold transition-colors inline-flex items-center">
          <svg className="w-4 h-4 mr-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
