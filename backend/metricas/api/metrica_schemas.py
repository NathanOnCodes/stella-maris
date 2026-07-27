from ninja import Schema


class VisualizacaoPorPeriodoOut(Schema):
    periodo: str
    total: int


class PublicacaoMaisLidaOut(Schema):
    publicacao_id: int
    titulo: str
    slug: str
    total: int


class DashboardOut(Schema):
    total: int
    publicados: int
    rascunhos: int
    arquivados: int
    acessos_por_periodo: list[VisualizacaoPorPeriodoOut] = []
    mais_lidas: list[PublicacaoMaisLidaOut] = []
    total_visualizacoes: int = 0
