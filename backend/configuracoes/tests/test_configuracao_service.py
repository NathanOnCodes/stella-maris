from django.contrib.auth.models import User
from django.test import TestCase

from configuracoes.models.configuracao_model import ConfiguracaoSite
from configuracoes.services.configuracao_service import ConfiguracaoSiteService
from core.exceptions import PermissaoNegada


class ConfiguracaoSiteServiceTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin", password="admin123"
        )
        self.admin.perfil.tipo = "admin"
        self.admin.perfil.save()
        self.colunista = User.objects.create_user(
            username="colunista", password="col123"
        )

    def test_obter_configuracao_cria_se_nao_existir(self):
        config = ConfiguracaoSiteService.obter_configuracao()
        self.assertEqual(config.pk, 1)
        self.assertEqual(config.nome_site, "Vox Regina Caeli")

    def test_obter_configuracao_retorna_existente(self):
        ConfiguracaoSite.objects.create(pk=1, nome_site="Teste")
        config = ConfiguracaoSiteService.obter_configuracao()
        self.assertEqual(config.nome_site, "Teste")

    def test_atualizar_configuracao_admin(self):
        config = ConfiguracaoSiteService.atualizar_configuracao(
            self.admin,
            {"nome_site": "Novo Nome", "descricao": "Nova descrição"},
        )
        self.assertEqual(config.nome_site, "Novo Nome")
        self.assertEqual(config.descricao, "Nova descrição")

    def test_atualizar_configuracao_colunista_erro(self):
        with self.assertRaises(PermissaoNegada):
            ConfiguracaoSiteService.atualizar_configuracao(
                self.colunista, {"nome_site": "X"}
            )
