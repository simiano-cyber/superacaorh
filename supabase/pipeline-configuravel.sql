-- ============================================
-- PIPELINE CONFIGURÁVEL POR VAGA
-- Rode no Supabase SQL Editor
-- ============================================

-- Tipos de etapa
CREATE TYPE stage_type AS ENUM ('triagem', 'teste', 'entrevista', 'proposta', 'contratacao', 'outro');

-- Tabela de etapas disponíveis (catálogo global)
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  stage_type stage_type NOT NULL DEFAULT 'outro',
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- etapas do sistema não podem ser deletadas
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates de pipeline
CREATE TABLE IF NOT EXISTS pipeline_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Etapas de cada template (ordem)
CREATE TABLE IF NOT EXISTS pipeline_template_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES pipeline_templates(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  position INT NOT NULL,
  UNIQUE(template_id, stage_id)
);

-- Etapas configuradas por vaga (pipeline da vaga)
CREATE TABLE IF NOT EXISTS job_pipeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES pipeline_stages(id) ON DELETE CASCADE,
  position INT NOT NULL,
  UNIQUE(job_id, stage_id)
);

-- Alterar applications para usar stage_id ao invés de enum
-- Adicionar campo stage_id (manter stage antigo para compatibilidade)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS current_stage_id UUID REFERENCES pipeline_stages(id);

-- ============================================
-- DADOS INICIAIS: Etapas padrão
-- ============================================
INSERT INTO pipeline_stages (name, stage_type, is_system) VALUES
  ('Inscrição', 'triagem', true),
  ('Triagem de currículo', 'triagem', true),
  ('Pré-seleção / Shortlist', 'triagem', false),
  ('Teste técnico', 'teste', false),
  ('Teste comportamental / DISC', 'teste', false),
  ('Case prático', 'teste', false),
  ('Teste de idiomas', 'teste', false),
  ('Entrevista RH', 'entrevista', true),
  ('Entrevista com Gestor', 'entrevista', false),
  ('Entrevista com Diretor', 'entrevista', false),
  ('Painel / Comitê', 'entrevista', false),
  ('Dinâmica de grupo', 'entrevista', false),
  ('Proposta salarial', 'proposta', false),
  ('Exame admissional', 'proposta', false),
  ('Contratação', 'contratacao', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- TEMPLATES PADRÃO
-- ============================================

-- Processo Rápido
INSERT INTO pipeline_templates (name, description) VALUES
  ('Processo Rápido', '4 etapas — ideal para vagas operacionais ou urgentes')
ON CONFLICT (name) DO NOTHING;

INSERT INTO pipeline_template_stages (template_id, stage_id, position)
SELECT t.id, s.id, pos
FROM pipeline_templates t, (VALUES
  ('Inscrição', 1),
  ('Triagem de currículo', 2),
  ('Entrevista RH', 3),
  ('Contratação', 4)
) AS stages(nome, pos)
JOIN pipeline_stages s ON s.name = stages.nome
WHERE t.name = 'Processo Rápido'
ON CONFLICT DO NOTHING;

-- Processo Padrão
INSERT INTO pipeline_templates (name, description) VALUES
  ('Processo Padrão', '6 etapas — fluxo completo para a maioria das vagas')
ON CONFLICT (name) DO NOTHING;

INSERT INTO pipeline_template_stages (template_id, stage_id, position)
SELECT t.id, s.id, pos
FROM pipeline_templates t, (VALUES
  ('Inscrição', 1),
  ('Triagem de currículo', 2),
  ('Entrevista RH', 3),
  ('Entrevista com Gestor', 4),
  ('Proposta salarial', 5),
  ('Contratação', 6)
) AS stages(nome, pos)
JOIN pipeline_stages s ON s.name = stages.nome
WHERE t.name = 'Processo Padrão'
ON CONFLICT DO NOTHING;

-- Processo Executivo
INSERT INTO pipeline_templates (name, description) VALUES
  ('Processo Executivo', '8 etapas — para cargos de liderança e alta gestão')
ON CONFLICT (name) DO NOTHING;

INSERT INTO pipeline_template_stages (template_id, stage_id, position)
SELECT t.id, s.id, pos
FROM pipeline_templates t, (VALUES
  ('Inscrição', 1),
  ('Triagem de currículo', 2),
  ('Teste técnico', 3),
  ('Entrevista RH', 4),
  ('Entrevista com Gestor', 5),
  ('Entrevista com Diretor', 6),
  ('Proposta salarial', 7),
  ('Contratação', 8)
) AS stages(nome, pos)
JOIN pipeline_stages s ON s.name = stages.nome
WHERE t.name = 'Processo Executivo'
ON CONFLICT DO NOTHING;

-- Processo Operacional
INSERT INTO pipeline_templates (name, description) VALUES
  ('Processo Operacional', '5 etapas — para vagas técnicas e operacionais')
ON CONFLICT (name) DO NOTHING;

INSERT INTO pipeline_template_stages (template_id, stage_id, position)
SELECT t.id, s.id, pos
FROM pipeline_templates t, (VALUES
  ('Inscrição', 1),
  ('Triagem de currículo', 2),
  ('Case prático', 3),
  ('Entrevista RH', 4),
  ('Contratação', 5)
) AS stages(nome, pos)
JOIN pipeline_stages s ON s.name = stages.nome
WHERE t.name = 'Processo Operacional'
ON CONFLICT DO NOTHING;

-- Desabilitar RLS
ALTER TABLE pipeline_stages DISABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_template_stages DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_pipeline DISABLE ROW LEVEL SECURITY;
