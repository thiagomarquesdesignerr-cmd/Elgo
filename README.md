# Elgo — hospedagem SaaS para portais de notícias

Cada cliente cria uma conta, abre um ou mais portais e publica matérias pelo painel.
Cada portal fica em `<endereco>.<dominio-da-elgo>` ou num domínio próprio, com 5 layouts à escolha.

Stack: Next.js 15 · Prisma · Postgres (Neon) · Vercel.

## Rodar localmente

1. Crie um banco grátis em [neon.tech](https://neon.tech) (região São Paulo). Dica: use um *branch* `dev` só para desenvolvimento.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `DATABASE_URL_UNPOOLED` com as duas URLs que o Neon mostra (com e sem *pooling*).
3. Rode:

```bash
npm install
npm run setup   # cria as tabelas e carrega o portal de exemplo
npm run dev
```

- Plataforma: http://localhost:3000
- Portal de exemplo: http://diariodovale.localhost:3000
- Login de teste: `demo@elgo.test` / `demo12345`

## Colocar no ar (Vercel + Neon)

### 1. Código no GitHub
Crie um repositório e envie este projeto (o `.env` fica de fora, pelo `.gitignore`).

### 2. Projeto na Vercel
1. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework (Next.js) é detectado sozinho.
2. Em **Storage**, conecte um banco **Neon**. Ele cria `DATABASE_URL` e `DATABASE_URL_UNPOOLED` no projeto.
3. Em **Settings → Environment Variables**, adicione:
   - `AUTH_SECRET`: gere com `openssl rand -base64 32`
   - `NEXT_PUBLIC_ROOT_DOMAIN`: seu domínio, sem `https://` (ex.: `elgo.com.br`)
4. Faça o deploy. O build roda `prisma migrate deploy` e cria as tabelas no banco.

### 3. Domínio da Elgo com subdomínios curinga
Os portais vivem em `*.elgo.com.br`, e para isso a Vercel precisa controlar o DNS do domínio:
1. Em **Settings → Domains**, adicione `elgo.com.br` e `*.elgo.com.br`.
2. No Registro.br, troque os **servidores DNS** do domínio para os da Vercel (`ns1.vercel-dns.com` e `ns2.vercel-dns.com`).
3. Espere propagar (minutos a algumas horas). O HTTPS dos subdomínios é emitido sozinho.

### 4. Domínios próprios dos clientes (opcional, mas recomendado)
Com estas variáveis, quando um cliente salva o domínio em **Configurações**, a Elgo liga esse domínio na Vercel sozinha e mostra o status (aguardando DNS / ativo):
- `VERCEL_TOKEN`: crie em vercel.com/account/tokens
- `VERCEL_PROJECT_ID`: em Project → Settings → General
- `VERCEL_TEAM_ID`: só se o projeto estiver num *team*

O cliente então aponta o domínio dele: `CNAME → cname.vercel-dns.com` (com www) ou `A → 76.76.21.21` (sem www).

## Como funciona

| Parte | Onde |
| --- | --- |
| Roteamento por domínio (multi-inquilino) | `src/middleware.ts` reescreve `qualquer-host/...` para `/s/<host>/...` |
| Site público dos portais | `src/app/s/[site]/` (capa, editorias, matéria, `rss.xml`, `sitemap.xml`) |
| Layouts dos portais | `src/components/site/homes.tsx`, `SiteHeader.tsx`, lista em `src/lib/layouts.ts` |
| Prévia de layout antes de publicar | `?previa=<layout>` na URL do portal (`src/lib/sites.ts`) e aba Aparência no painel |
| Painel do cliente | `src/app/painel/` |
| Login e cadastro | `src/app/(auth)/`, `src/lib/auth.ts` (JWT em cookie) |
| Domínios próprios na Vercel | `src/lib/vercel.ts` |
| Banco de dados | `prisma/schema.prisma`, migrações em `prisma/migrations/` |

Para mudar o banco: edite `schema.prisma` e rode `npx prisma migrate dev --name descricao` (gera uma nova migração).

## Próximos passos
- Upload de imagens (Vercel Blob ou Cloudflare R2) no lugar de URLs coladas.
- Cobrança dos planos (Stripe, Mercado Pago ou Asaas) e limites por plano (`Portal.plan`).
- Vários usuários por portal, com papéis (editor, repórter).
- Cache de borda nos portais, com invalidação ao publicar.
- Limite de tentativas no login e recuperação de senha por e-mail.
