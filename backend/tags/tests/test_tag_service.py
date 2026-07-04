from django.db import IntegrityError
from django.test import TestCase

from core.exceptions import RegistroNaoEncontrado
from tags.models.tag_model import Tag
from tags.services.tag_service import (
    atualizar_tag,
    buscar_tag_por_id,
    criar_tag,
    deletar_tag,
    listar_tags,
)


class TagServiceTest(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")

    def test_criar_tag_com_slug_explicito(self):
        tag = criar_tag({"nome": "Latim", "slug": "latim"})
        self.assertEqual(tag.slug, "latim")

    def test_criar_tag_sem_slug_gera_do_nome(self):
        tag = criar_tag({"nome": "São Tomás", "slug": None})
        self.assertEqual(tag.slug, "sao-tomas")

    def test_listar_tags(self):
        Tag.objects.create(nome="Terço", slug="terco")
        resultado = listar_tags()
        self.assertEqual(resultado.count(), 2)

    def test_buscar_tag_por_id(self):
        tag = buscar_tag_por_id(self.tag.id)
        self.assertEqual(tag.nome, "Vaticano")

    def test_buscar_tag_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            buscar_tag_por_id(9999)

    def test_atualizar_tag_nome(self):
        tag = atualizar_tag(self.tag.id, {"nome": "Santa Sé"})
        self.assertEqual(tag.nome, "Santa Sé")

    def test_atualizar_tag_slug(self):
        tag = atualizar_tag(self.tag.id, {"slug": "santa-se"})
        self.assertEqual(tag.slug, "santa-se")

    def test_deletar_tag(self):
        deletar_tag(self.tag.id)
        self.assertFalse(Tag.objects.filter(id=self.tag.id).exists())

    def test_deletar_tag_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            deletar_tag(9999)

    def test_criar_tag_slug_duplicado(self):
        with self.assertRaises(IntegrityError):
            criar_tag({"nome": "Outra", "slug": "vaticano"})

    def test_atualizar_tag_regenera_slug_do_novo_nome(self):
        tag = atualizar_tag(self.tag.id, {"nome": "Santa Sé Roma", "slug": None})
        self.assertEqual(tag.slug, "santa-se-roma")

    def test_atualizar_tag_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            atualizar_tag(9999, {"nome": "X"})
