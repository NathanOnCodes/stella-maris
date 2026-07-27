from http import HTTPStatus

from django.contrib.auth.models import User
from django.test import TestCase

from autenticacao.models.perfil_model import ADMINISTRADOR, COLUNISTA, MASTER, Perfil
from core.exceptions import ErroBaseVoxRC, PermissaoNegada, RegistroNaoEncontrado


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

    def test_master_eh_administrador_mas_tem_permissao_propria(self):
        usuario = User.objects.create_user(username="master", password="senha123")
        usuario.perfil.tipo = MASTER
        usuario.perfil.save()
        self.assertTrue(usuario.perfil.eh_administrador)
        self.assertTrue(usuario.perfil.eh_master)

    def test_one_to_one_com_user(self):
        usuario = User.objects.create_user(username="unico", password="senha123")
        self.assertEqual(usuario.perfil.usuario_id, usuario.id)
        self.assertIn("unico", str(usuario.perfil))


class CoreExceptionsTest(TestCase):
    def test_erro_base_default_detalhe(self):
        exc = ErroBaseVoxRC()
        self.assertEqual(exc.detalhe, "Erro interno do servidor.")
        self.assertEqual(exc.codigo_http, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_erro_base_detalhe_personalizado(self):
        exc = ErroBaseVoxRC("Falha crítica no sistema.")
        self.assertEqual(exc.detalhe, "Falha crítica no sistema.")
        self.assertEqual(str(exc), "Falha crítica no sistema.")

    def test_registro_nao_encontrado_default(self):
        exc = RegistroNaoEncontrado()
        self.assertEqual(exc.codigo_http, HTTPStatus.NOT_FOUND)
        self.assertEqual(exc.detalhe, "Registro não encontrado.")

    def test_registro_nao_encontrado_personalizado(self):
        exc = RegistroNaoEncontrado("Categoria inexistente.")
        self.assertEqual(exc.detalhe, "Categoria inexistente.")

    def test_permissao_negada_default(self):
        exc = PermissaoNegada()
        self.assertEqual(exc.codigo_http, HTTPStatus.FORBIDDEN)

    def test_permissao_negada_personalizada(self):
        exc = PermissaoNegada("Apenas administradores podem executar esta ação.")
        self.assertEqual(
            exc.detalhe, "Apenas administradores podem executar esta ação."
        )
