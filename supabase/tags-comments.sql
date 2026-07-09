-- ============================================
-- TAGS E COMENTÁRIOS - Rode no Supabase SQL Editor
-- ============================================

-- Tabela de tags disponíveis
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#142033',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relação candidato-tag (muitos para muitos)
CREATE TABLE IF NOT EXISTS candidate_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, tag_id)
);

-- Comentários internos (visíveis só para o time)
CREATE TABLE IF NOT EXISTS internal_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags padrão
INSERT INTO tags (name, color) VALUES
  ('Senior', '#142033'),
  ('Pleno', '#3d4f35'),
  ('Júnior', '#7d8086'),
  ('Urgente', '#dc2626'),
  ('Indicação', '#c9a563'),
  ('Destaque', '#a98645'),
  ('Banco de Talentos', '#0d1726'),
  ('Remoto', '#3d4f35')
ON CONFLICT (name) DO NOTHING;

-- Desabilitar RLS (manter consistente com o resto)
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE internal_comments DISABLE ROW LEVEL SECURITY;
