import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, LayoutDashboard, Settings, Users, LogOut, BarChart3 } from "lucide-react";
import { obterSessao } from "@/lib/sessao";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar?redirect=/painel");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-muted p-4 md:flex">
        <Link
          href="/painel"
          className="mb-6 text-lg font-display font-bold tracking-tight"
        >
          Vox Regina Caeli
        </Link>
        <nav className="flex flex-1 flex-col gap-2">
          <Link
            href="/painel"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/painel/publicacoes"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <FileText className="size-4" />
            Publicações
          </Link>
          {sessao.tipo === "colunista" && (
            <Link
              href="/painel/me"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <BarChart3 className="size-4" />
              Meu desempenho
            </Link>
          )}
          {sessao.eh_administrador && (
            <>
              <Link
                href="/painel/colunistas"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <Users className="size-4" />
                Colunistas
              </Link>
              <Link
                href="/painel/configuracoes"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <Settings className="size-4" />
                Configurações
              </Link>
            </>
          )}
        </nav>
        <div className="border-t border-border pt-4">
          <div className="mb-3 px-3 text-sm font-ui text-muted-foreground">
            {sessao.username}
            <span className="ml-2 text-xs">
              ({sessao.eh_administrador ? "admin" : "colunista"})
            </span>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-ui font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
          <h2 className="text-base font-display font-semibold">Painel</h2>
          <span className="text-sm text-muted-foreground font-ui">
            {sessao.username}
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
