from django.contrib.auth.models import User
from django.test import TestCase


class AutenticacaoAPITest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin", password="admin123")
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
        )

    def _obter_tokens(self, username, password):
        response = self.client.post(
            "/api/token/pair",
            data={"username": username, "password": password},
            content_type="application/json",
        )
        return response.json()

    def _auth_admin(self):
        tokens = self._obter_tokens("admin", "admin123")
        return {"HTTP_AUTHORIZATION": f"Bearer {tokens['access']}"}

    def _auth_colunista(self):
        tokens = self._obter_tokens("colunista", "col123")
        return {"HTTP_AUTHORIZATION": f"Bearer {tokens['access']}"}

    def test_token_pair_sucesso(self):
        response = self.client.post(
            "/api/token/pair",
            data={"username": "admin", "password": "admin123"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertIn("access", dados)
        self.assertIn("refresh", dados)

    def test_token_credenciais_invalidas(self):
        response = self.client.post(
            "/api/token/pair",
            data={"username": "admin", "password": "errada"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_token_refresh(self):
        tokens = self._obter_tokens("admin", "admin123")
        response = self.client.post(
            "/api/token/refresh",
            data={"refresh": tokens["refresh"]},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())

    def test_me_sem_auth_retorna_401(self):
        response = self.client.get("/api/autenticacao/me")
        self.assertEqual(response.status_code, 401)

    def test_me_com_auth_retorna_perfil(self):
        response = self.client.get("/api/autenticacao/me", **self._auth_admin())
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertEqual(dados["username"], "admin")
        self.assertTrue(dados["eh_administrador"])

    def test_alterar_senha_sucesso(self):
        response = self.client.put(
            "/api/autenticacao/me/alterar-senha",
            data={"senha_atual": "admin123", "senha_nova": "nova456"},
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 200)
        login_antiga = self._obter_tokens("admin", "admin123")
        self.assertNotIn("access", login_antiga)
        login_nova = self._obter_tokens("admin", "nova456")
        self.assertIn("access", login_nova)

    def test_listar_colunistas_como_admin(self):
        response = self.client.get("/api/autenticacao/colunistas", **self._auth_admin())
        self.assertEqual(response.status_code, 200)

    def test_listar_colunistas_como_colunista_bloqueado(self):
        response = self.client.get(
            "/api/autenticacao/colunistas", **self._auth_colunista()
        )
        self.assertEqual(response.status_code, 403)

    def test_criar_colunista_como_admin(self):
        response = self.client.post(
            "/api/autenticacao/colunistas",
            data={
                "username": "novo",
                "password": "senha123",
                "email": "e@e.com",
            },
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["username"], "novo")

    def test_criar_colunista_como_colunista_bloqueado(self):
        response = self.client.post(
            "/api/autenticacao/colunistas",
            data={"username": "novo", "password": "senha123"},
            content_type="application/json",
            **self._auth_colunista(),
        )
        self.assertEqual(response.status_code, 403)

    def test_deletar_colunista_como_admin(self):
        alvo = User.objects.create_user(username="alvo", password="x")
        response = self.client.delete(
            f"/api/autenticacao/colunistas/{alvo.id}",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 204)

    def test_token_pair_usuario_inexistente(self):
        response = self.client.post(
            "/api/token/pair",
            data={"username": "fantasma", "password": "x"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_token_refresh_com_token_invalido(self):
        response = self.client.post(
            "/api/token/refresh",
            data={"refresh": "token-invalido-aqui"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_alterar_senha_sem_auth_retorna_401(self):
        response = self.client.put(
            "/api/autenticacao/me/alterar-senha",
            data={"senha_atual": "x", "senha_nova": "y"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_alterar_senha_atual_incorreta(self):
        response = self.client.put(
            "/api/autenticacao/me/alterar-senha",
            data={"senha_atual": "errada", "senha_nova": "nova456"},
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 403)

    def test_criar_colunista_usuario_duplicado(self):
        User.objects.create_user(username="duplicado", password="x")
        response = self.client.post(
            "/api/autenticacao/colunistas",
            data={"username": "duplicado", "password": "senha123"},
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertNotEqual(response.status_code, 200)

    def test_listar_colunistas_retorna_dados_corretos(self):
        response = self.client.get("/api/autenticacao/colunistas", **self._auth_admin())
        self.assertEqual(response.status_code, 200)
        dados = response.json()
        self.assertIsInstance(dados, list)
        self.assertEqual(dados[0]["username"], "colunista")
        self.assertEqual(dados[0]["tipo"], "colunista")

    def test_atualizar_colunista_como_admin(self):
        alvo = User.objects.create_user(username="alvo_update", password="x")
        response = self.client.put(
            f"/api/autenticacao/colunistas/{alvo.id}",
            data={"username": "alvo_renomeado"},
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["username"], "alvo_renomeado")

    def test_atualizar_colunista_inexistente(self):
        response = self.client.put(
            "/api/autenticacao/colunistas/9999",
            data={"username": "x"},
            content_type="application/json",
            **self._auth_admin(),
        )
        self.assertEqual(response.status_code, 404)
