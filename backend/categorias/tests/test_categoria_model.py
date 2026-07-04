from django.db import IntegrityError
from django.test import TestCase

from categorias.models.categoria_model import Categoria


class CategoriaModelTest(TestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(
            nome="Notícias", slug="noticias", descricao="Últimas notícias"
        )

    def test_criar_categoria(self):
        self.assertEqual(self.categoria.nome, "Notícias")
        self.assertEqual(self.categoria.slug, "noticias")
        self.assertEqual(self.categoria.descricao, "Últimas notícias")

    def test_str_retorna_nome(self):
        self.assertEqual(str(self.categoria), "Notícias")

    def test_slug_unico(self):
        with self.assertRaises(IntegrityError):
            Categoria.objects.create(nome="outra", slug="noticias")

    def test_ordenacao_por_nome(self):
        Categoria.objects.create(nome="Bíblia", slug="biblia")
        Categoria.objects.create(nome="Apologética", slug="apologetica")
        nomes = list(Categoria.objects.values_list("nome", flat=True))
        self.assertEqual(nomes[0], "Apologética")
