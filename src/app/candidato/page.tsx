"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card from "@/components/ui/Card";
import { FileText, Briefcase, ClipboardList, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import type { ApplicationStage } from "@/lib/types";

const stageLabels: Record<string, string> = {
  inscrito: "Inscrito", triagem: "Triagem", entrevista_rh: "Entrevista RH",
  entrevista_cliente: "Entrevista Cliente", teste_tecnico: "Teste Técnico",
  aprovado: "Aprovado", contratado: "Contratado", reprovado: "Não selecionado",
};

export default function CandidatoDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [openJobs, setOpenJobs] = useState(0);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [profileComplete, setProfileComplete] = useState(0);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Nome
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    if (profile) setName(profile.full_name);

    // Vagas abertas
    const { count } = await supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "aberta");
    setOpenJobs(count || 0);

    // Candidato
    const { data: candidate } = await supabase.from("candidates").select("*").eq("profile_id", user.id).single();
    if (candidate) {
      // Completude do perfil
      const fields = [candidate.city, candidate.objective, candidate.salary_expectation, candidate.linkedin_url, candidate.availability];
      const filled = fields.filter(Boolean).length;
      setProfileComplete(Math.round((filled / fields.length) * 100));

      // Candidaturas
      const { data: apps } = await supabase
        .from("applications")
        .select("*, job:jobs(title, partner:partners(company_name))")
        .eq("candidate_id", candidate.id)
        .order("applied_at", { ascending: false })
        .limit(5);
      if (apps) setMyApplications(apps);
    }
    setLoading(false);
  }

  if (loading) {
    return (<><DashboardHeader title="Carregando..." subtitle="" /><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray" /></div></>);
  }

  return (
    <>
      <DashboardHeader title={`Bem-vindo(a), ${name.split(" ")[0]}!`} subtitle="Acompanhe suas oportunidades" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/candidato/curriculo">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <FileText className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Meu Currículo</p>
              <p className="text-xs text-gray mt-1">{profileComplete}% preenchido</p>
            </Card>
          </Link>

          <Link href="/candidato/vagas">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <Briefcase className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Vagas Abertas</p>
              <p className="text-xs text-gray mt-1">{openJobs} disponíveis</p>
            </Card>
          </Link>

          <Link href="/candidato/candidaturas">
            <Card className="hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-3 transition-colors">
                <ClipboardList className="w-5 h-5 text-navy" />
              </div>
              <p className="font-bold text-navy text-sm">Candidaturas</p>
              <p className="text-xs text-gray mt-1">{myApplications.length} processos</p>
            </Card>
          </Link>

          <Card className={`${profileComplete >= 80 ? "border-green/20 bg-green/5" : "border-gold/20 bg-gold/5"}`}>
            <div className={`w-10 h-10 rounded-lg ${profileComplete >= 80 ? "bg-green/10" : "bg-gold/10"} flex items-center justify-center mb-3`}>
              <span className="text-sm font-bold text-navy">{profileComplete}%</span>
            </div>
            <p className="font-bold text-navy text-sm">Perfil</p>
            <p className="text-xs text-gray mt-1">{profileComplete >= 80 ? "Completo" : "Complete seu currículo"}</p>
          </Card>
        </div>

        {/* Candidaturas recentes */}
        <Card>
          <h2 className="font-bold text-navy mb-4">Minhas candidaturas recentes</h2>
          {myApplications.length === 0 && <p className="text-sm text-gray">Nenhuma candidatura ainda. Veja as vagas disponíveis!</p>}
          <div className="space-y-3">
            {myApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                <div>
                  <p className="font-semibold text-navy text-sm">{app.job?.title}</p>
                  <p className="text-xs text-gray">{app.job?.partner?.company_name || ""}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold-dark">
                    <Clock className="w-3 h-3" />
                    {stageLabels[app.stage] || app.stage}
                  </span>
                  <p className="text-xs text-gray mt-1">{new Date(app.applied_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
