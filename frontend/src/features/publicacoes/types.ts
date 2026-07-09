export interface Tag {
  id: number;
  nome: string;
  slug: string;
}

export interface PublicacaoResumo {
  id: number;
  titulo: string;
  subtitulo: string;
  slug: string;
  imagem_capa: string | null;
  status: string;
  data_publicacao: string | null;
  autor_nome: string;
  categoria_nome: string | null;
  tags: Tag[];
}

export interface Publicacao extends PublicacaoResumo {
  conteudo: string;
  criado_em: string;
  atualizado_em: string;
  autor_id: number;
  categoria_id: number | null;
}
