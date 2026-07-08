-- ============================================
-- SCHEMA DO BANCO DE DADOS - SUPERAÇÃO RH
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Enum para os tipos de usuário
CREATE TYPE user_role AS ENUM ('candidato', 'admin', 'parceiro');

-- Enum para status de vaga
CREATE TYPE job_status AS ENUM ('aberta', 'pausada', 'encerrada');

-- Enum para etapas do processo seletivo
CREATE TYPE application_stage AS ENUM (
  'inscrito',
  'triagem',
  'entrevista_rh',
  'entrevista_cliente',
  'teste_tecnico',
  'aprovado',
  'reprovado',
  'contratado',
  'desistente'
);

-- ============================================
-- TABELA: profiles (extensão do auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'candidato',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  company_name TEXT, -- para parceiros
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: candidates (dados do currículo)
-- ============================================
CREATE TABLE candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  cpf TEXT,
  birth_date DATE,
  gender TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT, -- arquivo no storage
  objective TEXT,
  salary_expectation NUMERIC,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: candidate_experiences (experiências)
-- ============================================
CREATE TABLE candidate_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE, -- null = emprego atual
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: candidate_education (formação)
-- ============================================
CREATE TABLE candidate_education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  course TEXT NOT NULL,
  degree TEXT, -- graduação, pós, técnico, etc.
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: candidate_skills (habilidades)
-- ============================================
CREATE TABLE candidate_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT -- básico, intermediário, avançado
);

-- ============================================
-- TABELA: partners (empresas parceiras/clientes)
-- ============================================
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cnpj TEXT,
  sector TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: jobs (vagas)
-- ============================================
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  salary_range TEXT,
  city TEXT,
  state TEXT,
  work_model TEXT, -- presencial, remoto, híbrido
  contract_type TEXT, -- CLT, PJ, temporário
  status job_status DEFAULT 'aberta',
  positions_count INT DEFAULT 1,
  deadline DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: applications (candidaturas)
-- ============================================
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  stage application_stage DEFAULT 'inscrito',
  notes TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- ============================================
-- TABELA: application_timeline (linha do tempo)
-- ============================================
CREATE TABLE application_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  stage application_stage NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: interviews (entrevistas agendadas)
-- ============================================
CREATE TABLE interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interviewer_name TEXT,
  interview_type TEXT, -- rh, técnica, cliente
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  location TEXT, -- presencial ou link da videochamada
  notes TEXT,
  feedback TEXT,
  result TEXT, -- aprovado, reprovado, pendente
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Profiles: cada usuário vê seu próprio perfil, admin vê todos
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Candidates: candidato vê seus dados, admin vê todos
CREATE POLICY "Candidates view own data" ON candidates
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins view all candidates" ON candidates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Candidates manage own data" ON candidates
  FOR ALL USING (profile_id = auth.uid());

-- Jobs: todos veem vagas abertas, admin gerencia
CREATE POLICY "Anyone can view open jobs" ON jobs
  FOR SELECT USING (status = 'aberta');

CREATE POLICY "Admins manage all jobs" ON jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Partners view their jobs" ON jobs
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE profile_id = auth.uid()
    )
  );

-- Applications: candidato vê suas candidaturas, admin vê todas
CREATE POLICY "Candidates view own applications" ON applications
  FOR SELECT USING (
    candidate_id IN (
      SELECT id FROM candidates WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all applications" ON applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Partners: parceiro vê seus dados
CREATE POLICY "Partners view own data" ON partners
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins manage partners" ON partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCTION: criar perfil ao registrar
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidato')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auto-criar profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- FUNCTION: atualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
