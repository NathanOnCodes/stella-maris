from django.contrib.auth.models import User
from django.test import TestCase

from tags.models.tag_model import Tag


class TagAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")

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

    def test_listar_tags_publico(self):
        response = self.client.get("/api/tags/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_obter_tag_publico(self):
        response = self.client.get(f"/api/tags/{self.tag.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "vaticano")

    def test_obter_tag_inexistente_retorna_404(self):
        response = self.client.get("/api/tags/9999")
        self.assertEqual(response.status_code, 404)

    def test_criar_sem_auth_retorna_401(self):
        response = self.client.post(
            "/api/tags/",
            data={"nome": "X", "slug": "x"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_atualizar_sem_auth_retorna_401(self):
        response = self.client.put(
            f"/api/tags/{self.tag.id}",
            data={"nome": "X"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_deletar_sem_auth_retorna_401(self):
        response = self.client.delete(f"/api/tags/{self.tag.id}")
        self.assertEqual(response.status_code, 401)

    def test_criar_com_auth(self):
        response = self.client.post(
            "/api/tags/",
            data={"nome": "Latim", "slug": "latim"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome"], "Latim")

    def test_atualizar_com_auth(self):
        response = self.client.put(
            f"/api/tags/{self.tag.id}",
            data={"nome": "Santa Sé"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["nome"], "Santa Sé")

    def test_deletar_com_auth(self):
        response = self.client.delete(
            f"/api/tags/{self.tag.id}",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Tag.objects.filter(id=self.tag.id).exists())

    def test_criar_tag_slug_duplicado(self):
        response = self.client.post(
            "/api/tags/",
            data={"nome": "Outra", "slug": "vaticano"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertNotEqual(response.status_code, 200)

    def test_atualizar_tag_inexistente(self):
        response = self.client.put(
            "/api/tags/9999",
            data={"nome": "X"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 404)

    def test_deletar_tag_inexistente_retorna_404(self):
        response = self.client.delete(
            "/api/tags/9999",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 404)
