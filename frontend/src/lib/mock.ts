import type { PublicacaoResumo, Publicacao } from "@/features/publicacoes/types";
import type { Categoria } from "@/features/categorias/types";

const CONTEUDO_MOCK = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<h2>Introdução</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<blockquote><p>"Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida. Nisl purus in mollis nunc sed id semper."</p></blockquote>
<h2>Desenvolvimento</h2>
<p>Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Eget sit amet tellus cras adipiscing enim eu turpis egestas. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar.</p>
<p>Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.</p>
<h2>Conclusão</h2>
<p>Vitae semper quis lectus nulla at volutpat diam ut venenatis. Tellus orci ac auctor augue mauris augue neque gravida in. Dictumst quisque sagittis purus sit amet volutpat consequat mauris.</p>
`;

export const MOCK_PUBLICACOES: PublicacaoResumo[] = [
  {
    id: 1,
    titulo: "A importância da Oração Mental segundo Santa Teresa D'Ávila",
    subtitulo: "A oração não é outra coisa senão um trato de amizade com Aquele que sabemos que nos ama.",
    slug: "oracao-mental-santa-teresa",
    imagem_capa: "https://images.unsplash.com/photo-1607584102179-8809f6e6ccf4?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-15T10:00:00Z",
    autor_nome: "Pe. João Paulo",
    categoria_nome: "Espiritualidade",
    tags: [{ id: 1, nome: "Oração", slug: "oracao" }],
  },
  {
    id: 2,
    titulo: "Compreendendo o Catecismo da Igreja Católica",
    subtitulo: "Uma análise estrutural sobre o documento promulgado por São João Paulo II e sua importância para a formação do cristão.",
    slug: "compreendendo-catecismo",
    imagem_capa: "https://images.unsplash.com/photo-1572007797825-780996f8c857?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-12T08:30:00Z",
    autor_nome: "Prof. Marcelo Ribeiro",
    categoria_nome: "Notícias",
    tags: [{ id: 2, nome: "Magistério", slug: "magisterio" }],
  },
  {
    id: 3,
    titulo: "A historicidade da Ressurreição de Cristo",
    subtitulo: "Argumentos fundamentados nas evidências históricas e nos escritos dos Padres Apostólicos.",
    slug: "historicidade-ressurreicao",
    imagem_capa: "https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-10T14:00:00Z",
    autor_nome: "Dr. Antônio Campos",
    categoria_nome: "Espiritualidade",
    tags: [{ id: 3, nome: "Apologética", slug: "apologetica" }],
  },
  {
    id: 4,
    titulo: "A Virgem Maria e os tempos finais",
    subtitulo: "O papel da Mãe de Deus no plano da salvação e sua presença materna na história da Igreja.",
    slug: "virgem-maria-tempos-finais",
    imagem_capa: "https://images.unsplash.com/photo-1548625361-26c6ce7a2015?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-08T09:00:00Z",
    autor_nome: "Ir. Maria Clara",
    categoria_nome: "Espiritualidade",
    tags: [{ id: 4, nome: "Mariologia", slug: "mariologia" }],
  },
  {
    id: 5,
    titulo: "O Papa Francisco e o diálogo inter-religioso no século XXI",
    subtitulo: "Uma análise das iniciativas pontifícias para a aproximação entre as religiões abraâmicas.",
    slug: "papa-francisco-dialogo-inter-religioso",
    imagem_capa: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-07-05T11:00:00Z",
    autor_nome: "Dra. Sofia Montenegro",
    categoria_nome: "Notícias",
    tags: [{ id: 5, nome: "Vaticano", slug: "vaticano" }],
  },
  {
    id: 6,
    titulo: "Os Padres do Deserto e a luta contra os pensamentos",
    subtitulo: "Ensinamentos dos primeiros monges cristãos sobre o discernimento espiritual e a batalha interior.",
    slug: "padres-deserto-pensamentos",
    imagem_capa: null,
    status: "publicado",
    data_publicacao: "2026-07-03T07:00:00Z",
    autor_nome: "Monge Bento",
    categoria_nome: "Espiritualidade",
    tags: [{ id: 6, nome: "Patrística", slug: "patristica" }],
  },
  {
    id: 7,
    titulo: "Entrevista: A nova geração de teólogos brasileiros",
    subtitulo: "Conversamos com jovens teólogos sobre os desafios de ensinar a fé em tempos de secularização.",
    slug: "entrevista-nova-geracao-teologos",
    imagem_capa: "https://images.unsplash.com/photo-1577896851231-70ac1883cec4?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-06-28T16:00:00Z",
    autor_nome: "Redação",
    categoria_nome: "Entrevistas",
    tags: [{ id: 7, nome: "Teologia", slug: "teologia" }],
  },
  {
    id: 8,
    titulo: "Coluna: O silêncio na liturgia pós-Concílio Vaticano II",
    subtitulo: "Uma reflexão sobre a recuperação do espaço do silêncio nas celebrações eucarísticas contemporâneas.",
    slug: "coluna-silencio-liturgia",
    imagem_capa: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600&auto=format&fit=crop",
    status: "publicado",
    data_publicacao: "2026-06-25T13:00:00Z",
    autor_nome: "Dom Rafael Alves",
    categoria_nome: "Colunas",
    tags: [{ id: 8, nome: "Liturgia", slug: "liturgia" }],
  },
];

export const MOCK_PUBLICACOES_FULL: Publicacao[] = MOCK_PUBLICACOES.map((p) => ({
  ...p,
  conteudo: CONTEUDO_MOCK,
  criado_em: p.data_publicacao ?? new Date().toISOString(),
  atualizado_em: p.data_publicacao ?? new Date().toISOString(),
  autor_id: p.id + 10,
  categoria_id: p.id,
}));

export const MOCK_CATEGORIAS: Categoria[] = [
  { id: 1, nome: "Notícias", slug: "noticias", descricao: "Últimas notícias da Igreja Católica no Brasil e no mundo." },
  { id: 2, nome: "Espiritualidade", slug: "espiritualidade", descricao: "Artigos sobre oração, vida interior e crescimento espiritual." },
  { id: 3, nome: "Entrevistas", slug: "entrevistas", descricao: "Entrevistas com personalidades católicas e especialistas." },
  { id: 4, nome: "Colunas", slug: "colunas", descricao: "Colunas semanais de nossos colaboradores." },
];

export function mockListarPublicacoes(filtros?: {
  categoria_slug?: string;
  busca?: string;
}): PublicacaoResumo[] {
  let resultado = [...MOCK_PUBLICACOES];
  if (filtros?.categoria_slug) {
    const slug = filtros.categoria_slug.toLowerCase();
    resultado = resultado.filter((p) => {
      const nome = p.categoria_nome?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return nome === slug;
    });
  }
  if (filtros?.busca) {
    const termo = filtros.busca.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    resultado = resultado.filter((p) => {
      const titulo = p.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const subtitulo = p.subtitulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const autor = p.autor_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return titulo.includes(termo) || subtitulo.includes(termo) || autor.includes(termo);
    });
  }
  return resultado;
}

export function mockObterPublicacaoPorSlug(
  slug: string,
): Publicacao | null {
  return MOCK_PUBLICACOES_FULL.find((p) => p.slug === slug) ?? null;
}

export function mockListarCategorias(): Categoria[] {
  return MOCK_CATEGORIAS;
}
