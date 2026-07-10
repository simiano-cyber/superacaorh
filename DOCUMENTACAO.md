# SuperAção RH — Documentação Completa do Sistema

## Visão Geral

O SuperAção RH é uma plataforma de gestão de recrutamento e seleção (ATS - Applicant Tracking System) desenvolvida para a consultoria SuperAção RH. O sistema conecta candidatos, empresas parceiras e a equipe interna de recrutamento em uma plataforma única.

**URL de produção:** https://www.superacaorh.com.br

---

## Arquitetura

### Stack Tecnológica

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Frontend + Backend | Next.js 16 (App Router) | Interface, APIs, SSR |
| UI | Tailwind CSS v4 | Estilização responsiva |
| Banco de dados | Supabase (PostgreSQL) | Dados, relações, queries |
| Autenticação | Supabase Auth | Login, registro, sessões |
| Storage | Supabase Storage | Upload de CVs (PDF) |
| Ícones | Lucide React | Ícones SVG |
| E-mail | Resend | Notificações automáticas |
| Deploy | Vercel | Hospedagem, CI/CD |
| Versionamento | GitHub | Código fonte |
| Domínio | Registro.br | superacaorh.com.br |

### Diagrama de Serviços

```
[Navegador] → [Vercel (Next.js)] → [Supabase (PostgreSQL + Auth + Storage)]
                    ↓
              [Resend (E-mails)]
```

---

## Infraestrutura e Serviços

### GitHub
- **Repositório:** github.com/simiano-cyber/superacaorh
- **Branch principal:** main
- **Deploy automático:** cada push na main dispara deploy na Vercel

### Vercel
- **Projeto:** superacaorh
- **Framework:** Next.js (detectado automaticamente)
- **Domínios:** superacaorh.com.br, www.superacaorh.com.br
- **Variáveis de ambiente:**
  - `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Chave pública (anon JWT)
  - `SUPABASE_SERVICE_ROLE_KEY` — Chave admin (server-side apenas)
  - `RESEND_API_KEY` — Chave da API do Resend

### Supabase
- **Projeto:** SuperAcaoRH
- **Região:** São Paulo (sa-east-1)
- **Banco:** PostgreSQL
- **Auth:** E-mail + senha com auto-confirmação
- **Storage:** Bucket "documents" (público) para CVs
- **RLS:** Desabilitado temporariamente (para desenvolvimento)

### Resend
- **Domínio verificado:** superacaorh.com.br
- **Remetente:** noreply@superacaorh.com.br
- **Região:** São Paulo (sa-east-1)

### Registro.br
- **Domínio:** superacaorh.com.br (plano 2 anos)
- **DNS:** Apontado para Vercel (A record + CNAME)
- **Registros adicionais:** DKIM, SPF, DMARC para Resend

---

## Estrutura de Pastas

```
superacaorh/
├── public/
│   └── images/                    # Logotipos e imagens do site
├── src/
│   ├── app/
│   │   ├── (auth)/                # Páginas de autenticação
│   │   │   ├── login/             # Login com escolha de perfil
│   │   │   ├── registro/          # Cadastro (candidato/parceiro)
│   │   │   ├── recuperar-senha/   # Solicitar reset
│   │   │   └── redefinir-senha/   # Definir nova senha
│   │   ├── admin/                 # Portal Administrativo
│   │   │   ├── candidatos/        # Lista + detalhe candidato
│   │   │   ├── configuracoes/     # Colaboradores + settings
│   │   │   ├── entrevistas/       # Agendamento de entrevistas
│   │   │   ├── parceiros/         # CRUD parceiros
│   │   │   ├── relatorios/        # Métricas + exportação CSV
│   │   │   └── vagas/             # CRUD vagas + pipeline
│   │   ├── candidato/             # Portal do Candidato
│   │   │   ├── candidaturas/      # Acompanhamento com progresso
│   │   │   ├── curriculo/         # Formulário completo
│   │   │   ├── perfil/            # Dados de acesso
│   │   │   └── vagas/             # Vagas disponíveis + candidatura
│   │   ├── parceiro/              # Portal do Parceiro
│   │   │   ├── candidatos/        # Shortlist
│   │   │   ├── historico/         # Vagas anteriores
│   │   │   ├── metricas/          # SLA e indicadores
│   │   │   └── vagas/             # Vagas da empresa
│   │   ├── api/                   # API Routes (server-side)
│   │   │   ├── admin/
│   │   │   │   └── invite-collaborator/  # Criar colaborador
│   │   │   └── notifications/
│   │   │       ├── application-confirm/  # E-mail candidatura
│   │   │       ├── stage-change/         # E-mail mudança etapa
│   │   │       └── welcome/             # E-mail boas-vindas
│   │   ├── vagas/                 # Página pública de vagas (sem login)
│   │   ├── layout.tsx             # Layout global
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Estilos globais + tokens
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Menu lateral responsivo
│   │   │   └── DashboardHeader.tsx # Header com busca
│   │   ├── ui/
│   │   │   ├── Button.tsx         # Botão com variantes
│   │   │   ├── Card.tsx           # Card container
│   │   │   └── Input.tsx          # Input com label e erro
│   │   └── WhatsAppButton.tsx     # Botão flutuante WhatsApp
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Client-side Supabase
│   │   │   └── server.ts          # Server-side Supabase
│   │   ├── email.ts               # Templates e envio via Resend
│   │   └── types.ts               # TypeScript interfaces
│   └── middleware.ts              # Proteção de rotas
├── supabase/
│   ├── schema.sql                 # Schema original do banco
│   ├── fix-rls.sql                # Correção de permissões
│   ├── pipeline-configuravel.sql  # Pipeline configurável
│   └── tags-comments.sql          # Tags e comentários
├── .env.local                     # Variáveis locais (não commitado)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Banco de Dados — Schema Completo

