## Stack Tecnológica
- **Framework Fullstack:** Nuxt.js 
- **Banco de Dados:** SQLite.
- **ORM:** Drizzle ORM 
- **Estilização e UI:** Tailwind CSS integrado com Nuxt UI.
- **Autenticação:** Better Auth.

## Arquitetura e Convenção de Pastas Padrão Nuxt

1. `/server/api/` e `/server/routes/`: Toda lógica de backend, endpoints de API e processamento do lado do servidor roda exclusivamente aqui através do Nitro Engine.
2. `/server/middleware/`: Interceptadores de requisição backend que rodam antes de qualquer rota do servidor, ideais para checagem global de tokens e headers.
3. `/server/database/`: Local centralizado para definir os schemas do Drizzle ORM (`schema.ts`), as configurações de conexão do banco de dados e arquivos de migração.
4. `/pages/`: Sistema de roteamento frontend baseado em arquivos.
5. `/middleware/`: Route middleware exclusivo para o lado do cliente Vue (controle de acessos visual na navegação).
6. `/composables/`: Funções reativas utilitárias reutilizáveis com auto-import no frontend, incluindo os hooks do cliente de autenticação.
7. `/components/`: Componentes visuais isolados com suporte a componentes de ilha (Nuxt Islands).
8. `/public/`: Arquivos estáticos servidos diretamente na raiz, imutáveis no build.
9. `/utils/`: Funções JavaScript/TypeScript puras, sem estado reativo, focadas em formatação ou cálculos matemáticos (com auto-import global).
10. `/types/`: Tipagens globais do TypeScript, interfaces de domínio e inferências de tipos do Drizzle.

---

## O Decálogo de Segurança

1. **NÃO confie em Route Middleware do cliente (`/middleware/`) para proteger dados sensíveis (Bypass de Middleware)**
   * **Ação:** Bloqueie o acesso a dados confidenciais estritamente dentro das rotas de backend `/server/api/`. Filtros de navegação no frontend servem apenas para experiência visual.
   * **Erro:** `if (process.client && !user.auth) { navigateTo('/login') }` dentro do endpoint do servidor.
   * **Correção:** Valide a sessão do Better-Auth utilizando o contexto da requisição no backend com `auth.api.getSession({ headers: getHeaders(event) })` dentro de `/server/api/`.

2. **NÃO concatene strings em caminhos de arquivos ao ler o disco via rotas do servidor (Path Traversal)**
   * **Ação:** Ao ler arquivos de forma dinâmica dentro de `/server/api/`, use métodos como `path.basename` para higienizar qualquer entrada do usuário e rejeitar navegações retroativas com ponto-ponto-barra.
   * **Erro:** `fs.readFileSync('./storage/' + event.context.params.filename)`
   * **Correção:** `const filename = path.basename(getQuery(event).file); const safePath = path.join(process.cwd(), 'storage', filename);`

3. **NÃO use interpolação de strings em queries do Drizzle ORM (SQL Injection)**
   * **Ação:** Utilize os métodos type-safe nativos do Drizzle (`db.select().where(...)`) ou use a sintaxe de sql tag parametrizada (`sql` do `drizzle-orm`) se precisar escrever SQL bruto. Nunca interpole strings diretamente nas chamadas.
   * **Erro:** `db.execute(sql\`SELECT * FROM users WHERE email = '${email}'\`)`
   * **Correção:** `db.select().from(users).where(eq(users.email, email))` ou `db.execute(sql\`SELECT * FROM users WHERE email = ${email}\`)`

4. **NÃO passe dados de usuário não higienizados para o `MapsTo()` com redirecionamento externo (Reflected XSS via Meta-Refresh)**
   * **Ação:** Ao usar `MapsTo` com a opção `external: true`, sanitize e valide estritamente a URL de destino contra uma lista permitida (allowlist) para evitar a injeção de scripts HTML maliciosos no cabeçalho de redirecionamento.
   * **Erro:** `return navigateTo(getQuery(event).redirectUrl, { external: true })`
   * **Correção:** `const target = getQuery(event).redirectUrl; if (isSafeUrl(target)) { return navigateTo(target, { external: true }) }`

5. **NÃO exponha chaves ou variáveis sensíveis fora do `runtimeConfig` privado (Hardcoded Secrets)**
   * **Ação:** Defina variáveis de ambiente privadas (como `BETTER_AUTH_SECRET` e credenciais de banco) apenas dentro de `runtimeConfig` no arquivo `nuxt.config.ts`. Não use `runtimeConfig.public` para armazenar segredos.
   * **Erro:** `export default defineNuxtConfig({ runtimeConfig: { public: { dbUrl: 'postgres://...' } } })`
   * **Correção:** `export default defineNuxtConfig({ runtimeConfig: { dbUrl: process.env.DATABASE_URL, betterAuthSecret: process.env.BETTER_AUTH_SECRET } })`

