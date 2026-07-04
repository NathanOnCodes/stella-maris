from datetime import timedelta

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.test import TestCase
from django.utils.timezone import now

from categorias.models.categoria_model import Categoria
from publicacoes.models.publicacao_model import (
    ARQUIVADO,
    PUBLICADO,
    RASCUNHO,
    Publicacao,
)
from tags.models.tag_model import Tag


class PublicacaoModelTest(TestCase):
    def setUp(self):
        self.autor = User.objects.create_user(username="autor", password="x")
        self.categoria = Categoria.objects.create(nome="Notícias", slug="noticias")
        self.tag = Tag.objects.create(nome="Vaticano", slug="vaticano")
        self.publicacao = Publicacao.objects.create(
            titulo="Teste",
            slug="teste",
            autor=self.autor,
            categoria=self.categoria,
        )
        self.publicacao.tags.add(self.tag)

    def test_criar_publicacao(self):
        self.assertEqual(self.publicacao.titulo, "Teste")
        self.assertEqual(self.publicacao.slug, "teste")
        self.assertEqual(self.publicacao.status, RASCUNHO)

    def test_status_default_rascunho(self):
        self.assertEqual(self.publicacao.status, RASCUNHO)

    def test_slug_unico(self):
        with self.assertRaises(IntegrityError):
            Publicacao.objects.create(titulo="Outra", slug="teste", autor=self.autor)

    def test_esta_publicada_sem_data(self):
        self.publicacao.status = PUBLICADO
        self.publicacao.data_publicacao = None
        self.publicacao.save()
        self.assertTrue(self.publicacao.esta_publicada)

    def test_esta_publicada_com_data_passada(self):
        self.publicacao.status = PUBLICADO
        self.publicacao.data_publicacao = now() - timedelta(hours=1)
        self.publicacao.save()
        self.assertTrue(self.publicacao.esta_publicada)

    def test_nao_esta_publicada_com_data_futura(self):
        self.publicacao.status = PUBLICADO
        self.publicacao.data_publicacao = now() + timedelta(days=1)
        self.publicacao.save()
        self.assertFalse(self.publicacao.esta_publicada)

    def test_nao_esta_publicada_se_rascunho(self):
        self.publicacao.status = RASCUNHO
        self.publicacao.save()
        self.assertFalse(self.publicacao.esta_publicada)

    def test_nao_esta_publicada_se_arquivado(self):
        self.publicacao.status = ARQUIVADO
        self.publicacao.save()
        self.assertFalse(self.publicacao.esta_publicada)

    def test_relacionamentos(self):
        self.assertEqual(self.publicacao.autor, self.autor)
        self.assertEqual(self.publicacao.categoria, self.categoria)
        self.assertIn(self.tag, self.publicacao.tags.all())

    def test_str_retorna_titulo(self):
        self.assertEqual(str(self.publicacao), "Teste")