### Tabelas Principais

#### profiles
Extensão do auth.users com dados de perfil.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK, FK auth.users) | ID do usuário |
| role | user_role (enum) | candidato, admin, parceiro |
| full_name | TEXT | Nome completo |
| email | TEXT | E-mail |
| phone | TEXT | Telefone |
| avatar_url | TEXT | URL do avatar |
| company_name | TEXT | Nome da empresa (parceiros) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

#### candidates
Dados do currículo do candidato.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | ID do candidato |
| profile_id | UUID (FK profiles, UNIQUE) | Perfil associado |
| cpf | TEXT | CPF |
| birth_date | DATE | Data de nascimento |
| gender | TEXT | Gênero |
| city | TEXT | Cidade |
| state | TEXT | Estado |
| address | TEXT | Endereço |
| linkedin_url | TEXT | URL do LinkedIn |
| portfolio_url | TEXT | URL do portfólio |
| resume_url | TEXT | URL do CV em PDF (Storage) |
| objective | TEXT | Objetivo profissional |
| salary_expectation | NUMERIC | Pretensão salarial |
| availability | TEXT | Disponibilidade |

#### candidate_experiences
Experiências profissionais do candidato.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| candidate_id | UUID (FK candidates) | |
| company | TEXT | Empresa |
| position | TEXT | Cargo |
| start_date | DATE | Início |
| end_date | DATE | Fim (null = atual) |
| description | TEXT | Descrição das atividades |

#### candidate_education
Formação acadêmica.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| candidate_id | UUID (FK candidates) | |
| institution | TEXT | Instituição |
| course | TEXT | Curso |
| degree | TEXT | Nível (graduação, pós, etc.) |
| start_date | DATE | Início |
| end_date | DATE | Fim |

#### candidate_skills
Habilidades do candidato.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| candidate_id | UUID (FK candidates) | |
| skill_name | TEXT | Nome da habilidade |
| level | TEXT | Nível (básico, intermediário, avançado) |

#### partners
Empresas parceiras/clientes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| profile_id | UUID (FK profiles) | Perfil do usuário parceiro |
| company_name | TEXT | Nome da empresa |
| cnpj | TEXT | CNPJ |
| sector | TEXT | Setor de atuação |
| contact_name | TEXT | Nome do contato |
| contact_phone | TEXT | Telefone |
| contact_email | TEXT | E-mail do contato |
| city | TEXT | Cidade |
| state | TEXT | Estado |

#### jobs
Vagas abertas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| partner_id | UUID (FK partners) | Empresa da vaga |
| title | TEXT | Título da vaga |
| description | TEXT | Descrição |
| requirements | TEXT | Requisitos |
| benefits | TEXT | Benefícios |
| salary_range | TEXT | Faixa salarial |
| city | TEXT | Cidade |
| state | TEXT | Estado |
| work_model | TEXT | presencial, remoto, híbrido |
| contract_type | TEXT | CLT, PJ, Temporário, Estágio |
| status | job_status (enum) | aberta, pausada, encerrada |
| positions_count | INT | Número de vagas |
| deadline | DATE | Prazo |
| created_by | UUID (FK profiles) | Quem criou |

