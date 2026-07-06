from django.db import IntegrityError
from django.test import TestCase

from categorias.models.categoria_model import Categoria
from categorias.services.categoria_service import CategoriaService
from core.exceptions import RegistroNaoEncontrado


class CategoriaServiceTest(TestCase):
    def setUp(self):
        self.cat = Categoria.objects.create(
            nome="Notícias", slug="noticias", descricao="Desc"
        )

    def test_criar_categoria_com_slug_explicito(self):
        cat = CategoriaService.criar_categoria(
            {"nome": "Espiritualidade", "slug": "espiritualidade", "descricao": ""}
        )
        self.assertEqual(cat.slug, "espiritualidade")

    def test_criar_categoria_sem_slug_gera_do_nome(self):
        cat = CategoriaService.criar_categoria(
            {"nome": "Apologética Dogma", "slug": None, "descricao": ""}
        )
        self.assertEqual(cat.slug, "apologetica-dogma")

    def test_listar_categorias(self):
        Categoria.objects.create(nome="Colunas", slug="colunas")
        resultado = CategoriaService.listar_categorias()
        self.assertEqual(resultado.count(), 2)

    def test_buscar_categoria_por_id(self):
        cat = CategoriaService.buscar_categoria_por_id(self.cat.id)
        self.assertEqual(cat.nome, "Notícias")

    def test_buscar_categoria_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            CategoriaService.buscar_categoria_por_id(9999)

    def test_atualizar_categoria_nome(self):
        cat = CategoriaService.atualizar_categoria(
            self.cat.id, {"nome": "Notícias Atualizadas"}
        )
        self.assertEqual(cat.nome, "Notícias Atualizadas")

    def test_atualizar_categoria_slug(self):
        cat = CategoriaService.atualizar_categoria(self.cat.id, {"slug": "news"})
        self.assertEqual(cat.slug, "news")

    def test_atualizar_categoria_descricao(self):
        cat = CategoriaService.atualizar_categoria(
            self.cat.id, {"descricao": "Nova descrição"}
        )
        self.assertEqual(cat.descricao, "Nova descrição")

    def test_deletar_categoria(self):
        CategoriaService.deletar_categoria(self.cat.id)
        self.assertFalse(Categoria.objects.filter(id=self.cat.id).exists())

    def test_deletar_categoria_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            CategoriaService.deletar_categoria(9999)

    def test_criar_categoria_slug_duplicado(self):
        with self.assertRaises(IntegrityError):
            CategoriaService.criar_categoria(
                {"nome": "Outra", "slug": "noticias", "descricao": ""}
            )

    def test_atualizar_categoria_regenera_slug_do_novo_nome(self):
        cat = CategoriaService.atualizar_categoria(
            self.cat.id, {"nome": "Nova Categoria", "slug": None}
        )
        self.assertEqual(cat.slug, "nova-categoria")

    def test_atualizar_categoria_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            CategoriaService.atualizar_categoria(9999, {"nome": "X"})
