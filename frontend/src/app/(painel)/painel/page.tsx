import { adminGet } from "@/lib/fetch-admin";
import { ROTAS } from "@/lib/constantes";
import type { Dashboard } from "@/features/metricas/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Eye, FileText, PenLine } from "lucide-react";
import { PainelMetricCard } from "@/components/painel-metric-card";
import { GraficoAcessos } from "@/features/metricas/components/grafico-acessos";
import { TabelaMaisLidas } from "@/features/metricas/components/tabela-mais-lidas";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dados = await adminGet<Dashboard>(ROTAS.METRICAS_DASHBOARD).catch(
    () => null,
  );

  if (!dados) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-destructive font-ui">
          Erro ao carregar métricas.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-wine-700">Visão geral</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-wine-950">Dashboard editorial</h1>
        <p className="mt-2 text-sm text-muted-foreground">Acompanhe o ritmo da redação e a presença da Vox Regina Caeli.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PainelMetricCard label="Conteúdos" value={dados.total} hint="Todo o acervo editorial" icon={FileText} tone="neutral" />
        <PainelMetricCard label="Publicados" value={dados.publicados} hint="Disponíveis ao público" icon={PenLine} tone="gold" />
        <PainelMetricCard label="Visualizações" value={dados.total_visualizacoes ?? 0} hint="Visitantes únicos por dia" icon={Eye} tone="wine" />
        <PainelMetricCard label="Arquivados" value={dados.arquivados} hint={`${dados.rascunhos} em rascunho`} icon={Archive} tone="danger" />
      </div>

      {dados.acessos_por_periodo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display font-semibold">
              Acessos por período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoAcessos dados={dados.acessos_por_periodo} />
          </CardContent>
        </Card>
      )}

      {dados.mais_lidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display font-semibold">
              Mais lidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TabelaMaisLidas dados={dados.mais_lidas} />
          </CardContent>
        </Card>
      )}
    </section>
  );
}