#### applications
Candidaturas (relação candidato ↔ vaga).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| job_id | UUID (FK jobs) | Vaga |
| candidate_id | UUID (FK candidates) | Candidato |
| stage | application_stage (enum) | Etapa atual (legado) |
| current_stage_id | UUID (FK pipeline_stages) | Etapa do pipeline configurável |
| notes | TEXT | Observações |
| rating | INT (1-5) | Avaliação |
| applied_at | TIMESTAMPTZ | Data da candidatura |

#### application_timeline
Histórico de movimentações.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| application_id | UUID (FK applications) | |
| stage | application_stage | Etapa para a qual moveu |
| title | TEXT | Descrição da ação |
| description | TEXT | Observação/nota |
| created_by | UUID (FK profiles) | Quem fez a ação |
| created_at | TIMESTAMPTZ | Quando |

#### interviews
Entrevistas agendadas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| application_id | UUID (FK applications) | |
| interviewer_name | TEXT | Nome do entrevistador |
| interview_type | TEXT | Tipo (RH, Técnica, Cliente) |
| scheduled_at | TIMESTAMPTZ | Data/hora |
| duration_minutes | INT | Duração |
| location | TEXT | Local ou link |
| notes | TEXT | Notas prévias |
| feedback | TEXT | Feedback pós-entrevista |
| result | TEXT | Resultado |

### Tabelas do Pipeline Configurável

#### pipeline_stages
Catálogo de etapas disponíveis.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| name | TEXT (UNIQUE) | Nome da etapa |
| stage_type | stage_type (enum) | triagem, teste, entrevista, proposta, contratacao, outro |
| description | TEXT | Descrição |
| is_system | BOOLEAN | Se é etapa do sistema (não deletável) |

#### pipeline_templates
Templates de pipeline pré-configurados.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| name | TEXT (UNIQUE) | Nome do template |
| description | TEXT | Descrição |

#### pipeline_template_stages
Etapas de cada template (relação N:N com ordem).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| template_id | UUID (FK pipeline_templates) | |
| stage_id | UUID (FK pipeline_stages) | |
| position | INT | Ordem da etapa |

#### job_pipeline
Pipeline configurado por vaga.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| job_id | UUID (FK jobs) | |
| stage_id | UUID (FK pipeline_stages) | |
| position | INT | Ordem da etapa |

### Tabelas Auxiliares

#### tags
Tags disponíveis para candidatos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| name | TEXT (UNIQUE) | Nome da tag |
| color | TEXT | Cor em hex |

#### candidate_tags
Relação candidato ↔ tag.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| candidate_id | UUID (FK candidates) | |
| tag_id | UUID (FK tags) | |

#### internal_comments
Comentários internos sobre candidatos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | |
| candidate_id | UUID (FK candidates) | |
| application_id | UUID (FK applications) | |
| author_id | UUID (FK profiles) | Quem escreveu |
| content | TEXT | Conteúdo |
| created_at | TIMESTAMPTZ | Data |

### Enums

```sql
CREATE TYPE user_role AS ENUM ('candidato', 'admin', 'parceiro');
CREATE TYPE job_status AS ENUM ('aberta', 'pausada', 'encerrada');
CREATE TYPE application_stage AS ENUM ('inscrito', 'triagem', 'entrevista_rh', 'entrevista_cliente', 'teste_tecnico', 'aprovado', 'reprovado', 'contratado', 'desistente');
CREATE TYPE stage_type AS ENUM ('triagem', 'teste', 'entrevista', 'proposta', 'contratacao', 'outro');
```

### Relações (Diagrama simplificado)

```
auth.users
    └── profiles (1:1)
            ├── candidates (1:1)
            │       ├── candidate_experiences (1:N)
            │       ├── candidate_education (1:N)
            │       ├── candidate_skills (1:N)
            │       ├── candidate_tags (N:N via tags)
            │       └── applications (1:N)
            │               ├── application_timeline (1:N)
            │               └── interviews (1:N)
            ├── partners (1:1)
            │       └── jobs (1:N)
            │               ├── applications (1:N)
            │               └── job_pipeline (1:N → pipeline_stages)
            └── internal_comments (1:N)

pipeline_stages
    ├── pipeline_template_stages (N:N via pipeline_templates)
    └── job_pipeline (N:N via jobs)
```

