from django.test import TestCase

from metricas.models.visualizacao_model import VisualizacaoPublicacao


class VisualizacaoModelTest(TestCase):
    def test_gerar_hash_retorna_mesmo_valor_para_mesma_entrada(self):
        h1 = VisualizacaoPublicacao.gerar_hash("127.0.0.1", "Chrome")
        h2 = VisualizacaoPublicacao.gerar_hash("127.0.0.1", "Chrome")
        self.assertEqual(h1, h2)

    def test_gerar_hash_diferente_para_entradas_diferentes(self):
        h1 = VisualizacaoPublicacao.gerar_hash("127.0.0.1", "Chrome")
        h2 = VisualizacaoPublicacao.gerar_hash("192.168.0.1", "Firefox")
        self.assertNotEqual(h1, h2)

    def test_gerar_hash_tamanho_fixo(self):
        h = VisualizacaoPublicacao.gerar_hash("1.2.3.4", "Safari")
        self.assertEqual(len(h), 64)
