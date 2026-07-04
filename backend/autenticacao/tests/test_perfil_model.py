from django.contrib.auth.models import User
from django.test import TestCase

from autenticacao.models.perfil_model import ADMINISTRADOR, COLUNISTA, Perfil


class PerfilModelTest(TestCase):
    def test_criar_perfil_automatico_ao_criar_usuario(self):
        usuario = User.objects.create_user(username="joao", password="senha123")
        self.assertTrue(Perfil.objects.filter(usuario=usuario).exists())

    def test_perfil_default_colunista(self):
        usuario = User.objects.create_user(username="maria", password="senha123")
        self.assertEqual(usuario.perfil.tipo, COLUNISTA)

    def test_property_eh_colunista(self):
        usuario = User.objects.create_user(username="pedro", password="senha123")
        self.assertTrue(usuario.perfil.eh_colunista)
        self.assertFalse(usuario.perfil.eh_administrador)

    def test_property_eh_administrador(self):
        usuario = User.objects.create_user(username="admin", password="senha123")
        usuario.perfil.tipo = ADMINISTRADOR
        usuario.perfil.save()
        self.assertTrue(usuario.perfil.eh_administrador)

    def test_one_to_one_com_user(self):
        usuario = User.objects.create_user(username="unico", password="senha123")
        self.assertEqual(usuario.perfil.usuario_id, usuario.id)
        self.assertIn("unico", str(usuario.perfil))
