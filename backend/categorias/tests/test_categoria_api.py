from django.contrib.auth.models import User
from django.test import TestCase

from categorias.models.categoria_model import Categoria


class CategoriaAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.cat = Categoria.objects.create(
            nome="Notícias", slug="noticias", descricao="Desc"
        )

    def _obter_tokens(self):
        response = self.client.post(
            "/api/token/pair",
            data={"username": "admin", "password": "admin123"},
            content_type="application/json",
        )
        return response.json()

    def _auth(self):
        tokens = self._obter_tokens()
        return {"HTTP_AUTHORIZATION": f"Bearer {tokens['access']}"}

    def test_listar_categorias_publico(self):
        response = self.client.get("/api/categorias/")
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertEqual(len(dados), 1)
        self.assertEqual(dados[0]["nome"], "Notícias")

    def test_obter_categoria_publico(self):
        response = self.client.get(f"/api/categorias/{self.cat.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "noticias")

    def test_obter_categoria_inexistente_retorna_404(self):
        response = self.client.get("/api/categorias/9999")
        self.assertEqual(response.status_code, 404)

    def _auth_colunista(self):
        colunista = User.objects.create_user(
            username="colun", password="col123"
        )
        response = self.client.post(
            "/api/token/pair",
            data={"username": "colun", "password": "col123"},
            content_type="application/json",
        )
        return {"HTTP_AUTHORIZATION": f"Bearer {response.json()['access']}"}

    def test_criar_colunista_retorna_403(self):
        response = self.client.post(
            "/api/categorias/",
            data={"nome": "X", "slug": "x"},
            content_type="application/json",
            **self._auth_colunista(),
        )
        self.assertEqual(response.status_code, 403)

    def test_atualizar_colunista_retorna_403(self):
        response = self.client.put(
            f"/api/categorias/{self.cat.id}",
            data={"nome": "X"},
            content_type="application/json",
            **self._auth_colunista(),
        )
        self.assertEqual(response.status_code, 403)

    def test_deletar_colunista_retorna_403(self):
        response = self.client.delete(
            f"/api/categorias/{self.cat.id}",
            **self._auth_colunista(),
        )
        self.assertEqual(response.status_code, 403)

    def test_criar_sem_auth_retorna_401(self):
        response = self.client.post(
            "/api/categorias/",
            data={"nome": "X", "slug": "x"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_atualizar_sem_auth_retorna_401(self):
        response = self.client.put(
            f"/api/categorias/{self.cat.id}",
            data={"nome": "X"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_deletar_sem_auth_retorna_401(self):
        response = self.client.delete(f"/api/categorias/{self.cat.id}")
        self.assertEqual(response.status_code, 401)

    def test_criar_com_auth(self):
        response = self.client.post(
            "/api/categorias/",
            data={"nome": "Nova", "slug": "nova"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome"], "Nova")

    def test_atualizar_com_auth(self):
        response = self.client.put(
            f"/api/categorias/{self.cat.id}",
            data={"nome": "Alterada"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome"], "Alterada")

    def test_deletar_com_auth(self):
        response = self.client.delete(
            f"/api/categorias/{self.cat.id}",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Categoria.objects.filter(id=self.cat.id).exists())

    def test_criar_categoria_slug_duplicado(self):
        self.client.raise_request_exception = False
        response = self.client.post(
            "/api/categorias/",
            data={"nome": "Outra", "slug": "noticias"},
            content_type="application/json",
            **self._auth(),
        )
        self.client.raise_request_exception = True
        self.assertEqual(response.status_code, 500)

    def test_atualizar_categoria_inexistente(self):
        response = self.client.put(
            "/api/categorias/9999",
            data={"nome": "X"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 404)

    def test_deletar_categoria_inexistente_retorna_404(self):
        response = self.client.delete(
            "/api/categorias/9999",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 404)
