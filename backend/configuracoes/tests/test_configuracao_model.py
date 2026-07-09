from django.test import TestCase

from configuracoes.models.configuracao_model import ConfiguracaoSite


class ConfiguracaoSiteModelTest(TestCase):
    def test_criar_configuracao_com_valores_padrao(self):
        config = ConfiguracaoSite.objects.create()
        self.assertEqual(config.nome_site, "Vox Regina Caeli")
        self.assertEqual(config.descricao, "Revista digital católica independente")

    def test_str_retorna_nome_site(self):
        config = ConfiguracaoSite.objects.create()
        self.assertEqual(str(config), config.nome_site)