6. **NÃO use `v-html` com dados dinâmicos sem sanitização (Stored / Reflected XSS)**
   * **Ação:** Renderize strings de usuários sempre através de chaves `{{ text }}` ou `v-text`. Se precisar renderizar HTML de forma inevitável no frontend, use a biblioteca `sanitize-html` antes da exibição.
   * **Erro:** `<div v-html="userInput"></div>`
   * **Correção:** `<div>{{ userInput }}</div>` ou `<div v-html="sanitize(userInput)"></div>`

7. **NÃO confie cegamente no ID do usuário enviado no corpo da requisição para mutações do Drizzle (IDOR)**
   * **Ação:** Em qualquer operação de escrita ou leitura no banco com o Drizzle ORM dentro de `/server/api/`, extraia o ID do usuário logado diretamente da sessão ativa verificada pelo Better-Auth, ignorando IDs passados pelo payload do cliente.
   * **Erro:** `db.update(posts).set({ content }).where(eq(posts.id, body.postId))`
   * **Correção:** `const session = await auth.api.getSession({ headers: getHeaders(event) }); db.update(posts).set({ content }).where(and(eq(posts.id, body.postId), eq(posts.userId, session.user.id)))`

8. **NÃO exponha mensagens detalhadas do Nitro ou stack traces do Drizzle no cliente (Information Leakage)**
   * **Ação:** Envolva as rotas do servidor e operações do banco de dados em blocos `try/catch` e dispare exceções limpas usando a função `createError` nativa do Nuxt, ocultando stack traces e nomes de tabelas reais.
   * **Erro:** `catch (err) { throw createError({ statusCode: 500, statusMessage: err.message }) }`
   * **Correção:** `catch (err) { logger.error(err); throw createError({ statusCode: 500, statusMessage: 'Erro interno no processamento.' }) }`

9. **NÃO permita uploads de arquivos para o servidor sem validar magic bytes e associar ao usuário do banco**
   * **Ação:** Valide o tipo real do arquivo através dos bytes de cabeçalho (MIME Type) e use o Drizzle para registrar o caminho gerado de forma aleatória vinculado ao ID extraído do Better-Auth.
   * **Erro:** `if (file.name.endsWith(".jpg")) { saveFile(file) }`
   * **Correção:** `if (validarMagicBytes(file.buffer)) { const uniqueName = crypto.randomUUID(); saveFile(file, uniqueName); await db.insert(uploads).values({ userId: session.user.id, path: uniqueName }) }`

10. **NÃO deixe de configurar adequadamente os hooks e cookies do Better-Auth (Session Hijacking)**
    * **Ação:** Certifique-se de que os cookies de sessão gerados pelo Better-Auth estejam definidos com as flags `HttpOnly`, `Secure` e `SameSite=Lax` nas configurações de ambiente de produção do Nuxt para mitigar roubo de sessões via scripts do lado do cliente.

---

## Regras Críticas de SSR e Performance (Evitando Alucinações)

1. **Prevenção de Vazamento de Estado (Cross-Request State Pollution):**
   * Nunca declare variáveis reativas (`ref`, `reactive`) ou variáveis comuns (`let data = []`) fora do `<script setup>` em componentes, ou fora da função de retorno em `composables`. Isso faz com que os dados vazem entre requisições de diferentes usuários no servidor.
   * Use a API nativa `useState()` do Nuxt para estados globais compartilhados, pois ela é SSR-safe.

2. **Data Fetching Correto no Frontend:**
   * Nunca use a API `fetch` do navegador ou o `axios` solto dentro de componentes Vue. Isso causa chamadas duplas (uma no servidor e outra no cliente) e erros de hidratação (Hydration Mismatch).
   * **Obrigatório:** Use `useFetch` ou `useAsyncData` (com `$fetch`) para consumir dados das rotas `/server/api/`.

3. **Inferência de Tipos do Drizzle:**
   * Mantenha os tipos inferidos em um local acessível no frontend sem importar o código do servidor. Exporte os tipos no arquivo de schema usando a API do Drizzle: `export type User = typeof users.$inferSelect;`.

4. **Tratamento de Client-Only:**
   * Se um componente ou biblioteca manipular a DOM diretamente (ex: gráficos, editores rich text), envolva-o na tag `<ClientOnly>` para evitar falhas do Node.js durante a renderização no servidor (SSR).