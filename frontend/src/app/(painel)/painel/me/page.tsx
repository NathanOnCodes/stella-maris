import { redirect } from "next/navigation";
import { Eye, FileText, PenLine, Archive } from "lucide-react";
import { adminGet } from "@/lib/fetch-admin";
import { ROTAS } from "@/lib/constantes";
import { obterSessao } from "@/lib/sessao";
import type { Dashboard } from "@/features/metricas/types";
import { PainelMetricCard } from "@/components/painel-metric-card";
import { GraficoAcessos } from "@/features/metricas/components/grafico-acessos";
import { TabelaMaisLidas } from "@/features/metricas/components/tabela-mais-lidas";

export const dynamic = "force-dynamic";

export default async function MeuDesempenhoPage() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar?redirect=/painel/me");
  if (sessao.eh_administrador) redirect("/painel");

  const dados = await adminGet<Dashboard>(ROTAS.METRICAS_ME).catch(() => null);
  if (!dados) {
    return <section className="rounded-[1.5rem] border border-wine-900/10 bg-white p-8 text-sm text-destructive">Não foi possível carregar seus indicadores.</section>;
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-wine-700">Área do colunista</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-wine-950">Olá, {sessao.username}.</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">Acompanhe a presença dos seus textos na comunidade Vox Regina Caeli.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PainelMetricCard label="Visualizações" value={dados.total_visualizacoes ?? 0} hint="Visitantes únicos por dia" icon={Eye} tone="wine" />
        <PainelMetricCard label="Publicações" value={dados.total} hint="Todos os seus conteúdos" icon={FileText} />
        <PainelMetricCard label="Publicados" value={dados.publicados} hint="Visíveis para o público" icon={PenLine} tone="gold" />
        <PainelMetricCard label="Arquivados" value={dados.arquivados} hint="Fora da área pública" icon={Archive} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <div className="rounded-[1.5rem] border border-wine-900/10 bg-white p-5 sm:p-7">
          <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-wine-700">Audiência</p><h2 className="mt-2 font-display text-2xl font-semibold text-wine-950">Evolução das leituras</h2></div>
          {dados.acessos_por_periodo.length ? <GraficoAcessos dados={dados.acessos_por_periodo} /> : <p className="py-16 text-center text-sm text-muted-foreground">Ainda não há visualizações suficientes.</p>}
        </div>
        <div className="rounded-[1.5rem] border border-wine-900/10 bg-white p-5 sm:p-7">
          <div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-wine-700">Performance</p><h2 className="mt-2 font-display text-2xl font-semibold text-wine-950">Mais lidas</h2></div>
          {dados.mais_lidas.length ? <TabelaMaisLidas dados={dados.mais_lidas} /> : <p className="py-16 text-center text-sm text-muted-foreground">Publique para acompanhar seu ranking.</p>}
        </div>
      </div>
    </section>
  );
}
