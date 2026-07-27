# Vox Regina Caeli — Infraestrutura Docker

Este documento explica como executar e publicar o Vox Regina Caeli com quatro serviços:

- **frontend**: Next.js em modo standalone;
- **backend**: Django servido por Gunicorn;
- **db**: PostgreSQL persistente;
- **nginx**: único ponto público de entrada, proxy reverso e servidor de mídia/estáticos.

A estrutura usa multi-stage builds, imagens finais sem ferramentas de build, usuários não-root, healthchecks, volumes persistentes e `uv.lock`/`package-lock.json` para reproduzir dependências.

As escolhas de Next standalone e cópia apenas de `.next/standalone` e `.next/static` seguem o exemplo oficial consultado no Context7: [Next.js Docker standalone](https://github.com/vercel/next.js/tree/canary/examples/with-docker). O backend usa o padrão de `uv sync --locked`, bytecode compilado e runtime sem o instalador, conforme o exemplo da Astral: [uv Docker example](https://github.com/astral-sh/uv-docker-example). O Compose utiliza healthchecks e `depends_on.condition: service_healthy`, conforme a documentação de Compose: [Docker Compose](https://docs.docker.com/compose/).

## Arquivos

```text
.
├── compose.yml              # produção/deploy
├── compose.dev.yml          # desenvolvimento
├── env_example.py           # template dotenv para produção; copiar para .env
├── env_dev_example.py       # template dotenv para dev; copiar para .env.dev
├── nginx/
│   ├── nginx.conf           # produção, HTTP → HTTPS e proxy
│   └── nginx.dev.conf       # desenvolvimento, HTTP local
├── frontend/Dockerfile
└── backend/Dockerfile
```

Apesar da extensão `.py` solicitada, `env_example.py` e `env_dev_example.py` são arquivos no formato dotenv (`CHAVE=VALOR`) para permitir cópia direta. Eles não são importados pelo Python.

## Variáveis de ambiente

### Produção

```bash
cp env_example.py .env
```

Edite `.env` antes do primeiro deploy e troque todos os valores `replace-with-*` e `example.invalid`.

Variáveis mais importantes:

- `SECRET_KEY`: segredo longo e aleatório do Django;
- `POSTGRES_PASSWORD`: senha forte do banco;
- `NEXT_PUBLIC_SITE_URL`: domínio público;
- `ALLOWED_HOSTS`: hosts aceitos pelo Django;
- `CORS_ALLOWED_ORIGINS`: origens autorizadas;
- `CSRF_TRUSTED_ORIGINS`: origens confiáveis para CSRF;
- `TLS_CERTS_PATH`: diretório da VPS contendo `fullchain.pem` e `privkey.pem`.

### Desenvolvimento

```bash
cp env_dev_example.py .env.dev
```

O ambiente de dev usa PostgreSQL em `localhost:5433`, backend em `localhost:8000`, frontend em `localhost:3000` e Nginx em `localhost:8080`.

## Desenvolvimento

Subir todos os serviços:

```bash
docker compose --env-file .env.dev -f compose.dev.yml up --build
```

Abrir:

- aplicação via Nginx: <http://localhost:8080>;
- frontend direto: <http://localhost:3000>;
- backend direto: <http://localhost:8000>;
- status da API: <http://localhost:8000/api/status>.

Parar mantendo volumes:

```bash
docker compose --env-file .env.dev -f compose.dev.yml down
```

Apagar banco e dados locais também:

```bash
docker compose --env-file .env.dev -f compose.dev.yml down -v
```

O Compose de desenvolvimento monta o código-fonte, mantém `node_modules` e `.next` em volumes e executa `npm ci`/`uv sync` dentro do container. Isso permite hot reload sem instalar Node ou Python na máquina host.

## Deploy na VPS

### Preparação

Na VPS, instalar Docker Engine e o plugin Compose. Clonar o repositório em um diretório de deploy e criar o ambiente:

```bash
cp env_example.py .env
mkdir -p certs
```

Colocar os certificados no diretório configurado:

```text
certs/fullchain.pem
certs/privkey.pem
```

O Nginx escuta HTTP e redireciona para HTTPS. A porta HTTP não serve conteúdo em produção; o tráfego final deve entrar por HTTPS.

### Subir produção

```bash
docker compose --env-file .env -f compose.yml up -d --build
```

O container backend executa automaticamente, nesta ordem:

1. `python manage.py migrate --noinput`;
2. `python manage.py collectstatic --noinput`;
3. Gunicorn com workers configuráveis.

Ver logs:

```bash
docker compose --env-file .env -f compose.yml logs -f
docker compose --env-file .env -f compose.yml logs -f backend
```

Atualizar a aplicação:

```bash
git pull
docker compose --env-file .env -f compose.yml up -d --build
```

## Persistência dos dados

O Compose cria estes volumes nomeados:

| Volume | Conteúdo | Importância |
| --- | --- | --- |
| `postgres_data` | Banco PostgreSQL | obrigatório; contém todos os dados |
| `media_data` | Imagens enviadas pelo painel | obrigatório; contém capas e uploads |
| `static_data` | Arquivos gerados por `collectstatic` | recriável, mas mantido para o Nginx |

As imagens enviadas via painel são gravadas em `/app/media` no backend e compartilhadas com o Nginx em `/var/www/media`. Portanto, elas permanecem na VPS mesmo quando os containers são recriados.

Não use `docker compose down -v` em produção sem backup: isso remove banco e imagens persistidos nos volumes.

## Backup mínimo recomendado

Backup do banco:

```bash
docker compose --env-file .env -f compose.yml exec -T db \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup.sql
```

Backup das imagens:

```bash
docker run --rm \
  -v vox-regina-caeli_media_data:/media:ro \
  -v "$PWD":/backup \
  alpine tar czf /backup/media-backup.tar.gz -C /media .
```

Use um mecanismo externo para enviar os backups para outro armazenamento. A VPS não deve ser a única cópia dos dados.

## Proxy e roteamento

O Nginx é o único serviço exposto publicamente:

- `/`: encaminha para Next.js;
- `/api/`: encaminha para as rotas BFF do Next.js;
- `/media/`: serve imagens do volume compartilhado;
- `/static/`: serve arquivos estáticos coletados pelo Django.

O Next.js acessa o backend pela rede interna usando `API_URL=http://backend:8000/api`. O backend não precisa ficar exposto à internet.

## Segurança de produção

- Nunca use os valores de exemplo em produção.
- Nunca versione `.env`, certificados, `db.sqlite3` ou uploads.
- Mantenha `DEBUG=false`.
- Use uma `SECRET_KEY` nova e longa.
- Restrinja `ALLOWED_HOSTS`, CORS e CSRF ao domínio real.
- Mantenha PostgreSQL sem `ports` publicados no Compose de produção.
- Mantenha backend e frontend sem portas públicas; somente Nginx publica `80/443`.
- Faça backup antes de migrations destrutivas ou remoção de volumes.
- Atualize as imagens base periodicamente e faça rebuild controlado.

## Limitações conhecidas

- O Compose pressupõe que os certificados TLS já existam na VPS; a renovação do Let's Encrypt não está dentro do stack.
- `uv.lock` precisa ser atualizado quando dependências Python mudarem. Execute `uv lock` com acesso ao PyPI antes de publicar uma nova imagem.
- O primeiro build precisa de acesso aos registries npm, PyPI/GHCR e Docker Hub.
- O deploy não substitui backup, monitoramento, firewall ou configuração DNS da VPS.

## Validação antes do deploy

```bash
docker compose --env-file .env.dev -f compose.dev.yml config
docker compose --env-file .env.dev -f compose.dev.yml build
docker compose --env-file .env.dev -f compose.dev.yml up -d
curl http://localhost:8080/api/status
```

Antes da produção, confirmar:

- login e refresh JWT;
- upload e leitura de imagem;
- migrations aplicadas;
- `/api/status` respondendo;
- HTTPS válido;
- persistência após `docker compose up -d --force-recreate`;
- backup e restauração testados.
