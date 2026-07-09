-- ============================================
-- FIX: Corrigir RLS para todas as tabelas
-- Rode este SQL no Supabase SQL Editor
-- ============================================

-- ===================
-- CANDIDATES
-- ===================
-- Dropar policies existentes para evitar conflito
DROP POLICY IF EXISTS "Candidates view own data" ON candidates;
DROP POLICY IF EXISTS "Admins view all candidates" ON candidates;
DROP POLICY IF EXISTS "Candidates manage own data" ON candidates;

-- Candidatos gerenciam seus próprios dados
CREATE POLICY "Candidates full access own data" ON candidates
  FOR ALL USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Admin vê tudo
CREATE POLICY "Admins full access candidates" ON candidates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- CANDIDATE_EXPERIENCES
-- ===================
DROP POLICY IF EXISTS "candidate_experiences_select" ON candidate_experiences;
DROP POLICY IF EXISTS "candidate_experiences_insert" ON candidate_experiences;
DROP POLICY IF EXISTS "candidate_experiences_delete" ON candidate_experiences;

CREATE POLICY "Candidates manage own experiences" ON candidate_experiences
  FOR ALL USING (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  );

CREATE POLICY "Admins full access experiences" ON candidate_experiences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- CANDIDATE_EDUCATION
-- ===================
DROP POLICY IF EXISTS "candidate_education_select" ON candidate_education;
DROP POLICY IF EXISTS "candidate_education_insert" ON candidate_education;
DROP POLICY IF EXISTS "candidate_education_delete" ON candidate_education;

CREATE POLICY "Candidates manage own education" ON candidate_education
  FOR ALL USING (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  );

CREATE POLICY "Admins full access education" ON candidate_education
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- CANDIDATE_SKILLS
-- ===================
DROP POLICY IF EXISTS "candidate_skills_select" ON candidate_skills;
DROP POLICY IF EXISTS "candidate_skills_insert" ON candidate_skills;
DROP POLICY IF EXISTS "candidate_skills_delete" ON candidate_skills;

CREATE POLICY "Candidates manage own skills" ON candidate_skills
  FOR ALL USING (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  );

CREATE POLICY "Admins full access skills" ON candidate_skills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- PROFILES
-- ===================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins full access profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- JOBS
-- ===================
DROP POLICY IF EXISTS "Anyone can view open jobs" ON jobs;
DROP POLICY IF EXISTS "Admins manage all jobs" ON jobs;
DROP POLICY IF EXISTS "Partners view their jobs" ON jobs;

-- Qualquer autenticado vê vagas abertas
CREATE POLICY "Authenticated view open jobs" ON jobs
  FOR SELECT USING (status = 'aberta' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin gerencia tudo
CREATE POLICY "Admins full access jobs" ON jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Parceiros veem suas vagas
CREATE POLICY "Partners view own jobs" ON jobs
  FOR SELECT USING (
    partner_id IN (SELECT id FROM partners WHERE profile_id = auth.uid())
  );

-- ===================
-- APPLICATIONS
-- ===================
DROP POLICY IF EXISTS "Candidates view own applications" ON applications;
DROP POLICY IF EXISTS "Admins manage all applications" ON applications;

-- Candidatos criam e veem suas candidaturas
CREATE POLICY "Candidates manage own applications" ON applications
  FOR ALL USING (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    candidate_id IN (SELECT id FROM candidates WHERE profile_id = auth.uid())
  );

-- Admin gerencia tudo
CREATE POLICY "Admins full access applications" ON applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- APPLICATION_TIMELINE
-- ===================
DROP POLICY IF EXISTS "timeline_select" ON application_timeline;
DROP POLICY IF EXISTS "timeline_insert" ON application_timeline;

CREATE POLICY "Admins manage timeline" ON application_timeline
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Candidates view own timeline" ON application_timeline
  FOR SELECT USING (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  );

-- ===================
-- INTERVIEWS
-- ===================
DROP POLICY IF EXISTS "interviews_select" ON interviews;
DROP POLICY IF EXISTS "interviews_insert" ON interviews;

CREATE POLICY "Admins manage interviews" ON interviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- PARTNERS
-- ===================
DROP POLICY IF EXISTS "Partners view own data" ON partners;
DROP POLICY IF EXISTS "Admins manage partners" ON partners;

CREATE POLICY "Partners manage own data" ON partners
  FOR ALL USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins full access partners" ON partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===================
-- STORAGE: Bucket documents
-- ===================
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policy para upload de documentos
DROP POLICY IF EXISTS "Users upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;

CREATE POLICY "Users upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users update own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Public read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');
