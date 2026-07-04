from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils.timezone import now

from categorias.models.categoria_model import Categoria
from publicacoes.models.publicacao_model import PUBLICADO, RASCUNHO, Publicacao
from tags.models.tag_model import Tag


class PublicacaoAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
        )
        self.categoria = Categoria.objects.create(nome="Geral", slug="geral")
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")
        self.publicada = Publicacao.objects.create(
            titulo="Publicada",
            slug="publicada",
            autor=self.admin,
            categoria=self.categoria,
            status=PUBLICADO,
            data_publicacao=now() - timedelta(hours=1),
        )
        self.rascunho = Publicacao.objects.create(
            titulo="Rascunho",
            slug="rascunho",
            autor=self.admin,
            status=RASCUNHO,
        )
        self.futura = Publicacao.objects.create(
            titulo="Futura",
            slug="futura",
            autor=self.admin,
            status=PUBLICADO,
            data_publicacao=now() + timedelta(days=1),
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

    def test_listar_publicas_retorna_200(self):
        response = self.client.get("/api/publicacoes/")
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertEqual(len(dados), 1)
        self.assertEqual(dados[0]["slug"], "publicada")

    def test_obter_publica_por_slug_retorna_200(self):
        response = self.client.get("/api/publicacoes/publicada")
        self.assertEqual(response.status_code, 200)
        self.assertIn("conteudo", response.json())

    def test_obter_rascunho_publicamente_retorna_404(self):
        response = self.client.get("/api/publicacoes/rascunho")
        self.assertEqual(response.status_code, 404)

    def test_obter_agendada_futura_publicamente_retorna_404(self):
        response = self.client.get("/api/publicacoes/futura")
        self.assertEqual(response.status_code, 404)

    def test_criar_sem_auth_retorna_401(self):
        response = self.client.post(
            "/api/publicacoes/admin/",
            data={"titulo": "X", "slug": "x"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_atualizar_sem_auth_retorna_401(self):
        response = self.client.put(
            f"/api/publicacoes/admin/{self.publicada.id}",
            data={"titulo": "X"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_criar_como_admin(self):
        response = self.client.post(
            "/api/publicacoes/admin/",
            data={
                "titulo": "Nova",
                "slug": "nova",
                "categoria_id": self.categoria.id,
                "tag_ids": [self.tag.id],
            },
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["titulo"], "Nova")
        self.assertEqual(len(response.json()["tags"]), 1)

    def test_colunista_nao_edita_publicacao_alheia(self):
        response = self.client.put(
            f"/api/publicacoes/admin/{self.publicada.id}",
            data={"titulo": "Hackeado"},
            content_type="application/json",
            **self._auth("colunista", "col123"),
        )
        self.assertEqual(response.status_code, 403)

    def test_colunista_deleta_sua_propria(self):
        minha = Publicacao.objects.create(
            titulo="Minha",
            slug="minha-api",
            autor=self.colunista,
            status=RASCUNHO,
        )
        response = self.client.delete(
            f"/api/publicacoes/admin/{minha.id}",
            **self._auth("colunista", "col123"),
        )
        self.assertEqual(response.status_code, 204)

    def test_admin_lista_inclui_rascunho(self):
        response = self.client.get("/api/publicacoes/admin/", **self._auth())
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        slugs = [p["slug"] for p in dados]
        self.assertIn("rascunho", slugs)
        self.assertIn("publicada", slugs)

    def test_colunista_lista_admin_ve_apenas_suas(self):
        minha = Publicacao.objects.create(
            titulo="Só minha",
            slug="so-minha",
            autor=self.colunista,
            status=RASCUNHO,
        )
        response = self.client.get(
            "/api/publicacoes/admin/",
            **self._auth("colunista", "col123"),
        )
        dados = response.json()
        slugs = [p["slug"] for p in dados]
        self.assertIn("so-minha", slugs)
        self.assertNotIn("publicada", slugs)

    def test_deletar_sem_auth_retorna_401(self):
        response = self.client.delete(f"/api/publicacoes/admin/{self.publicada.id}")
        self.assertEqual(response.status_code, 401)

    def test_publicar_rascunho(self):
        response = self.client.put(
            f"/api/publicacoes/admin/{self.rascunho.id}",
            data={"status": "publicado", "data_publicacao": None},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        resposta = self.client.get("/api/publicacoes/rascunho")
        self.assertEqual(resposta.status_code, 200)

    def test_arquivar_publicacao(self):
        response = self.client.put(
            f"/api/publicacoes/admin/{self.publicada.id}",
            data={"status": "arquivado"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "arquivado")

    def test_admin_ve_publicacao_futura_por_id(self):
        response = self.client.get(
            f"/api/publicacoes/admin/{self.futura.id}", **self._auth()
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "futura")

    def test_criar_publicacao_sem_categoria_sem_tags(self):
        response = self.client.post(
            "/api/publicacoes/admin/",
            data={"titulo": "Minimalista", "slug": "minimalista"},
            content_type="application/json",
            **self._auth(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["categoria_id"], None)
        self.assertEqual(len(response.json()["tags"]), 0)
