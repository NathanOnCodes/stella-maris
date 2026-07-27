# Vox Regina Caeli — Guia do frontend

> Manual de contexto para agentes de codificação. Leia este arquivo antes de alterar a interface, navegação, consumo de APIs ou experiência editorial.

## 1. O que é o frontend

O frontend é uma aplicação Next.js com App Router para uma revista católica digital. Ele possui duas áreas com responsabilidades diferentes:

- **Área pública**: home, categorias, busca, leitura de artigos e autenticação.
- **Área administrativa**: dashboard, publicações, edição de conteúdo, colunistas, configurações e desempenho pessoal.

O produto se chama **Vox Regina Caeli**. A identidade visual combina vinho imperial, marfim, dourado e tipografia editorial. A inspiração é uma interface limpa e refinada, com hierarquia clara, superfícies suaves e poucos elementos concorrendo pela atenção.

## 2. Regras para agentes

Antes de codar:

1. Leia `AGENTS.md` na raiz.
2. Confira o contrato real no backend antes de criar tipos ou mocks.
3. Preserve a separação entre página, feature, componente e cliente de API.
4. Não coloque regra de negócio ou autorização somente no frontend.
5. Use `next/link` para navegação interna.
6. Use componentes client somente quando houver estado, efeitos, eventos ou APIs do navegador.
7. Evite chamadas HTTP diretas espalhadas em páginas; use `api-client.ts`, `fetch-admin.ts` ou os módulos de `features/*/api`.
8. Não leia, altere ou adicione `auth_key.json`, `db.sqlite3`, `.env` ou arquivos locais equivalentes.
9. Não substitua uma API existente por mock sem registrar claramente a limitação.

## 3. Arquitetura de pastas

```text
frontend/src/
├── app/
│   ├── (publico)/             # Rotas públicas
│   ├── (painel)/painel/       # Painel autenticado
│   ├── api/                   # BFF: rotas Next que protegem/encaminham chamadas
│   ├── entrar/                # Login
│   ├── globals.css            # Tokens, fontes e utilitários visuais
│   └── layout.tsx             # Fontes, metadata e shell global
├── components/                # Componentes compartilhados
├── features/                  # Domínios: autenticação, publicações, métricas etc.
├── lib/api-client.ts          # Cliente público para o backend
├── lib/fetch-admin.ts         # Cliente server-side com cookies JWT e refresh
├── lib/sessao.ts              # Leitura da sessão autenticada
└── proxy.ts                   # Bloqueio inicial das rotas /painel sem cookie
```

### Onde encontrar as responsabilidades

| Necessidade | Local principal |
| --- | --- |
| Shell público | `src/app/(publico)/layout.tsx` |
| Header e navegação pública | `src/components/cabecalho.tsx` |
| Footer público | `src/components/rodape.tsx` |
| Home | `src/app/(publico)/page.tsx` |
| Cards de publicação | `src/features/publicacoes/components/card-publicacao.tsx` |
| Lista de publicações | `src/features/publicacoes/components/lista-publicacoes.tsx` |
| Leitor editorial | `src/features/publicacoes/components/leitor-artigo.tsx` |
| Editor do painel | `src/features/publicacoes/components/editor-conteudo.tsx` |
| Métricas | `src/features/metricas/` |
| Autenticação do painel | `src/lib/sessao.ts`, `src/lib/fetch-admin.ts` |
| Tokens visuais | `src/app/globals.css` |

## 4. Rotas de páginas

### Área pública

| Rota | Função | Fonte atual |
| --- | --- | --- |
| `/` | Home editorial, hero, publicações e chamada final | `src/app/(publico)/page.tsx` |
| `/[categoria]` | Lista de publicações filtradas por categoria | `src/app/(publico)/[categoria]/page.tsx` |
| `/artigo/[slug]` | Leitura completa de uma publicação | `src/app/(publico)/artigo/[slug]/page.tsx` |
| `/busca` | Busca pública por termo | `src/app/(publico)/busca/page.tsx` |
| `/entrar` | Login dos usuários do painel | `src/app/entrar/page.tsx` |
| `/~offline` | Fallback offline da PWA | `src/app/~offline/page.tsx` |

Rotas de sistema:

- `/robots.txt`: `src/app/robots.ts`;
- `/sitemap.xml`: `src/app/sitemap.ts`;
- `/manifest.webmanifest`: `src/app/manifest.ts`.

### Painel autenticado

Todas as rotas abaixo exigem sessão. O `proxy.ts` verifica o cookie `access_token`; o layout consulta `/autenticacao/me` e redireciona usuários não autenticados.

