from ninja import Router
from ninja_jwt.authentication import JWTAuth

from metricas.api.metrica_schemas import DashboardOut
from metricas.services.metrica_service import MetricaService

router = Router(tags=["Métricas"])
auth = JWTAuth()


@router.get("/dashboard", response=DashboardOut, auth=auth)
def dashboard(request, periodo: str = "dia"):
    contagens = MetricaService.obter_contagens_conteudo(request.auth)
    acessos = MetricaService.obter_visualizacoes_por_periodo(request.auth, periodo)
    mais_lidas = MetricaService.obter_publicacoes_mais_lidas(request.auth)
    return {
        **contagens,
        "total_visualizacoes": sum(item["total"] for item in acessos),
        "acessos_por_periodo": acessos,
        "mais_lidas": mais_lidas,
    }


@router.get("/acessos", response=list, auth=auth)
def acessos_por_periodo(request, periodo: str = "dia"):
    return MetricaService.obter_visualizacoes_por_periodo(request.auth, periodo)


@router.get("/me", response=DashboardOut, auth=auth)
def meu_dashboard(request, periodo: str = "dia"):
    return MetricaService.obter_metricas_do_usuario(request.auth, periodo)
