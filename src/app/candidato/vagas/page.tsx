"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, MapPin, Building2, Clock, Briefcase, Loader2, CheckCircle } from "lucide-react";
import type { Job } from "@/lib/types";

export default function VagasCandidatoPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [candidateId, setCandidateId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar candidato
    let { data: candidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!candidate) {
      const { data: newCandidate } = await supabase
        .from("candidates")
        .insert({ profile_id: user.id })
        .select("id")
        .single();
      candidate = newCandidate;
    }

    if (candidate) {
      setCandidateId(candidate.id);

      // Buscar candidaturas existentes
      const { data: applications } = await supabase
        .from("applications")
        .select("job_id")
        .eq("candidate_id", candidate.id);
      if (applications) {
        setAppliedJobs(new Set(applications.map((a) => a.job_id)));
      }
    }

    // Buscar vagas abertas
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*, partner:partners(company_name)")
      .eq("status", "aberta")
      .order("created_at", { ascending: false });

    if (jobsData) setJobs(jobsData as Job[]);
    setLoading(false);
  }

  async function handleApply(jobId: string) {
    if (!candidateId) return;
    setApplying(jobId);

    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      candidate_id: candidateId,
      stage: "inscrito",
    });

    if (!error) {
      setAppliedJobs(new Set([...appliedJobs, jobId]));

      // Enviar e-mail de confirmação
      fetch("/api/notifications/application-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      }).catch(() => {});
    }
    setApplying(null);
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.city?.toLowerCase().includes(search.toLowerCase()) ||
      (job.partner as any)?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoje";
    if (days === 1) return "1 dia atrás";
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  }

  return (
    <>
      <DashboardHeader title="Vagas Disponíveis" subtitle="Encontre sua próxima oportunidade" />

      <div className="p-6 space-y-4">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
          <input
            type="text"
            placeholder="Buscar por cargo, empresa ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray" />
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray">Nenhuma vaga disponível no momento. Volte em breve!</p>
          </Card>
        )}

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray">
                    {(job.partner as any)?.company_name && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {(job.partner as any).company_name}
                      </span>
                    )}
                    {job.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.city}{job.state ? `, ${job.state}` : ""}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.contract_type} · {job.work_model}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {timeAgo(job.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray mt-3 line-clamp-2">{job.description}</p>
                  {job.salary_range && (
                    <p className="text-sm font-bold text-gold-dark mt-2">{job.salary_range}</p>
                  )}
                </div>
                {appliedJobs.has(job.id) ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green/10 text-green text-sm font-bold shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    Candidatado
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="shrink-0"
                    loading={applying === job.id}
                    onClick={() => handleApply(job.id)}
                  >
                    Candidatar-se
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
