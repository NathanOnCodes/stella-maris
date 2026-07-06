from django.contrib.auth.models import User
from django.test import TestCase

from autenticacao.models.perfil_model import ADMINISTRADOR, COLUNISTA
from autenticacao.services.perfil_service import AutenticacaoService
from core.exceptions import PermissaoNegada, RegistroNaoEncontrado


class PerfilServiceTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = ADMINISTRADOR
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
        )

    def _criar_colunista(self, username="teste"):
        return AutenticacaoService.criar_usuario_colunista(
            self.admin, username, "senha123"
        )

    def test_criar_colunista_retorna_usuario(self):
        usuario = self._criar_colunista("joao")
        self.assertEqual(usuario.username, "joao")
        self.assertEqual(usuario.perfil.tipo, COLUNISTA)

    def test_criar_colunista_por_nao_admin_bloqueado(self):
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.criar_usuario_colunista(
                self.colunista, "x", "senha123"
            )

    def test_listar_colunistas_retorna_apenas_colunistas(self):
        self._criar_colunista("c1")
        self._criar_colunista("c2")
        resultado = AutenticacaoService.listar_colunistas(self.admin)
        self.assertFalse(any(c["eh_administrador"] for c in resultado))
        usernames = [c["username"] for c in resultado]
        self.assertIn("c1", usernames)
        self.assertIn("c2", usernames)
        self.assertNotIn("admin", usernames)

    def test_listar_colunistas_nao_inclui_admin(self):
        self._criar_colunista("c1")
        resultado = AutenticacaoService.listar_colunistas(self.admin)
        usernames = [c["username"] for c in resultado]
        self.assertNotIn("admin", usernames)

    def test_listar_colunistas_por_nao_admin_bloqueado(self):
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.listar_colunistas(self.colunista)

    def test_obter_perfil(self):
        perfil = AutenticacaoService.obter_perfil_do_usuario(self.admin)
        self.assertEqual(perfil["username"], "admin")
        self.assertEqual(perfil["tipo"], ADMINISTRADOR)
        self.assertTrue(perfil["eh_administrador"])

    def test_obter_perfil_sem_perfil_lanca_erro(self):
        usuario = User.objects.create_user(username="orfao", password="x")
        usuario.perfil.delete()
        usuario = User.objects.get(id=usuario.id)
        with self.assertRaises(RegistroNaoEncontrado):
            AutenticacaoService.obter_perfil_do_usuario(usuario)

    def test_atualizar_colunista(self):
        usuario = self._criar_colunista("original")
        resultado = AutenticacaoService.atualizar_colunista(
            self.admin, usuario.id, {"username": "alterado"}
        )
        self.assertEqual(resultado["username"], "alterado")

    def test_atualizar_admin_bloqueado(self):
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.atualizar_colunista(
                self.admin, self.admin.id, {"username": "x"}
            )

    def test_atualizar_por_nao_admin_bloqueado(self):
        usuario = self._criar_colunista("alvo")
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.atualizar_colunista(
                self.colunista, usuario.id, {"username": "x"}
            )

    def test_deletar_colunista(self):
        usuario = self._criar_colunista("removivel")
        AutenticacaoService.deletar_colunista(self.admin, usuario.id)
        self.assertFalse(User.objects.filter(id=usuario.id).exists())

    def test_deletar_admin_bloqueado(self):
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.deletar_colunista(self.admin, self.admin.id)

    def test_deletar_por_nao_admin_bloqueado(self):
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.deletar_colunista(
                self.colunista, self.colunista.id
            )

    def test_deletar_inexistente_lanca_erro(self):
        with self.assertRaises(RegistroNaoEncontrado):
            AutenticacaoService.deletar_colunista(self.admin, 9999)

    def test_alterar_senha_sucesso(self):
        usuario = self._criar_colunista("senha")
        AutenticacaoService.alterar_senha(usuario, "senha123", "nova123")
        usuario.refresh_from_db()
        self.assertTrue(usuario.check_password("nova123"))

    def test_alterar_senha_atual_incorreta(self):
        usuario = self._criar_colunista("senha")
        with self.assertRaises(PermissaoNegada):
            AutenticacaoService.alterar_senha(usuario, "errada", "nova123")

    def test_criar_admin(self):
        usuario = AutenticacaoService.criar_admin(
            "super", "secret", "super@exemplo.com"
        )
        self.assertEqual(usuario.username, "super")
        self.assertTrue(usuario.perfil.eh_administrador)

    def test_atualizar_colunista_email(self):
        usuario = self._criar_colunista("email")
        resultado = AutenticacaoService.atualizar_colunista(
            self.admin, usuario.id, {"email": "novo@email.com"}
        )
        self.assertEqual(resultado["email"], "novo@email.com")

    def test_atualizar_colunista_senha(self):
        usuario = self._criar_colunista("password")
        AutenticacaoService.atualizar_colunista(
            self.admin, usuario.id, {"password": "nova-senha123"}
        )
        usuario.refresh_from_db()
        self.assertTrue(usuario.check_password("nova-senha123"))

    def test_atualizar_colunista_inexistente(self):
        with self.assertRaises(RegistroNaoEncontrado):
            AutenticacaoService.atualizar_colunista(
                self.admin, 9999, {"username": "x"}
            )