### Triggers

| Trigger | Tabela | Ação |
|---------|--------|------|
| on_auth_user_created | auth.users | Cria profile automaticamente ao registrar |
| auto_confirm_on_signup | auth.users | Confirma e-mail automaticamente |

---

## Funcionalidades por Portal

### Portal Público (sem login)

| Rota | Funcionalidade |
|------|---------------|
| `/` | Landing page institucional |
| `/vagas` | Lista de vagas abertas (compartilhável) |
| `/login` | Login com escolha de perfil |
| `/registro` | Cadastro de candidato ou parceiro |
| `/recuperar-senha` | Solicitar reset de senha |
| `/redefinir-senha` | Definir nova senha |

### Portal do Candidato

| Rota | Funcionalidade |
|------|---------------|
| `/candidato` | Dashboard com métricas pessoais |
| `/candidato/curriculo` | Formulário completo (dados, experiências, formação, skills, upload CV) |
| `/candidato/vagas` | Vagas abertas com candidatura em 1 clique |
| `/candidato/candidaturas` | Acompanhamento com barra de progresso |
| `/candidato/perfil` | Alterar dados de acesso |

### Portal Administrativo

| Rota | Funcionalidade |
|------|---------------|
| `/admin` | Dashboard com métricas reais do banco |
| `/admin/vagas` | Lista com filtros (status, empresa, modelo, contrato) |
| `/admin/vagas/nova` | Criar vaga com pipeline configurável |
| `/admin/vagas/[id]` | Pipeline Kanban + ações (avançar, reprovar, pausar) |
| `/admin/vagas/[id]/editar` | Editar vaga existente |
| `/admin/candidatos` | Lista em tabela com filtros (cidade, skill, disponibilidade) |
| `/admin/candidatos/[id]` | Detalhe completo + tags + comentários internos |
| `/admin/parceiros` | CRUD de empresas parceiras |
| `/admin/parceiros/[id]` | Detalhe do parceiro + vagas vinculadas |
| `/admin/entrevistas` | Agendar e listar entrevistas |
| `/admin/relatorios` | Métricas calculadas + exportação CSV |
| `/admin/configuracoes` | Gerenciar colaboradores (convidar/listar) |

### Portal do Parceiro

| Rota | Funcionalidade |
|------|---------------|
| `/parceiro` | Dashboard com métricas das vagas da empresa |
| `/parceiro/vagas` | Vagas abertas com SLA |
| `/parceiro/candidatos` | Candidatos pré-selecionados |
| `/parceiro/metricas` | SLA detalhado + indicadores |
| `/parceiro/historico` | Vagas anteriores |

---

## Sistema de E-mails

### Eventos que disparam e-mail

| Evento | Template | Rota API |
|--------|----------|----------|
| Cadastro concluído | Boas-vindas + próximos passos | `/api/notifications/welcome` |
| Candidatura registrada | Confirmação com dados da vaga | `/api/notifications/application-confirm` |
| Mudança de etapa | Notificação com nova etapa | `/api/notifications/stage-change` |
| Colaborador criado | Credenciais de acesso | `/api/admin/invite-collaborator` |

### Configuração

- **Serviço:** Resend
- **Remetente:** noreply@superacaorh.com.br
- **Templates:** HTML inline com identidade visual (navy, gold)

---

## Autenticação e Segurança

### Fluxo de Login

1. Usuário escolhe tipo de acesso (Candidato, Parceiro, Colaborador)
2. Digita e-mail + senha
3. Supabase Auth valida credenciais
4. Middleware verifica sessão e redireciona para o portal correto
5. Rotas `/admin`, `/candidato`, `/parceiro` são protegidas

### Tipos de Usuário

| Role | Cadastro | Acesso |
|------|----------|--------|
| candidato | Auto-registro em `/registro` | Portal do candidato |
| parceiro | Auto-registro em `/registro` | Portal do parceiro |
| admin | Criado por outro admin (Configurações) | Portal administrativo |

### Middleware

O middleware intercepta todas as requisições e:
- Redireciona para `/login` se não autenticado em rotas protegidas
- Redireciona para o portal correto se autenticado e tentando acessar `/login`

---

## Pipeline Configurável

### Como funciona

