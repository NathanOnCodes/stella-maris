from django.contrib.auth.models import User
from django.test import TestCase


class ConfiguracaoSiteAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin", password="admin123"
        )
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
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

    def test_obter_configuracao_publico_retorna_200(self):
        response = self.client.get("/api/configuracoes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome_site"], "Vox Regina Caeli")

    def test_atualizar_sem_auth_retorna_401(self):
        response = self.client.put(
            "/api/configuracoes/",
            data={"nome_site": "X"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_atualizar_colunista_retorna_403(self):
        response = self.client.put(
            "/api/configuracoes/",
            data={"nome_site": "X"},
            content_type="application/json",
            **self._auth("colunista", "col123"),
        )
        self.assertEqual(response.status_code, 403)

    def test_atualizar_admin_retorna_200(self):
        response = self.client.put(
            "/api/configuracoes/",
            data={"nome_site": "VRC Alterado", "descricao": "Desc nova"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome_site"], "VRC Alterado")
        self.assertEqual(response.json()["descricao"], "Desc nova")

    def test_obter_reflete_atualizacao(self):
        self.client.put(
            "/api/configuracoes/",
            data={"nome_site": "Atualizado"},
            content_type="application/json",
            **self._auth(),
        )
        response = self.client.get("/api/configuracoes/")
        self.assertEqual(response.json()["nome_site"], "Atualizado")
