// Tipos do sistema SuperAção RH

export type UserRole = "candidato" | "admin" | "parceiro";

export type JobStatus = "aberta" | "pausada" | "encerrada";

export type ApplicationStage =
  | "inscrito"
  | "triagem"
  | "entrevista_rh"
  | "entrevista_cliente"
  | "teste_tecnico"
  | "aprovado"
  | "reprovado"
  | "contratado"
  | "desistente";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  partner_id?: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salary_range?: string;
  city?: string;
  state?: string;
  work_model?: string;
  contract_type?: string;
  status: JobStatus;
  positions_count: number;
  deadline?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined
  partner?: Partner;
  applications_count?: number;
}

export interface Partner {
  id: string;
  profile_id?: string;
  company_name: string;
  cnpj?: string;
  sector?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  city?: string;
  state?: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  profile_id: string;
  cpf?: string;
  birth_date?: string;
  gender?: string;
  city?: string;
  state?: string;
  address?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  objective?: string;
  salary_expectation?: number;
  availability?: string;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Profile;
  experiences?: CandidateExperience[];
  education?: CandidateEducation[];
  skills?: CandidateSkill[];
}

export interface CandidateExperience {
  id: string;
  candidate_id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface CandidateEducation {
  id: string;
  candidate_id: string;
  institution: string;
  course: string;
  degree?: string;
  start_date?: string;
  end_date?: string;
}

export interface CandidateSkill {
  id: string;
  candidate_id: string;
  skill_name: string;
  level?: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  stage: ApplicationStage;
  notes?: string;
  rating?: number;
  applied_at: string;
  updated_at: string;
  // Joined
  job?: Job;
  candidate?: Candidate;
}

export interface ApplicationTimeline {
  id: string;
  application_id: string;
  stage: ApplicationStage;
  title: string;
  description?: string;
  created_by?: string;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  interviewer_name?: string;
  interview_type?: string;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  notes?: string;
  feedback?: string;
  result?: string;
  created_at: string;
}
