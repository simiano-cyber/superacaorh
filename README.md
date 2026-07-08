# SuperAção RH — Sistema de Gestão em Recrutamento

Plataforma completa de gestão em recrutamento e seleção com 3 portais:

- **Portal do Candidato** — cadastro de currículo, busca e inscrição em vagas
- **Portal Administrativo** — gestão de vagas, candidatos, entrevistas e pipeline
- **Portal do Parceiro** — acompanhamento de vagas, SLA e métricas

## Stack

- **Frontend/Backend:** Next.js 16 (App Router)
- **UI:** Tailwind CSS (identidade visual SuperAção RH)
- **Banco de dados + Auth + Storage:** Supabase
- **Ícones:** Lucide React
- **Deploy:** Vercel

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page institucional |
| `/login` | Login (3 perfis) |
| `/registro` | Cadastro de candidato ou parceiro |
| `/candidato` | Dashboard do candidato |
| `/candidato/curriculo` | Formulário de currículo |
| `/candidato/vagas` | Vagas disponíveis |
| `/admin` | Dashboard administrativo |
| `/admin/vagas` | Gerenciamento de vagas |
| `/admin/candidatos` | Base de candidatos |
| `/parceiro` | Dashboard do parceiro |

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a URL e a Anon Key
3. Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-ANON-KEY
```

### 3. Criar as tabelas

No Supabase → SQL Editor, execute o conteúdo de `supabase/schema.sql`

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5. Deploy na Vercel

1. Suba o projeto para o GitHub
2. Conecte o repositório na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Deploy automático a cada push

## Estrutura de Pastas

```
src/
├── app/
│   ├── (auth)/          → login, registro
│   ├── admin/           → portal administrativo
│   ├── candidato/       → portal do candidato
│   ├── parceiro/        → portal do parceiro
│   ├── layout.tsx       → layout global
│   └── page.tsx         → landing page
├── components/
│   ├── layout/          → sidebar, header
│   └── ui/              → button, input, card
├── lib/
│   └── supabase/        → client e server
└── middleware.ts        → proteção de rotas
```

## Identidade Visual

| Token | Cor |
|-------|-----|
| Navy | `#142033` |
| Navy Deep | `#0d1726` |
| Gold | `#c9a563` |
| Gold Dark | `#a98645` |
| Green | `#3d4f35` |
| Gray | `#7d8086` |
| Soft | `#f5f5f5` |
