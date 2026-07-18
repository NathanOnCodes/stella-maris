import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginBanner } from "@/components/login-banner";
import { FormularioLogin } from "@/features/autenticacao/components/formulario-login";

export const metadata: Metadata = {
  title: "Entrar — Vox Regina Caeli",
  description: "Acesso restrito à equipe editorial da Vox Regina Caeli.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LoginBanner />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <Link
          href="/"
          className="absolute top-6 left-6 lg:hidden text-gray-400 hover:text-wine-900 transition-colors flex items-center text-sm font-semibold uppercase tracking-widest"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </Link>

        <Suspense fallback={<p className="text-sm text-muted-foreground font-ui">Carregando…</p>}>
          <FormularioLogin />
        </Suspense>
      </div>
    </div>
  );
}
