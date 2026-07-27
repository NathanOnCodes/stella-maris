from django.contrib.auth.models import User
from django.db import models
from django.db.models import Count
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek
from django.utils.timezone import localdate

from core.decorators import requer_admin
from metricas.models.visualizacao_model import VisualizacaoPublicacao
from publicacoes.models.publicacao_model import Publicacao


class MetricaService:
    @staticmethod
    def registrar_visualizacao(
        publicacao: Publicacao,
        ip: str = "",
        user_agent: str = "",
        referrer: str = "",
    ) -> None:
        visitante_hash = VisualizacaoPublicacao.gerar_hash(ip, user_agent)
        if (ip or user_agent) and VisualizacaoPublicacao.objects.filter(
            publicacao=publicacao,
            visitante_hash=visitante_hash,
            data__date=localdate(),
        ).exists():
            return
        VisualizacaoPublicacao.objects.create(
            publicacao=publicacao,
            visitante_hash=visitante_hash,
            referrer=referrer,
        )

    @staticmethod
    @requer_admin
    def obter_total_visualizacoes(solicitante: User, publicacao_id: int) -> int:
        return VisualizacaoPublicacao.objects.filter(
            publicacao_id=publicacao_id
        ).count()

    @staticmethod
    @requer_admin
    def obter_visualizacoes_por_periodo(
        solicitante: User, periodo: str = "dia"
    ) -> list[dict]:
        return MetricaService._acessos_do_queryset(
            VisualizacaoPublicacao.objects.all(), periodo
        )

    @staticmethod
    def _acessos_do_queryset(queryset, periodo: str) -> list[dict]:
        trunc_map = {"dia": TruncDay, "semana": TruncWeek, "mes": TruncMonth}
        fn = trunc_map.get(periodo, TruncDay)
        limite = {"dia": 30, "semana": 12, "mes": 12}.get(periodo, 30)
        qs = (
            queryset.annotate(periodo=fn("data"))
            .values("periodo")
            .annotate(total=Count("id"))
            .order_by("-periodo")[:limite]
        )
        return [
            {"periodo": item["periodo"].isoformat(), "total": item["total"]}
            for item in qs
        ]

    @staticmethod
    @requer_admin
    def obter_publicacoes_mais_lidas(
        solicitante: User, limite: int = 10
    ) -> list[dict]:
        return MetricaService._mais_lidas_do_queryset(
            VisualizacaoPublicacao.objects.all(), limite
        )

    @staticmethod
    def _mais_lidas_do_queryset(queryset, limite: int = 10) -> list[dict]:
        qs = (
            queryset
            .values("publicacao_id", "publicacao__titulo", "publicacao__slug")
            .annotate(total=Count("id"))
            .order_by("-total")[:limite]
        )
        return [
            {
                "publicacao_id": item["publicacao_id"],
                "titulo": item["publicacao__titulo"],
                "slug": item["publicacao__slug"],
                "total": item["total"],
            }
            for item in qs
        ]

    @staticmethod
    @requer_admin
    def obter_contagens_conteudo(solicitante: User) -> dict:
        return Publicacao.objects.aggregate(
            total=Count("id"),
            publicados=Count("id", filter=models.Q(status="publicado")),
            rascunhos=Count("id", filter=models.Q(status="rascunho")),
            arquivados=Count("id", filter=models.Q(status="arquivado")),
        )

    @staticmethod
    def obter_metricas_do_usuario(solicitante: User, periodo: str = "dia") -> dict:
        publicacoes = Publicacao.objects.filter(autor=solicitante)
        visualizacoes = VisualizacaoPublicacao.objects.filter(
            publicacao__autor=solicitante
        )
        contagens = publicacoes.aggregate(
            total=Count("id"),
            publicados=Count("id", filter=models.Q(status="publicado")),
            rascunhos=Count("id", filter=models.Q(status="rascunho")),
            arquivados=Count("id", filter=models.Q(status="arquivado")),
        )
        return {
            **contagens,
            "total_visualizacoes": visualizacoes.count(),
            "acessos_por_periodo": MetricaService._acessos_do_queryset(
                visualizacoes, periodo
            ),
            "mais_lidas": MetricaService._mais_lidas_do_queryset(visualizacoes),
        }
