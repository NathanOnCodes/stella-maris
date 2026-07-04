from django.db import IntegrityError
from django.test import TestCase

from tags.models.tag_model import Tag


class TagModelTest(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")

    def test_criar_tag(self):
        self.assertEqual(self.tag.nome, "Vaticano")
        self.assertEqual(self.tag.slug, "vaticano")

    def test_str_retorna_nome(self):
        self.assertEqual(str(self.tag), "Vaticano")

    def test_slug_unico(self):
        with self.assertRaises(IntegrityError):
            Tag.objects.create(nome="outra", slug="vaticano")

    def test_ordenacao_por_nome(self):
        Tag.objects.create(nome="Latim", slug="latim")
        Tag.objects.create(nome="Apologética", slug="apologetica")
        nomes = list(Tag.objects.values_list("nome", flat=True))
        self.assertEqual(nomes[0], "Apologética")
