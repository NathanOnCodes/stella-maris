from datetime import timedelta

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.test import TestCase
from django.utils.timezone import now

from categorias.models.categoria_model import Categoria
from core.exceptions import PermissaoNegada, RegistroNaoEncontrado
from publicacoes.models.publicacao_model import (
    ARQUIVADO,
    PUBLICADO,
    RASCUNHO,
    Publicacao,
)
from publicacoes.services.publicacao_service import PublicacaoService
from tags.models.tag_model import Tag


class PublicacaoServiceTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="x")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista_a = User.objects.create_user(username="col_a", password="x")
        self.colunista_b = User.objects.create_user(username="col_b", password="x")
        self.categoria = Categoria.objects.create(nome="Geral", slug="geral")
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")

    def _criar(self, autor=None, **kwargs):
        dados = {
            "titulo": kwargs.get("titulo", "Título Padrão"),
            "slug": kwargs.get("slug"),
            "conteudo": kwargs.get("conteudo", ""),
            "status": kwargs.get("status", PUBLICADO),
            "data_publicacao": kwargs.get(
                "data_publicacao", now() - timedelta(hours=1)
            ),
            "categoria_id": kwargs.get("categoria_id", self.categoria.id),
            "tag_ids": kwargs.get("tag_ids", [self.tag.id]),
        }
        return PublicacaoService.criar_publicacao(autor or self.admin, dados)

    def test_publicas_retorna_apenas_publicadas(self):
        self._criar(titulo="Visível", slug="visivel")
        self._criar(titulo="Rascunho", slug="rascunho-svc", status=RASCUNHO)
        self._criar(titulo="Arquivada", slug="arquivada-svc", status=ARQUIVADO)
        publicas = PublicacaoService.listar_publicacoes_publicas()
        titulos = [p.titulo for p in publicas]
        self.assertIn("Visível", titulos)
        self.assertNotIn("Rascunho", titulos)
        self.assertNotIn("Arquivada", titulos)

    def test_publicas_nao_retorna_agendadas_futuras(self):
        self._criar(
            titulo="Futura",
            slug="futura-svc",
            data_publicacao=now() + timedelta(days=7),
        )
        publicas = PublicacaoService.listar_publicacoes_publicas()
        titulos = [p.titulo for p in publicas]
        self.assertNotIn("Futura", titulos)

    def test_buscar_por_slug_publica_encontra(self):
        p = self._criar(titulo="Encontrada", slug="encontrada-svc")
        encontrada = PublicacaoService.buscar_publicacao_por_slug(
            "encontrada-svc"
        )
        self.assertEqual(encontrada.id, p.id)

    def test_buscar_por_slug_rascunho_lanca_404(self):
        self._criar(
            titulo="Invisivel",
            slug="invisivel-svc",
            status=RASCUNHO,
            data_publicacao=None,
        )
        with self.assertRaises(RegistroNaoEncontrado):
            PublicacaoService.buscar_publicacao_por_slug("invisivel-svc")

    def test_admin_lista_todas(self):
        self._criar(titulo="Admin Pub", slug="admin-pub")
        self._criar(
            autor=self.colunista_a, titulo="Col A Pub", slug="col-a-pub"
        )
        resultado = PublicacaoService.listar_publicacoes_admin(self.admin)
        self.assertEqual(resultado.count(), 2)

    def test_colunista_lista_apenas_suas(self):
        self._criar(
            autor=self.colunista_a, titulo="Minha", slug="minha-svc"
        )
        self._criar(
            autor=self.colunista_b, titulo="Outra", slug="outra-svc"
        )
        resultado = PublicacaoService.listar_publicacoes_admin(
            self.colunista_a
        )
        titulos = [p.titulo for p in resultado]
        self.assertIn("Minha", titulos)
        self.assertNotIn("Outra", titulos)

    def test_colunista_nao_edita_alheia(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Do A", slug="do-a"
        )
        with self.assertRaises(PermissaoNegada):
            PublicacaoService.atualizar_publicacao(
                self.colunista_b, p.id, {"titulo": "Hackeado"}
            )

    def test_colunista_edita_sua_propria(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Do A", slug="do-a-alt"
        )
        atualizada = PublicacaoService.atualizar_publicacao(
            self.colunista_a, p.id, {"titulo": "Editado por A"}
        )
        self.assertEqual(atualizada.titulo, "Editado por A")

    def test_admin_edita_qualquer(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Do A", slug="do-a-edit"
        )
        atualizada = PublicacaoService.atualizar_publicacao(
            self.admin, p.id, {"titulo": "Editado pelo Admin"}
        )
        self.assertEqual(atualizada.titulo, "Editado pelo Admin")

    def test_colunista_nao_deleta_alheia(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Alheia", slug="alheia"
        )
        with self.assertRaises(PermissaoNegada):
            PublicacaoService.deletar_publicacao(
                self.colunista_b, p.id
            )

    def test_colunista_deleta_sua_propria(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Minha", slug="minha-del"
        )
        PublicacaoService.deletar_publicacao(self.colunista_a, p.id)
        self.assertFalse(Publicacao.objects.filter(id=p.id).exists())

    def test_admin_deleta_qualquer(self):
        p = self._criar(
            autor=self.colunista_a, titulo="Alheia", slug="alheia-del"
        )
        PublicacaoService.deletar_publicacao(self.admin, p.id)
        self.assertFalse(Publicacao.objects.filter(id=p.id).exists())

    def test_criar_publicacao_com_auto_slug(self):
        p = PublicacaoService.criar_publicacao(
            self.admin,
            {
                "titulo": "Como Rezar o Terço",
                "slug": None,
                "categoria_id": self.categoria.id,
            },
        )
        self.assertEqual(p.slug, "como-rezar-o-terco")

    def test_criar_publicacao_com_tags(self):
        tag2 = Tag.objects.create(nome="Latim", slug="latim")
        p = PublicacaoService.criar_publicacao(
            self.admin,
            {
                "titulo": "Com Tags",
                "slug": "com-tags",
                "categoria_id": self.categoria.id,
                "tag_ids": [self.tag.id, tag2.id],
            },
        )
        self.assertEqual(p.tags.count(), 2)

    def test_buscar_por_id(self):
        p = self._criar(titulo="Busca", slug="busca-svc")
        encontrada = PublicacaoService.buscar_publicacao_por_id(p.id)
        self.assertEqual(encontrada.titulo, "Busca")

    def test_buscar_por_id_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            PublicacaoService.buscar_publicacao_por_id(9999)

    def test_criar_publicacao_slug_duplicado(self):
        with self.assertRaises(IntegrityError):
            PublicacaoService.criar_publicacao(
                self.admin,
                {
                    "titulo": "Outra",
                    "slug": self._criar(
                        titulo="Primeira", slug="primeira-ns"
                    ).slug,
                    "categoria_id": self.categoria.id,
                },
            )

    def test_criar_publicacao_categoria_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            PublicacaoService.criar_publicacao(
                self.admin,
                {
                    "titulo": "Inválida",
                    "slug": "invalida-s",
                    "categoria_id": 9999,
                },
            )

    def test_criar_publicacao_tag_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            PublicacaoService.criar_publicacao(
                self.admin,
                {
                    "titulo": "Com tag ruim",
                    "slug": "tag-ruim-s",
                    "categoria_id": self.categoria.id,
                    "tag_ids": [9999],
                },
            )

    def test_criar_publicacao_sem_categoria(self):
        p = PublicacaoService.criar_publicacao(
            self.admin,
            {
                "titulo": "Sem Categoria",
                "slug": "sem-cat",
                "categoria_id": None,
            },
        )
        self.assertIsNone(p.categoria)

    def test_atualizar_publicacao_limpa_tags(self):
        tag2 = Tag.objects.create(nome="Latim", slug="latim")
        p = PublicacaoService.criar_publicacao(
            self.admin,
            {
                "titulo": "Com tags",
                "slug": "limpa-tags-s",
                "categoria_id": self.categoria.id,
                "tag_ids": [self.tag.id, tag2.id],
            },
        )
        self.assertEqual(p.tags.count(), 2)
        atualizada = PublicacaoService.atualizar_publicacao(
            self.admin, p.id, {"tag_ids": []}
        )
        self.assertEqual(atualizada.tags.count(), 0)

    def test_atualizar_publicacao_data_publicacao_para_none(self):
        p = self._criar(titulo="Data None", slug="data-none-s")
        self.assertIsNotNone(p.data_publicacao)
        atualizada = PublicacaoService.atualizar_publicacao(
            self.admin, p.id, {"data_publicacao": None}
        )
        self.assertIsNone(atualizada.data_publicacao)

    def test_atualizar_publicacao_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            PublicacaoService.atualizar_publicacao(
                self.admin, 9999, {"titulo": "X"}
            )

    def test_listar_publicas_sem_n_mais_um(self):
        tag2 = Tag.objects.create(nome="Latim", slug="latim-svc2")
        for i in range(5):
            PublicacaoService.criar_publicacao(
                self.admin,
                {
                    "titulo": f"Publicação {i}",
                    "slug": f"pub-n-{i}",
                    "status": PUBLICADO,
                    "categoria_id": self.categoria.id,
                    "tag_ids": [self.tag.id, tag2.id],
                },
            )
        with self.assertNumQueries(2):
            resultado = list(
                PublicacaoService.listar_publicacoes_publicas()
            )
            self.assertEqual(len(resultado), 5)

    def test_listar_admin_sem_n_mais_um(self):
        tag2 = Tag.objects.create(nome="Latim2", slug="latim2-svc2")
        for i in range(5):
            PublicacaoService.criar_publicacao(
                self.admin,
                {
                    "titulo": f"Admin Pub {i}",
                    "slug": f"admin-pub-n-{i}",
                    "categoria_id": self.categoria.id,
                    "tag_ids": [self.tag.id, tag2.id],
                },
            )
        with self.assertNumQueries(2):
            resultado = list(
                PublicacaoService.listar_publicacoes_admin(self.admin)
            )
            self.assertEqual(len(resultado), 5)