1. Admin cria vaga → escolhe um template ou configura manualmente
2. Templates disponíveis: Rápido (4 etapas), Padrão (6), Executivo (8), Operacional (5)
3. 15 etapas disponíveis para combinar livremente
4. Cada etapa tem um tipo: triagem, teste, entrevista, proposta, contratação
5. Etapas de entrevista criam agendamento automático ao avançar candidato

### Etapas Disponíveis

| Etapa | Tipo | Sistema |
|-------|------|---------|
| Inscrição | Triagem | Sim |
| Triagem de currículo | Triagem | Sim |
| Pré-seleção / Shortlist | Triagem | Não |
| Teste técnico | Teste | Não |
| Teste comportamental / DISC | Teste | Não |
| Case prático | Teste | Não |
| Teste de idiomas | Teste | Não |
| Entrevista RH | Entrevista | Sim |
| Entrevista com Gestor | Entrevista | Não |
| Entrevista com Diretor | Entrevista | Não |
| Painel / Comitê | Entrevista | Não |
| Dinâmica de grupo | Entrevista | Não |
| Proposta salarial | Proposta | Não |
| Exame admissional | Proposta | Não |
| Contratação | Contratação | Sim |

---

## Identidade Visual

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| navy | #142033 | Cor principal, textos, botões |
| navy-deep | #0d1726 | Fundos escuros, sidebar |
| gold | #c9a563 | Destaques, badges, links ativos |
| gold-dark | #a98645 | Hover do gold, textos de destaque |
| green | #3d4f35 | Sucesso, aprovado, positivo |
| gray | #7d8086 | Textos secundários |
| soft | #f5f5f5 | Fundos claros, backgrounds |
| line | rgba(20,32,51,0.12) | Bordas, separadores |

### Tipografia

- **Fonte:** Montserrat (Google Fonts)
- **Pesos:** 400 (normal), 700 (bold), 800 (extra-bold), 900 (black)

---

## Deploy e CI/CD

### Fluxo

```
Desenvolvedor faz push no GitHub (main)
        ↓
Vercel detecta automaticamente
        ↓
Build (Next.js build) ~35s
        ↓
Deploy em produção
        ↓
Site atualizado em www.superacaorh.com.br
```

### Como fazer deploy

```bash
cd ~/Documents/Proj\ RH/superacaorh
git add -A
git commit -m "descrição da mudança"
git push origin main
```

---

## Contatos Configurados

| Canal | Número/E-mail | Uso |
|-------|---------------|-----|
| WhatsApp Comercial | (11) 99416-7331 | Empresas interessadas em serviços |
| WhatsApp Vagas | (11) 95404-2488 | Candidatos com dúvidas |
| E-mail Comercial | comercial@superacaorh.com.br | Comunicação comercial |
| E-mail Vagas | vagas@superacaorh.com.br | Comunicação sobre vagas |
| E-mail Sistema | noreply@superacaorh.com.br | Notificações automáticas |

---

## Pendências Conhecidas

| Item | Prioridade | Descrição |
|------|-----------|-----------|
| RLS | Alta | Reativar Row Level Security com policies corretas para produção |
| Editar parceiro | Média | Formulário de edição de dados do parceiro |
| Parceiro aprovar shortlist | Baixa | Parceiro interagir com candidatos pré-selecionados |
| Integração WhatsApp | Baixa | Enviar mensagens pelo painel |
| App mobile | Baixa | App nativo para candidatos |
| Testes automatizados | Média | Adicionar testes unitários e E2E |

---

## Histórico de Versões

| Data | Versão | Mudanças |
|------|--------|----------|
| 08/07/2026 | 1.0 | Projeto criado, estrutura base, 3 portais |
| 08/07/2026 | 1.1 | Deploy Vercel, Supabase configurado |
| 09/07/2026 | 1.2 | CRUD vagas, currículo, candidaturas conectados ao banco |
| 09/07/2026 | 1.3 | Pipeline Kanban, detalhe candidato/parceiro |
| 09/07/2026 | 1.4 | UX (sidebar mobile, notas, progresso, busca) |
| 09/07/2026 | 1.5 | Notificações por e-mail (Resend) |
| 10/07/2026 | 1.6 | Recuperar senha, editar vaga |
| 10/07/2026 | 1.7 | Página pública de vagas, tags, comentários, relatórios exportáveis |
| 10/07/2026 | 1.8 | Seção contato redesenhada, WhatsApp flutuante |
| 10/07/2026 | 1.9 | Filtros avançados (vagas e candidatos) |
| 10/07/2026 | 2.0 | Pipeline configurável por vaga com templates |
