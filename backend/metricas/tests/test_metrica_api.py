from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils.timezone import now

from metricas.models.visualizacao_model import VisualizacaoPublicacao
from publicacoes.models.publicacao_model import PUBLICADO, Publicacao


class MetricaAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
        )
        self.publicacao = Publicacao.objects.create(
            titulo="Metrica Teste",
            slug="metrica-teste",
            autor=self.admin,
            status=PUBLICADO,
            data_publicacao=now() - timedelta(hours=1),
        )

    def _obter_tokens(self, username, password):
        response = self.client.post(
            "/api/token/pair",
            data={"username": username, "password": password},
            content_type="application/json",
        )
        return response.json()

    def _auth(self, username="admin", password="admin123"):
        tokens = self._obter_tokens(username, password)
        return {"HTTP_AUTHORIZATION": f"Bearer {tokens['access']}"}

    def test_dashboard_sem_auth_retorna_401(self):
        response = self.client.get("/api/metricas/dashboard")
        self.assertEqual(response.status_code, 401)

    def test_dashboard_colunista_retorna_403(self):
        response = self.client.get(
            "/api/metricas/dashboard",
            **self._auth("colunista", "col123"),
        )
        self.assertEqual(response.status_code, 403)

    def test_dashboard_admin_retorna_200(self):
        response = self.client.get(
            "/api/metricas/dashboard",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertIn("total", dados)
        self.assertIn("acessos_por_periodo", dados)

    def test_leitura_publica_registra_visualizacao(self):
        self.assertEqual(VisualizacaoPublicacao.objects.count(), 0)
        self.client.get("/api/publicacoes/metrica-teste")
        self.assertEqual(VisualizacaoPublicacao.objects.count(), 1)

    def test_acessos_por_periodo_admin_retorna_200(self):
        response = self.client.get(
            "/api/metricas/acessos?periodo=dia",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
