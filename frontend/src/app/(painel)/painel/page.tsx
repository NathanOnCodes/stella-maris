import { adminGet } from "@/lib/fetch-admin";
import { ROTAS } from "@/lib/constantes";
import type { Dashboard } from "@/features/metricas/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-ui text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold">{dados.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-ui text-muted-foreground">
              Publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-primary">
              {dados.publicados}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-ui text-muted-foreground">
              Rascunhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-muted-foreground">
              {dados.rascunhos}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-ui text-muted-foreground">
              Arquivados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-destructive">
              {dados.arquivados}
            </p>
          </CardContent>
        </Card>
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
