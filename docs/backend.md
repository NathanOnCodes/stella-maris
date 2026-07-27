# Vox Regina Caeli — Guia do backend

> Manual de contexto para agentes de codificação. Leia este arquivo antes de alterar modelos, serviços, autorização, métricas ou contratos HTTP.

## 1. O que é o backend

O backend é uma API Django + Django Ninja para uma revista católica digital. Ele é a fonte de verdade para:

- identidade e permissões;
- publicações editoriais;
- categorias e tags;
- configurações do site;
- registro e agregação de visualizações;
- regras de propriedade e disponibilidade pública.

O frontend nunca deve replicar essas regras de forma independente.

## 2. Regras para agentes

1. Leia `AGENTS.md` na raiz antes de codar.
2. Para alterações de negócio, escreva/ajuste testes backend antes da implementação final.
3. Fluxo de domínio: **route → service → model**. Não coloque regra de negócio na route.
4. Não acesse ORM diretamente no frontend.
5. Use schemas Ninja para entrada e saída.
6. Preserve os handlers de `core.exceptions` para erros de domínio.
7. Toda nova permissão precisa de teste positivo e negativo.
8. Toda alteração de modelo precisa de migration versionada.
9. Não leia nem altere `.env`, `auth_key.json` ou `db.sqlite3`.
10. Não exponha dados sensíveis do usuário na resposta pública.

## 3. Arquitetura de pastas

```text
backend/
├── core/                 # API raiz, URLs, settings, decorators e exceções
├── autenticacao/         # Perfis, login auxiliar e gestão de usuários
├── publicacoes/         # Conteúdo editorial e imagens de capa
├── categorias/          # Taxonomia editorial principal
├── tags/                # Assuntos complementares
├── configuracoes/       # Configuração pública do site
├── metricas/            # Visualizações e dashboards
├── manage.py
├── pyproject.toml
└── uv.lock
```

Dentro de cada domínio:

- `models/`: persistência;
- `api/`: routes e schemas HTTP;
- `services/`: regras de negócio;
- `tests/`: testes unitários, de API e integração;
- `migrations/`: evolução do banco.

## 4. Modelo de autorização

O usuário Django possui um `Perfil` OneToOne.

### Papéis

| Papel | Regra |
| --- | --- |
| `master` | Usuário proprietário. Pode executar todos os recursos e alterar o papel de outros usuários. Não pode ser rebaixado pelas rotas comuns. |
| `admin` | Pode gerenciar conteúdo, categorias, tags, configurações, colunistas e métricas globais. Não altera papéis administrativos. |
| `colunista` | Pode criar/publicar e editar somente as próprias publicações. Vê somente suas métricas. |

`Perfil.eh_administrador` é verdadeiro para `master` e `admin`. `Perfil.eh_master` identifica exclusivamente o master.

Os decorators centrais ficam em `core/decorators.py`:

- `requer_admin`: exige admin ou master;
- `requer_master`: exige master.

Mesmo quando o decorator não é usado diretamente na route, a service deve validar propriedade e papel.

## 5. Regras editoriais

### Publicação

O modelo está em `publicacoes/models/publicacao_model.py`.

Tipos editoriais:

- `artigo`;
- `entrevista`;
- `coluna`.

Status:

- `rascunho`: não aparece publicamente;
- `publicado`: pode aparecer publicamente quando a data estiver liberada;
- `arquivado`: retirado da área pública, mas preservado.

Regras:

- o slug é único;
- categoria é opcional;
- tags são muitos-para-muitos;
- imagem de capa é opcional;
- conteúdo público exige status publicado e data menor ou igual ao momento atual, ou data nula;
- admin/master podem operar qualquer publicação;
- colunista só pode alterar publicações cujo `autor_id` seja o próprio usuário;
- colunista pode publicar diretamente;
- somente admin/master podem arquivar;
- colunista não pode excluir publicação arquivada;
- imagens aceitas: `.jpg`, `.jpeg`, `.png`, `.webp`;
- limite da imagem de capa: 5 MB.

Implementação principal: `publicacoes/services/publicacao_service.py`.

## 6. Rotas HTTP do backend

Prefixo geral: `/api`.

### Sistema e JWT

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/status` | Não | Status e versão da API |
| `POST` | `/api/token/pair` | Não | Gera access e refresh token |
| `POST` | `/api/token/refresh` | Não | Renova access token |
| `POST` | `/api/token/verify` | Não | Valida token JWT, disponibilizado pelo controller JWT |

O JWT é configurado em `core/settings.py`. Access token dura 15 minutos e refresh token dura 7 dias.

### Autenticação e usuários

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/autenticacao/me` | JWT | Perfil autenticado |
| `PUT` | `/api/autenticacao/me/alterar-senha` | JWT | Troca senha após validar senha atual |
| `GET` | `/api/autenticacao/colunistas` | JWT/admin | Lista colunistas |
| `POST` | `/api/autenticacao/colunistas` | JWT/admin | Cria colunista |
| `PUT` | `/api/autenticacao/colunistas/{id}` | JWT/admin | Atualiza dados de colunista |
| `DELETE` | `/api/autenticacao/colunistas/{id}` | JWT/admin | Remove colunista não administrador |
| `GET` | `/api/autenticacao/usuarios` | JWT/admin | Lista usuários conforme papel do solicitante |
| `PUT` | `/api/autenticacao/usuarios/{id}/tipo` | JWT/master | Promove/rebaixa para `admin` ou `colunista` |