| Rota | Função | Permissão esperada |
| --- | --- | --- |
| `/painel` | Dashboard global de conteúdo e audiência | admin/master |
| `/painel/me` | Desempenho e conteúdos do colunista autenticado | colunista |
| `/painel/publicacoes` | Listagem administrativa de publicações | usuário autenticado; dados filtrados pelo backend |
| `/painel/publicacoes/nova` | Criação de publicação | usuário autenticado |
| `/painel/publicacoes/[id]` | Edição de publicação | autor ou admin/master |
| `/painel/colunistas` | Gestão de colunistas/usuários | admin/master; promoção de papel somente master |
| `/painel/configuracoes` | Configurações editoriais do site | admin/master |

O frontend pode ocultar links conforme `Perfil`, mas a autorização definitiva é sempre do backend.

## 5. Rotas API do Next.js (BFF)

Estas rotas não substituem o backend. Elas tratam cookies HTTP-only, refresh de token e encaminhamento seguro.

### Autenticação

| Método | Rota | Função |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login no backend e gravação dos cookies `access_token` e `refresh_token` |
| `POST` | `/api/auth/refresh` | Renova o access token usando o refresh token |
| `POST` | `/api/auth/logout` | Remove os cookies locais |
| `PUT` | `/api/me/alterar-senha` | Proxy para alteração de senha autenticada |

### Usuários e colunistas

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/api/colunistas` | Lista colunistas |
| `POST` | `/api/colunistas` | Cria colunista |
| `PUT` | `/api/colunistas/[id]` | Atualiza colunista |
| `DELETE` | `/api/colunistas/[id]` | Remove colunista |
| `GET` | `/api/usuarios` | Lista usuários conforme permissão |
| `PUT` | `/api/usuarios/[id]/tipo` | Altera papel; deve ser usado somente pelo master |

### Publicações e configurações

| Método | Rota | Função |
| --- | --- | --- |
| `GET` | `/api/publicacoes/metadata` | Metadados para o editor: categorias, tags e opções necessárias |
| `POST` | `/api/publicacoes/admin/criar` | Cria publicação |
| `GET` | `/api/publicacoes/admin/obter/[id]` | Obtém publicação para edição |
| `PUT` | `/api/publicacoes/admin/atualizar/[id]` | Atualiza publicação |
| `POST` | `/api/publicacoes/admin/imagem/[id]` | Envia imagem de capa |
| `DELETE` | `/api/publicacoes/admin/imagem/[id]` | Remove imagem de capa |
| `GET` | `/api/configuracoes` | Obtém configuração pública |
| `PUT` | `/api/configuracoes` | Atualiza configurações protegidas |

## 6. Consumo de APIs

### Cliente público

`src/lib/api-client.ts` usa `API_URL` e serve para chamadas ao backend sem sessão ou com headers fornecidos explicitamente.

### Cliente administrativo

`src/lib/fetch-admin.ts` deve ser usado em Server Components e módulos server-side do painel. Ele:

- lê o `access_token` dos cookies;
- envia `Authorization: Bearer`;
- tenta refresh quando recebe `401`;
- lança `ApiError` para a página decidir o estado de erro.

As rotas disponíveis ficam centralizadas em `src/lib/constantes.ts`, no objeto `ROTAS`.

## 7. Modelos TypeScript importantes

### `Perfil`

Campos principais:

- `id`;
- `username`;
- `email`;
- `tipo`: `master`, `admin` ou `colunista`;
- `eh_administrador`;
- `eh_master`.

### `PublicacaoResumo` e `Publicacao`

Uma publicação possui:

- título e subtítulo;
- slug;
- conteúdo HTML;
- imagem de capa opcional;
- status: `rascunho`, `publicado`, `arquivado`;
- tipo editorial: `artigo`, `entrevista`, `coluna`;
- autor;
- categoria;
- tags;
- datas;
- visualizações quando retornadas pelo endpoint.

Quando `imagem_capa` for nula, use `ImagemPublicacao` para manter o fallback visual vinho/dourado consistente.

## 8. Regras de interface

- Não exibir uma página branca quando a API falhar: mostrar estado de erro compreensível.
- Toda lista deve ter estado vazio.
- Todo carregamento assíncrono relevante deve possuir skeleton ou feedback.
- Ações destrutivas precisam de confirmação.
- O texto visual deve respeitar português brasileiro e a linguagem editorial do projeto.
- Publicações públicas precisam de `alt`, hierarquia semântica e foco visível.
- Não duplicar o layout do card em várias páginas; evoluir `CardPublicacao`.
- Não usar `dangerouslySetInnerHTML` fora de conteúdo sanitizado pelo fluxo editorial.

## 9. Verificação antes de entregar frontend

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

Verifique também desktop, tablet, mobile, menu, estados de erro, sessão expirada e permissões distintas.
