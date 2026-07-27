from django.contrib.auth.models import User
from django.test import TestCase


class IntegracaoCrossModuleTest(TestCase):
    """Testa fluxo completo: login → criar categoria → criar tag → criar publicação."""

    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()

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

    def test_fluxo_completo_criar_categoria_tag_publicacao(self):
        headers = self._auth()

        resp_cat = self.client.post(
            "/api/categorias/",
            data={"nome": "Notícias", "slug": "noticias-integ"},
            content_type="application/json",
            **headers,
        )
        self.assertEqual(resp_cat.status_code, 200)
        cat_id = resp_cat.json()["id"]

        resp_tag1 = self.client.post(
            "/api/tags/",
            data={"nome": "Vaticano", "slug": "vaticano-integ"},
            content_type="application/json",
            **headers,
        )
        self.assertEqual(resp_tag1.status_code, 200)
        tag1_id = resp_tag1.json()["id"]

        resp_tag2 = self.client.post(
            "/api/tags/",
            data={"nome": "Papa", "slug": "papa-integ"},
            content_type="application/json",
            **headers,
        )
        self.assertEqual(resp_tag2.status_code, 200)
        tag2_id = resp_tag2.json()["id"]

        resp_pub = self.client.post(
            "/api/publicacoes/admin/",
            data={
                "titulo": "Notícia do Vaticano",
                "slug": "noticia-vaticano-integ",
                "conteudo": "<p>Conteúdo da notícia</p>",
                "status": "publicado",
                "tipo_editorial": "entrevista",
                "categoria_id": cat_id,
                "tag_ids": [tag1_id, tag2_id],
            },
            content_type="application/json",
            **headers,
        )
        self.assertEqual(resp_pub.status_code, 200)
        dados = resp_pub.json()
        self.assertEqual(dados["titulo"], "Notícia do Vaticano")
        self.assertEqual(dados["categoria_id"], cat_id)
        self.assertEqual(dados["categoria_nome"], "Notícias")
        self.assertEqual(dados["tipo_editorial"], "entrevista")

        resp_publica = self.client.get("/api/publicacoes/noticia-vaticano-integ")
        self.assertEqual(resp_publica.status_code, 200)
        self.assertIn(
            "Conteúdo da notícia",
            resp_publica.json()["conteudo"],
        )