O usuário inicial é criado pelo comando `python manage.py criar_admin` e recebe o papel `master`.

### Publicações

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/publicacoes/` | Não | Lista publicações públicas; aceita `categoria_slug`, `tag_slug` e `busca` |
| `GET` | `/api/publicacoes/{slug}` | Não | Obtém publicação pública e registra visualização |
| `GET` | `/api/publicacoes/admin/` | JWT | Lista publicações; admin vê todas, colunista vê as próprias |
| `GET` | `/api/publicacoes/admin/{id}` | JWT | Obtém publicação para gestão |
| `POST` | `/api/publicacoes/admin/` | JWT | Cria publicação com o usuário autenticado como autor |
| `PUT` | `/api/publicacoes/admin/{id}` | JWT | Atualiza publicação respeitando propriedade |
| `POST` | `/api/publicacoes/admin/{id}/imagem` | JWT | Define imagem de capa |
| `DELETE` | `/api/publicacoes/admin/{id}/imagem` | JWT | Remove imagem de capa |
| `DELETE` | `/api/publicacoes/admin/{id}` | JWT | Exclui publicação conforme propriedade/status |

Ao alterar uma publicação, o service remove campos `None` do payload antes de aplicar a atualização. Tags são substituídas quando `tag_ids` é enviado.

### Categorias

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/categorias/` | Não | Lista categorias |
| `GET` | `/api/categorias/{id}` | Não | Obtém categoria |
| `POST` | `/api/categorias/` | JWT/admin | Cria categoria |
| `PUT` | `/api/categorias/{id}` | JWT/admin | Atualiza categoria |
| `DELETE` | `/api/categorias/{id}` | JWT/admin | Remove categoria |

### Tags

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/tags/` | Não | Lista tags |
| `GET` | `/api/tags/{id}` | Não | Obtém tag |
| `POST` | `/api/tags/` | JWT/admin | Cria tag |
| `PUT` | `/api/tags/{id}` | JWT/admin | Atualiza tag |
| `DELETE` | `/api/tags/{id}` | JWT/admin | Remove tag |

### Configurações

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/configuracoes/` | Não | Configuração usada pela área pública |
| `PUT` | `/api/configuracoes/` | JWT/admin | Atualiza identidade, contatos e redes sociais |

### Métricas

| Método | Rota | Auth | Função |
| --- | --- | --- | --- |
| `GET` | `/api/metricas/dashboard` | JWT/admin | Dashboard global |
| `GET` | `/api/metricas/acessos` | JWT/admin | Acessos agregados por `periodo=dia|semana|mes` |
| `GET` | `/api/metricas/me` | JWT | Métricas dos conteúdos do usuário autenticado |

O registro público ocorre ao acessar `/api/publicacoes/{slug}`. O serviço usa hash de IP + user-agent. Quando há IP ou user-agent disponível, o mesmo visitante conta no máximo uma vez por publicação no dia corrente. O IP bruto não é persistido.

## 7. Exceções e respostas

As exceções de domínio ficam em `core/exceptions.py` e são traduzidas em `core/api.py`:

- `RegistroNaoEncontrado`: HTTP 404;
- `PermissaoNegada`: HTTP 403;
- `ErroBaseVoxRC`: erro de domínio genérico.

Não capture essas exceções para retornar mensagens genéricas. Preserve `detail` para o frontend exibir feedback útil.

## 8. Testes

Os testes estão próximos de cada domínio:

- `autenticacao/tests/`: criação de perfil, login, senha e permissões;
- `publicacoes/tests/`: CRUD, propriedade e integração;
- `metricas/tests/`: registro e agregação de visualizações;
- `categorias/tests/` e `tags/tests/`: taxonomias;
- `configuracoes/tests/`: leitura e atualização da configuração.

Executar:

```bash
cd backend
uv run python manage.py test
```

Para uma alteração de regra, sempre cobrir:

- usuário sem autenticação;
- colunista tentando acessar recurso administrativo;
- colunista tentando operar conteúdo de outro autor;
- admin operando conteúdo de qualquer autor;
- master alterando papel;
- caso de sucesso;
- registro inexistente;
- estado inválido.

## 9. Migrations e banco

Use migrations para qualquer mudança de modelo:

```bash
cd backend
uv run python manage.py makemigrations
uv run python manage.py migrate
```

Nunca altere `db.sqlite3` manualmente e nunca inclua esse arquivo no commit.
