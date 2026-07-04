# 🏗️ Arquitetura do Sistema e Estrutura de Pastas
Este documento estabelece o padrão arquitetural do projeto. O agente deve seguir rigorosamente a estrutura de arquivos, a separação de responsabilidades e o fluxo de roteamento descritos abaixo.

---

## Back-end: Monólito Modular (Django + Django Ninja)

O código reside em `backend/*`. O projeto é dividido em módulos de negócio (apps Django) isolados, centralizados por um módulo core que gerencia as configurações e o roteamento global da API.

### 🔌 Roteamento Centralizado (Pasta Core)
* **Ponto de Entrada Único:** A instância principal do Django Ninja deve residir exclusivamente em `backend/core/api.py`.
* **Registro de Rotas:** Os arquivos `produto_routes.py` (e de outros módulos futuros) não devem instanciar a classe `NinjaAPI` principal. Eles devem expor um objeto `Router` local (`from ninja import Router`).
* **Acoplamento:** O arquivo `backend/core/api.py` importa os roteadores locais de cada módulo e os centraliza utilizando `api.add_router("/prefixo", modulo_router)`.

### 🧪 Convenção de Testes (Back-end)

Cada módulo de negócio DEVE conter um pacote `tests/` com arquivos nomeados no padrão `test_[entidade].py`:

```text
backend/[nome_app]/
├── tests/
│   ├── __init__.py
│   ├── test_[entidade]_model.py    # Testes unitários do modelo
│   ├── test_[entidade]_service.py  # Testes unitários da camada de serviço
│   └── test_[entidade]_api.py      # Testes de integração dos endpoints
```

* **Framework:** `django.test.TestCase` (padrão Django, sem dependências extras).
* **Execução:** `uv run python manage.py test autenticacao.tests.test_perfil_model --verbosity=2`
* **Isolamento:** Cada arquivo de teste testa apenas uma camada (model, service ou api).
  Testes de API consomem exclusivamente as rotas registradas no Router.

### 🚫 Regras Críticas de Design:
* **Service Layer:** Toda regra de negócio, validações complexas e orquestração de dados devem residir obrigatoriamente na camada de serviços.
* **Thin Models:** Os modelos devem conter apenas a definição da tabela e campos. É proibida lógica de negócio pesada nos models. São permitidos métodos `@property` exclusivamente para cálculos derivados imediatos e frequentes (ex: totalizadores).
* **Nomenclatura Explícita:** Os nomes dos arquivos dentro dos pacotes devem conter explicitamente o prefixo do domínio para máxima clareza humana (ex: `[entidade]_model.py`, não apenas `model.py`).
* **Isolamento entre Módulos:** Um módulo não deve acessar diretamente modelos ou dados internos de outro módulo. Toda comunicação inter-módulos deve ser feita chamando estritamente a API pública da camada de serviço do módulo correspondente.

### 📂 Estrutura de Pastas do Back-end
```text
backend/
├── core/                       # Módulo Central do Projeto
│   ├── __init__.py
│   ├── settings.py             # Configurações do Django
│   ├── urls.py                 # Roteamento nativo do Django (aponta para core/api.py)
│   └── api.py                  # CENTRAL DE ENDPOINTS: Instancia NinjaAPI e adiciona os routers
│   └── exceptions.py           # CENTRAL DE EXCEÇÕES: Classes de erros customizados 
└── [nome_app]/                 # Módulo isolado do App
    ├── __init__.py
    ├── apps.py
    ├── api/                    # Camada de Entrada / HTTP
    │   ├── __init__.py
    │   ├── [entidade]_routes.py   # Define o Router local (ex: router = Router())
    │   └── [entidade]_schemas.py  # Definição dos schemas Pydantic v2
    ├── models/                 # Camada de Persistência / Banco de Dados
    │   ├── __init__.py
    │   └── [entidade]_model.py    # Definição da tabela e propriedades simples
    └── services/               # Camada de Regra de Negócio
        ├── __init__.py
        └── [entidade]_service.py  # Funções executáveis de manipulação do domínio

```

---

## Front-end: Arquitetura Baseada em Features (Next.js)

O código reside em `frontend/*` utilizando o App Router. A lógica visual é modularizada por domínio de negócio na pasta `features/`, garantindo simetria com o Back-end.

### Estrutura de Pastas do Front-end

```text
frontend/
├── src/
│   ├── app/                    # Rotas e Páginas (Next.js App Router)
│   │   ├── layout.tsx          # Layout global
│   │   ├── page.tsx            # Landing page / Home
│   │   └── produtos/
│   │       ├── page.tsx        # Página de listagem (Consome a Feature)
│   │       └── [id]/
│   │           └── page.tsx    # Página de detalhe (Consome a Feature)
│   ├── components/
│   │   └── ui/                 # Componentes agnósticos/globais (shadcn/ui)
│   │       ├── button.tsx
│   │       └── dialog.tsx
│   └── features/               # Módulos de Domínio
│       └── [dominio]/           # Feature isolada de [dominio]
│           ├── api/            # Chamadas HTTP ao Django Ninja (Fetch / Mutations)
│           ├── components/     # Componentes de interface específicos desta feature
│           │   ├── lista-[dominio].tsx
│           │   └── card-[dominio].tsx
│           └── types.ts        # Tipagens TypeScript (Espelho dos schemas do backend)

```

### 🚫 Regras Críticas do Front-end:

* **Páginas Enxutas:** Os arquivos dentro de `src/app/` devem apenas capturar parâmetros de URL/Contexto e renderizar componentes vindos da pasta `features/`. Não implemente JSX complexo ou lógica de estado dentro da pasta `app/`.
* **Componentização UI:** Elementos básicos de layout (botões, inputs, cards genéricos) pertencem ao `components/ui/`. Componentes acoplados a regras de negócio pertencem à sua respectiva `feature/`.

```