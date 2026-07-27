from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils.timezone import now

from metricas.models.visualizacao_model import VisualizacaoPublicacao
from metricas.services.metrica_service import MetricaService
from publicacoes.models.publicacao_model import PUBLICADO, Publicacao


class MetricaServiceTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.publicacao = Publicacao.objects.create(
            titulo="Teste",
            slug="teste-metrica",
            autor=self.admin,
            status=PUBLICADO,
            data_publicacao=now() - timedelta(hours=1),
        )

    def test_registrar_visualizacao_cria_registro(self):
        MetricaService.registrar_visualizacao(
            self.publicacao, ip="1.2.3.4", user_agent="TestAgent"
        )
        self.assertEqual(VisualizacaoPublicacao.objects.count(), 1)

    def test_registrar_visualizacao_nao_duplica_visitante_no_mesmo_dia(self):
        MetricaService.registrar_visualizacao(
            self.publicacao, ip="1.2.3.4", user_agent="TestAgent"
        )
        MetricaService.registrar_visualizacao(
            self.publicacao, ip="1.2.3.4", user_agent="TestAgent"
        )
        self.assertEqual(VisualizacaoPublicacao.objects.count(), 1)

    def test_obter_contagens_conteudo(self):
        contagens = MetricaService.obter_contagens_conteudo(self.admin)
        self.assertIn("total", contagens)
        self.assertIn("publicados", contagens)

    def test_obter_visualizacoes_por_periodo(self):
        MetricaService.registrar_visualizacao(self.publicacao, ip="1.1.1.1")
        resultado = MetricaService.obter_visualizacoes_por_periodo(
            self.admin, periodo="dia"
        )
        self.assertGreaterEqual(len(resultado), 1)
