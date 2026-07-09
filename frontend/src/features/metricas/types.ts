export interface VisualizacaoPorPeriodo {
  periodo: string;
  total: number;
}

export interface PublicacaoMaisLida {
  publicacao_id: number;
  titulo: string;
  slug: string;
  total: number;
}

export interface Dashboard {
  total: number;
  publicados: number;
  rascunhos: number;
  arquivados: number;
  acessos_por_periodo: VisualizacaoPorPeriodo[];
  mais_lidas: PublicacaoMaisLida[];
}
